"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Plus, Trash2, Star } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface PaymentMethod {
  id: number;
  gateway: string;
  method_type: string;
  display_name: string | null;
  last_four: string | null;
  card_brand: string | null;
  expiry_month: number | null;
  expiry_year: number | null;
  paypal_email: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/payment-methods`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMethods(response.data || []);
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (methodId: number) => {
    try {
      await axios.post(
        `${API_URL}/api/v1/payment-methods/${methodId}/set-default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      fetchPaymentMethods();
    } catch (error) {
      console.error("Failed to set default:", error);
      alert("Failed to update default payment method");
    }
  };

  const handleDelete = async (methodId: number) => {
    if (!confirm("Are you sure you want to remove this payment method?"))
      return;

    try {
      await axios.delete(`${API_URL}/api/v1/payment-methods/${methodId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchPaymentMethods();
    } catch (error) {
      console.error("Failed to delete payment method:", error);
      alert("Failed to remove payment method");
    }
  };

  const getCardIcon = (brand: string | null) => {
    if (!brand) return <CreditCard className="h-6 w-6" />;
    // You can add brand-specific icons here
    return <CreditCard className="h-6 w-6" />;
  };

  const formatExpiryDate = (month: number | null, year: number | null) => {
    if (!month || !year) return null;
    return `${String(month).padStart(2, "0")}/${String(year).slice(-2)}`;
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

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          <p className="text-muted-foreground mt-2">
            Manage your saved payment methods for faster checkout
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {methods.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No saved payment methods
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Payment Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {methods.map((method) => (
            <Card
              key={method.id}
              className={method.is_default ? "border-primary" : ""}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-muted">
                      {getCardIcon(method.card_brand)}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {method.display_name ||
                            (method.method_type === "card"
                              ? "Credit Card"
                              : method.method_type)}
                        </h3>
                        {method.is_default && (
                          <Badge
                            variant="default"
                            className="flex items-center gap-1"
                          >
                            <Star className="h-3 w-3" fill="currentColor" />
                            Default
                          </Badge>
                        )}
                        <Badge variant="outline" className="capitalize">
                          {method.gateway}
                        </Badge>
                      </div>

                      {method.method_type === "card" && method.last_four && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>•••• •••• •••• {method.last_four}</span>
                          {method.card_brand && (
                            <span className="capitalize">
                              {method.card_brand}
                            </span>
                          )}
                          {formatExpiryDate(
                            method.expiry_month,
                            method.expiry_year,
                          ) && (
                            <span>
                              Expires{" "}
                              {formatExpiryDate(
                                method.expiry_month,
                                method.expiry_year,
                              )}
                            </span>
                          )}
                        </div>
                      )}

                      {method.method_type === "paypal" &&
                        method.paypal_email && (
                          <div className="text-sm text-muted-foreground">
                            {method.paypal_email}
                          </div>
                        )}

                      <p className="text-xs text-muted-foreground">
                        Added on{" "}
                        {new Date(method.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!method.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-muted">
        <CardContent className="py-6">
          <h3 className="font-semibold mb-3">Security</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• All payment information is encrypted and securely stored</li>
            <li>• We never store your full card number</li>
            <li>
              • Payment processing handled by industry-standard providers
              (Stripe, PayPal)
            </li>
            <li>• You can remove payment methods anytime</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
