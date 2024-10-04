import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const DAOContent = () => {
  return (
    <Card className="bg-gray-700">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-100">DAO Governance</h3>
        <p className="text-gray-300 mb-4">
          Token holder governance (DAO) is now active. Token holders can create and vote on proposals to guide the direction of the project.
        </p>
        <div className="space-y-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">Create Proposal</Button>
          <Button className="w-full bg-green-600 hover:bg-green-700">View Active Proposals</Button>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">Delegate Votes</Button>
        </div>
      </CardContent>
    </Card>
  );
};