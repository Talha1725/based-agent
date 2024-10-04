import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TokenStatistics = () => {
  const stats = [
    { label: "Market Cap", value: "$10,000,000" },
    { label: "24h Volume", value: "$500,000" },
    { label: "Current Price", value: "$1.00" },
    { label: "Token Symbol", value: "BASED" },
    { label: "Capital Pool", value: "80%" },
    { label: "Contributor Pool", value: "20%" },
  ];

  return (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-100">Token Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-gray-400">{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-gray-400">Token Contract Address</p>
          <a href="#" className="text-blue-400 hover:underline">View on Explorer</a>
        </div>
      </CardContent>
    </Card>
  );
};