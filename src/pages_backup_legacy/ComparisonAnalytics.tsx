"use client";

/**
 * Course Comparison Analytics Page
 *
 * Allows comparison of multiple courses side-by-side with:
 * - Multi-select course picker
 * - Comparison charts and metrics
 * - Export to PDF/CSV
 */

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  SelectChangeEvent,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Download, Compare } from "@mui/icons-material";
import api from "@/lib/api";

interface CourseMetrics {
  total_enrollments: number;
  completion_rate: number;
  average_rating: number;
  revenue: number;
  revenue_per_enrollment: number;
  engagement_rate: number;
  avg_completion_time_days: number;
}

interface CourseComparison {
  course_id: number;
  course_name: string;
  metrics: CourseMetrics;
}

interface ComparisonData {
  courses: CourseComparison[];
  insights: string[];
  benchmarks: {
    avg_completion_rate: number;
    avg_rating: number;
    total_revenue: number;
    total_enrollments: number;
  };
}

export default function ComparisonAnalytics() {
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableCourses();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      const response = await api.get("/courses"); // Adjust endpoint as needed
      setAvailableCourses(response.data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleCourseSelection = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setSelectedCourseIds(typeof value === "string" ? [] : value);
  };

  const handleCompare = async () => {
    if (selectedCourseIds.length < 2) {
      setError("Please select at least 2 courses to compare");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/analytics/compare/courses", {
        params: {
          course_ids: selectedCourseIds.join(","),
        },
      });
      setComparisonData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to compare courses");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await api.get("/analytics/export/comparison/pdf", {
        params: {
          course_ids: selectedCourseIds.join(","),
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `course_comparison_${new Date().toISOString().split("T")[0]}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exporting PDF:", err);
    }
  };

  // Prepare data for radar chart
  const getRadarData = () => {
    if (!comparisonData) return [];

    const metrics = ["Completion Rate", "Rating", "Engagement", "Revenue"];

    return metrics.map((metric) => {
      const dataPoint: any = { metric };

      comparisonData.courses.forEach((course) => {
        const value =
          metric === "Completion Rate"
            ? course.metrics.completion_rate
            : metric === "Rating"
              ? course.metrics.average_rating * 20 // Scale to 100
              : metric === "Engagement"
                ? course.metrics.engagement_rate
                : course.metrics.revenue / 1000; // Scale revenue

        dataPoint[course.course_name] = value;
      });

      return dataPoint;
    });
  };

  // Prepare data for bar chart
  const getBarChartData = () => {
    if (!comparisonData) return [];

    return comparisonData.courses.map((course) => ({
      name: course.course_name,
      enrollments: course.metrics.total_enrollments,
      revenue: course.metrics.revenue,
      "Avg Completion Days": course.metrics.avg_completion_time_days,
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        <Compare sx={{ mr: 1, verticalAlign: "middle" }} />
        Course Comparison Analytics
      </Typography>

      {/* Course Selection */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <FormControl fullWidth>
              <InputLabel>Select Courses to Compare</InputLabel>
              <Select
                multiple
                value={selectedCourseIds}
                onChange={handleCourseSelection}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((id) => {
                      const course = availableCourses.find((c) => c.id === id);
                      return <Chip key={id} label={course?.title || id} />;
                    })}
                  </Box>
                )}
              >
                {availableCourses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleCompare}
              disabled={selectedCourseIds.length < 2 || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Compare />}
            >
              {loading ? "Comparing..." : "Compare Courses"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {comparisonData && (
        <>
          {/* Insights */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Key Insights
            </Typography>
            {comparisonData.insights.map((insight, index) => (
              <Alert key={index} severity="info" sx={{ mb: 1 }}>
                {insight}
              </Alert>
            ))}
          </Paper>

          {/* Metrics Table */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Comparison Metrics</Typography>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExportPDF}
              >
                Export PDF
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Course</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Enrollments</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Completion %</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Avg Rating</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Revenue</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Rev/Enrollment</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Engagement %</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comparisonData.courses.map((course) => (
                    <TableRow key={course.course_id}>
                      <TableCell>{course.course_name}</TableCell>
                      <TableCell align="right">
                        {course.metrics.total_enrollments}
                      </TableCell>
                      <TableCell align="right">
                        {course.metrics.completion_rate.toFixed(1)}%
                      </TableCell>
                      <TableCell align="right">
                        {course.metrics.average_rating.toFixed(1)}/5.0
                      </TableCell>
                      <TableCell align="right">
                        ${course.metrics.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        ${course.metrics.revenue_per_enrollment.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {course.metrics.engagement_rate.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>
                      <strong>Benchmark</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>
                        {comparisonData.benchmarks.total_enrollments}
                      </strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>
                        {comparisonData.benchmarks.avg_completion_rate.toFixed(
                          1,
                        )}
                        %
                      </strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>
                        {comparisonData.benchmarks.avg_rating.toFixed(1)}/5.0
                      </strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>
                        $
                        {comparisonData.benchmarks.total_revenue.toLocaleString()}
                      </strong>
                    </TableCell>
                    <TableCell align="right" colSpan={2}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Charts */}
          <Grid container spacing={3}>
            {/* Radar Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Performance Comparison
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={getRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis />
                    {comparisonData.courses.map((course, index) => (
                      <Radar
                        key={course.course_id}
                        name={course.course_name}
                        dataKey={course.course_name}
                        stroke={`hsl(${(index * 360) / comparisonData.courses.length}, 70%, 50%)`}
                        fill={`hsl(${(index * 360) / comparisonData.courses.length}, 70%, 50%)`}
                        fillOpacity={0.3}
                      />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Bar Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Enrollments & Revenue
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getBarChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="enrollments"
                      fill="#8884d8"
                      name="Enrollments"
                    />
                    <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {!comparisonData && !loading && (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            Select 2-10 courses above and click "Compare Courses" to see
            analytics
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
