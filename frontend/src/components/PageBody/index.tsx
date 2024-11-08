// MainChart.tsx
import React, { useState, useEffect } from 'react';
import ChartHeader from './ChartHeader.tsx';
import ChartComponent from './Chart.tsx';
import OrderForm from './OrderForm.tsx';
// import { fetchMarketData } from './api';

interface MarketData {
    price: any[]; // Replace 'any' with the actual data type if known
    funding: any[];
}

const PageBody: React.FC = () => {
    const [market, setMarket] = useState<string>("BTC/USDT");
    const [chartType, setChartType] = useState<"price" | "funding">("price");
    const [data, setData] = useState<MarketData>({ price: [], funding: [] });

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const result = await fetchMarketData(market);
    //         setData(result);
    //     };
    //     fetchData();
    // }, [market]);

    return (
        <div className="main-chart">
            <ChartHeader market={market} setMarket={setMarket} />
            <div className="tabs">
                <button onClick={() => setChartType("price")}>Price</button>
                <button onClick={() => setChartType("funding")}>Funding</button>
            </div>
            <ChartComponent type={chartType} data={data[chartType]} />
            <OrderForm />
        </div>
    );
};

export default PageBody;
