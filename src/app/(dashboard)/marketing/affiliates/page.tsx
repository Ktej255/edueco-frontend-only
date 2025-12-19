"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, DollarSign, MousePointer, Link as LinkIcon } from "lucide-react";
import api from "@/lib/api";

export default function AffiliatesPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  // Registration form state
  const [slug, setSlug] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [payoutEmail, setPayoutEmail] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/affiliates/stats");
      setStats(response.data);
      setIsRegistered(true);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setIsRegistered(false);
      } else {
        console.error("Failed to fetch affiliate stats:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/affiliates/register", {
        custom_slug: slug,
        payment_method: paymentMethod,
        payout_email: payoutEmail
      });
      fetchStats();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!isRegistered) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Become an Affiliate Partner</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-6">
              Earn commissions by referring students to our courses. Join our affiliate program today!
            </p>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="slug">Custom Slug (Optional)</Label>
                <Input
                  id="slug"
                  placeholder="e.g., john-doe"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="email">Payout Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="paypal@example.com"
                  value={payoutEmail}
                  onChange={(e) => setPayoutEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Join Program
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Affiliate Dashboard</h1>
          <p className="text-gray-400">Track your referrals and earnings</p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg flex items-center gap-3 border border-gray-700">
          <LinkIcon className="text-blue-400 h-5 w-5" />
          <code className="text-blue-400">{stats?.referral_link}</code>
          <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(stats?.referral_link)}>
            Copy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <MousePointer className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Clicks</p>
              <p className="text-2xl font-bold text-white">{stats?.total_clicks}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Referrals</p>
              <p className="text-2xl font-bold text-white">{stats?.total_referrals}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-white">${stats?.total_earnings}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Referrals Table could go here */}
    </div>
  );
}
