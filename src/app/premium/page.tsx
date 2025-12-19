"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SubscriptionPage() {
  const [isLoading, setIsLoading] = useState(false);
  // TODO: This should come from auth context or be fetched from API
  const [isPremium] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/checkout-session`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Failed to start checkout");
      setIsLoading(false);
    }
  };

  const handleManage = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/portal`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Redirect to Stripe Portal
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Portal failed:", error);
      toast.error("Failed to open billing portal");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground">
          Unlock the full potential of your learning journey.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>
              Essential features for every student
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-4xl font-bold mb-6">
              $0
              <span className="text-lg font-normal text-muted-foreground">
                /mo
              </span>
            </div>
            <ul className="space-y-3">
              <FeatureItem text="Access to basic courses" />
              <FeatureItem text="Community forums" />
              <FeatureItem text="Basic progress tracking" />
              <FeatureItem text="Limited AI Tutor queries" />
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled>
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className="flex flex-col border-primary shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
            POPULAR
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Premium</CardTitle>
            <CardDescription>
              Advanced tools for serious learners
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-4xl font-bold mb-6">
              $19
              <span className="text-lg font-normal text-muted-foreground">
                /mo
              </span>
            </div>
            <ul className="space-y-3">
              <FeatureItem text="Unlimited AI Tutor access" />
              <FeatureItem text="Live classes & webinars" />
              <FeatureItem text="Verified certificates" />
              <FeatureItem text="Code review & debugging" />
              <FeatureItem text="Priority support" />
              <FeatureItem text="Offline downloads (Mobile)" />
            </ul>
          </CardContent>
          <CardFooter>
            {isPremium ? (
              <Button
                className="w-full"
                onClick={handleManage}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-4 w-4" />
                )}
                Manage Subscription
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handleSubscribe}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Upgrade to Premium"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Check className="h-4 w-4 text-primary" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
