// ChartHeader.tsx
import React from 'react';

interface ChartHeaderProps {
    market: string;
    setMarket: (market: string) => void;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ market, setMarket }) => {
    return (
        <div className="chart-header">
            <select value={market} onChange={(e) => setMarket(e.target.value)}>
                <option value="BTC/USDT">BTC / USDT</option>
                <option value="ETH/USDT">ETH / USDT</option>
                {/* Add more market options here */}
            </select>
        </div>
    );
};

export default ChartHeader;
