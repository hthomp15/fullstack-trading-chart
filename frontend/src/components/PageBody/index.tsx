import React, { useState, useEffect } from 'react';
import ChartHeader from './ChartHeader.tsx';
import ChartComponent from './Chart.tsx';
import OrderForm from './OrderForm.tsx';
import { MarketData } from '../../types/market'
import EmojiToolbar from './EmojiToolbar.tsx';


const PageBody: React.FC = () => {
    const [market, setMarket] = useState<string>("BTC-PERP");
    const [chartType, setChartType] = useState<string>("price");
    const [selectedInterval, setSelectedInterval] = useState<string>('1m');
    const [data, setData] = useState<MarketData>({
        market: "",
        price: Number(),
        change24h: Number(),
        changePercentage: Number(),
        fundingRate: Number(),
        longOpenInterest: Number(),
        shortOpenInterest: Number(),
        chartType: ""
    });

    const handleUpdateMarket = (market: string) => {
        setMarket(market)
    }

    const handleUpdateChartType = (chartType: string) => {
        setChartType(chartType)
    }

    const intervalMapping = {
        '1m': '1m', '3m': '3m', '5m': '5m', '15m': '15m', '30m': '30m',
        '1h': '1h', '2h': '2h', '4h': '4h', '6h': '6h', '8h': '8h',
        '12h': '12h', '1d': '1d', '3d': '3d', '1w': '1w', '1M': '1M',
    };


    const handleIntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedInterval(event.target.value);
    };

    return (
        <div className="main-chart w-full mt-4 mb-20">
            <ChartHeader
                marketData={data}
                market={market}
                updateMarket={handleUpdateMarket}
                updateChartType={handleUpdateChartType}
                chartType={chartType}
            />
            <div className="tabs">
                <button onClick={() => setChartType("price")}>Price</button>
                <button onClick={() => setChartType("funding")}>Funding</button>
            </div>
            <div className="flex">
                <ChartComponent market={market} interval={intervalMapping[selectedInterval]} />
                <OrderForm />
            </div>
            <div className="flex mt-4">
                <EmojiToolbar />
                <select
                    value={selectedInterval}
                    onChange={handleIntervalChange}
                    className="bg-[#100E0D] text-[#adadad] focus:outline-none pl-4"
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

export default PageBody;
