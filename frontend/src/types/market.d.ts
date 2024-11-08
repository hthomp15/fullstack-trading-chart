export interface MarketData {
    market: string;
    price: number;
    change24h: number;
    changePercentage: number;
    fundingRate: number;
    longOpenInterest: number;
    shortOpenInterest: number;
    chartType: string;
}