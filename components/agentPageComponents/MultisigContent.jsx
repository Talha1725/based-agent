import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const MultisigContent = () => {
  const [newSignerAddress, setNewSignerAddress] = useState('');
  const [signers, setSigners] = useState([
    { id: 1, name: 'Alice (Creator)', address: '0x1234...5678', avatarUrl: 'https://example.com/alice.jpg' },
    { id: 2, name: 'Bob', address: '0xabcd...efgh', avatarUrl: 'https://example.com/bob.jpg' },
  ]);

  const handleAddSigner = () => {
    if (newSignerAddress) {
      setSigners([...signers, { id: signers.length + 1, name: `Signer ${signers.length + 1}`, address: newSignerAddress, avatarUrl: '' }]);
      setNewSignerAddress('');
    }
  };

  const handleRemoveSigner = (signerId) => {
    setSigners(signers.filter(signer => signer.id !== signerId));
  };

  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-100">Current Signers</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-300">Name</TableHead>
            <TableHead className="text-gray-300">Address</TableHead>
            <TableHead className="text-gray-300">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signers.map((signer) => (
            <TableRow key={signer.id}>
              <TableCell className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={signer.avatarUrl} alt={signer.name} />
                  <AvatarFallback>{signer.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-gray-300">{signer.name}</span>
              </TableCell>
              <TableCell className="text-gray-300">{signer.address}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Remove</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-800 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Signer</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        Are you sure you want to remove this signer? This action will create a proposal that needs to be approved by other signers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-700 text-white">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600" onClick={() => handleRemoveSigner(signer.id)}>
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-100">Add New Signer</h3>
      <div className="flex space-x-2">
        <Input
          placeholder="Enter wallet address or ENS name"
          value={newSignerAddress}
          onChange={(e) => setNewSignerAddress(e.target.value)}
          className="bg-gray-700 text-white"
        />
        <Button onClick={handleAddSigner}>Add Signer</Button>
      </div>
    </>
  );
};