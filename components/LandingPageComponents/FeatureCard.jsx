import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const FeatureCard = ({ icon, title }) => (
  <Card className="bg-blue-700 text-white">
    <CardContent className="p-4 flex flex-col items-center text-center">
      {icon}
      <h3 className="mt-2 text-base font-semibold">{title}</h3>
    </CardContent>
  </Card>
);

export default FeatureCard;