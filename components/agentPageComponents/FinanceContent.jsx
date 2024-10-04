import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FinanceContent = () => (
  <Card className="bg-gray-800 mb-8">
    <CardHeader>
      <CardTitle className="text-gray-100">Finance</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-300">Financial information and analytics will be displayed here. This section is under development and will include details about token economics, revenue streams, and financial projections for the AI agent.</p>
    </CardContent>
  </Card>
);