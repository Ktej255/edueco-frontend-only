"use client";

import React, { useEffect, useState } from "react";
import {
  marketplaceService,
  InstructorEarnings,
  PayoutResponse,
} from "@/services/marketplaceService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { format } from "date-fns";

export default function InstructorEarningsPage() {
  const [earnings, setEarnings] = useState<InstructorEarnings | null>(null);
  const [payouts, setPayouts] = useState<PayoutResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [earningsData, payoutsData] = await Promise.all([
          marketplaceService.getMyEarnings(),
          marketplaceService.getPayoutHistory(),
        ]);
        setEarnings(earningsData);
        setPayouts(payoutsData);
      } catch (error) {
        console.error("Failed to fetch earnings data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRequestPayout = async () => {
    if (!earnings || earnings.available_balance < 50) return;
    setRequesting(true);
    try {
      await marketplaceService.requestPayout({ payment_method: "stripe" });
      alert("Payout requested successfully!");
      // Refresh data
      const [earningsData, payoutsData] = await Promise.all([
        marketplaceService.getMyEarnings(),
        marketplaceService.getPayoutHistory(),
      ]);
      setEarnings(earningsData);
      setPayouts(payoutsData);
    } catch (error) {
      console.error("Payout request failed:", error);
      alert("Failed to request payout.");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Earnings Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${earnings?.total_revenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime gross revenue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${earnings?.total_earnings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Your 70% share</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available for Payout
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${earnings?.available_balance.toFixed(2)}
            </div>
            <Button
              size="sm"
              className="mt-2 w-full"
              onClick={handleRequestPayout}
              disabled={requesting || (earnings?.available_balance || 0) < 50}
            >
              {requesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Request Payout"
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Min. $50.00 required
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Payout History</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payouts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No payouts yet.
                  </p>
                ) : (
                  payouts.map((payout) => (
                    <div
                      key={payout.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          ${payout.amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(payout.requested_at), "MMM d, yyyy")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payout.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : payout.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {payout.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Payout Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <div className="font-medium">Stripe Connect</div>
                    <div className="text-sm text-gray-500">Connected</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
