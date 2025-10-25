import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Download, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Users, 
  MapPin,
  DollarSign,
  BarChart3,
  Filter,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface Report {
  id: string;
  title: string;
  description: string;
  type: "analytics" | "demographics" | "financial" | "geographic";
  icon: typeof FileText;
  lastUpdated: string;
  dataPoints: number;
  format: string[];
  preview: {
    keyMetrics: Array<{ label: string; value: string | number }>;
  };
}

const availableReports: Report[] = [
  {
    id: "user-demographics",
    title: "User Demographics Report",
    description: "Comprehensive breakdown of user age groups, travel preferences, and demographic profiles",
    type: "demographics",
    icon: Users,
    lastUpdated: "2025-10-16",
    dataPoints: 1247,
    format: ["CSV", "JSON", "PDF"],
    preview: {
      keyMetrics: [
        { label: "Total Users", value: 1247 },
        { label: "Age 25-34", value: "42%" },
        { label: "International Visitors", value: "68%" },
        { label: "Average Stay", value: "8.5 days" }
      ]
    }
  },
  {
    id: "travel-patterns",
    title: "Travel Patterns & Preferences",
    description: "Analysis of user travel routes, destination preferences, and seasonal trends",
    type: "analytics",
    icon: MapPin,
    lastUpdated: "2025-10-16",
    dataPoints: 3421,
    format: ["CSV", "JSON"],
    preview: {
      keyMetrics: [
        { label: "Top Destination", value: "Queenstown" },
        { label: "Avg. Destinations/Trip", value: 3.2 },
        { label: "Peak Season", value: "Dec-Feb" },
        { label: "Adventure Activities", value: "78%" }
      ]
    }
  },
  {
    id: "spending-analysis",
    title: "Spending Behavior Analysis",
    description: "Detailed insights into user spending patterns, budget ranges, and purchase preferences",
    type: "financial",
    icon: DollarSign,
    lastUpdated: "2025-10-16",
    dataPoints: 2156,
    format: ["CSV", "JSON", "PDF"],
    preview: {
      keyMetrics: [
        { label: "Avg. Daily Spend", value: "$285" },
        { label: "Accommodation", value: "45%" },
        { label: "Activities", value: "30%" },
        { label: "Food & Beverage", value: "25%" }
      ]
    }
  },
  {
    id: "geographic-distribution",
    title: "Geographic Distribution Report",
    description: "Regional data on user origins, travel flows, and geographic concentration",
    type: "geographic",
    icon: MapPin,
    lastUpdated: "2025-10-16",
    dataPoints: 1897,
    format: ["CSV", "JSON"],
    preview: {
      keyMetrics: [
        { label: "Top Origin", value: "Australia" },
        { label: "North Island", value: "52%" },
        { label: "South Island", value: "48%" },
        { label: "Multi-Region", value: "67%" }
      ]
    }
  },
  {
    id: "engagement-metrics",
    title: "Engagement & Conversion Metrics",
    description: "Data sharing engagement rates, consent trends, and ROI analysis",
    type: "analytics",
    icon: TrendingUp,
    lastUpdated: "2025-10-16",
    dataPoints: 5643,
    format: ["CSV", "JSON", "PDF"],
    preview: {
      keyMetrics: [
        { label: "Engagement Rate", value: "78.5%" },
        { label: "Consent Rate", value: "92%" },
        { label: "Data Quality", value: "94/100" },
        { label: "ROI", value: "3.2x" }
      ]
    }
  },
  {
    id: "seasonal-trends",
    title: "Seasonal Trends Report",
    description: "Year-over-year trends, seasonal patterns, and forecast insights",
    type: "analytics",
    icon: Calendar,
    lastUpdated: "2025-10-16",
    dataPoints: 4523,
    format: ["CSV", "JSON"],
    preview: {
      keyMetrics: [
        { label: "Peak Month", value: "January" },
        { label: "YoY Growth", value: "+12.5%" },
        { label: "Booking Lead Time", value: "45 days" },
        { label: "Repeat Visitors", value: "34%" }
      ]
    }
  }
];

const generateCSVData = (report: Report): string => {
  const headers = ["Metric", "Value"];
  const rows = report.preview.keyMetrics.map(metric => 
    [metric.label, metric.value].join(",")
  );
  
  const csv = [
    `# ${report.title}`,
    `# Generated: ${new Date().toISOString()}`,
    `# Data Points: ${report.dataPoints}`,
    `# Last Updated: ${report.lastUpdated}`,
    "",
    headers.join(","),
    ...rows,
    "",
    "# This is a sample export. Full dataset available in production environment.",
    "# For questions contact: business@travelsense.co.nz"
  ].join("\n");
  
  return csv;
};

