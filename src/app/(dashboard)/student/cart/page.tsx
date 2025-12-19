"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";

interface CartItem {
  id: number;
  cart_id: number;
  course_id?: number;
  bundle_id?: number;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  subtotal: number;
  total: number;
  added_at: string;
  course_title?: string;
  course_thumbnail?: string;
  bundle_name?: string;
  coupon_code?: string;
}

interface CartSummary {
  cart_id: number;
  items: CartItem[];
  item_count: number;
  subtotal: number;
  total_discount: number;
  tax_amount: number;
  total: number;
  currency: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      setCart(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
      return;
    }

    try {
      await api.patch(`/cart/items/${itemId}`, { quantity: newQuantity });
      await fetchCart();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update quantity");
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      await fetchCart();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to remove item");
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      setApplyingCoupon(true);
      setCouponError(null);
      setCouponSuccess(null);

      await api.post("/cart/apply-coupon", {
        coupon_code: couponCode.trim(),
      });

      setCouponSuccess("Coupon applied successfully!");
      setCouponCode("");
      await fetchCart();
    } catch (err: any) {
      setCouponError(
        err.response?.data?.detail || "Invalid or expired coupon code",
      );
    } finally {
      setApplyingCoupon(false);
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) {
      return;
    }

    try {
      await api.delete("/cart/clear");
      await fetchCart();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to clear cart");
    }
  };

  const proceedToCheckout = () => {
    router.push("/student/checkout");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
          <div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added any courses yet.
        </p>
        <Button onClick={() => router.push("/lms/courses")} size="lg">
          Browse Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="h-8 w-8" />
        <h1 className="text-3xl font-bold">
          Shopping Cart ({cart.item_count} items)
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {item.course_thumbnail && (
                    <img
                      src={item.course_thumbnail}
                      alt={item.course_title || item.bundle_name}
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {item.course_title || item.bundle_name}
                    </h3>

                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm text-muted-foreground">
                        Quantity:
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {item.coupon_code && (
                      <Badge variant="secondary" className="mb-2">
                        <Tag className="h-3 w-3 mr-1" />
                        Coupon: {item.coupon_code}
                      </Badge>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {cart.currency} {item.total.toFixed(2)}
                        </p>
                        {item.discount_amount > 0 && (
                          <p className="text-sm text-muted-foreground line-through">
                            {cart.currency} {item.subtotal.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={clearCart} className="mt-4">
            Clear Cart
          </Button>
        </div>

        {/* Cart Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Coupon Section */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Have a coupon?
                </label>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    disabled={applyingCoupon}
                  />
                  <Button
                    onClick={applyCoupon}
                    disabled={applyingCoupon || !couponCode.trim()}
                  >
                    {applyingCoupon ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>

                {couponError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{couponError}</AlertDescription>
                  </Alert>
                )}
                {couponSuccess && (
                  <Alert className="mt-2">
                    <AlertDescription>{couponSuccess}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>
                    {cart.currency} {cart.subtotal.toFixed(2)}
                  </span>
                </div>

                {cart.total_discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>
                      -{cart.currency} {cart.total_discount.toFixed(2)}
                    </span>
                  </div>
                )}

                {cart.tax_amount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>
                      {cart.currency} {cart.tax_amount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">
                  {cart.currency} {cart.total.toFixed(2)}
                </span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={proceedToCheckout}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/lms/courses")}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
