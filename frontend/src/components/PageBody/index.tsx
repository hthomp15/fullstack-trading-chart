import React, { useState, useEffect } from 'react';
import ChartHeader from './ChartHeader.tsx';
import ChartComponent from './Chart.tsx';
import OrderForm from './OrderForm.tsx';
import { MarketData } from '../../types/market'


const PageBody: React.FC = () => {
    const [market, setMarket] = useState<string>("BTC-PERP");
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

    const handleUpdateMarket = (market: string) => {
        setMarket(market)
    }


    return (
        <div className="main-chart w-full mt-4">
            <ChartHeader marketData={data} market={market} updateMarket={handleUpdateMarket}/>
            <div className="flex mt-4">
                <ChartComponent market={market}/>
                <OrderForm />
            </div>
        </div>
    );
};

export default PageBody;
