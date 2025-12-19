"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart, TrendingUp, DollarSign, ShoppingCart } from "lucide-react";
import api from "@/lib/api";

export default function ReportsOverviewPage() {
  const handleDownload = async (endpoint: string, filename: string) => {
    try {
      const response = await api.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const reports = [
    {
      title: "Revenue Report",
      description: "Detailed breakdown of revenue by course and time period.",
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      actions: [
        { label: "Download CSV", endpoint: "/export/revenue/csv", filename: "revenue.csv" },
        { label: "Download PDF", endpoint: "/export/revenue/pdf", filename: "revenue.pdf" },
      ]
    },
    {
      title: "Orders Report",
      description: "List of all individual orders and transactions.",
      icon: <ShoppingCart className="h-8 w-8 text-blue-500" />,
      actions: [
        { label: "Download CSV", endpoint: "/export/orders/csv", filename: "orders.csv" },
      ]
    },
    {
      title: "Analytics Summary",
      description: "Comprehensive analytics including student progress and engagement.",
      icon: <BarChart className="h-8 w-8 text-purple-500" />,
      actions: [
        { label: "Download CSV", endpoint: "/export/analytics/csv", filename: "analytics.csv" },
      ]
    },
    {
      title: "Revenue Forecast",
      description: "AI-powered revenue forecast for the next 30 days.",
      icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
      actions: [
        { label: "Download CSV", endpoint: "/export/forecast/csv", filename: "forecast.csv" },
      ]
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Reports Center</h1>
        <p className="text-gray-400">Export data and generate reports for your analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, idx) => (
          <Card key={idx} className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                {report.icon}
              </div>
              <div>
                <CardTitle className="text-xl text-white">{report.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-6 h-12">{report.description}</p>
              <div className="flex gap-3">
                {report.actions.map((action, actionIdx) => (
                  <Button
                    key={actionIdx}
                    variant="outline"
                    className="flex-1 border-gray-700 hover:bg-gray-800 text-gray-300"
                    onClick={() => handleDownload(action.endpoint, action.filename)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
