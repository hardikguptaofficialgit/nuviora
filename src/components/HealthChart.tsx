
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';

interface HealthChartProps {
  data: any[];
  dataKeys: { key: string; name: string; color: string }[];
  animationDuration?: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-neon p-2 rounded shadow-lg">
        <p className="text-neon text-xs">{`Time: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const HealthChart: React.FC<HealthChartProps> = ({ 
  data, 
  dataKeys,
  animationDuration = 2000 
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Animate the data gradually
    const dataLength = data.length;
    const increment = Math.ceil(dataLength / 10);
    let currentIndex = 0;
    
    setChartData([]);
    
    const interval = setInterval(() => {
      const nextIndex = Math.min(currentIndex + increment, dataLength);
      setChartData(data.slice(0, nextIndex));
      
      if (nextIndex >= dataLength) {
        clearInterval(interval);
      }
      
      currentIndex = nextIndex;
    }, animationDuration / 10);
    
    return () => clearInterval(interval);
  }, [data, animationDuration]);

  return (
    <div className="h-full w-full biometric-card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(190, 234, 158, 0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(190, 234, 158, 0.5)"
            tick={{ fill: 'rgba(190, 234, 158, 0.8)', fontSize: 10 }}
          />
          <YAxis 
            stroke="rgba(190, 234, 158, 0.5)"
            tick={{ fill: 'rgba(190, 234, 158, 0.8)', fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          {dataKeys.map((dataKey, index) => (
            <Line
              key={dataKey.key}
              type="monotone"
              dataKey={dataKey.key}
              name={dataKey.name}
              stroke={dataKey.color}
              strokeWidth={2}
              dot={{ fill: dataKey.color, strokeWidth: 1, r: 2, strokeDasharray: '' }}
              activeDot={{ r: 6, fill: 'black', stroke: dataKey.color, strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={animationDuration}
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthChart;
