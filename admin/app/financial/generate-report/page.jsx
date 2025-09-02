"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "../../../components/ui";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Filter,
  ChevronDown,
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  Users,
  CreditCard,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Send,
  Mail,
  Printer,
  Share,
  Copy,
  RefreshCw,
  Settings,
  Plus,
  Minus,
  Info,
  AlertTriangle,
  Globe,
  Search,
  Edit,
  Trash2,
  Star,
  Bookmark,
  ExternalLink,
  Play,
  Pause,
  Square
} from "lucide-react";

export default function GenerateReportPage() {
  const [reportType, setReportType] = useState("financial_summary");
  const [dateRange, setDateRange] = useState("last_7_days");
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });
  const [format, setFormat] = useState("pdf");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [previewData, setPreviewData] = useState(null);
  const [scheduledReports, setScheduledReports] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock scheduled reports
  useEffect(() => {
    const mockScheduledReports = [
      {
        id: "SCH001",
        name: "Weekly Financial Summary",
        type: "financial_summary",
        frequency: "weekly",
        nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        lastRun: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        recipients: ["iren.kukoma@ajo.com", "finance@ajo.com"],
        status: "active",
        format: "pdf"
      },
      {
        id: "SCH002", 
        name: "Monthly Transaction Report",
        type: "transaction_details",
        frequency: "monthly",
        nextRun: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        lastRun: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        recipients: ["accounting@ajo.com"],
        status: "active",
        format: "excel"
      },
      {
        id: "SCH003",
        name: "Daily Dispute Summary",
        type: "dispute_analysis",
        frequency: "daily",
        nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
        recipients: ["support@ajo.com", "compliance@ajo.com"],
        status: "paused",
        format: "pdf"
      }
    ];

    setScheduledReports(mockScheduledReports);
  }, []);

  const reportTypes = [
    {
      id: "financial_summary",
      name: "Financial Summary",
      description: "Revenue, expenses, profit/loss overview",
      icon: DollarSign,
      estimatedTime: "2-3 minutes",
      complexity: "Basic"
    },
    {
      id: "transaction_details",
      name: "Transaction Details",
      description: "Detailed transaction logs and analytics",
      icon: Activity,
      estimatedTime: "5-10 minutes",
      complexity: "Standard"
    },
    {
      id: "user_analytics",
      name: "User Analytics",
      description: "User behavior, registration, and engagement",
      icon: Users,
      estimatedTime: "3-5 minutes",
      complexity: "Standard"
    },
    {
      id: "payment_gateway",
      name: "Payment Gateway Report",
      description: "Gateway performance and fee analysis",
      icon: CreditCard,
      estimatedTime: "3-4 minutes",
      complexity: "Basic"
    },
    {
      id: "dispute_analysis",
      name: "Dispute & Refund Analysis",
      description: "Dispute trends, refund rates, resolution times",
      icon: AlertTriangle,
      estimatedTime: "4-6 minutes",
      complexity: "Advanced"
    },
    {
      id: "performance_metrics",
      name: "Performance Metrics",
      description: "KPIs, growth metrics, and benchmarks",
      icon: TrendingUp,
      estimatedTime: "6-8 minutes",
      complexity: "Advanced"
    },
    {
      id: "regulatory_compliance",
      name: "Regulatory Compliance",
      description: "AML, KYC compliance status and reports",
      icon: CheckCircle,
      estimatedTime: "8-12 minutes",
      complexity: "Complex"
    },
    {
      id: "custom_report",
      name: "Custom Report",
      description: "Build your own report with custom metrics",
      icon: Settings,
      estimatedTime: "Variable",
      complexity: "Advanced"
    }
  ];

  const dateRangeOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last_7_days", label: "Last 7 Days" },
    { value: "last_30_days", label: "Last 30 Days" },
    { value: "last_90_days", label: "Last 90 Days" },
    { value: "this_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: "this_quarter", label: "This Quarter" },
    { value: "last_quarter", label: "Last Quarter" },
    { value: "this_year", label: "This Year" },
    { value: "last_year", label: "Last Year" },
    { value: "custom", label: "Custom Range" }
  ];

  const formatOptions = [
    { value: "pdf", label: "PDF Document", icon: FileText },
    { value: "excel", label: "Excel Spreadsheet", icon: BarChart3 },
    { value: "csv", label: "CSV Data", icon: FileText },
    { value: "json", label: "JSON Data", icon: FileText }
  ];

  const filterOptions = [
    { id: "payment_method", name: "Payment Method", values: ["Card", "Bank Transfer", "Wallet"] },
    { id: "transaction_status", name: "Transaction Status", values: ["Success", "Failed", "Pending"] },
    { id: "user_type", name: "User Type", values: ["Individual", "Business", "Premium"] },
    { id: "gateway", name: "Payment Gateway", values: ["Stripe", "Paystack", "Flutterwave"] },
    { id: "amount_range", name: "Amount Range", values: ["0-1K", "1K-10K", "10K-100K", "100K+"] }
  ];

  // Mock preview data based on report type
  const generatePreviewData = (type) => {
    const baseData = {
      financial_summary: {
        totalRevenue: "₦2,450,000",
        totalTransactions: 1856,
        averageTransaction: "₦1,320",
        successRate: "94.5%",
        topMetrics: [
          { label: "Revenue Growth", value: "+12.5%", trend: "up" },
          { label: "Transaction Volume", value: "+8.2%", trend: "up" },
          { label: "Failed Rate", value: "-2.1%", trend: "down" },
          { label: "Average Fee", value: "₦45", trend: "neutral" }
        ]
      },
      transaction_details: {
        totalCount: 1856,
        totalVolume: "₦2,450,000",
        byStatus: {
          successful: 1754,
          failed: 68,
          pending: 34
        },
        byMethod: {
          card: 834,
          bank: 712,
          wallet: 310
        }
      },
      user_analytics: {
        totalUsers: 2341,
        activeUsers: 1876,
        newRegistrations: 234,
        retentionRate: "78.5%"
      }
    };

    return baseData[type] || baseData.financial_summary;
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const reportData = generatePreviewData(reportType);
    setPreviewData(reportData);
    setIsGenerating(false);

    // In a real app, this would trigger the actual report generation
    console.log("Generating report:", {
      type: reportType,
      dateRange,
      customDateRange,
      format,
      includeCharts,
      includeRawData,
      filters: selectedFilters
    });
  };

  const handleScheduleReport = () => {
    console.log("Scheduling report:", {
      type: reportType,
      recipients: emailRecipients.split(',').map(email => email.trim()),
      frequency: "weekly" // This would be configurable
    });
    setShowScheduleModal(false);
    setEmailRecipients("");
  };

  const handleFilterToggle = (filterId, value) => {
    const filterKey = `${filterId}:${value}`;
    setSelectedFilters(prev => 
      prev.includes(filterKey)
        ? prev.filter(f => f !== filterKey)
        : [...prev, filterKey]
    );
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case "Basic":
        return "text-green-600 bg-green-50 border-green-200";
      case "Standard":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Advanced":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "Complex":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
      <PageHeader title="Generate Reports" />
      
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">
        
        {/* Back Navigation */}
        <Link href="/financial" className="inline-flex items-center gap-2 text-sm text-[#999999] hover:text-[#1E1E1E] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to Financial Dashboard
        </Link>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-light text-[#1E1E1E]">Financial Report Generator</h2>
              <p className="text-[#999999] text-xs mt-1 font-light">
                Create detailed financial reports with custom parameters and scheduling
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#1E1E1E] text-sm font-light">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} WAT
              </p>
              <p className="text-[#999999] text-xs mt-1">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                <span className="text-xs text-blue-600">23</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">23</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Generated Today</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                <span className="text-xs text-amber-600">{scheduledReports.filter(r => r.status === 'active').length}</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">{scheduledReports.length}</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Scheduled Reports</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
              <div className="flex items-center justify-between mb-2">
                <Download className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                <span className="text-xs text-emerald-600">156</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">156</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Downloaded This Month</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
                <span className="text-xs text-violet-600">4.2 min</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">4.2</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Avg Generation Time (min)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Type Selection */}
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
              <h3 className="text-lg font-light text-[#1E1E1E] mb-4">Select Report Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = reportType === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setReportType(type.id)}
                      className={`p-4 border cursor-pointer transition-all duration-200 hover:border-[#00000020] ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50/50' 
                          : 'border-[#00000008] hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-1 ${isSelected ? 'text-blue-600' : 'text-[#999999]'}`} strokeWidth={1.5} />
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-[#1E1E1E]'} mb-1`}>
                            {type.name}
                          </h4>
                          <p className="text-xs text-[#666666] mb-2 line-clamp-2">
                            {type.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border ${getComplexityColor(type.complexity)}`}>
                              {type.complexity}
                            </span>
                            <span className="text-[10px] text-[#999999]">
                              {type.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date Range & Filters */}
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
              <h3 className="text-lg font-light text-[#1E1E1E] mb-4">Configure Parameters</h3>
              
              <div className="space-y-4">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Date Range</label>
                  <div className="relative">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full px-4 py-2 pr-10 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors cursor-pointer appearance-none"
                    >
                      {dateRangeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  </div>

                  {dateRange === 'custom' && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-xs text-[#999999] mb-1">Start Date</label>
                        <input
                          type="date"
                          value={customDateRange.start}
                          onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                          className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#999999] mb-1">End Date</label>
                        <input
                          type="date"
                          value={customDateRange.end}
                          onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                          className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Output Format */}
                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Output Format</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {formatOptions.map((fmt) => {
                      const Icon = fmt.icon;
                      const isSelected = format === fmt.value;
                      return (
                        <button
                          key={fmt.value}
                          onClick={() => setFormat(fmt.value)}
                          className={`p-3 border text-left transition-colors ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50/50 text-blue-900' 
                              : 'border-[#00000008] hover:border-[#00000020] text-[#1E1E1E]'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-blue-600' : 'text-[#999999]'}`} strokeWidth={1.5} />
                          <span className="text-xs font-light">{fmt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Report Options */}
                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Report Options</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeCharts}
                        onChange={(e) => setIncludeCharts(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-light text-[#1E1E1E]">Include charts and visualizations</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeRawData}
                        onChange={(e) => setIncludeRawData(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-light text-[#1E1E1E]">Include raw data tables</span>
                    </label>
                  </div>
                </div>

                {/* Filters */}
                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Additional Filters</label>
                  <div className="space-y-3">
                    {filterOptions.map((filter) => (
                      <div key={filter.id}>
                        <p className="text-xs font-medium text-[#999999] mb-2">{filter.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {filter.values.map((value) => {
                            const filterKey = `${filter.id}:${value}`;
                            const isSelected = selectedFilters.includes(filterKey);
                            return (
                              <button
                                key={value}
                                onClick={() => handleFilterToggle(filter.id, value)}
                                className={`px-3 py-1 text-xs border transition-colors ${
                                  isSelected 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                    : 'border-[#00000008] hover:border-[#00000020] text-[#666666]'
                                }`}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Actions */}
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-light text-[#1E1E1E] mb-1">Generate Report</h3>
                  <p className="text-xs text-[#999999]">
                    Estimated generation time: {reportTypes.find(t => t.id === reportType)?.estimatedTime || '2-3 minutes'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors text-sm font-light flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                    Schedule
                  </button>
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="px-6 py-2 bg-[#1E1E1E] text-white hover:bg-[#2E2E2E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-light flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" strokeWidth={1.5} />
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress indicator */}
              {isGenerating && (
                <div className="mt-4 p-3 bg-blue-50/50 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-blue-700">
                      Processing your request... This may take a few minutes.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            {previewData && (
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-lg font-light text-[#1E1E1E] mb-4">Report Preview</h3>
                <div className="space-y-3">
                  {reportType === 'financial_summary' && (
                    <>
                      <div className="flex items-center justify-between py-2 border-b border-[#00000008]">
                        <span className="text-sm font-light text-[#666666]">Total Revenue</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{previewData.totalRevenue}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#00000008]">
                        <span className="text-sm font-light text-[#666666]">Total Transactions</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{previewData.totalTransactions?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-[#00000008]">
                        <span className="text-sm font-light text-[#666666]">Success Rate</span>
                        <span className="text-sm font-medium text-emerald-600">{previewData.successRate}</span>
                      </div>
                      <div className="pt-3">
                        <p className="text-xs font-medium text-[#999999] mb-2">Key Metrics</p>
                        <div className="space-y-2">
                          {previewData.topMetrics?.map((metric, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <span className="text-[#666666]">{metric.label}</span>
                              <span className={`font-medium ${
                                metric.trend === 'up' ? 'text-emerald-600' : 
                                metric.trend === 'down' ? 'text-red-600' : 'text-[#1E1E1E]'
                              }`}>
                                {metric.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors">
                    Download Full Report
                  </button>
                </div>
              </div>
            )}

            {/* Scheduled Reports */}
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light text-[#1E1E1E]">Scheduled Reports</h3>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="p-1 hover:bg-[#F8F9FA] transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                </button>
              </div>
              
              <div className="space-y-3">
                {scheduledReports.slice(0, 3).map((report) => (
                  <div key={report.id} className="p-3 border border-[#00000008] hover:border-[#00000020] transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-medium text-[#1E1E1E] line-clamp-1">{report.name}</h4>
                      <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border ${
                        report.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-amber-50 text-amber-600 border-amber-200'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-[#999999]">
                      <div className="flex items-center justify-between">
                        <span>Frequency</span>
                        <span className="capitalize">{report.frequency}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Next Run</span>
                        <span>{formatTimestamp(report.nextRun)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Recipients</span>
                        <span>{report.recipients.length} user{report.recipients.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {scheduledReports.length > 3 && (
                  <button className="w-full text-center py-2 text-xs text-blue-600 hover:text-blue-700 transition-colors">
                    View all scheduled reports →
                  </button>
                )}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
              <h3 className="text-lg font-light text-[#1E1E1E] mb-4">Recent Reports</h3>
              <div className="space-y-3">
                {[
                  { name: "Weekly Summary", time: "2 hours ago", size: "1.2 MB", format: "PDF" },
                  { name: "Transaction Analysis", time: "1 day ago", size: "3.8 MB", format: "Excel" },
                  { name: "User Analytics", time: "2 days ago", size: "890 KB", format: "PDF" }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border border-[#00000008] hover:border-[#00000020] transition-colors">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                      <div>
                        <p className="text-sm font-light text-[#1E1E1E]">{report.name}</p>
                        <p className="text-xs text-[#999999]">{report.time} • {report.size}</p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-[#F8F9FA] transition-colors">
                      <Download className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Report Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-[#00000008] w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-light text-[#1E1E1E]">Schedule Report</h3>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-[#999999]" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Email Recipients</label>
                    <input
                      type="email"
                      value={emailRecipients}
                      onChange={(e) => setEmailRecipients(e.target.value)}
                      placeholder="Enter email addresses separated by commas"
                      className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Frequency</label>
                    <select className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>

                  <div className="bg-[#F8F9FA] p-4 rounded-lg">
                    <h4 className="text-sm font-light text-[#1E1E1E] mb-2">Schedule Summary</h4>
                    <div className="space-y-1 text-xs text-[#666666]">
                      <div className="flex items-center justify-between">
                        <span>Report Type</span>
                        <span>{reportTypes.find(t => t.id === reportType)?.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Format</span>
                        <span className="uppercase">{format}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Date Range</span>
                        <span>{dateRangeOptions.find(d => d.value === dateRange)?.label}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <button
                    onClick={handleScheduleReport}
                    className="flex-1 px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors"
                  >
                    Schedule Report
                  </button>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 bg-[#F8F9FA] text-[#666666] text-sm font-light hover:bg-[#F0F0F0] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
