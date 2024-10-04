import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const TokenPriceHistory = () => {
  const data = [
    { date: '2023-01-01', price: 1.0 },
    { date: '2023-02-01', price: 1.2 },
    { date: '2023-03-01', price: 1.1 },
    { date: '2023-04-01', price: 1.3 },
    { date: '2023-05-01', price: 1.5 },
  ];

  return (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-100">Token Price History</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};