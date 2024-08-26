'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const Chart = ({ data }) => {
  return (
    <Card>
      <ResponsiveContainer width='100%' height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey='name'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar dataKey='total' fill='#0369a1' radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
export default Chart;
