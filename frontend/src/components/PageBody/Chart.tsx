import React, { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickData, IChartApi, CandlestickSeriesApi, UTCTimestamp } from 'lightweight-charts';
import EmojiToolbar from './EmojiToolbar.tsx';

interface ChartComponentProps {
    market: string;
    interval: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ market, interval }) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const [chart, setChart] = useState<IChartApi | null>(null);
    const [candlestickSeries, setCandlestickSeries] = useState<CandlestickSeriesApi<'Candlestick'> | null>(null);
    const wsRef = useRef<WebSocket | null>(null);  // WebSocket reference


    const fetchHistoricalData = async (interval: string) => {
        const now = Date.now();
        const tenDaysAgo = now - 10 * 24 * 60 * 60 * 1000;

        const response = await fetch(
            `https://serverprod.vest.exchange/v2/klines?symbol=${market}&interval=${interval}&startTime=${tenDaysAgo}&endTime=${now}&limit=1000`,
            { headers: { 'xrestservermm': 'restserver0' } }
        );

        const data = await response.json();
        return data.map((item: any[]) => ({
            time: convertToEST(item[0] / 1000) as UTCTimestamp,
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4]),
        }));
    };

    const convertToEST = (utcTime: number) => {
        const estOffset = 5 * 60 * 60 * 1000;
        return Math.floor((utcTime * 1000 - estOffset) / 1000);
    };

    useEffect(() => {
        if (chartContainerRef.current) {
            const chart = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: chartContainerRef.current.clientHeight,
                layout: { textColor: '#888888', background: { color: '#171513' } },
                grid: { vertLines: { color: '#313131' }, horzLines: { color: '#313131' } },
                crosshair: { mode: 1 },
                timeScale: { borderColor: '#555', timeVisible: true },
            });

            chart.timeScale().fitContent();

            const newCandlestickSeries = chart.addCandlestickSeries({
                upColor: '#4bc2a2', borderUpColor: '#4bc2a2', wickUpColor: '#4bc2a2',
                downColor: '#e03638', borderDownColor: '#e03638', wickDownColor: '#e03638',
            });

            setChart(chart);
            setCandlestickSeries(newCandlestickSeries);

            fetchHistoricalData(interval).then((historicalData) => {
                newCandlestickSeries.setData(historicalData);
            });

            let resizeTimeout: NodeJS.Timeout;

            const resizeObserver = new ResizeObserver((entries) => {
                if (resizeTimeout) clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    for (let entry of entries) {
                        if (entry.target === chartContainerRef.current && chart) {
                            chart.applyOptions({ width: entry.contentRect.width });
                        }
                    }
                }, 100); 
            });

            resizeObserver.observe(chartContainerRef.current);

            return () => {
                chart.remove();
                resizeObserver.disconnect();
                if (resizeTimeout) clearTimeout(resizeTimeout);
            };
        }
    }, [market, interval]);

    useEffect(() => {
        if (!candlestickSeries) return;

        if (wsRef.current) {
            wsRef.current.close();
        }

        const wsUrl = 'wss://wsprod.vest.exchange/ws-api?xwebsocketserver=restserver0&version=1.0';
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
            console.log('WebSocket connected');
            const subscribeMessage = JSON.stringify({
                method: 'SUBSCRIBE',
                params: [`${market}@kline_${interval}`],
                id: 1,
            });
            wsRef.current?.send(subscribeMessage);
        };

        wsRef.current.onmessage = async (event) => {
            if (!(event.data instanceof Blob)) return;
            const text = await event.data.text();
            const jsonData = JSON.parse(text);

            if (jsonData?.data?.length >= 5) { //Prevent error if data isn't as we expect
                const [
                    startTime, 
                    open,      
                    high,     
                    low,       
                    close,    
                    , , ,      // Unused values
                ] = jsonData.data;

                const candlestickData: CandlestickData = {
                    time: convertToEST(startTime / 1000) as UTCTimestamp,
                    open: parseFloat(open),
                    high: parseFloat(high),
                    low: parseFloat(low),
                    close: parseFloat(close),
                };

                candlestickSeries.update(candlestickData);
            }
        };

        wsRef.current.onclose = () => console.log("WebSocket closed");

        return () => {
            wsRef.current?.close();
        };
    }, [interval, candlestickSeries, market]);


    return (
        <div className="w-9/12 mr-4">
            <div ref={chartContainerRef} className="w-full h-full"/>
        </div>
    );
};

export default ChartComponent;
