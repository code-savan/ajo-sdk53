"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "../../../components/ui";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  DollarSign,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Upload,
  Send,
  FileText,
  CreditCard,
  Banknote,
  Receipt,
  Mail,
  Phone,
  MapPin,
  Info,
  AlertCircle,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  ArrowRight,
  Plus,
  Minus,
  MoreVertical
} from "lucide-react";

export default function ProcessRefundPage() {
  const [refunds, setRefunds] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [selectedRefunds, setSelectedRefunds] = useState([]);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeRefund, setActiveRefund] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock refund data
  useEffect(() => {
    const mockRefunds = [
      {
        id: "RF001",
        transactionId: "TXN-789456",
        userId: "user-12345",
        userName: "John Doe",
        userEmail: "john.doe@email.com",
        phone: "+234 813 456 7890",
        amount: 50000,
        currency: "NGN",
        reason: "Unauthorized transaction",
        description: "Customer claims they did not authorize this transaction. Bank statement shows no record of user initiating this payment.",
        status: "pending",
        priority: "high",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        requestedBy: "Customer",
        assignedTo: "Sarah Johnson",
        originalTransaction: {
          date: "2025-08-25",
          method: "Card",
          gateway: "Paystack",
          cardLast4: "1234",
          merchantRef: "REF123456"
        },
        attachments: ["dispute_evidence.pdf", "bank_statement.pdf"],
        customerLocation: "Lagos, Nigeria",
        riskScore: 85,
        category: "dispute"
      },
      {
        id: "RF002",
        transactionId: "TXN-654321",
        userId: "user-67890",
        userName: "Adaeze Okafor",
        userEmail: "adaeze.okafor@email.com",
        phone: "+234 801 234 5678",
        amount: 25000,
        currency: "NGN",
        reason: "Service not received",
        description: "Customer paid for premium membership but features were not unlocked. Technical issue confirmed on our end.",
        status: "approved",
        priority: "medium",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        processedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        requestedBy: "Customer",
        assignedTo: "Michael Chen",
        processedBy: "Sarah Johnson",
        originalTransaction: {
          date: "2025-08-24",
          method: "Bank Transfer",
          gateway: "Flutterwave",
          bankCode: "044",
          accountNumber: "***6789"
        },
        attachments: ["screenshot.png"],
        customerLocation: "Abuja, Nigeria",
        riskScore: 25,
        category: "technical_issue",
        refundMethod: "original_method",
        refundReference: "REF_RF002_20250826"
      },
      {
        id: "RF003",
        transactionId: "TXN-111222",
        userId: "user-55555",
        userName: "Emeka Nwosu",
        userEmail: "emeka.nwosu@email.com",
        phone: "+234 812 345 6789",
        amount: 15000,
        currency: "NGN",
        reason: "Duplicate charge",
        description: "Transaction was processed twice due to network timeout. Customer was charged twice for the same service.",
        status: "processing",
        priority: "low",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        requestedBy: "System",
        assignedTo: "David Okafor",
        originalTransaction: {
          date: "2025-08-25",
          method: "Wallet",
          gateway: "Internal",
          walletId: "WALLET_12345"
        },
        attachments: [],
        customerLocation: "Port Harcourt, Nigeria",
        riskScore: 10,
        category: "system_error",
        estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000)
      },
      {
        id: "RF004",
        transactionId: "TXN-333444",
        userId: "user-77777",
        userName: "Blessing Adebayo",
        userEmail: "blessing.adebayo@email.com",
        phone: "+234 909 876 5432",
        amount: 100000,
        currency: "NGN",
        reason: "Fraudulent transaction",
        description: "Suspicious transaction pattern detected. User's account may have been compromised. Immediate refund requested as part of fraud protection.",
        status: "investigating",
        priority: "high",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        requestedBy: "Fraud Detection System",
        assignedTo: "Compliance Team",
        originalTransaction: {
          date: "2025-08-25",
          method: "Card",
          gateway: "Stripe",
          cardLast4: "9876",
          merchantRef: "REF789012"
        },
        attachments: ["fraud_report.pdf", "transaction_analysis.pdf"],
        customerLocation: "Unknown",
        riskScore: 95,
        category: "fraud",
        flags: ["high_risk", "unusual_location", "velocity_check_failed"]
      },
      {
        id: "RF005",
        transactionId: "TXN-555666",
        userId: "user-88888",
        userName: "Kemi Ogundipe",
        userEmail: "kemi.ogundipe@email.com",
        phone: "+234 708 123 4567",
        amount: 5000,
        currency: "NGN",
        reason: "Accidental payment",
        description: "Customer accidentally made payment for wrong service. Requesting refund to process correct payment.",
        status: "rejected",
        priority: "low",
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        rejectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        requestedBy: "Customer",
        assignedTo: "David Okafor",
        rejectedBy: "Sarah Johnson",
        rejectionReason: "Payment was processed correctly. Service was delivered and confirmed by customer support logs.",
        originalTransaction: {
          date: "2025-08-23",
          method: "Card",
          gateway: "Paystack",
          cardLast4: "5678",
          merchantRef: "REF456789"
        },
        attachments: ["support_chat.pdf"],
        customerLocation: "Ibadan, Nigeria",
        riskScore: 15,
        category: "user_error"
      }
    ];

    setRefunds(mockRefunds);
    setFilteredRefunds(mockRefunds);
    setLoading(false);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...refunds];

    if (searchTerm) {
      filtered = filtered.filter(refund =>
        refund.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(refund => refund.status === statusFilter);
    }

    if (amountFilter !== "all") {
      const amounts = {
        "under_10k": [0, 10000],
        "10k_50k": [10000, 50000],
        "50k_100k": [50000, 100000],
        "over_100k": [100000, Infinity]
      };
      const [min, max] = amounts[amountFilter];
      filtered = filtered.filter(refund => refund.amount >= min && refund.amount < max);
    }

    setFilteredRefunds(filtered);
  }, [refunds, searchTerm, statusFilter, amountFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "processing":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "investigating":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "rejected":
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-amber-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const formatCurrency = (amount, currency = "NGN") => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    
    if (diff < 60 * 1000) return "Just now";
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };

  const handleSelectRefund = (refundId) => {
    setSelectedRefunds(prev => 
      prev.includes(refundId) 
        ? prev.filter(id => id !== refundId)
        : [...prev, refundId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRefunds.length === filteredRefunds.length) {
      setSelectedRefunds([]);
    } else {
      setSelectedRefunds(filteredRefunds.map(r => r.id));
    }
  };

  const handleBatchAction = (action) => {
    console.log(`Batch ${action} for refunds:`, selectedRefunds);
    // In real app, this would make API calls
    setSelectedRefunds([]);
    setShowBatchActions(false);
  };

  const handleRefundAction = (refundId, action) => {
    console.log(`${action} refund:`, refundId);
    // In real app, this would make API call
    setRefunds(prev => 
      prev.map(refund => 
        refund.id === refundId 
          ? { 
              ...refund, 
              status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : refund.status,
              processedAt: new Date(),
              processedBy: 'Current Admin'
            }
          : refund
      )
    );
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "investigating", label: "Investigating" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" }
  ];

  const amountOptions = [
    { value: "all", label: "All Amounts" },
    { value: "under_10k", label: "Under ₦10,000" },
    { value: "10k_50k", label: "₦10,000 - ₦50,000" },
    { value: "50k_100k", label: "₦50,000 - ₦100,000" },
    { value: "over_100k", label: "Over ₦100,000" }
  ];

  const stats = {
    total: refunds.length,
    pending: refunds.filter(r => r.status === "pending").length,
    processing: refunds.filter(r => r.status === "processing").length,
    approved: refunds.filter(r => r.status === "approved").length,
    totalAmount: refunds.reduce((sum, r) => sum + r.amount, 0),
    pendingAmount: refunds.filter(r => r.status === "pending").reduce((sum, r) => sum + r.amount, 0)
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
      <PageHeader title="Process Refunds" />
      
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
              <h2 className="text-2xl font-light text-[#1E1E1E]">Refund Processing Center</h2>
              <p className="text-[#999999] text-xs mt-1 font-light">
                Review, approve, and process customer refund requests
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[#1E1E1E] text-sm font-light">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} WAT
                </p>
                <p className="text-[#999999] text-xs mt-1">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                <span className="text-xs text-blue-600">{stats.total}</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">{stats.total}</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Refunds</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                <span className="text-xs text-amber-600">{stats.pending}</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">{stats.pending}</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Pending</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
              <div className="flex items-center justify-between mb-2">
                <RefreshCw className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                <span className="text-xs text-blue-600">{stats.processing}</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">{stats.processing}</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Processing</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                <span className="text-xs text-emerald-600">{stats.approved}</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">{stats.approved}</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Approved</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-green-600" strokeWidth={1.5} />
                <span className="text-xs text-green-600">{formatCurrency(stats.pendingAmount)}</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">{formatCurrency(stats.totalAmount)}</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Amount</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008] mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search by ID, transaction, user, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors cursor-pointer"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
              </div>

              <div className="relative">
                <select
                  value={amountFilter}
                  onChange={(e) => setAmountFilter(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors cursor-pointer"
                >
                  {amountOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
              </div>

              <button className="p-2 hover:bg-[#FAFAFA] transition-colors">
                <RefreshCw className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Batch Actions */}
          {selectedRefunds.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50/50 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-light text-blue-800">
                  {selectedRefunds.length} refund{selectedRefunds.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBatchAction('approve')}
                  className="px-3 py-1 bg-emerald-600 text-white text-xs hover:bg-emerald-700 transition-colors"
                >
                  Approve All
                </button>
                <button
                  onClick={() => handleBatchAction('reject')}
                  className="px-3 py-1 bg-red-600 text-white text-xs hover:bg-red-700 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setSelectedRefunds([])}
                  className="px-3 py-1 border border-[#00000008] text-xs hover:border-[#00000020] transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Refunds Table */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-[#1E1E1E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#999999]">Loading refunds...</p>
            </div>
          ) : filteredRefunds.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-[#999999] mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-light text-[#1E1E1E] mb-2">No refunds found</h3>
              <p className="text-[#999999] text-sm">
                {searchTerm || statusFilter !== "all" || amountFilter !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "No refund requests at this time."}
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-[#00000008]">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedRefunds.length === filteredRefunds.length && filteredRefunds.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-light text-[#1E1E1E]">
                    {selectedRefunds.length > 0 
                      ? `${selectedRefunds.length} selected`
                      : `${filteredRefunds.length} refund${filteredRefunds.length > 1 ? 's' : ''}`}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-[#00000008]">
                {filteredRefunds.map((refund) => (
                  <div
                    key={refund.id}
                    className="p-4 hover:bg-[#FAFAFA] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedRefunds.includes(refund.id)}
                        onChange={() => handleSelectRefund(refund.id)}
                        className="w-4 h-4 mt-1"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-sm font-medium text-[#1E1E1E]">
                                {refund.id}
                              </h4>
                              <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border ${getStatusColor(refund.status)}`}>
                                {refund.status}
                              </span>
                              <span className={`text-xs ${getPriorityColor(refund.priority)}`}>
                                {refund.priority} priority
                              </span>
                              {refund.flags && refund.flags.includes('high_risk') && (
                                <AlertTriangle className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                              )}
                            </div>
                            
                            <div className="flex items-center gap-6 text-xs text-[#999999] mb-2">
                              <span>Transaction: {refund.transactionId}</span>
                              <span>Amount: {formatCurrency(refund.amount, refund.currency)}</span>
                              <span>Created: {formatTimestamp(refund.createdAt)}</span>
                              <span>Assigned to: {refund.assignedTo}</span>
                            </div>

                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                                <div>
                                  <p className="text-sm font-light text-[#1E1E1E]">{refund.userName}</p>
                                  <p className="text-xs text-[#999999]">{refund.userEmail}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                                <div>
                                  <p className="text-sm font-light text-[#1E1E1E]">{refund.reason}</p>
                                  <p className="text-xs text-[#999999] capitalize">{refund.category.replace('_', ' ')}</p>
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-[#666666] font-light mb-3 line-clamp-2">
                              {refund.description}
                            </p>

                            {/* Transaction Details */}
                            <div className="bg-[#FAFAFA] p-3 mb-3">
                              <p className="text-xs font-medium text-[#999999] mb-2">Original Transaction</p>
                              <div className="flex items-center gap-6 text-xs text-[#666666]">
                                <span>Date: {refund.originalTransaction.date}</span>
                                <span>Method: {refund.originalTransaction.method}</span>
                                <span>Gateway: {refund.originalTransaction.gateway}</span>
                                {refund.originalTransaction.cardLast4 && (
                                  <span>Card: ***{refund.originalTransaction.cardLast4}</span>
                                )}
                              </div>
                            </div>

                            {/* Attachments */}
                            {refund.attachments.length > 0 && (
                              <div className="flex items-center gap-2 mb-3">
                                <FileText className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                                <div className="flex flex-wrap gap-2">
                                  {refund.attachments.map((file, index) => (
                                    <button
                                      key={index}
                                      className="text-xs text-blue-600 hover:text-blue-700 underline"
                                    >
                                      {file}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {refund.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleRefundAction(refund.id, 'approve')}
                                  className="px-3 py-1 bg-emerald-600 text-white text-xs hover:bg-emerald-700 transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRefundAction(refund.id, 'reject')}
                                  className="px-3 py-1 bg-red-600 text-white text-xs hover:bg-red-700 transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            
                            {refund.status === 'investigating' && (
                              <button
                                onClick={() => handleRefundAction(refund.id, 'process')}
                                className="px-3 py-1 bg-blue-600 text-white text-xs hover:bg-blue-700 transition-colors"
                              >
                                Process
                              </button>
                            )}

                            <button className="p-1 hover:bg-[#F8F9FA] transition-colors">
                              <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            </button>

                            <button className="p-1 hover:bg-[#F8F9FA] transition-colors">
                              <MoreVertical className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>

                        {/* Status-specific additional info */}
                        {refund.status === 'approved' && refund.processedAt && (
                          <div className="bg-emerald-50/50 p-3 border-l-2 border-emerald-500">
                            <div className="flex items-center gap-2 text-xs text-emerald-700">
                              <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                              <span>
                                Approved by {refund.processedBy} on {formatTimestamp(refund.processedAt)}
                                {refund.refundReference && ` • Ref: ${refund.refundReference}`}
                              </span>
                            </div>
                          </div>
                        )}

                        {refund.status === 'rejected' && refund.rejectedAt && (
                          <div className="bg-red-50/50 p-3 border-l-2 border-red-500">
                            <div className="text-xs text-red-700">
                              <div className="flex items-center gap-2 mb-1">
                                <XCircle className="w-4 h-4" strokeWidth={1.5} />
                                <span>Rejected by {refund.rejectedBy} on {formatTimestamp(refund.rejectedAt)}</span>
                              </div>
                              <p className="font-light">{refund.rejectionReason}</p>
                            </div>
                          </div>
                        )}

                        {refund.status === 'processing' && refund.estimatedCompletion && (
                          <div className="bg-blue-50/50 p-3 border-l-2 border-blue-500">
                            <div className="flex items-center gap-2 text-xs text-blue-700">
                              <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
                              <span>
                                Estimated completion: {formatTimestamp(refund.estimatedCompletion)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
