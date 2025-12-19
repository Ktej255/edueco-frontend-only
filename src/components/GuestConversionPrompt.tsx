"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, CheckCircle, ArrowRight } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function GuestConversionPrompt() {
  const router = useRouter();
  const [guestEmail, setGuestEmail] = useState<string | null>(null);
  const [orderCount, setOrderCount] = useState(0);
  const [converting, setConverting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if there's a guest email in localStorage (set during guest checkout)
    const email = localStorage.getItem("guest_checkout_email");
    if (email) {
      setGuestEmail(email);
      checkGuestOrders(email);
    }
  }, []);

  const checkGuestOrders = async (email: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/guest/orders/${encodeURIComponent(email)}`,
      );
      setOrderCount(response.data.order_count || 0);
    } catch (error) {
      console.error("Failed to check guest orders:", error);
    }
  };

  const handleConvert = async () => {
    if (!guestEmail) return;

    setConverting(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/guest/convert-to-user`,
        { guest_email: guestEmail },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setSuccess(true);
      localStorage.removeItem("guest_checkout_email");

      // Wait a moment then redirect to orders
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    } catch (error: any) {
      console.error("Conversion failed:", error);
      alert(error.response?.data?.detail || "Failed to convert orders");
    } finally {
      setConverting(false);
    }
  };

  const handleSkip = () => {
    localStorage.removeItem("guest_checkout_email");
    router.push("/dashboard");
  };

  if (!guestEmail || orderCount === 0) {
    return null;
  }

  if (success) {
    return (
      <div className="container max-w-md py-10">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">Orders Linked!</h2>
            <p className="text-muted-foreground">
              Your {orderCount} guest {orderCount === 1 ? "order" : "orders"}{" "}
              {orderCount === 1 ? "has" : "have"} been added to your account.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Link Your Guest Orders</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                We found {orderCount} {orderCount === 1 ? "order" : "orders"}{" "}
                from {guestEmail}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              It looks like you made{" "}
              {orderCount === 1 ? "a purchase" : "purchases"} as a guest using{" "}
              <strong>{guestEmail}</strong>. Would you like to link{" "}
              {orderCount === 1 ? "this order" : "these orders"} to your new
              account for easier management?
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-sm">Benefits of linking:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Access all orders in one place</li>
              <li>• Download invoices anytime</li>
              <li>• Track order status easily</li>
              <li>• Quick course access from dashboard</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleConvert}
              className="flex-1"
              disabled={converting}
            >
              {converting ? (
                "Linking..."
              ) : (
                <>
                  Link Orders to Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleSkip}>
              Skip for Now
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You can always link your orders later from your account settings
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
