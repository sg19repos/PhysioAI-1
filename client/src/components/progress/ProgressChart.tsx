import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  date: Date;
  value: number;
}

interface ProgressChartProps {
  data?: DataPoint[];
  timeRange: 'week' | 'month' | 'all';
  dataKey?: string;
  color?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data = [], 
  timeRange, 
  dataKey = 'value',
  color = '#1976D2'
}) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      // Generate sample data if no data is provided
      const sampleData = generateSampleData(timeRange);
      setChartData(sampleData);
      return;
    }

    // Filter data by time range
    const today = new Date();
    const filteredData = data.filter(item => {
      if (timeRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        return item.date >= weekAgo;
      } else if (timeRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        return item.date >= monthAgo;
      }
      return true; // 'all' time range
    });

    // Format data for chart
    const formattedData = filteredData.map(item => ({
      date: formatDate(item.date, timeRange),
      [dataKey]: item.value
    }));

    setChartData(formattedData);
  }, [data, timeRange, dataKey]);

  // Format date based on time range
  const formatDate = (date: Date, range: string): string => {
    if (range === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (range === 'month') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Generate sample data if no real data is provided
  const generateSampleData = (range: string): any[] => {
    const result = [];
    const today = new Date();
    
    let numPoints = range === 'week' ? 7 : range === 'month' ? 30 : 12;
    let startValue = 50;
    let endValue = 150;
    
    for (let i = 0; i < numPoints; i++) {
      const date = new Date();
      if (range === 'week') {
        date.setDate(today.getDate() - (numPoints - i - 1));
      } else if (range === 'month') {
        date.setDate(today.getDate() - (numPoints - i - 1));
      } else {
        // 'all' range - show months
        date.setMonth(today.getMonth() - (numPoints - i - 1));
      }
      
      // Create a progressive trend with some randomness
      const progress = i / (numPoints - 1);
      const value = Math.round(startValue + (endValue - startValue) * progress + (Math.random() * 20 - 10));
      
      result.push({
        date: formatDate(date, range),
        [dataKey]: value
      });
    }
    
    return result;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={{ stroke: '#e0e0e0' }}
        />
        <YAxis 
          hide={true}
          domain={['dataMin - 10', 'dataMax + 10']}
        />
        <Tooltip 
          formatter={(value: number) => [`${value}`, dataKey === 'rangeOfMotion' ? 'Degrees' : 'Score']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          fillOpacity={1} 
          fill={`url(#color${dataKey})`} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
