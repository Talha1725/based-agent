import React, { useState, useEffect } from 'react';

const DynamicHeadline = () => {
  const headlines = [
    { text: "1 BILLION AGENTS", color: "text-orange-500" },
    { text: "DEFI AGENTS", color: "text-blue-400" },
    { text: "CODING AGENTS", color: "text-green-500" },
    { text: "AGENTS FOR EVERYTHING", color: "text-purple-500" },
    { text: "YOUR AGENT", color: "text-pink-500" }
  ];
  const [currentHeadline, setCurrentHeadline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { text, color } = headlines[currentHeadline];

  return (
    <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-0 text-left ${color} uppercase`}>
      {text}
    </h1>
  );
};

export default DynamicHeadline;