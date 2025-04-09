"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardPage: React.FC = () => {
  const customerInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    status: "Active",
    createdAt: "2024-06-01",
  };


  const transactions = [
    {
      id: "TXN-001",
      amount: 150.0,
      method: "Credit Card",
      date: "2024-06-10",
    },
    {
      id: "TXN-002",
      amount: 90.5,
      method: "Cash",
      date: "2024-06-12",
    },
    {
      id: "TXN-003",
      amount: 200.75,
      method: "Transfer",
      date: "2024-06-15",
    },
  ];
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/"); // Redirect ke halaman login/home
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost"><Bell className="w-5 h-5" /></Button>
          <Button variant="ghost" onClick={handleLogout}><LogOut className="w-5 h-5" /></Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> Profile Info
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div><strong>Name:</strong> {customerInfo.name}</div>
              <div><strong>Email:</strong> {customerInfo.email}</div>
              <div>
                <strong>Status:</strong> <Badge variant="outline">{customerInfo.status}</Badge>
              </div>
              <div><strong>Joined At:</strong> {customerInfo.createdAt}</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 pr-4">
                {transactions.map((txn) => (
                  <div key={txn.id} className="mb-4">
                    <div className="flex justify-between">
                      <span className="font-medium">{txn.id}</span>
                      <span className="text-sm">{txn.date}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {txn.method} — $ {txn.amount.toFixed(2)}
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;