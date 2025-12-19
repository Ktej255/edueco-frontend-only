"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Calendar, CreditCard, AlertTriangle } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Subscription {
  id: number;
  plan: {
    name: string;
    description: string;
  };
  billing_cycle: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  next_payment_date: string;
  price_paid: number;
  currency: string;
  auto_renew: boolean;
  cancel_at_period_end: boolean;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/subscriptions/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSubscription(response.data);
    } catch (error: any) {
      // No active subscription
      if (error.response?.status === 404) {
        setSubscription(null);
      } else {
        console.error("Failed to fetch subscription:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (immediate: boolean = false) => {
    if (
      !confirm(
        `Are you sure you want to cancel your subscription${immediate ? " immediately" : ""}?`,
      )
    ) {
      return;
    }

    setCancelling(true);

    try {
      await axios.post(
        `${API_URL}/api/v1/subscriptions/cancel?immediate=${immediate}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // Refresh subscription data
      await fetchSubscription();
      alert(
        immediate
          ? "Subscription cancelled immediately"
          : "Subscription will be cancelled at the end of your billing period",
      );
    } catch (error: any) {
      console.error("Cancellation failed:", error);
      alert(error.response?.data?.detail || "Cancellation failed");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      trial: "secondary",
      cancelled: "destructive",
      past_due: "destructive",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="container max-w-4xl py-10 space-y-8">
        <h1 className="text-3xl font-bold">Subscription</h1>

        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You don't have an active subscription. Browse our plans to get
              started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/pricing")}>View Plans</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{subscription.plan.name}</CardTitle>
              <CardDescription>{subscription.plan.description}</CardDescription>
            </div>
            {getStatusBadge(subscription.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              ${subscription.price_paid}
            </span>
            <span className="text-muted-foreground">
              /{subscription.billing_cycle === "monthly" ? "month" : "year"}
            </span>
          </div>

          {/* Billing Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Billing Period</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(subscription.current_period_start)} -{" "}
                  {formatDate(subscription.current_period_end)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Next Payment</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.cancel_at_period_end
                    ? "Cancelled"
                    : formatDate(subscription.next_payment_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {subscription.cancel_at_period_end && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your subscription will be cancelled on{" "}
                {formatDate(subscription.current_period_end)}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {!subscription.cancel_at_period_end && (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push("/pricing")}
                >
                  Change Plan
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCancel(false)}
                  disabled={cancelling}
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Cancel Subscription"
                  )}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View your past invoices and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Invoice history will be displayed here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
