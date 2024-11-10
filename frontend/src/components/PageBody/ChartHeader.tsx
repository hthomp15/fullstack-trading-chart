import React from 'react';
import { MarketData } from '../../types/market';

interface ChartHeaderProps {
    marketData: MarketData;
    market: string;
    updateMarket: (market: string) => void;
    updateChartType: (chartType: string) => void;
    chartType: string;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ marketData, market, updateMarket, updateChartType, chartType }) => {
    const dataItems = [
        {
            label: 'Price',
            value: marketData.price.toFixed(2),
            className: 'text-white',
        },
        {
            label: '24H CHANGE',
            value: `${marketData.change24h >= 0 ? `+${marketData.change24h}` : marketData.change24h} USDC`,
            className: marketData.change24h >= 0 ? 'text-green-500' : 'text-red-500',
        },
        {
            label: '1H FUNDING',
            value: `${marketData.fundingRate.toFixed(5)}%`,
            className: 'text-green-500',
        },
        {
            label: 'LONG OPEN INTEREST',
            value: `${marketData.longOpenInterest.toFixed(3)} BTC`,
            className: 'text-green-500',
        },
        {
            label: 'SHORT OPEN INTEREST',
            value: `${marketData.shortOpenInterest.toFixed(3)} BTC`,
            className: 'text-green-500',
        },
    ];

    const handleSelectMarket = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMarket = e.target.value;
        console.log("selected amrket", e)
        updateMarket(selectedMarket);
    };

    const handleDataType = ()=> {
        if (chartType === "price") {
            updateChartType("funding")
        } else {
            updateChartType("price")
        }
    }

    return (
        <div>
            <ul className="border-[#1A1A1A] border-b-2 p-2 pr-20 mt-6 flex items-center justify-between text-[#ADADAD] text-sm">
                {/* Market Dropdown */}
                <li className="flex items-center space-x-2">
                    <select
                        value={market}
                        onChange={handleSelectMarket}
                        className="bg-[#100E0D] focus:outline-none text-white font-bold p-2 rounded-md"
                    >
                        <option value="BTC-PERP">BTC / BTC-PERP</option>
                        <option value="ETH-PERP">ETH / ETH-PERP</option>
                        <option value="SOL-PERP">SOL / SOL-PERP</option>
                    </select>
                </li>
                {/* Rest Fields */}
                {dataItems.map((item, index) => (
                    <li key={index} className="flex flex-col items-center">
                        <span className="text-gray-400">{item.label}</span>
                        <span className={`font-bold ${item.className}`}>{item.value}</span>
                    </li>
                ))}
            </ul>
            <div className="price-funding-tabs flex border-b-2 border-[#1A1A1A] my-4">
                <div className="tab-container flex">
                    <button 
                        onClick={handleDataType} 
                        className={`text-lg  w-full p-2 ${chartType === "price" ? "text-[#fe5144] border-b-2 border-[#fe5144]" : "text-[#9d9a9b]"}`}
                    >
                        Price
                    </button>
                    <button 
                        onClick={handleDataType}
                        className={`text-lg  w-full p-2 mx-2 ${chartType === "funding" ? "text-[#fe5144] border-b-2 border-[#fe5144]" : "text-[#9d9a9b]"}`}
                    >
                        Funding
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChartHeader;
