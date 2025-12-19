"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Download } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const order_id = searchParams?.get("order_id");
    const order_num = searchParams?.get("order_number");

    if (order_num) {
      setOrderNumber(order_num);
    } else if (order_id) {
      // Fetch order to get order number
      fetchOrder(Number(order_id));
    }
  }, [searchParams]);

  const fetchOrder = async (orderId: number) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrderNumber(response.data.order_number);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    }
  };

  return (
    <div className="container max-w-2xl py-10 space-y-8">
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">
            Order Confirmed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            {orderNumber && (
              <p className="text-sm">
                <span className="text-muted-foreground">Order Number:</span>{" "}
                <span className="font-semibold font-mono">{orderNumber}</span>
              </p>
            )}
          </div>

          <div className="space-y-3 py-4">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Instant Access</p>
                <p className="text-sm text-muted-foreground">
                  Your courses are now available in your dashboard
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Receipt</p>
                <p className="text-sm text-muted-foreground">
                  A confirmation email with your receipt has been sent to your
                  email
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Link href="/dashboard">
              <Button className="w-full" size="lg">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline" className="w-full">
                View Order History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6">
          <h3 className="font-semibold mb-3">Next Steps</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Access your courses from the dashboard</li>
            <li>• Download course materials and resources</li>
            <li>• Track your learning progress</li>
            <li>• Get certificates upon completion</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
