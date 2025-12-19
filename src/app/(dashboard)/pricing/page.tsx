"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Sparkles } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  monthly_price: number;
  yearly_price: number | null;
  currency: string;
  trial_days: number;
  features: string[];
  is_popular: boolean;
  is_featured: boolean;
}

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/subscriptions/plans`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setPlans(response.data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    setSubscribing(planId);

    try {
      await axios.post(
        `${API_URL}/api/v1/subscriptions/subscribe`,
        { plan_id: planId, billing_cycle: billingCycle },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // Redirect to subscription management page
      router.push("/subscription");
    } catch (error: any) {
      console.error("Subscription failed:", error);
      alert(error.response?.data?.detail || "Subscription failed");
    } finally {
      setSubscribing(null);
    }
  };

  const getPrice = (plan: SubscriptionPlan) => {
    const price =
      billingCycle === "monthly"
        ? plan.monthly_price
        : plan.yearly_price || plan.monthly_price;
    return price;
  };

  if (loading) {
    return (
      <div className="container max-w-7xl py-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock unlimited access to courses, live classes, and premium features
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span
          className={
            billingCycle === "monthly"
              ? "font-semibold"
              : "text-muted-foreground"
          }
        >
          Monthly
        </span>
        <button
          onClick={() =>
            setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
          }
          className="relative w-14 h-8 bg-primary rounded-full transition-colors"
        >
          <div
            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
              billingCycle === "yearly" ? "translate-x-6" : ""
            }`}
          />
        </button>
        <span
          className={
            billingCycle === "yearly"
              ? "font-semibold"
              : "text-muted-foreground"
          }
        >
          Yearly
          <Badge variant="secondary" className="ml-2">
            Save 20%
          </Badge>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {plans.map((plan) => {
          const price = getPrice(plan);
          const features =
            typeof plan.features === "string"
              ? JSON.parse(plan.features)
              : plan.features || [];

          return (
            <Card
              key={plan.id}
              className={`relative ${
                plan.is_popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.short_description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-muted-foreground">
                      /{billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                  {plan.trial_days > 0 && (
                    <p className="text-sm text-green-600">
                      {plan.trial_days} days free trial
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.is_popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={subscribing !== null}
                >
                  {subscribing === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe Now"
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* FAQs or Additional Info */}
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          All plans include 24/7 support and can be cancelled anytime
        </p>
      </div>
    </div>
  );
}
