"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeftRight,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Calendar,
  IndianRupee,
  CreditCard,
  Wallet,
  TrendingUp,
  Users,
  MoreVertical,
  Eye,
  FileText,
  Receipt,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

// Sample transaction data
const transactions = [
  {
    id: "TXN001",
    date: "2024-12-16",
    time: "14:32:45",
    student: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    course: "UPSC Prelims 2026 - Batch 1",
    amount: 2999,
    method: "UPI",
    status: "completed",
    orderId: "ORD-2024-1234",
  },
  {
    id: "TXN002",
    date: "2024-12-16",
    time: "12:15:22",
    student: "Priya Patel",
    email: "priya.patel@email.com",
    course: "GS Mains Answer Writing",
    amount: 1999,
    method: "Card",
    status: "completed",
    orderId: "ORD-2024-1233",
  },
  {
    id: "TXN003",
    date: "2024-12-15",
    time: "18:45:10",
    student: "Amit Kumar",
    email: "amit.kumar@email.com",
    course: "CSAT Crash Course",
    amount: 999,
    method: "Net Banking",
    status: "completed",
    orderId: "ORD-2024-1232",
  },
  {
    id: "TXN004",
    date: "2024-12-15",
    time: "16:20:33",
    student: "Sneha Reddy",
    email: "sneha.reddy@email.com",
    course: "Current Affairs Monthly",
    amount: 499,
    method: "UPI",
    status: "pending",
    orderId: "ORD-2024-1231",
  },
  {
    id: "TXN005",
    date: "2024-12-15",
    time: "10:05:18",
    student: "Vikram Singh",
    email: "vikram.singh@email.com",
    course: "UPSC Prelims 2026 - Batch 1",
    amount: 2999,
    method: "Card",
    status: "failed",
    orderId: "ORD-2024-1230",
  },
  {
    id: "TXN006",
    date: "2024-12-14",
    time: "20:12:55",
    student: "Anjali Gupta",
    email: "anjali.gupta@email.com",
    course: "GS Mains Answer Writing",
    amount: 1999,
    method: "UPI",
    status: "completed",
    orderId: "ORD-2024-1229",
  },
  {
    id: "TXN007",
    date: "2024-12-14",
    time: "15:38:42",
    student: "Karthik Nair",
    email: "karthik.nair@email.com",
    course: "UPSC Prelims 2026 - Batch 1",
    amount: 2999,
    method: "Wallet",
    status: "refunded",
    orderId: "ORD-2024-1228",
  },
  {
    id: "TXN008",
    date: "2024-12-14",
    time: "11:22:08",
    student: "Meera Joshi",
    email: "meera.joshi@email.com",
    course: "CSAT Crash Course",
    amount: 999,
    method: "UPI",
    status: "completed",
    orderId: "ORD-2024-1227",
  },
  {
    id: "TXN009",
    date: "2024-12-13",
    time: "09:45:33",
    student: "Arjun Menon",
    email: "arjun.menon@email.com",
    course: "Current Affairs Monthly",
    amount: 499,
    method: "Card",
    status: "completed",
    orderId: "ORD-2024-1226",
  },
  {
    id: "TXN010",
    date: "2024-12-13",
    time: "07:18:21",
    student: "Divya Krishnan",
    email: "divya.k@email.com",
    course: "UPSC Prelims 2026 - Batch 1",
    amount: 2999,
    method: "Net Banking",
    status: "completed",
    orderId: "ORD-2024-1225",
  },
];

// Stats data
const transactionStats = [
  {
    label: "Total Revenue",
    value: "₹14,47,890",
    change: "+12.5%",
    trend: "up",
    icon: IndianRupee,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    label: "Transactions",
    value: "1,246",
    change: "+8.3%",
    trend: "up",
    icon: ArrowLeftRight,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    label: "Avg. Order Value",
    value: "₹1,161",
    change: "+3.2%",
    trend: "up",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    label: "New Customers",
    value: "423",
    change: "+15.7%",
    trend: "up",
    icon: Users,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </span>
      );
    case "pending":
      return (
        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      );
    case "failed":
      return (
        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-medium">
          <XCircle className="h-3 w-3" />
          Failed
        </span>
      );
    case "refunded":
      return (
        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
          <RefreshCw className="h-3 w-3" />
          Refunded
        </span>
      );
    default:
      return (
        <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
          {status}
        </span>
      );
  }
};

const getPaymentMethodIcon = (method: string) => {
  switch (method.toLowerCase()) {
    case "upi":
      return <Wallet className="h-4 w-4 text-purple-600" />;
    case "card":
      return <CreditCard className="h-4 w-4 text-blue-600" />;
    case "net banking":
      return <ArrowLeftRight className="h-4 w-4 text-green-600" />;
    case "wallet":
      return <Wallet className="h-4 w-4 text-orange-600" />;
    default:
      return <CreditCard className="h-4 w-4 text-gray-600" />;
  }
};

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("7days");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    const matchesMethod = methodFilter === "all" || txn.method.toLowerCase() === methodFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ArrowLeftRight className="h-8 w-8 text-emerald-600" />
            Transactions
          </h1>
          <p className="text-gray-600 mt-1">View and manage all financial transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {transactionStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, transaction ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            {/* Method Filter */}
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="net banking">Net Banking</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Transactions</span>
            <span className="text-sm font-normal text-gray-500">
              Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Transaction</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Course</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Method</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{txn.id}</p>
                        <p className="text-xs text-gray-500">{txn.date} • {txn.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{txn.student}</p>
                        <p className="text-xs text-gray-500">{txn.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-700 max-w-[200px] truncate" title={txn.course}>
                        {txn.course}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(txn.method)}
                        <span className="text-sm text-gray-700">{txn.method}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-gray-800">₹{txn.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {getStatusBadge(txn.status)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Receipt className="mr-2 h-4 w-4" />
                            View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Download Receipt
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {txn.status === "completed" && (
                            <DropdownMenuItem className="text-red-600">
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Initiate Refund
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {paginatedTransactions.length === 0 && (
            <div className="text-center py-12">
              <ArrowLeftRight className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No transactions found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
