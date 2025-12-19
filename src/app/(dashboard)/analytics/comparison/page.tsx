"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Calendar, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";

interface ComparisonData {
  metric: string;
  current_period: number;
  previous_period: number;
  change_percent: number;
}

export default function ComparisonAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState<ComparisonData[]>([]);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/comparison?period=${period}`);
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Comparison Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Compare performance across different time periods
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week vs Last Week</SelectItem>
            <SelectItem value="month">This Month vs Last Month</SelectItem>
            <SelectItem value="quarter">This Quarter vs Last Quarter</SelectItem>
            <SelectItem value="year">This Year vs Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {data.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{item.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Period</p>
                  <p className="text-2xl font-bold">{item.current_period.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Previous Period</p>
                  <p className="text-2xl font-bold">{item.previous_period.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Change</p>
                  <p
                    className={`text-2xl font-bold flex items-center gap-1 ${item.change_percent >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    <TrendingUp
                      className={`h-5 w-5 ${item.change_percent < 0 ? "rotate-180" : ""}`}
                    />
                    {Math.abs(item.change_percent).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
