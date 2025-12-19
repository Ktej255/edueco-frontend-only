"use client";

import React, { useEffect, useState } from "react";
import {
  affiliateService,
  AffiliateStats,
  AffiliateRegister,
} from "@/services/affiliateService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Link as LinkIcon,
  Users,
  DollarSign,
  MousePointer,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AffiliateDashboardPage() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState<AffiliateRegister>({
    payment_method: "paypal",
    payout_email: "",
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await affiliateService.getStats();
        setStats(data);
      } catch (error: any) {
        // If 404, user is not registered yet
        if (error.response?.status !== 404) {
          console.error("Failed to fetch affiliate stats:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    try {
      const data = await affiliateService.register(registrationData);
      setStats(data);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register as affiliate.");
    } finally {
      setRegistering(false);
    }
  };

  const copyLink = () => {
    if (!stats) return;
    const link = `${window.location.origin}/?ref=${stats.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Join Affiliate Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-8">
              Earn 10% commission on every sale you refer. Join our partner
              program today!
            </p>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payout_email">PayPal Email for Payouts</Label>
                <Input
                  id="payout_email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={registrationData.payout_email}
                  onChange={(e) =>
                    setRegistrationData({
                      ...registrationData,
                      payout_email: e.target.value,
                    })
                  }
                />
              </div>
              <Button type="submit" className="w-full" disabled={registering}>
                {registering ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {registering ? "Registering..." : "Become an Affiliate"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Affiliate Dashboard</h1>

      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Your Referral Link</h3>
              <p className="text-sm text-muted-foreground">
                Share this link to earn commissions
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${stats.referral_code}`}
                className="bg-white"
              />
              <Button onClick={copyLink} variant="outline">
                {copied ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <LinkIcon className="h-4 w-4 mr-2" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clicks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.conversion_rate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.total_earnings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              ${stats.pending_earnings.toFixed(2)} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertTitle>How it works</AlertTitle>
        <AlertDescription>
          You earn 10% commission on every purchase made by users who sign up
          through your link. Cookies are tracked for 30 days. Payouts are
          processed monthly via PayPal for balances over $50.
        </AlertDescription>
      </Alert>
    </div>
  );
}

import { CheckCircle, TrendingUp } from "lucide-react";
