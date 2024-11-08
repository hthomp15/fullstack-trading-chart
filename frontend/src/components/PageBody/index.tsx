// MainChart.tsx
import React, { useState, useEffect } from 'react';
import ChartHeader from './ChartHeader.tsx';
import ChartComponent from './Chart.tsx';
import OrderForm from './OrderForm.tsx';
import { MarketData } from '../../types/market'
// import { fetchMarketData } from './api';





const PageBody: React.FC = () => {
    const [market, setMarket] = useState<string>("ETH/USDT");
    const [chartType, setChartType] = useState<"price" | "funding">("price");
    const [data, setData] = useState<MarketData>({
        market: "BTC/USDT",
        price: 45678.90,
        change24h: -125.50,
        changePercentage: -0.27,
        fundingRate: 0.0015,
        longOpenInterest: 1523.768,
        shortOpenInterest: 1123.456,
        chartType: "price"
    });


    return (
        <div className="main-chart w-full mt-4">
            <ChartHeader marketData={data} market={market} setMarket={setMarket} />
            <div className="tabs">
                <button onClick={() => setChartType("price")}>Price</button>
                <button onClick={() => setChartType("funding")}>Funding</button>
            </div>
            {/* <ChartComponent type={chartType} data={data[chartType]} /> */}
            <OrderForm />
        </div>
    );
};

export default PageBody;
