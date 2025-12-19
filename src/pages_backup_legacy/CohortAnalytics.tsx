/**
 * Cohort Analysis Page
 *
 * Track and analyze user cohorts with:
 * - Cohort list with filtering
 * - Retention funnel visualization
 * - Performance trend charts
 * - Cohort comparison
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Groups, TrendingDown } from "@mui/icons-material";
import api from "@/lib/api";

interface CohortListItem {
  name: string;
  cohort_type: string;
  period: string;
  member_count: number;
}

interface RetentionData {
  cohort_period: string;
  initial_size: number;
  retention_data: Array<{
    months_after_formation: number;
    period: string;
    active_users: number;
    retention_rate: number;
  }>;
}

interface PerformanceData {
  cohort_period: string;
  total_enrollments: number;
  unique_users: number;
  metrics: {
    completion_rate: number;
    active_rate: number;
    total_revenue: number;
    revenue_per_user: number;
    ltv: number;
    avg_enrollments_per_user: number;
  };
}

export default function CohortAnalytics() {
  const [cohorts, setCohorts] = useState<CohortListItem[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<string>("");
  const [retentionData, setRetentionData] = useState<RetentionData | null>(
    null,
  );
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCohorts();
  }, []);

  const fetchCohorts = async () => {
    try {
      const response = await api.get("/analytics/cohorts");
      setCohorts(response.data.cohorts || []);
    } catch (err) {
      console.error("Error fetching cohorts:", err);
    }
  };

  const handleCohortChange = async (event: SelectChangeEvent<string>) => {
    const cohortPeriod = event.target.value;
    setSelectedCohort(cohortPeriod);

    if (!cohortPeriod) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch retention data
      const retentionResponse = await api.get(
        `/analytics/cohorts/${cohortPeriod}/retention`,
      );
      setRetentionData(retentionResponse.data);

      // Fetch performance data
      const performanceResponse = await api.get(
        `/analytics/cohorts/${cohortPeriod}/performance`,
      );
      setPerformanceData(performanceResponse.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load cohort data");
    } finally {
      setLoading(false);
    }
  };

  const getRetentionChartData = () => {
    if (!retentionData) return [];
    return retentionData.retention_data.map((d) => ({
      month: `Month ${d.months_after_formation}`,
      "Active Users": d.active_users,
      "Retention %": d.retention_rate,
    }));
  };

  const getRetentionFunnelData = () => {
    if (!retentionData) return [];

    return retentionData.retention_data
      .filter((d) => [0, 1, 3, 6, 12].includes(d.months_after_formation))
      .map((d) => ({
        stage: `Month ${d.months_after_formation}`,
        users: d.active_users,
        retention: d.retention_rate,
      }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        <Groups sx={{ mr: 1, verticalAlign: "middle" }} />
        Cohort Analysis
      </Typography>

      {/* Cohort Selection */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Cohort</InputLabel>
              <Select
                value={selectedCohort}
                onChange={handleCohortChange}
                label="Select Cohort"
              >
                {cohorts.map((cohort) => (
                  <MenuItem key={cohort.period} value={cohort.period}>
                    {cohort.name} ({cohort.member_count} members)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Total Cohorts: <strong>{cohorts.length}</strong>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {retentionData && performanceData && !loading && (
        <>
          {/* Performance Metrics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Initial Size
                  </Typography>
                  <Typography variant="h4">
                    {retentionData.initial_size}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    users in cohort
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Completion Rate
                  </Typography>
                  <Typography variant="h4">
                    {performanceData.metrics.completion_rate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    course completion
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Lifetime Value
                  </Typography>
                  <Typography variant="h4">
                    ${performanceData.metrics.ltv.toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    per user
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    ${performanceData.metrics.total_revenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    generated
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Retention Trends */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Retention Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getRetentionChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="Active Users"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="Retention %"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>

          {/* Retention Funnel */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Retention Funnel
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getRetentionFunnelData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" name="Active Users" />
                <Bar dataKey="retention" fill="#82ca9d" name="Retention %" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          {/* Detailed Retention Table */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detailed Retention Data
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Period</TableCell>
                    <TableCell align="right">Active Users</TableCell>
                    <TableCell align="right">Retention Rate</TableCell>
                    <TableCell align="right">Churn</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {retentionData.retention_data.map((row, index) => {
                    const churn =
                      index > 0
                        ? retentionData.retention_data[index - 1]
                          .retention_rate - row.retention_rate
                        : 0;

                    return (
                      <TableRow key={row.months_after_formation}>
                        <TableCell>
                          Month {row.months_after_formation}
                        </TableCell>
                        <TableCell align="right">{row.period}</TableCell>
                        <TableCell align="right">{row.active_users}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${row.retention_rate.toFixed(1)}%`}
                            color={
                              row.retention_rate >= 50
                                ? "success"
                                : row.retention_rate >= 30
                                  ? "warning"
                                  : "error"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {index > 0 && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                              }}
                            >
                              {churn > 0 && (
                                <TrendingDown color="error" fontSize="small" />
                              )}
                              {churn.toFixed(1)}%
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {!selectedCohort && !loading && (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            Select a cohort above to view retention and performance analytics
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
