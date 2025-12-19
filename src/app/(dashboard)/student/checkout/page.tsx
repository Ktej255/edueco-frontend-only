"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  CreditCard,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import api from "@/lib/api";

interface CartSummary {
  cart_id: number;
  items: Array<{
    id: number;
    course_title?: string;
    bundle_name?: string;
    quantity: number;
    total: number;
  }>;
  item_count: number;
  subtotal: number;
  total_discount: number;
  tax_amount: number;
  total: number;
  currency: string;
}

interface BillingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const steps = ["Review Cart", "Billing Information", "Payment", "Confirmation"];

export default function CheckoutPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [formErrors, setFormErrors] = useState<Partial<BillingInfo>>({});

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      setCart(response.data);

      if (response.data.items.length === 0) {
        router.push("/student/cart");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const validateBillingInfo = (): boolean => {
    const errors: Partial<BillingInfo> = {};

    if (!billingInfo.name.trim()) errors.name = "Name is required";
    if (!billingInfo.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingInfo.email)) {
      errors.email = "Invalid email format";
    }
    if (!billingInfo.address.trim()) errors.address = "Address is required";
    if (!billingInfo.city.trim()) errors.city = "City is required";
    if (!billingInfo.zipCode.trim()) errors.zipCode = "ZIP code is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 1 && !validateBillingInfo()) {
      return;
    }

    if (activeStep === 2) {
      handleSubmitOrder();
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmitOrder = async () => {
    if (!cart) return;

    try {
      setProcessing(true);
      setError(null);

      const orderResponse = await api.post("/orders", {
        cart_id: cart.cart_id,
        billing_name: billingInfo.name,
        billing_email: billingInfo.email,
        billing_address: `${billingInfo.address}, ${billingInfo.city}, ${billingInfo.state} ${billingInfo.zipCode}, ${billingInfo.country}`,
        customer_notes: "",
      });

      const order = orderResponse.data;
      setOrderNumber(order.order_number);

      // Process the order
      await api.post(`/orders/${order.id}/process`);

      setActiveStep(3);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to process order");
    } finally {
      setProcessing(false);
    }
  };

  const handleChange =
    (field: keyof BillingInfo) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setBillingInfo({ ...billingInfo, [field]: event.target.value });
        if (formErrors[field]) {
          setFormErrors({ ...formErrors, [field]: undefined });
        }
      };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/student/cart")}>
          Back to Cart
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((label, index) => (
          <div key={label} className="flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${index <= activeStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                  }`}
              >
                {index + 1}
              </div>
              <span className="text-xs mt-1 text-center hidden sm:block">{label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="h-0.5 bg-muted-foreground/30 flex-1 mt-5" />
            )}
          </div>
        ))}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          {/* Step 0: Review Cart */}
          {activeStep === 0 && cart && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start py-2">
                    <div>
                      <p className="font-medium">{item.course_title || item.bundle_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × {cart.currency}{" "}
                        {(item.total / item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {cart.currency} {item.total.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-right">
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
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total:</span>
                  <span>
                    {cart.currency} {cart.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Billing Information */}
          {activeStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={billingInfo.name}
                    onChange={handleChange("name")}
                    className={formErrors.name ? "border-destructive" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-destructive mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingInfo.email}
                    onChange={handleChange("email")}
                    className={formErrors.email ? "border-destructive" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-destructive mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={billingInfo.address}
                    onChange={handleChange("address")}
                    className={formErrors.address ? "border-destructive" : ""}
                  />
                  {formErrors.address && (
                    <p className="text-sm text-destructive mt-1">{formErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={billingInfo.city}
                      onChange={handleChange("city")}
                      className={formErrors.city ? "border-destructive" : ""}
                    />
                    {formErrors.city && (
                      <p className="text-sm text-destructive mt-1">{formErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={billingInfo.state}
                      onChange={handleChange("state")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                    <Input
                      id="zipCode"
                      value={billingInfo.zipCode}
                      onChange={handleChange("zipCode")}
                      className={formErrors.zipCode ? "border-destructive" : ""}
                    />
                    {formErrors.zipCode && (
                      <p className="text-sm text-destructive mt-1">{formErrors.zipCode}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={billingInfo.country}
                      onChange={handleChange("country")}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {activeStep === 2 && cart && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="cursor-pointer">
                    Credit/Debit Card (Stripe)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay" className="cursor-pointer">
                    Razorpay (Cards, UPI, Wallets)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="paypal" id="paypal" disabled />
                  <Label htmlFor="paypal" className="opacity-50">
                    PayPal (Coming Soon)
                  </Label>
                </div>
              </RadioGroup>

              <Separator className="my-4" />

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Order Summary</p>
                <p className="text-sm">Items: {cart.item_count}</p>
                <p className="text-lg font-bold text-primary">
                  Total: {cart.currency} {cart.total.toFixed(2)}
                </p>
              </div>

              <Alert className="mt-4">
                <AlertDescription>
                  You will be redirected to the payment gateway to complete your purchase.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {activeStep === 3 && (
            <div className="text-center py-8">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
              <p className="text-muted-foreground mb-2">
                Your order number is: <strong>{orderNumber}</strong>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                You will receive a confirmation email shortly.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push("/student/orders")}>
                  View Orders
                </Button>
                <Button variant="outline" onClick={() => router.push("/lms/courses")}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      {activeStep < 3 && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={activeStep === 0 || processing}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={processing}>
            {processing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : activeStep === 2 ? (
              "Place Order"
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
