"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart as CartIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  LocalOffer as CouponIcon,
  ArrowForward as CheckoutIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Divider,
  Grid,
  Alert,
  Skeleton,
  Chip,
} from "@mui/material";
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

const CartPage: React.FC = () => {
  const router = useRouter();
  const navigate = router.push;
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
    navigate("/checkout");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="text" sx={{ mt: 2 }} />
        <Skeleton variant="text" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CartIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you haven't added any courses yet.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/courses")}
          size="large"
        >
          Browse Courses
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 3, display: "flex", alignItems: "center" }}
      >
        <CartIcon sx={{ mr: 1 }} /> Shopping Cart ({cart.item_count} items)
      </Typography>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {cart.items.map((item) => (
            <Card key={item.id} sx={{ mb: 2, display: "flex" }}>
              {item.course_thumbnail && (
                <CardMedia
                  component="img"
                  sx={{ width: 160, objectFit: "cover" }}
                  image={item.course_thumbnail}
                  alt={item.course_title || item.bundle_name}
                />
              )}
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography variant="h6" gutterBottom>
                    {item.course_title || item.bundle_name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Quantity:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        variant="body1"
                        sx={{ minWidth: 30, textAlign: "center" }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {item.coupon_code && (
                    <Chip
                      icon={<CouponIcon />}
                      label={`Coupon: ${item.coupon_code}`}
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" color="primary">
                      {cart.currency} {item.total.toFixed(2)}
                    </Typography>
                    {item.discount_amount > 0 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: "line-through" }}
                      >
                        {cart.currency} {item.subtotal.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => removeItem(item.id)}
                    size="small"
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            </Card>
          ))}

          <Button
            variant="outlined"
            color="error"
            onClick={clearCart}
            sx={{ mt: 2 }}
          >
            Clear Cart
          </Button>
        </Grid>

        {/* Cart Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: "sticky", top: 80 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Coupon Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Have a coupon?
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter code"
                    disabled={applyingCoupon}
                  />
                  <Button
                    variant="outlined"
                    onClick={applyCoupon}
                    disabled={applyingCoupon || !couponCode.trim()}
                  >
                    Apply
                  </Button>
                </Box>

                {couponError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {couponError}
                  </Alert>
                )}
                {couponSuccess && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    {couponSuccess}
                  </Alert>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Price Breakdown */}
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">
                    {cart.currency} {cart.subtotal.toFixed(2)}
                  </Typography>
                </Box>

                {cart.total_discount > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="success.main">
                      Discount:
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      -{cart.currency} {cart.total_discount.toFixed(2)}
                    </Typography>
                  </Box>
                )}

                {cart.tax_amount > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">Tax:</Typography>
                    <Typography variant="body2">
                      {cart.currency} {cart.tax_amount.toFixed(2)}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  {cart.currency} {cart.total.toFixed(2)}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                endIcon={<CheckoutIcon />}
                onClick={proceedToCheckout}
                sx={{ mb: 1 }}
              >
                Proceed to Checkout
              </Button>

              <Button
                fullWidth
                variant="text"
                onClick={() => navigate("/courses")}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
