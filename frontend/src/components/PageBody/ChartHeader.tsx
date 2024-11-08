import React from 'react';
import { MarketData } from '../../types/market';

interface ChartHeaderProps {
    marketData: MarketData;
    market: string;
    setMarket: (market: string) => void;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ marketData, market, setMarket }) => {
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

    return (
        <ul className="border-solid border-[#1A1A1A] border-b-2 p-2 mr-20 mt-6 flex items-center justify-between text-[#ADADAD] text-sm">
            {/* Market Dropdown */}
            <li className="flex items-center space-x-2">
                <select
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
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
    );
};

export default ChartHeader;
