"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Lock, Plus } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface PaymentMethod {
  id: number;
  gateway: string;
  method_type: string;
  display_name: string | null;
  last_four: string | null;
  card_brand: string | null;
  is_default: boolean;
}

interface CartItem {
  id: number;
  course_title: string;
  price: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Cart and pricing
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  // Payment
  const [paymentGateway, setPaymentGateway] = useState<"stripe" | "paypal">(
    "stripe",
  );
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<number | "new">("new");
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);

  // Billing info
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  useEffect(() => {
    fetchCartData();
    fetchSavedPaymentMethods();
  }, []);

  const fetchCartData = async () => {
    try {
      // In a real implementation, fetch cart from API
      // For now, mock data
      const mockCart = [
        { id: 1, course_title: "Advanced JavaScript", price: 99.99 },
        { id: 2, course_title: "React Master Class", price: 149.99 },
      ];

      setCartItems(mockCart);
      const subtotalAmount = mockCart.reduce(
        (sum, item) => sum + item.price,
        0,
      );
      setSubtotal(subtotalAmount);

      // Calculate tax (8.25% example)
      const taxAmount = subtotalAmount * 0.0825;
      setTax(taxAmount);
      setTotal(subtotalAmount + taxAmount);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPaymentMethods = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/payment-methods`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSavedMethods(response.data || []);

      // Auto-select default method if exists
      const defaultMethod = response.data.find(
        (m: PaymentMethod) => m.is_default,
      );
      if (defaultMethod) {
        setSelectedMethod(defaultMethod.id);
        setPaymentGateway(defaultMethod.gateway as "stripe" | "paypal");
      }
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
    }
  };

  const handlePaymentGatewayChange = (gateway: "stripe" | "paypal") => {
    setPaymentGateway(gateway);

    // If switching gateways, reset to new payment method
    if (selectedMethod !== "new") {
      const method = savedMethods.find((m) => m.id === selectedMethod);
      if (method && method.gateway !== gateway) {
        setSelectedMethod("new");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (paymentGateway === "stripe") {
        await processStripePayment();
      } else {
        await processPayPalPayment();
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const processStripePayment = async () => {
    // Stripe payment processing
    // In production, use Stripe Elements or Stripe Checkout

    // Mock successful payment
    setTimeout(() => {
      router.push("/checkout/success?order_number=ORD-12345");
    }, 2000);
  };

  const processPayPalPayment = async () => {
    // PayPal payment processing
    // In production, use PayPal SDK

    // Mock successful payment
    setTimeout(() => {
      router.push("/checkout/success?order_number=ORD-12345");
    }, 2000);
  };

  const filteredMethods = savedMethods.filter(
    (m) => m.gateway === paymentGateway,
  );

  if (loading) {
    return (
      <div className="container max-w-6xl py-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Select Payment Gateway */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={paymentGateway}
                  onValueChange={(value) =>
                    handlePaymentGatewayChange(value as "stripe" | "paypal")
                  }
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          <span className="font-medium">Credit/Debit Card</span>
                        </div>
                        <Badge variant="outline">Stripe</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Visa, Mastercard, American Express
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                            P
                          </div>
                          <span className="font-medium">PayPal</span>
                        </div>
                        <Badge variant="outline">PayPal</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pay securely with your PayPal account
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Saved Payment Methods or New Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {paymentGateway === "stripe"
                    ? "Card Details"
                    : "PayPal Account"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredMethods.length > 0 && (
                  <RadioGroup
                    value={selectedMethod.toString()}
                    onValueChange={(value) =>
                      setSelectedMethod(value === "new" ? "new" : Number(value))
                    }
                  >
                    {filteredMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center space-x-2 p-3 border rounded-lg"
                      >
                        <RadioGroupItem
                          value={method.id.toString()}
                          id={`method-${method.id}`}
                        />
                        <Label
                          htmlFor={`method-${method.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {method.display_name ||
                                  (method.method_type === "card"
                                    ? "Credit Card"
                                    : "PayPal")}
                              </p>
                              {method.last_four && (
                                <p className="text-sm text-muted-foreground">
                                  •••• •••• •••• {method.last_four}
                                </p>
                              )}
                            </div>
                            {method.is_default && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}

                    <div className="flex items-center space-x-2 p-3 border rounded-lg border-dashed">
                      <RadioGroupItem value="new" id="method-new" />
                      <Label
                        htmlFor="method-new"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          <span className="font-medium">
                            Use a new payment method
                          </span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                )}

                {(selectedMethod === "new" || filteredMethods.length === 0) && (
                  <div className="space-y-4 pt-4">
                    {paymentGateway === "stripe" ? (
                      <>
                        <div className="p-4 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                          <CreditCard className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">
                            Stripe Card Element would render here
                          </p>
                          <p className="text-xs mt-1">
                            In production: Stripe Elements integration
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="save-card"
                            checked={savePaymentMethod}
                            onCheckedChange={(checked) =>
                              setSavePaymentMethod(checked as boolean)
                            }
                          />
                          <Label
                            htmlFor="save-card"
                            className="text-sm cursor-pointer"
                          >
                            Save this card for future purchases
                          </Label>
                        </div>
                      </>
                    ) : (
                      <div className="p-6 border rounded-lg bg-blue-50 text-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                          P
                        </div>
                        <p className="font-medium mb-2">PayPal Checkout</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          You'll be redirected to PayPal to complete your
                          purchase
                        </p>
                        <Button
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Continue with PayPal
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billing-name">Full Name</Label>
                  <Input
                    id="billing-name"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing-email">Email</Label>
                  <Input
                    id="billing-email"
                    type="email"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing-address">Address</Label>
                  <Input
                    id="billing-address"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.course_title}
                      </span>
                      <span className="font-medium">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Complete Purchase
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Your payment information is encrypted and secure
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
