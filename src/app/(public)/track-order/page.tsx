"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Package } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Order {
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}

export default function TrackOrderPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [showAllOrders, setShowAllOrders] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    setShowAllOrders(false);

    try {
      const response = await axios.post(`${API_URL}/api/v1/guest/track-order`, {
        email,
        order_number: orderNumber,
      });

      setOrder(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Order not found. Please check your email and order number.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllOrders = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await axios.get(
        `${API_URL}/api/v1/guest/orders/${encodeURIComponent(email)}`,
      );
      setAllOrders(response.data.orders || []);
      setShowAllOrders(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "text-yellow-600 bg-yellow-50",
      processing: "text-blue-600 bg-blue-50",
      completed: "text-green-600 bg-green-50",
      failed: "text-red-600 bg-red-50",
      cancelled: "text-gray-600 bg-gray-50",
    };
    return colors[status] || "text-gray-600 bg-gray-50";
  };

  return (
    <div className="container max-w-2xl py-10 space-y-8">
      <div className="text-center">
        <Package className="h-12 w-12 mx-auto text-primary mb-4" />
        <h1 className="text-3xl font-bold">Track Your Order</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email and order number to track your purchase
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use the email address you provided during checkout
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-number">Order Number</Label>
              <Input
                id="order-number"
                placeholder="ORD-20240126-ABC123"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Found in your order confirmation email
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Track Order
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleViewAllOrders}
                disabled={loading || !email}
              >
                View All My Orders
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Single Order Result */}
      {order && !showAllOrders && (
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-semibold font-mono">{order.order_number}</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold text-lg">
                  ${order.total?.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-semibold">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Items ({order.items.length})
                </p>
                <div className="space-y-2">
                  {order.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between p-2 bg-muted rounded"
                    >
                      <span className="text-sm">{item.item_name}</span>
                      <span className="text-sm font-medium">
                        ${item.total?.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/register")}
              >
                Create Account to Manage Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Orders List */}
      {showAllOrders && allOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Orders ({allOrders.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allOrders.map((order) => (
              <div
                key={order.order_number}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold font-mono text-sm">
                      {order.order_number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Button
                className="w-full"
                onClick={() => router.push("/register")}
              >
                Create Account to Access All Features
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showAllOrders && allOrders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No orders found for this email
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted">
        <CardContent className="py-6">
          <h3 className="font-semibold mb-3">Need Help?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Check your email for order confirmation</li>
            <li>• Order number format: ORD-YYYYMMDD-XXXXXX</li>
            <li>• Create an account to manage all your orders</li>
            <li>• Contact support if you can't find your order</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
