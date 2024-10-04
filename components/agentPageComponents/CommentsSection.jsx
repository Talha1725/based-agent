import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CommentsSection = () => (
  <Card className="bg-gray-800 mb-8">
    <CardHeader>
      <CardTitle className="text-gray-100">Comments</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="bg-gray-700 p-4 rounded-md">
          <p className="text-gray-300 mb-2">Great project! Looking forward to seeing how it develops.</p>
          <p className="text-gray-400 text-sm">Posted by 0x1234...5678 • 2 hours ago</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-md">
          <p className="text-gray-300 mb-2">Interesting use of AI. How does it compare to other language models?</p>
          <p className="text-gray-400 text-sm">Posted by 0xabcd...efgh • 5 hours ago</p>
        </div>
        <div className="flex space-x-2">
          <Input placeholder="Add a comment" className="bg-gray-700 text-white" />
          <Button>Post</Button>
        </div>
      </div>
    </CardContent>
  </Card>
);