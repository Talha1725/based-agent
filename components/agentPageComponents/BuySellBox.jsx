import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const BuySellBox = () => (
  <Card className="bg-gray-800 mb-8">
    <CardHeader>
      <CardTitle className="text-gray-100">Buy/Sell Tokens</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex space-x-4">
        <Input type="number" placeholder="Amount" className="bg-gray-700 text-white" />
        <Button className="bg-green-600 hover:bg-green-700">Buy</Button>
        <Button className="bg-red-600 hover:bg-red-700">Sell</Button>
      </div>
    </CardContent>
  </Card>
);