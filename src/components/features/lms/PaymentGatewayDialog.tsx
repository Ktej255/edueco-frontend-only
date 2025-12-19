"use client";

import { useState } from "react";
import { X, CreditCard, CheckCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import api from "@/lib/api";

interface PaymentGatewayDialogProps {
  open: boolean;
  onClose: () => void;
  courseId: number;
  courseTitle: string;
  price: number;
  onSuccess: () => void;
}

const paymentGateways = [
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Credit/Debit Cards, UPI, Netbanking, Wallets",
    icon: "💳",
    popular: true,
    color: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20",
  },
  {
    id: "instamojo",
    name: "Instamojo",
    description: "Cards, UPI, Netbanking",
    icon: "💰",
    popular: false,
    color: "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "International Cards",
    icon: "🌍",
    popular: false,
    color: "bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20",
  },
];

export function PaymentGatewayDialog({
  open,
  onClose,
  courseId,
  courseTitle,
  price,
  onSuccess,
}: PaymentGatewayDialogProps) {
  const [selectedGateway, setSelectedGateway] = useState<string>("razorpay");
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [finalPrice, setFinalPrice] = useState(price);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      setValidatingCoupon(true);
      const response = await api.post("/coupons/validate", {
        code: couponCode.toUpperCase(),
        course_id: courseId,
        original_price: price,
      });

      if (response.data.valid) {
        setAppliedCoupon(response.data);
        setFinalPrice(response.data.final_price);
        alert(
          `✅ ${response.data.message}\nDiscount: ₹${response.data.discount_amount}\nFinal Price: ₹${response.data.final_price}`,
        );
      } else {
        alert(`❌ ${response.data.message}`);
        setAppliedCoupon(null);
        setFinalPrice(price);
      }
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to validate coupon");
      setAppliedCoupon(null);
      setFinalPrice(price);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setFinalPrice(price);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      if (selectedGateway === "razorpay") {
        await handleRazorpayPayment();
      } else if (selectedGateway === "instamojo") {
        await handleInstamojoPayment();
      } else if (selectedGateway === "stripe") {
        await handleStripePayment();
      }
    } catch (error: any) {
      console.error("Payment failed:", error);
      alert(
        error.response?.data?.detail || "Payment failed. Please try again.",
      );
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    // Create Razorpay order
    const response = await api.post("/course-payments/create-razorpay-order", {
      course_id: courseId,
    });

    const { order_id, razorpay_key } = response.data;

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: razorpay_key,
        amount: price * 100, // paise
        currency: "INR",
        name: "EduEcosystem",
        description: courseTitle,
        order_id: order_id,
        handler: async function (response: any) {
          try {
            // Verify payment
            await api.post("/course-payments/verify-razorpay-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            onSuccess();
            onClose();
          } catch (error) {
            alert("Payment verification failed");
            setLoading(false);
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#0891b2",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
  };

  const handleInstamojoPayment = async () => {
    const response = await api.post(
      "/course-payments/create-instamojo-payment",
      {
        course_id: courseId,
      },
    );

    // Redirect to Instamojo
    window.location.href = response.data.checkout_url;
  };

  const handleStripePayment = async () => {
    const response = await api.post("/course-payments/create-stripe-checkout", {
      course_id: courseId,
    });

    // Redirect to Stripe
    window.location.href = response.data.checkout_url;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            Select Payment Method
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose your preferred payment gateway
          </DialogDescription>
        </DialogHeader>

        {/* Course Summary */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">Course</span>
            <span className="text-white font-medium text-sm">
              {courseTitle}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Total Amount</span>
            <span className="text-cyan-400 font-bold text-xl">
              ₹{price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-3">
          {paymentGateways.map((gateway) => (
            <button
              key={gateway.id}
              onClick={() => setSelectedGateway(gateway.id)}
              className={`w-full border-2 rounded-lg p-4 transition ${
                selectedGateway === gateway.id
                  ? "border-cyan-500 bg-cyan-500/10"
                  : `border-gray-700 ${gateway.color}`
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{gateway.icon}</div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">
                        {gateway.name}
                      </span>
                      {gateway.popular && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {gateway.description}
                    </p>
                  </div>
                </div>
                {selectedGateway === gateway.id && (
                  <CheckCircle className="h-5 w-5 text-cyan-400" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Coupon Code Section */}
        {!appliedCoupon ? (
          <div className="mt-4 bg-gray-800/30 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-green-400" />
              <span className="text-white text-sm font-medium">
                Have a coupon code?
              </span>
            </div>
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCouponCode(e.target.value.toUpperCase())
                }
                placeholder="Enter code"
                className="bg-gray-800 border-gray-700 text-white uppercase"
                disabled={validatingCoupon}
              />
              <Button
                onClick={handleApplyCoupon}
                disabled={validatingCoupon || !couponCode.trim()}
                className="bg-green-600 hover:bg-green-500"
              >
                {validatingCoupon ? "..." : "Apply"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 bg-green-500/10 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-medium">
                  {appliedCoupon.coupon.code}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeCoupon}
                className="text-red-400 hover:text-red-300 h-auto p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Original Price:</span>
                <span>₹{price}</span>
              </div>
              <div className="flex justify-between text-green-400">
                <span>Discount:</span>
                <span>-₹{appliedCoupon.discount_amount}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-green-500/20">
                <span>Final Price:</span>
                <span>₹{finalPrice}</span>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3 mt-4">
          <p className="text-xs text-blue-200/80">
            🔒 All payments are secure and encrypted. Your payment information
            is never stored on our servers.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ₹{finalPrice.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
