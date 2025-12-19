/**
 * Executive Dashboard Page
 *
 * High-level platform analytics for admins:
 * - Real-time KPIs
 * - Platform health score
 * - Risk indicators
 * - Growth trends
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Dashboard,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Error,
  Download,
} from "@mui/icons-material";
import api from "@/lib/api";

interface KPIData {
  active_users: {
    daily: number;
    weekly: number;
    monthly: number;
    total: number;
  };
  revenue: {
    total: number;
    monthly: number;
    growth_rate: number;
    arr: number;
  };
  courses: {
    total_published: number;
    total_enrollments: number;
    completion_rate: number;
  };
  satisfaction: {
    average_rating: number;
    nps_score: number;
  };
  business_metrics: {
    cac: number;
    churn_rate: number;
    total_orders: number;
  };
}

interface HealthData {
  score: number;
  grade: string;
  trend: string;
  components: {
    user_engagement: number;
    revenue_health: number;
    course_completion: number;
    customer_satisfaction: number;
    retention: number;
  };
}

interface Risk {
  type: string;
  severity: string;
  value: number;
  message: string;
  recommendation: string;
}

interface GrowthData {
  monthly_trends: Array<{
    month: string;
    enrollments: number;
    revenue: number;
    new_users: number;
  }>;
}

export default function ExecutiveDashboard() {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [growth, setGrowth] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchAllData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [kpiRes, healthRes, riskRes, growthRes] = await Promise.all([
        api.get("/analytics/executive/kpis"),
        api.get("/analytics/executive/health"),
        api.get("/analytics/executive/risks"),
        api.get("/analytics/executive/growth"),
      ]);

      setKpis(kpiRes.data);
      setHealth(healthRes.data);
      setRisks(riskRes.data.risks || []);
      setGrowth(growthRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching executive data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await api.get("/analytics/admin/export/executive/pdf", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `executive_summary_${new Date().toISOString().split("T")[0]}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exporting PDF:", err);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "#4caf50";
    if (score >= 60) return "#ff9800";
    return "#f44336";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      default:
        return "info";
    }
  };

  if (loading && !kpis) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          <Dashboard sx={{ mr: 1, verticalAlign: "middle" }} />
          Executive Dashboard
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportPDF}
            sx={{ mr: 2 }}
          >
            Export PDF
          </Button>
          <Chip
            label={`Last updated: ${lastUpdated.toLocaleTimeString()}`}
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Platform Health Score */}
      {health && (
        <Paper sx={{ p: 3, mb: 3, backgroundColor: "#f5f5f5" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                  Platform Health Score
                </Typography>
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress
                    variant="determinate"
                    value={health.score}
                    size={120}
                    thickness={6}
                    sx={{ color: getHealthColor(health.score) }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {health.score.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Grade: {health.grade}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Chip
                    icon={
                      health.trend === "improving" ? (
                        <TrendingUp />
                      ) : health.trend === "declining" ? (
                        <TrendingDown />
                      ) : undefined
                    }
                    label={health.trend.toUpperCase()}
                    color={
                      health.trend === "improving"
                        ? "success"
                        : health.trend === "declining"
                          ? "error"
                          : "default"
                    }
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Health Components
              </Typography>
              {Object.entries(health.components).map(([key, value]) => (
                <Box key={key} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {key.replace(/_/g, " ")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {value.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={value}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: getHealthColor(value),
                      },
                    }}
                  />
                </Box>
              ))}
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* KPI Cards */}
      {kpis && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Monthly Active Users
                </Typography>
                <Typography variant="h4">
                  {kpis.active_users.monthly.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Daily: {kpis.active_users.daily.toLocaleString()} | Weekly:{" "}
                  {kpis.active_users.weekly.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Monthly Revenue
                </Typography>
                <Typography variant="h4">
                  ${kpis.revenue.monthly.toLocaleString()}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  {kpis.revenue.growth_rate >= 0 ? (
                    <TrendingUp color="success" fontSize="small" />
                  ) : (
                    <TrendingDown color="error" fontSize="small" />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      ml: 0.5,
                      color:
                        kpis.revenue.growth_rate >= 0
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    {kpis.revenue.growth_rate.toFixed(1)}% growth
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Completion Rate
                </Typography>
                <Typography variant="h4">
                  {kpis.courses.completion_rate.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {kpis.courses.total_enrollments.toLocaleString()} total
                  enrollments
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Churn Rate
                </Typography>
                <Typography variant="h4">
                  {kpis.business_metrics.churn_rate.toFixed(1)}%
                </Typography>
                <Typography
                  variant="body2"
                  color={
                    kpis.business_metrics.churn_rate > 5
                      ? "error"
                      : "success.main"
                  }
                >
                  {kpis.business_metrics.churn_rate > 5 ? "Above" : "Below"} 5%
                  target
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Risk Alerts */}
      {risks.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Warning sx={{ mr: 1, color: "warning.main" }} />
            Risk Indicators ({risks.length})
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            {risks.map((risk, index) => (
              <Grid item xs={12} key={index}>
                <Alert
                  severity={getSeverityColor(risk.severity)}
                  icon={
                    risk.severity === "high" ? (
                      <Error />
                    ) : risk.severity === "medium" ? (
                      <Warning />
                    ) : (
                      <CheckCircle />
                    )
                  }
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {risk.message}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    <strong>Recommendation:</strong> {risk.recommendation}
                  </Typography>
                </Alert>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Growth Trends */}
      {growth && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            6-Month Growth Trends
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growth.monthly_trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="enrollments"
                stroke="#8884d8"
                strokeWidth={2}
                name="Enrollments"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Revenue ($)"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="new_users"
                stroke="#ffc658"
                strokeWidth={2}
                name="New Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </Container>
  );
}
