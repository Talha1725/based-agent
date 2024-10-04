import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight } from 'lucide-react';

export const DashboardContent = ({ agent }) => (
  <>
    <div className="flex flex-col lg:flex-row gap-8 mb-8">
      <Card className="bg-white  backdrop-blur-sm w-full lg:w-1/2 rounded-none border-black border-2">
        <CardHeader>
          <CardTitle className="text-gray-800 ">Token Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={[
              { date: '2023-01-01', price: 1.0 },
              { date: '2023-02-01', price: 1.2 },
              { date: '2023-03-01', price: 1.1 },
              { date: '2023-04-01', price: 1.3 },
              { date: '2023-05-01', price: 1.5 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#4B5563" />
              <YAxis stroke="#4B5563" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#E5E7EB' }} />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
              <ReferenceLine y={1} stroke="red" strokeDasharray="3 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white backdrop-blur-sm w-full lg:w-1/2 border-2 border-black rounded-none">
        <CardHeader>
          <CardTitle className="text-gray-800 ">Buy/Sell Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="number"
                placeholder="Enter the amount"
                className="bg-transparent border-2 border-black text-gray-800 pl-4 pr-20 py-6 w-full rounded-none"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 pb-6">
                <span className="text-gray-800">ETH</span>
                <div className="bg-blackCustom rounded-full p-1 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                  </svg>
                </div>
              </div>
              <p className="text-[#4f5d75] text-sm mt-1 ml-1">Balance: -- ETH</p>
            </div>
            <div className="flex space-x-2">
              <Button className="bg-blackCustom hover:bg-brownCustom text-white flex-grow rounded-none border-2 border-black">Buy</Button>
              <Button className="bg-white hover:bg-brownCustom text-blackCustom flex-grow rounded-none border-2 border-black">Sell</Button>
            </div>
            <div className="mt-4">
              <p className="text-gray-700 mb-2">Bonding Curve Progress</p>
              <Progress value={33} className="h-2 bg-gray-200 dark:bg-gray-700" indicatorClassName="bg-[#0000FF]" />
              <div className="flex justify-between text-gray-600  text-sm mt-1">
                <span>0%</span>
                <span>33%</span>
                <span>100%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              There are 794,470,858.69 BASED still available for sale in the bonding curve and there are 50.79 ETH in the bonding curve.
            </p>
            <p className="text-sm text-gray-600 ">
              When 85 ETH have been raised, all the liquidity from the bonding curve will be deposited into Raydium.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="flex flex-col lg:flex-row gap-8 mb-8">
      <Card className="bg-white  backdrop-blur-sm w-full lg:w-1/2 rounded-none border-2 border-black">
        <CardHeader>
          <CardTitle className="text-gray-800 ">Token Holder Distribution & Trading History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="distribution" className="space-y-4">
            <TabsList className="bg-gray-100 ">
              <TabsTrigger value="distribution" className="data-[state=active]:bg-white text-gray-800 ">Distribution</TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-white text-gray-800 ">Trading History</TabsTrigger>
            </TabsList>
            <TabsContent value="distribution">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">Wallet</TableHead>
                    <TableHead className="text-gray-700">Tokens Held</TableHead>
                    <TableHead className="text-gray-700">% of Supply</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-gray-800">0x1234...5678</TableCell>
                    <TableCell className="text-gray-800">1,000,000</TableCell>
                    <TableCell className="text-gray-800">10%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-gray-800">0xabcd...efgh</TableCell>
                    <TableCell className="text-gray-800">500,000</TableCell>
                    <TableCell className="text-gray-800">5%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="history">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">Time</TableHead>
                    <TableHead className="text-gray-700">Type</TableHead>
                    <TableHead className="text-gray-700">Price</TableHead>
                    <TableHead className="text-gray-700">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-gray-800">2023-05-01 14:30</TableCell>
                    <TableCell className="text-green-600">Buy</TableCell>
                    <TableCell className="text-gray-800">$1.05</TableCell>
                    <TableCell className="text-gray-800">1000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-gray-800">2023-05-01 14:25</TableCell>
                    <TableCell className="text-red-600">Sell</TableCell>
                    <TableCell className="text-gray-800">$1.04</TableCell>
                    <TableCell className="text-gray-800">500</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-white backdrop-blur-sm w-full lg:w-1/2 rounded-none border-2 border-black">
        <CardHeader>
          <CardTitle className="text-gray-800 ">Token Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 ">Market Cap</p>
              <p className="text-xl font-bold text-gray-800 ">$10,000,000</p>
            </div>
            <div>
              <p className="text-gray-600 ">24h Volume</p>
              <p className="text-xl font-bold text-gray-800 ">$500,000</p>
            </div>
            <div>
              <p className="text-gray-600 ">Current Price</p>
              <p className="text-xl font-bold text-gray-800 ">$1.00</p>
            </div>
            <div>
              <p className="text-gray-600 ">Token Symbol</p>
              <p className="text-xl font-bold text-gray-800 ">BASED</p>
            </div>
            <div>
              <p className="text-gray-600 ">Capital Pool</p>
              <p className="text-xl font-bold text-gray-800 ">80%</p>
            </div>
            <div>
              <p className="text-gray-600 ">Contributor Pool</p>
              <p className="text-xl font-bold text-gray-800 ">20%</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600 ">Token Contract Address</p>
            <a href="#" className="text-blackCustom font-black hover:underline ">View on Explorer</a>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="bg-white backdrop-blur-sm mb-8 rounded-none border-2 border-black">
      <CardHeader>
        <CardTitle className="text-gray-800 ">Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white/50  p-4 rounded-md">
            <p className="text-gray-800 mb-2">Great project! Looking forward to seeing how it develops.</p>
            <p className="text-gray-600  text-sm">Posted by 0x1234...5678 • 2 hours ago</p>
          </div>
          <div className="bg-white/50  p-4 rounded-md">
            <p className="text-gray-800 mb-2">Interesting use of AI. How does it compare to other language models?</p>
            <p className="text-gray-600  text-sm">Posted by 0xabcd...efgh • 5 hours ago</p>
          </div>
          <div className="flex space-x-2">
            <Input placeholder="Add a comment" className="bg-transparent rounded-none  text-gray-800 border-2 border-black  " />
            <Button className="bg-blackCustom hover:bg-brownCustom border-2 border-black text-white rounded-none">Post</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </>
);