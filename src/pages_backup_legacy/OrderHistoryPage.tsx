import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Receipt as OrderIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Cancel as CancelIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import api from "../services/api";

interface OrderSummary {
  id: number;
  order_number: string;
  status: string;
  total: number;
  currency: string;
  item_count: number;
  created_at: string;
}

interface OrderListResponse {
  orders: OrderSummary[];
  total: number;
  page: number;
  page_size: number;
}

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const pageSize = 10;

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get<OrderListResponse>("/orders", {
        params: { page, page_size: pageSize },
      });

      setOrders(response.data.orders);
      setTotalOrders(response.data.total);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (
    status: string,
  ): "default" | "primary" | "success" | "error" | "warning" => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "processing":
        return "primary";
      case "cancelled":
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const handleViewOrder = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  const handleDownloadInvoice = async (orderId: number) => {
    try {
      const response = await api.get(`/invoices/order/${orderId}`);
      const invoice = response.data;

      // Download PDF
      const pdfResponse = await api.get(`/invoices/${invoice.id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoice.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download invoice", err);
      alert("Invoice not available yet");
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await api.post(`/orders/${orderId}/cancel`);
      fetchOrders(); // Refresh list
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to cancel order");
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === statusFilter.toLowerCase(),
        );

  if (loading && orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
          <OrderIcon sx={{ mr: 1 }} /> Order History
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/courses")}>
          Browse Courses
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FilterIcon />
            <TextField
              select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">All Orders</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </TextField>
            <Typography variant="body2" color="text.secondary">
              Total: {totalOrders} orders
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <OrderIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Orders Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {statusFilter === "all"
                ? "You haven't placed any orders yet."
                : `No ${statusFilter} orders found.`}
            </Typography>
            <Button variant="contained" onClick={() => navigate("/courses")}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order Number</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {order.order_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(order.created_at), "MMM dd, yyyy")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(order.created_at), "hh:mm a")}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.item_count} item(s)</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {order.currency} {order.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewOrder(order.id)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>

                        {order.status.toLowerCase() === "completed" && (
                          <Tooltip title="Download Invoice">
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadInvoice(order.id)}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        {order.status.toLowerCase() === "pending" && (
                          <Tooltip title="Cancel Order">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalOrders > pageSize && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}
            >
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                Page {page} of {Math.ceil(totalOrders / pageSize)}
              </Typography>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(totalOrders / pageSize)}
              >
                Next
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default OrderHistoryPage;
