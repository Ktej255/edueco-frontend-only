"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Calendar,
  Download,
  Filter,
  Search,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface EarningsSummary {
  total_earnings: number;
  monthly_earnings: number;
  total_sales: number;
  monthly_sales: number;
  top_earning_course_title?: string;
}

interface CourseSales {
  course_id: number;
  course_title: string;
  total_sales: number;
  total_revenue: number;
  average_price: number;
  last_sale_date?: string;
}

interface Transaction {
  id: number;
  course_title: string;
  student_name: string;
  student_email: string;
  amount: number;
  currency: string;
  status: string;
  payment_provider: string;
  created_at: string;
  succeeded_at?: string;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
  sales_count: number;
}

export default function EarningsPage() {
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [courseSales, setCourseSales] = useState<CourseSales[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [summaryRes, salesRes, transactionsRes, monthlyRes] =
        await Promise.all([
          api.get("/earnings/instructor/earnings/summary"),
          api.get("/earnings/instructor/earnings/by-course"),
          api.get("/earnings/instructor/transactions?limit=50"),
          api.get("/earnings/instructor/earnings/monthly?months=12"),
        ]);

      setSummary(summaryRes.data);
      setCourseSales(salesRes.data);
      setTransactions(transactionsRes.data);
      setMonthlyRevenue(monthlyRes.data);
    } catch (error) {
      console.error("Failed to fetch earnings data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get(
        "/earnings/instructor/transactions/export",
      );
      const blob = new Blob([response.data.csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `earnings-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } catch (error) {
      console.error("Failed to export:", error);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      searchQuery === "" ||
      t.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.student_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="text-white">Loading earnings data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Earnings Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Track your course sales and revenue
            </p>
          </div>
          <Button
            onClick={handleExport}
            className="bg-cyan-600 hover:bg-cyan-500"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-cyan-900/30 to-gray-900 border-cyan-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-white">
                    ₹{summary?.total_earnings.toLocaleString("en-IN")}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">All time</p>
                </div>
                <DollarSign className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-gray-900 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-white">
                    ₹{summary?.monthly_earnings.toLocaleString("en-IN")}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-white">
                    {summary?.total_sales}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">All enrollments</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br  from-yellow-900/30 to-gray-900 border-yellow-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Monthly Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-white">
                    {summary?.monthly_sales}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF" }}
                  />
                  <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#F3F4F6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={{ fill: "#06B6D4", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-400 py-12">
                No revenue data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Sales Table */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Sales by Course</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">Course</TableHead>
                  <TableHead className="text-gray-400">Sales</TableHead>
                  <TableHead className="text-gray-400">Revenue</TableHead>
                  <TableHead className="text-gray-400">Avg Price</TableHead>
                  <TableHead className="text-gray-400">Last Sale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseSales.map((course) => (
                  <TableRow key={course.course_id} className="border-gray-800">
                    <TableCell className="text-white font-medium">
                      {course.course_title}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {course.total_sales}
                    </TableCell>
                    <TableCell className="text-cyan-400 font-semibold">
                      ₹{course.total_revenue.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      ₹{course.average_price.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {course.last_sale_date
                        ? new Date(course.last_sale_date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {courseSales.length === 0 && (
              <div className="text-center text-gray-400 py-8">No sales yet</div>
            )}
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Recent Transactions</CardTitle>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(e.target.value)
                    }
                    className="pl-10 bg-gray-800 border-gray-700 text-white w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="succeeded">Succeeded</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Course</TableHead>
                  <TableHead className="text-gray-400">Student</TableHead>
                  <TableHead className="text-gray-400">Amount</TableHead>
                  <TableHead className="text-gray-400">Gateway</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id} className="border-gray-800">
                    <TableCell className="text-gray-400 text-sm">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-white">
                      {tx.course_title}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {tx.student_name}
                    </TableCell>
                    <TableCell className="text-cyan-400 font-semibold">
                      ₹{tx.amount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm capitalize">
                      {tx.payment_provider}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          tx.status === "succeeded"
                            ? "bg-green-500/20 text-green-400"
                            : tx.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredTransactions.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No transactions found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
