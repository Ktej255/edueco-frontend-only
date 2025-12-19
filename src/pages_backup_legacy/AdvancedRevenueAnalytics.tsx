"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Download as DownloadIcon,
  ShowChart as ChartIcon,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../services/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AdvancedRevenueAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [forecast, setForecast] = useState<any>(null);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [comparison, setComparison] = useState<any>(null);
  const [ltv, setLtv] = useState<any>(null);

  // Controls
  const [forecastDays, setForecastDays] = useState(30);
  const [comparisonType, setComparisonType] = useState("mom");

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all analytics in parallel
      const [forecastRes, breakdownRes, comparisonRes, ltvRes] =
        await Promise.all([
          api.get(`/analytics/revenue/forecast?forecast_days=${forecastDays}`),
          api.get("/analytics/revenue/breakdown"),
          api.get(
            `/analytics/revenue/comparison?comparison_type=${comparisonType}`,
          ),
          api.get("/analytics/revenue/ltv"),
        ]);

      setForecast(forecastRes.data);
      setBreakdown(breakdownRes.data);
      setComparison(comparisonRes.data);
      setLtv(ltvRes.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: string) => {
    try {
      const response = await api.get(`/analytics/export/${type}/csv`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${type}_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to export data");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading analytics...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <ChartIcon /> Advanced Revenue Analytics
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport("revenue")}
          >
            Export Revenue
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport("forecast")}
          >
            Export Forecast
          </Button>
        </Box>
      </Box>

      {/* Revenue Forecast */}
      {forecast && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justify: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Revenue Forecast</Typography>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Forecast Period</InputLabel>
                <Select
                  value={forecastDays}
                  label="Forecast Period"
                  onChange={(e) => {
                    setForecastDays(Number(e.target.value));
                    setTimeout(fetchAllAnalytics, 100);
                  }}
                >
                  <MenuItem value={7}>7 days</MenuItem>
                  <MenuItem value={14}>14 days</MenuItem>
                  <MenuItem value={30}>30 days</MenuItem>
                  <MenuItem value={60}>60 days</MenuItem>
                  <MenuItem value={90}>90 days</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    bgcolor: "primary.50",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" color="primary">
                    ${forecast.predicted_revenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Predicted Revenue ({forecast.forecast_period_days} days)
                  </Typography>
                  {forecast.trend && (
                    <Chip
                      icon={
                        forecast.trend === "upward" ? (
                          <TrendingUpIcon />
                        ) : (
                          <TrendingDownIcon />
                        )
                      }
                      label={`${forecast.growth_rate}% ${forecast.trend}`}
                      color={
                        forecast.trend === "upward"
                          ? "success"
                          : forecast.trend === "downward"
                            ? "error"
                            : "default"
                      }
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    bgcolor: "grey.100",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6">
                    ${forecast.predicted_daily_avg?.toLocaleString() || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Daily Average
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    bgcolor: "grey.100",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6">
                    ${forecast.confidence_interval[0].toLocaleString()} - $
                    {forecast.confidence_interval[1].toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confidence Range
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    bgcolor: "grey.100",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6">
                    ${forecast.historical_average?.toLocaleString() || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Historical Daily Avg
                  </Typography>
                </Box>
              </Grid>

              {forecast.breakdown_by_week && (
                <Grid item xs={12}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={forecast.breakdown_by_week}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="week"
                        label={{
                          value: "Week",
                          position: "insideBottom",
                          offset: -5,
                        }}
                      />
                      <YAxis
                        label={{
                          value: "Revenue ($)",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="predicted_revenue"
                        fill="#8884d8"
                        name="Predicted Revenue"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Period Comparison */}
      {comparison && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Period Comparison</Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Comparison Type</InputLabel>
                <Select
                  value={comparisonType}
                  label="Comparison Type"
                  onChange={(e) => {
                    setComparisonType(e.target.value);
                    setTimeout(fetchAllAnalytics, 100);
                  }}
                >
                  <MenuItem value="mom">Month over Month</MenuItem>
                  <MenuItem value="yoy">Year over Year</MenuItem>
                  <MenuItem value="custom">Last 30 vs Previous 30</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: "success.50", borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Current Period
                  </Typography>
                  <Typography variant="h5" color="success.dark">
                    ${comparison.current_period.revenue.toLocaleString()}
                  </Typography>
                  <Typography variant="caption">
                    {comparison.current_period.start} to{" "}
                    {comparison.current_period.end}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Previous Period
                  </Typography>
                  <Typography variant="h5">
                    ${comparison.previous_period.revenue.toLocaleString()}
                  </Typography>
                  <Typography variant="caption">
                    {comparison.previous_period.start} to{" "}
                    {comparison.previous_period.end}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor:
                      comparison.change.trend === "up"
                        ? "success.50"
                        : "error.50",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Change
                  </Typography>
                  <Typography
                    variant="h5"
                    color={
                      comparison.change.trend === "up"
                        ? "success.dark"
                        : "error.dark"
                    }
                  >
                    {comparison.change.trend === "up" ? "+" : ""}
                    {comparison.change.percentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="caption">
                    ${Math.abs(comparison.change.amount).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Revenue Breakdown */}
      {breakdown && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue by Course
                </Typography>
                {breakdown.by_course && breakdown.by_course.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={breakdown.by_course}
                        dataKey="revenue"
                        nameKey="course"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) =>
                          `${entry.course}: ${entry.percentage}%`
                        }
                      >
                        {breakdown.by_course.map(
                          (entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ),
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography color="text.secondary">
                    No course data available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue by Day of Week
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={breakdown.by_day_of_week}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Customer LTV */}
      {ltv && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Lifetime Value
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="primary">
                    ${ltv.avg_ltv}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average LTV
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4">{ltv.total_customers}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Customers
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4">
                    {ltv.repeat_customer_rate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Repeat Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4">
                    {ltv.avg_orders_per_customer}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Orders/Customer
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {ltv.top_customers && ltv.top_customers.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                  Top Customers
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Customer ID</TableCell>
                        <TableCell align="right">Total Spent</TableCell>
                        <TableCell align="right">Orders</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ltv.top_customers.map((customer: any, index: number) => (
                        <TableRow key={customer.user_id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>#{customer.user_id}</TableCell>
                          <TableCell align="right">
                            ${customer.total_spent}
                          </TableCell>
                          <TableCell align="right">
                            {customer.order_count}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AdvancedRevenueAnalytics;
