import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  CreditCard as PaymentIcon,
  CheckCircle as SuccessIcon,
} from "@mui/icons-material";
import api from "../services/api";

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

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Billing form state
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
        navigate("/cart");
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
      // Process payment and create order
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

      // Create order
      const orderResponse = await api.post("/orders", {
        cart_id: cart.cart_id,
        billing_name: billingInfo.name,
        billing_email: billingInfo.email,
        billing_address: `${billingInfo.address}, ${billingInfo.city}, ${billingInfo.state} ${billingInfo.zipCode}, ${billingInfo.country}`,
        customer_notes: "",
      });

      const order = orderResponse.data;
      setOrderNumber(order.order_number);

      // TODO: Integrate actual payment processing here
      // For now, we'll simulate successful payment
      // In production, this would call Stripe/PayPal/Razorpay

      // Process the order (create enrollments)
      await api.post(`/orders/${order.id}/process`);

      // Move to confirmation step
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
      // Clear error for this field
      if (formErrors[field]) {
        setFormErrors({ ...formErrors, [field]: undefined });
      }
    };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !cart) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate("/cart")} sx={{ mt: 2 }}>
          Back to Cart
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Step Content */}
      <Card>
        <CardContent>
          {activeStep === 0 && cart && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review Your Order
              </Typography>
              <List>
                {cart.items.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={item.course_title || item.bundle_name}
                      secondary={`Quantity: ${item.quantity} × ${cart.currency} ${(item.total / item.quantity).toFixed(2)}`}
                    />
                    <Typography variant="body1">
                      {cart.currency} {item.total.toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2">
                  Subtotal: {cart.currency} {cart.subtotal.toFixed(2)}
                </Typography>
                {cart.total_discount > 0 && (
                  <Typography variant="body2" color="success.main">
                    Discount: -{cart.currency} {cart.total_discount.toFixed(2)}
                  </Typography>
                )}
                {cart.tax_amount > 0 && (
                  <Typography variant="body2">
                    Tax: {cart.currency} {cart.tax_amount.toFixed(2)}
                  </Typography>
                )}
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Total: {cart.currency} {cart.total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Billing Information
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={billingInfo.name}
                    onChange={handleChange("name")}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={billingInfo.email}
                    onChange={handleChange("email")}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={billingInfo.address}
                    onChange={handleChange("address")}
                    error={!!formErrors.address}
                    helperText={formErrors.address}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={billingInfo.city}
                    onChange={handleChange("city")}
                    error={!!formErrors.city}
                    helperText={formErrors.city}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    value={billingInfo.state}
                    onChange={handleChange("state")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ZIP/Postal Code"
                    value={billingInfo.zipCode}
                    onChange={handleChange("zipCode")}
                    error={!!formErrors.zipCode}
                    helperText={formErrors.zipCode}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={billingInfo.country}
                    onChange={handleChange("country")}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && cart && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>

              <FormControl component="fieldset" sx={{ mt: 2, mb: 3 }}>
                <FormLabel component="legend">Select Payment Method</FormLabel>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="stripe"
                    control={<Radio />}
                    label="Credit/Debit Card (Stripe)"
                  />
                  <FormControlLabel
                    value="razorpay"
                    control={<Radio />}
                    label="Razorpay (Cards, UPI, Wallets)"
                  />
                  <FormControlLabel
                    value="paypal"
                    control={<Radio />}
                    label="PayPal"
                    disabled
                  />
                </RadioGroup>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Order Summary
              </Typography>
              <Typography variant="body2">Items: {cart.item_count}</Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                Total: {cart.currency} {cart.total.toFixed(2)}
              </Typography>

              <Alert severity="info" sx={{ mt: 2 }}>
                You will be redirected to the payment gateway to complete your
                purchase.
              </Alert>
            </Box>
          )}

          {activeStep === 3 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <SuccessIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Order Placed Successfully!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Your order number is: <strong>{orderNumber}</strong>
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                You will receive a confirmation email shortly.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button variant="contained" onClick={() => navigate("/orders")}>
                  View Orders
                </Button>
                <Button variant="outlined" onClick={() => navigate("/courses")}>
                  Continue Shopping
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      {activeStep < 3 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || processing}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={processing}
            startIcon={processing && <CircularProgress size={20} />}
          >
            {activeStep === 2 ? "Place Order" : "Next"}
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default CheckoutPage;
