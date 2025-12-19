"use client";

import { useState } from "react";
import {
  Wallet,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  IndianRupee,
  Building2,
  TrendingUp,
  Banknote,
  MoreVertical,
  Eye,
  FileText,
  RefreshCw,
  ArrowDownToLine,
  CreditCard,
  Landmark,
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

// Sample settlements data
const settlements = [
  {
    id: "STL001",
    date: "2024-12-15",
    period: "Dec 8 - Dec 14",
    transactions: 156,
    grossAmount: 467400,
    fees: 9348,
    tax: 1682,
    netAmount: 456370,
    status: "completed",
    bank: "HDFC Bank",
    accountEnding: "4521",
    utr: "HDFC24121500123456",
  },
  {
    id: "STL002",
    date: "2024-12-08",
    period: "Dec 1 - Dec 7",
    transactions: 142,
    grossAmount: 425800,
    fees: 8516,
    tax: 1533,
    netAmount: 415751,
    status: "completed",
    bank: "HDFC Bank",
    accountEnding: "4521",
    utr: "HDFC24120800098765",
  },
  {
    id: "STL003",
    date: "2024-12-01",
    period: "Nov 24 - Nov 30",
    transactions: 168,
    grossAmount: 503400,
    fees: 10068,
    tax: 1812,
    netAmount: 491520,
    status: "completed",
    bank: "HDFC Bank",
    accountEnding: "4521",
    utr: "HDFC24120100076543",
  },
  {
    id: "STL004",
    date: "2024-12-16",
    period: "Dec 15 - Dec 16",
    transactions: 45,
    grossAmount: 134850,
    fees: 2697,
    tax: 485,
    netAmount: 131668,
    status: "pending",
    bank: "HDFC Bank",
    accountEnding: "4521",
    utr: null,
  },
  {
    id: "STL005",
    date: "2024-11-24",
    period: "Nov 17 - Nov 23",
    transactions: 134,
    grossAmount: 401600,
    fees: 8032,
    tax: 1446,
    netAmount: 392122,
    status: "completed",
    bank: "HDFC Bank",
    accountEnding: "4521",
    utr: "HDFC24112400054321",
  },
  {
    id: "STL006",
    date: "2024-11-17",
    period: "Nov 10 - Nov 16",
    transactions: 128,
    grossAmount: 383600,
    fees: 7672,
    tax: 1381,
    netAmount: 374547,
    status: "completed",
    bank: "HDFC Bank",
    accountEnding: "4521",
    utr: "HDFC24111700043210",
  },
];

// Stats data
const settlementStats = [
  {
    label: "Total Settled",
    value: "₹22,61,978",
    change: "+14.2%",
    icon: Banknote,
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "Last 30 days",
  },
  {
    label: "Pending",
    value: "₹1,31,668",
    change: "1 settlement",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    description: "Processing",
  },
  {
    label: "Platform Fees",
    value: "₹46,333",
    change: "2%",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "This month",
  },
  {
    label: "Avg. Settlement",
    value: "₹3,76,996",
    change: "+5.8%",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "Weekly average",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium">
          <CheckCircle2 className="h-3 w-3" />
          Settled
        </span>
      );
    case "pending":
      return (
        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      );
    case "processing":
      return (
        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Processing
        </span>
      );
    case "failed":
      return (
        <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-medium">
          <XCircle className="h-3 w-3" />
          Failed
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function SettlementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("30days");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter settlements
  const filteredSettlements = settlements.filter((stl) => {
    const matchesSearch =
      stl.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stl.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stl.utr && stl.utr.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || stl.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSettlements.length / itemsPerPage);
  const paginatedSettlements = filteredSettlements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate totals
  const totalPending = settlements
    .filter(s => s.status === "pending")
    .reduce((sum, s) => sum + s.netAmount, 0);

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
            <Wallet className="h-8 w-8 text-emerald-600" />
            Settlements
          </h1>
          <p className="text-gray-600 mt-1">Track payouts and settlement history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {settlementStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <span className="text-xs text-gray-400">{stat.description}</span>
                <span className="text-xs font-medium text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bank Account Info */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white rounded-xl shadow-sm">
                <Landmark className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Settlement Account</h3>
                <p className="text-sm text-gray-600">HDFC Bank •••• 4521</p>
                <p className="text-xs text-gray-500 mt-1">Settlements are processed every Monday</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Next Settlement</p>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(totalPending)}</p>
              <p className="text-xs text-gray-500">Expected: Dec 23, 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by settlement ID, period, or UTR..."
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
                <SelectItem value="completed">Settled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Settlements Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Settlement History</span>
            <span className="text-sm font-normal text-gray-500">
              Showing {paginatedSettlements.length} of {filteredSettlements.length} settlements
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Settlement</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Period</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Transactions</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Gross Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Fees & Tax</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Net Amount</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSettlements.map((stl) => (
                  <tr key={stl.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{stl.id}</p>
                        <p className="text-xs text-gray-500">{stl.date}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-700">{stl.period}</p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-medium text-gray-700">{stl.transactions}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm text-gray-700">{formatCurrency(stl.grossAmount)}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div>
                        <p className="text-sm text-red-600">-{formatCurrency(stl.fees + stl.tax)}</p>
                        <p className="text-xs text-gray-400">
                          Fees: {formatCurrency(stl.fees)} | Tax: {formatCurrency(stl.tax)}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-semibold text-green-600">{formatCurrency(stl.netAmount)}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {getStatusBadge(stl.status)}
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
                            <FileText className="mr-2 h-4 w-4" />
                            View Transactions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Statement
                          </DropdownMenuItem>
                          {stl.utr && (
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Copy UTR: {stl.utr.slice(-8)}
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
          {paginatedSettlements.length === 0 && (
            <div className="text-center py-12">
              <Wallet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No settlements found</h3>
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

      {/* Info Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Settlement Schedule</h4>
              <p className="text-sm text-blue-600 mt-1">
                Settlements are processed every Monday for transactions from the previous week.
                Funds typically arrive in your bank account within 1-2 business days after processing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
