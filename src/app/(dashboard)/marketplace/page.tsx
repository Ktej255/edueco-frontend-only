"use client";

import React, { useEffect, useState } from "react";
import { bundleService, Bundle } from "@/services/bundleService";
import { subscriptionService, Plan } from "@/services/subscriptionService";
import { BundleCard } from "@/components/marketplace/BundleCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function MarketplacePage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bundlesData, plansData] = await Promise.all([
          bundleService.getFeaturedBundles(),
          subscriptionService.getPlans(),
        ]);
        setBundles(bundlesData);
        setPlans(plansData);
      } catch (error) {
        console.error("Failed to fetch marketplace data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Discover course bundles and premium plans to accelerate your
            learning.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/affiliate">
            <Button variant="outline">Affiliate Program</Button>
          </Link>
          <Link href="/dashboard/instructor/earnings">
            <Button variant="outline">Instructor Dashboard</Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="bundles" className="space-y-8">
        <TabsList>
          <TabsTrigger value="bundles">Course Bundles</TabsTrigger>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="bundles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
          {bundles.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No bundles available at the moment.
            </div>
          )}
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.description}
                  </p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold">
                    ${plan.monthly_price}
                  </span>
                  <span className="text-gray-500">/month</span>
                  {plan.trial_days > 0 && (
                    <div className="text-sm text-green-600 font-medium mt-2">
                      {plan.trial_days}-day free trial
                    </div>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features &&
                    JSON.parse(plan.features).map(
                      (feature: string, i: number) => (
                        <li key={i} className="flex items-center text-sm">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feature}
                        </li>
                      ),
                    )}
                </ul>
                <Button className="w-full">Subscribe Now</Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
