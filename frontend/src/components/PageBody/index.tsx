import React, { useState, useEffect } from 'react';
import ChartHeader from './ChartHeader.tsx';
import ChartComponent from './Chart.tsx';
import OrderForm from './OrderForm.tsx';
import { MarketData } from '../../types/market'


const PageBody: React.FC = () => {
    const [market, setMarket] = useState<string>("BTC-PERP");
    const [chartType, setChartType] = useState<string>("price");
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

    return (
        <div className="main-chart w-full mt-4">
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
                <ChartComponent market={market}/>
                <OrderForm />
            </div>
        </div>
    );
};

export default PageBody;
