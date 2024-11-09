import React, { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickData, IChartApi, CandlestickSeriesApi, UTCTimestamp } from 'lightweight-charts';

interface ChartComponantProps {
    market: string
}

const ChartComponent: React.FC<ChartComponantProps> = ({market}) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const [chart, setChart] = useState<IChartApi | null>(null);
    const [candlestickSeries, setCandlestickSeries] = useState<CandlestickSeriesApi<'Candlestick'> | null>(null);
    const [selectedInterval, setSelectedInterval] = useState<string>('1m'); // Default interval
    const [chartData, setChartData] = useState<CandlestickData[]>([]); // Internal state to track chart data


    const intervalMapping: { [key: string]: string } = {
        '1m': '1m',
        '3m': '3m',
        '5m': '5m',
        '15m': '15m',
        '30m': '30m',
        '1h': '1h',
        '2h': '2h',
        '4h': '4h',
        '6h': '6h',
        '8h': '8h',
        '12h': '12h',
        '1d': '1d',
        '3d': '3d',
        '1w': '1w',
        '1M': '1M',
    };

    // Function to fetch historical data based on selected interval
    const fetchHistoricalData = async (interval: string) => {
        const now = Date.now();
        const tenDaysAgo = now - 10 * 24 * 60 * 60 * 1000; // 10 days ago in milliseconds

        const response = await fetch(
            `https://serverprod.vest.exchange/v2/klines?symbol=${market}&interval=${intervalMapping[interval]}&startTime=${tenDaysAgo}&endTime=${now}&limit=1000`,
            {
                headers: {
                    'xrestservermm': 'restserver0',
                },
            }
        );

        const data = await response.json();

        return data.map((item: Array<any>) => ({
            time: convertToEST(item[0] / 1000), // Convert milliseconds to seconds and then to EST
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4]),
        }));
    };

    // Function to convert UTC time to EST (UTC-5)
    const convertToEST = (utcTime: number) => {
        const estOffset = 5 * 60 * 60 * 1000; // EST is UTC-5
        const estTime = utcTime * 1000 - estOffset; // Convert seconds to milliseconds and apply the offset
        return Math.floor(estTime / 1000); // Return the timestamp in seconds
    };

    // Initialize chart with historical data
    useEffect(() => {
        if (chartContainerRef.current) {
            const chart = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 400,
                layout: {
                    textColor: '#888888',
                    background: { color: '#171513' },
                },
                grid: {
                    vertLines: { color: '#313131' },
                    horzLines: { color: '#313131' },
                },
                crosshair: { mode: 1 },
                timeScale: { borderColor: '#555', timeVisible: true },
            });

            chart.timeScale().fitContent();

            const newCandlestickSeries = chart.addCandlestickSeries({
                upColor: '#4bc2a2',
                borderUpColor: '#4bc2a2',
                wickUpColor: '#4bc2a2',
                downColor: '#e03638',
                borderDownColor: '#e03638',
                wickDownColor: '#e03638',
            });

            setChart(chart);
            setCandlestickSeries(newCandlestickSeries);

            // Fetch historical data for the default interval ('1m') initially
            fetchHistoricalData(selectedInterval).then((historicalData) => {
                setChartData(historicalData);
                newCandlestickSeries.setData(historicalData); // Set data on the series
            });

            return () => {
                chart.remove();
            };
        }
    }, [market]);

    // Update chart data when the interval changes
    useEffect(() => {
        if (!candlestickSeries) return;

        const wsUrl = 'wss://wsprod.vest.exchange/ws-api?xwebsocketserver=restserver0&version=1.0';
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket connected');
            const subscribeMessage = JSON.stringify({
                method: 'SUBSCRIBE',
                params: [`${market}@kline_${selectedInterval}`], 
                id: 1,
            });
            ws.send(subscribeMessage);
        };

        // Helper function to convert interval to milliseconds
        const getIntervalDuration = (interval: string) => {
            const intervals: { [key: string]: number } = {
                '1m': 60 * 1000,
                '3m': 3 * 60 * 1000,
                '5m': 5 * 60 * 1000,
                '15m': 15 * 60 * 1000,
                '30m': 30 * 60 * 1000,
                '1h': 60 * 60 * 1000,
                '2h': 2 * 60 * 60 * 1000,
                '4h': 4 * 60 * 60 * 1000,
                '6h': 6 * 60 * 60 * 1000,
                '8h': 8 * 60 * 60 * 1000,
                '12h': 12 * 60 * 60 * 1000,
                '1d': 24 * 60 * 60 * 1000,
                '3d': 3 * 24 * 60 * 60 * 1000,
                '1w': 7 * 24 * 60 * 60 * 1000,
                '1M': 30 * 24 * 60 * 60 * 1000,
            };

            return intervals[interval] || 60 * 1000; // Default to 1 minute if not found
        };

        ws.onmessage = async (event) => {
            if (!(event.data instanceof Blob)) return;
        
            const text = await event.data.text();
            const jsonData = JSON.parse(text);
        
            if (jsonData && jsonData.data && jsonData.data.length >= 5) {
                const [timestamp, open, high, low, close] = jsonData.data;
                
                const candlestickData: CandlestickData = {
                    time: convertToEST(timestamp / 1000) as UTCTimestamp, // Convert timestamp to EST
                    open: parseFloat(open),
                    high: parseFloat(high),
                    low: parseFloat(low),
                    close: parseFloat(close),
                };
        
                const lastTime = chartData.length ? Number(chartData[chartData.length - 1].time) : 0;
                const candlestickTime = Number(candlestickData.time);
                const interval = getIntervalDuration(selectedInterval)
                
                // Adjust the time to match the interval (rounding to the nearest interval boundary)
                const roundedLastTime = Math.floor(lastTime / interval) * interval;
                const roundedCandlestickTime = Math.floor(candlestickTime / interval) * interval;
        
                // Check if the new data time is greater than the last time and fits the interval
                if (roundedCandlestickTime > roundedLastTime) {
                    setChartData((prevData) => {
                        const updatedData = [...prevData, candlestickData];
                        candlestickSeries.update(candlestickData); // Update chart with new data
                        return updatedData;
                    });
                } else {
                    console.warn('Received overlapping or outdated data:', candlestickData.time);
                }
            }
        };
        



        ws.onclose = () => {
            console.log("WebSocket Closed")
        };

        return () => {
            ws.close();
        };
    }, [selectedInterval, candlestickSeries, chart, chartData, market]);



    // Handle interval change from dropdown
    const handleIntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newInterval = event.target.value;
        setSelectedInterval(newInterval);
    };

    useEffect(() => {
        if (!candlestickSeries) return;

        const wsUrl = 'wss://wsprod.vest.exchange/ws-api?xwebsocketserver=restserver0&version=1.0';
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket connected');
            const subscribeMessage = JSON.stringify({
                method: 'SUBSCRIBE',
                params: [`${market}@kline_${selectedInterval}`], // Update with the selected interval
                id: 1,
            });
            ws.send(subscribeMessage);
        };

        ws.onmessage = async (event) => {
            if (!(event.data instanceof Blob)) return;

            const text = await event.data.text();
            const jsonData = JSON.parse(text);
            console.log('jsonData', jsonData);

            if (jsonData && jsonData.data && jsonData.data.length >= 5) {
                const [timestamp, open, high, low, close] = jsonData.data;
                const candlestickData: CandlestickData = {
                    time: convertToEST(timestamp / 1000) as UTCTimestamp, // Convert timestamp to EST
                    open: parseFloat(open),
                    high: parseFloat(high),
                    low: parseFloat(low),
                    close: parseFloat(close),
                };

                // Only add new data if it's newer than the most recent one
                setChartData((prevData) => {
                    const updatedData = [...prevData, candlestickData];
                    candlestickSeries.update(candlestickData);
                    return updatedData;
                });
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close(); // Clean up WebSocket on unmount or when interval changes
        };
    }, [selectedInterval, candlestickSeries]);

    return (
        <div className='w-full'>
            <div ref={chartContainerRef} />

            <div style={{ marginTop: '10px' }}>
                <select
                    value={selectedInterval}
                    onChange={handleIntervalChange}
                    style={{
                        backgroundColor: '#171513',
                        color: '#888888',
                        border: '1px solid #555',
                        padding: '8px',
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                >
                    {Object.keys(intervalMapping).map((interval) => (
                        <option key={interval} value={interval}>
                            {interval}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ChartComponent;