const generateJSONData = (report: Report) => {
  return JSON.stringify({
    report: {
      id: report.id,
      title: report.title,
      description: report.description,
      type: report.type,
      generatedAt: new Date().toISOString(),
      lastUpdated: report.lastUpdated,
      dataPoints: report.dataPoints,
      metrics: report.preview.keyMetrics,
      metadata: {
        company: "Air New Zealand",
        privacyCompliant: true,
        dataRetentionDays: 365,
        note: "This is a sample export. Full dataset available in production environment."
      }
    }
  }, null, 2);
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export function BusinessReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-30-days");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredReports = selectedType === "all" 
    ? availableReports 
    : availableReports.filter(report => report.type === selectedType);

  const handleDownload = (report: Report, format: string) => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${report.id}-${timestamp}`;
      
      if (format === "CSV") {
        const csvData = generateCSVData(report);
        downloadFile(csvData, `${filename}.csv`, "text/csv");
        toast.success(`Downloaded ${report.title} as CSV`);
      } else if (format === "JSON") {
        const jsonData = generateJSONData(report);
        downloadFile(jsonData, `${filename}.json`, "application/json");
        toast.success(`Downloaded ${report.title} as JSON`);
      } else if (format === "PDF") {
        // For PDF, we'll show a toast indicating it's being generated
        toast.success(`${report.title} PDF download started`, {
          description: "Your PDF report is being generated and will download shortly."
        });
        // In production, this would trigger a server-side PDF generation
        setTimeout(() => {
          toast.info("PDF generation complete", {
            description: "In production, this would download a formatted PDF report."
          });
        }, 2000);
      }
    } catch (error) {
      toast.error("Download failed", {
        description: "There was an error downloading the report. Please try again."
      });
    }
  };

  const handleScheduleReport = (reportId: string) => {
    toast.success("Report scheduled", {
      description: "You'll receive this report automatically every month via email."
    });
  };

  const handleRequestCustomReport = () => {
    toast.success("Custom report request submitted", {
      description: "Our team will contact you within 24 hours to discuss your specific requirements."
    });
  };

  const handleRedownload = (reportTitle: string, format: string) => {
    // Find the original report to redownload
    const report = availableReports.find(r => r.title === reportTitle);
    if (report) {
      handleDownload(report, format);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl text-white">Data Reports</h1>
            <p className="text-slate-400">Download comprehensive analytics and insights from your data partnerships</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="demographics">Demographics</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="geographic">Geographic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="border-slate-700 bg-slate-800/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Reports</p>
                    <p className="text-2xl text-white">{filteredReports.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Data Points</p>
                    <p className="text-2xl text-white">18.8K</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Last Updated</p>
                    <p className="text-2xl text-white">Today</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Data Quality</p>
                    <p className="text-2xl text-white">94%</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="border-slate-700 bg-slate-800/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <report.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white">{report.title}</CardTitle>
                      <CardDescription className="text-slate-400 mt-1">
                        {report.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {report.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Metrics Preview */}
                <div className="grid grid-cols-2 gap-3">
                  {report.preview.keyMetrics.map((metric, index) => (
                    <div key={index} className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400">{metric.label}</p>
                      <p className="text-lg text-white">{metric.value}</p>
                    </div>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>{report.dataPoints.toLocaleString()} data points</span>
                  <span>•</span>
                  <span>Updated {report.lastUpdated}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex gap-2">
                    {report.format.map((format) => (
                      <Button
                        key={format}
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700"
                        onClick={() => handleDownload(report, format)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {format}
                      </Button>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    onClick={() => handleScheduleReport(report.id)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Monthly Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Report Builder Card */}
        <Card className="border-slate-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Need a Custom Report?</CardTitle>
            <CardDescription className="text-slate-400">
              Request a tailored report with specific metrics and data points relevant to your business needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleRequestCustomReport}
              >
                Request Custom Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Downloads */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Recent Downloads</CardTitle>
            <CardDescription className="text-slate-400">
              Your download history from the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableHead className="text-slate-400">Report</TableHead>
                  <TableHead className="text-slate-400">Format</TableHead>
                  <TableHead className="text-slate-400">Date</TableHead>
                  <TableHead className="text-slate-400">Size</TableHead>
                  <TableHead className="text-right text-slate-400">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableCell className="text-white">User Demographics Report</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">CSV</Badge>
                  </TableCell>
                  <TableCell className="text-slate-400">2025-10-15</TableCell>
                  <TableCell className="text-slate-400">245 KB</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => handleRedownload("User Demographics Report", "CSV")}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableCell className="text-white">Spending Behavior Analysis</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">JSON</Badge>
                  </TableCell>
                  <TableCell className="text-slate-400">2025-10-14</TableCell>
                  <TableCell className="text-slate-400">128 KB</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => handleRedownload("Spending Behavior Analysis", "JSON")}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="border-slate-700 hover:bg-slate-800/50">
                  <TableCell className="text-white">Engagement & Conversion Metrics</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">PDF</Badge>
                  </TableCell>
                  <TableCell className="text-slate-400">2025-10-10</TableCell>
                  <TableCell className="text-slate-400">1.2 MB</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => handleRedownload("Engagement & Conversion Metrics", "PDF")}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
