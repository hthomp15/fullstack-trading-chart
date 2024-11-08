// ChartComponent.tsx
import React, { useEffect, useRef } from 'react';
import { createChart, ISeriesApi, LineData } from 'lightweight-charts';

interface ChartComponentProps {
    type: "price" | "funding";
    data: LineData[]; // Assuming LineData is the correct type for chart data points
}

const Chart: React.FC<ChartComponentProps> = ({ type, data }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;
        
        const chart = createChart(chartContainerRef.current, { width: 600, height: 300 });
        const lineSeries: ISeriesApi<"Line"> = chart.addLineSeries();

        lineSeries.setData(data);

        return () => chart.remove();
    }, [data]);

    return <div ref={chartContainerRef} />;
};

export default Chart;
