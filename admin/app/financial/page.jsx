"use client";
import { useState } from "react";
import { PageHeader } from "../../components/ui";
import { transactions, payouts, users, groups } from "../../data/adminContent";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Download,
  Filter,
  Search,
  Shield,
  AlertTriangle,
  RefreshCw,
  Receipt,
  BarChart3,
  PieChart,
  Target,
  Banknote,
  Coins,
  Users,
  Calendar,
  ChevronRight,
  Info,
  ExternalLink
} from "lucide-react";

export default function FinancialPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);
  
  // Calculate financial statistics
  const stats = {
    totalRevenue: '$12,450',
    monthlyRevenue: '$4,200',
    weeklyRevenue: '$980',
    totalTransactions: transactions.length + 150,
    pendingTransactions: transactions.filter(t => t.status === 'pending').length,
    failedTransactions: transactions.filter(t => t.status === 'failed').length,
    totalPayouts: payouts.length + 45,
    scheduledPayouts: payouts.filter(p => p.status === 'scheduled').length,
    processingPayouts: payouts.filter(p => p.status === 'processing').length,
    totalWalletBalance: '$8,320,000',
    availableBalance: '$7,100,000',
    lockedBalance: '$1,220,000',
    transactionFees: '$3,200',
    lateFees: '$450',
    subscriptionFees: '$8,800',
    activeDisputes: 3,
    resolvedDisputes: 12,
    pendingRefunds: 2,
    verifiedAccounts: 145,
    unverifiedAccounts: 23,
    successRate: 94.5
  };
  
  // Mock recent transactions with enhanced data
  const recentTransactions = transactions.slice(0, 5).map(t => ({
    ...t,
    userName: users.find(u => u.id === t.userId)?.name || 'Unknown',
    userEmail: users.find(u => u.id === t.userId)?.email || 'unknown@email.com',
    method: t.type === 'deposit' ? 'Bank Transfer' : 'Wallet',
    fee: '$2.50',
    net: t.amount.replace('$', '') - 2.5
  }));
  
  // Mock payment gateway activity
  const gatewayActivity = [
    { id: 'gw-001', gateway: 'Stripe', status: 'active', volume: '$3,200', transactions: 45, lastActivity: '2 mins ago' },
    { id: 'gw-002', gateway: 'Paystack', status: 'active', volume: '$2,100', transactions: 32, lastActivity: '15 mins ago' },
    { id: 'gw-003', gateway: 'Flutterwave', status: 'maintenance', volume: '$0', transactions: 0, lastActivity: '2 hours ago' },
  ];
  
  // Mock dispute data
  const disputes = [
    { id: 'disp-001', transactionId: 't-3001', amount: '$50,000', reason: 'Unauthorized charge', status: 'investigating', createdAt: '2025-08-14' },
    { id: 'disp-002', transactionId: 't-3002', amount: '$25,000', reason: 'Service not received', status: 'pending', createdAt: '2025-08-13' },
    { id: 'disp-003', transactionId: 't-3003', amount: '$15,000', reason: 'Duplicate charge', status: 'resolved', createdAt: '2025-08-10' },
  ];
  
  // Mock revenue breakdown
  const revenueBreakdown = [
    { source: 'Transaction Fees', amount: '$3,200', percentage: 25.7, trend: 'up' },
    { source: 'Subscriptions', amount: '$8,800', percentage: 70.7, trend: 'up' },
    { source: 'Late Penalties', amount: '$450', percentage: 3.6, trend: 'down' },
  ];
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'success': case 'active': case 'completed': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100';
      case 'pending': case 'processing': return 'bg-amber-50/50 text-amber-600 border-amber-100';
      case 'failed': case 'cancelled': return 'bg-red-50/50 text-red-600 border-red-100';
      case 'scheduled': return 'bg-blue-50/50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50/50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px]">
      <PageHeader title="Financial Management" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                <span className="text-xs text-emerald-600">+12%</span>
              </div>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.totalRevenue}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Revenue</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              <span className="text-xs text-blue-600">{stats.availableBalance}</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.totalWalletBalance}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Balance</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
              <span className="text-xs text-violet-600">{stats.totalTransactions}</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.totalTransactions}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Transactions</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              <span className="text-xs text-amber-600">{stats.successRate}%</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.successRate}%</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Success Rate</p>
          </div>
        </div>
        
        {/* Quick Actions & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-[#00000008] p-4">
            <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href="/financial/transactions" className="p-3 border border-[#00000008] hover:border-[#00000020] transition-all duration-200 flex flex-col items-center gap-2">
                <Receipt className="w-5 h-5 text-[#1E1E1E]" strokeWidth={1.5} />
                <span className="text-xs text-[#1E1E1E]">Transactions</span>
              </Link>
              <Link href="/financial/payouts" className="p-3 border border-[#00000008] hover:border-[#00000020] transition-all duration-200 flex flex-col items-center gap-2">
                <Banknote className="w-5 h-5 text-[#1E1E1E]" strokeWidth={1.5} />
                <span className="text-xs text-[#1E1E1E]">Payouts</span>
              </Link>
              <button className="p-3 border border-[#00000008] hover:border-[#00000020] transition-all duration-200 flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#1E1E1E]" strokeWidth={1.5} />
                <span className="text-xs text-[#1E1E1E]">Process Refunds</span>
              </button>
              <button className="p-3 border border-[#00000008] hover:border-[#00000020] transition-all duration-200 flex flex-col items-center gap-2">
                <FileText className="w-5 h-5 text-[#1E1E1E]" strokeWidth={1.5} />
                <span className="text-xs text-[#1E1E1E]">Generate Report</span>
              </button>
            </div>
          </div>
          
          {/* Alerts */}
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-4">
            <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Alerts</h3>
            <div className="space-y-3">
              {stats.pendingTransactions > 0 && (
                <div className="flex items-center gap-3 p-2 bg-amber-50/50 border-l-2 border-amber-500">
                  <Clock className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-amber-900">{stats.pendingTransactions} Pending Transactions</p>
                    <p className="text-[10px] text-amber-700">Require processing</p>
                  </div>
                </div>
              )}
              {stats.failedTransactions > 0 && (
                <div className="flex items-center gap-3 p-2 bg-red-50/50 border-l-2 border-red-500">
                  <XCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-red-900">{stats.failedTransactions} Failed Transactions</p>
                    <p className="text-[10px] text-red-700">Need investigation</p>
                  </div>
                </div>
              )}
              {stats.activeDisputes > 0 && (
                <div className="flex items-center gap-3 p-2 bg-violet-50/50 border-l-2 border-violet-500">
                  <AlertTriangle className="w-4 h-4 text-violet-600" strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-violet-900">{stats.activeDisputes} Active Disputes</p>
                    <p className="text-[10px] text-violet-700">Awaiting resolution</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6 border-b border-[#00000008]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
                activeTab === 'overview' 
                  ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                  : 'text-[#999999] hover:text-[#1E1E1E]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
                activeTab === 'audit' 
                  ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                  : 'text-[#999999] hover:text-[#1E1E1E]'
              }`}
            >
              Audit Trail
            </button>
            <button
              onClick={() => setActiveTab('gateways')}
              className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
                activeTab === 'gateways' 
                  ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                  : 'text-[#999999] hover:text-[#1E1E1E]'
              }`}
            >
              Payment Gateways
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
                activeTab === 'revenue' 
                  ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                  : 'text-[#999999] hover:text-[#1E1E1E]'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
                activeTab === 'disputes' 
                  ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                  : 'text-[#999999] hover:text-[#1E1E1E]'
              }`}
            >
              Disputes & Refunds
            </button>
            <button
              onClick={() => setActiveTab('verification')}
              className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
                activeTab === 'verification' 
                  ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                  : 'text-[#999999] hover:text-[#1E1E1E]'
              }`}
            >
              Verification
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-[#00000008] bg-white/50 text-sm font-light focus:outline-none focus:border-[#00000020]"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors flex items-center gap-2 text-sm font-light">
              <Download className="w-4 h-4" strokeWidth={1.5} />
              Export
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="space-y-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Transaction Summary */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Transaction Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-[#999999] mb-2">Volume by Type</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ArrowUpRight className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                          <span className="text-sm font-light">Deposits</span>
                        </div>
                        <span className="text-sm font-medium text-emerald-600">$3,250,000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ArrowDownRight className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                          <span className="text-sm font-light">Withdrawals</span>
                        </div>
                        <span className="text-sm font-medium text-red-600">$1,120,000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                          <span className="text-sm font-light">Payouts</span>
                        </div>
                        <span className="text-sm font-medium text-blue-600">$2,450,000</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-[#999999] mb-2">Status Distribution</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                          <span className="text-sm font-light">Successful</span>
                        </div>
                        <span className="text-sm font-medium">{stats.totalTransactions - stats.pendingTransactions - stats.failedTransactions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                          <span className="text-sm font-light">Pending</span>
                        </div>
                        <span className="text-sm font-medium">{stats.pendingTransactions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                          <span className="text-sm font-light">Failed</span>
                        </div>
                        <span className="text-sm font-medium">{stats.failedTransactions}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-[#999999] mb-2">Payment Methods</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-violet-600" strokeWidth={1.5} />
                          <span className="text-sm font-light">Cards</span>
                        </div>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                          <span className="text-sm font-light">Bank Transfer</span>
                        </div>
                        <span className="text-sm font-medium">38%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-green-600" strokeWidth={1.5} />
                          <span className="text-sm font-light">Wallet</span>
                        </div>
                        <span className="text-sm font-medium">17%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Transactions */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Recent Transactions</h3>
                  <Link href="/financial/transactions" className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                    View All
                    <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#00000008]">
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">ID</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">User</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Type</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Amount</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Fee</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Method</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA]">
                          <td className="p-3">
                            <span className="text-xs text-[#999999]">{transaction.id}</span>
                          </td>
                          <td className="p-3">
                            <p className="text-sm font-light text-[#1E1E1E]">{transaction.userName}</p>
                            <p className="text-xs text-[#999999]">{transaction.userEmail}</p>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {transaction.type === 'deposit' ? (
                                <ArrowUpRight className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                              ) : (
                                <ArrowDownRight className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                              )}
                              <span className="text-sm font-light text-[#1E1E1E] capitalize">{transaction.type}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-medium text-[#1E1E1E]">{transaction.amount}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-xs text-[#999999]">{transaction.fee}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E]">{transaction.method}</span>
                          </td>
                          <td className="p-3">
                            <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          
          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Transaction Audit Trail</h3>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Receipt className="w-5 h-5 text-[#999999]" strokeWidth={1.5} />
                        <div>
                          <p className="text-sm font-medium text-[#1E1E1E]">Transaction {transaction.id}</p>
                          <p className="text-xs text-[#999999]">{transaction.date} • {transaction.userName}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <div className="pl-8 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#999999]">
                        <Info className="w-3 h-3" strokeWidth={1.5} />
                        <span>Initiated: {transaction.date} 10:30 AM</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#999999]">
                        <Info className="w-3 h-3" strokeWidth={1.5} />
                        <span>Gateway: Stripe • Method: {transaction.method}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#999999]">
                        <Info className="w-3 h-3" strokeWidth={1.5} />
                        <span>IP Address: 192.168.1.1 • Device: Chrome/Windows</span>
                      </div>
                      {transaction.status === 'success' && (
                        <div className="flex items-center gap-2 text-xs text-emerald-600">
                          <CheckCircle className="w-3 h-3" strokeWidth={1.5} />
                          <span>Completed: {transaction.date} 10:31 AM</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Payment Gateways Tab */}
          {activeTab === 'gateways' && (
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Payment Gateway Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gatewayActivity.map((gateway) => (
                  <div key={gateway.id} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-[#1E1E1E]">{gateway.gateway}</h4>
                      <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${
                        gateway.status === 'active' ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' :
                        'bg-amber-50/50 text-amber-600 border-amber-100'
                      }`}>
                        {gateway.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-xs text-[#999999]">Volume</span>
                        <span className="font-medium text-[#1E1E1E]">{gateway.volume}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-xs text-[#999999]">Transactions</span>
                        <span className="font-light text-[#1E1E1E]">{gateway.transactions}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-xs text-[#999999]">Last Activity</span>
                        <span className="font-light text-[#1E1E1E]">{gateway.lastActivity}</span>
                      </div>
                    </div>
                    <button className="mt-3 w-full px-3 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors text-xs font-light flex items-center justify-center gap-2">
                      <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                      View Dashboard
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Revenue Tab */}
          {activeTab === 'revenue' && (
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Revenue Breakdown</h3>
                <div className="space-y-4">
                  {revenueBreakdown.map((source) => (
                    <div key={source.source} className="flex items-center justify-between p-3 border-b border-[#00000008] last:border-0">
                      <div className="flex items-center gap-3">
                        <Coins className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                        <div>
                          <p className="text-sm font-light text-[#1E1E1E]">{source.source}</p>
                          <p className="text-xs text-[#999999]">{source.percentage}% of total</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#1E1E1E]">{source.amount}</span>
                        {source.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Fee Collection</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Transaction Fees</span>
                      <span className="text-sm font-medium text-emerald-600">{stats.transactionFees}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Late Payment Penalties</span>
                      <span className="text-sm font-medium text-amber-600">{stats.lateFees}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Subscription Fees</span>
                      <span className="text-sm font-medium text-blue-600">{stats.subscriptionFees}</span>
                    </div>
                    <div className="pt-3 border-t border-[#00000008] flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1E1E1E]">Total Revenue</span>
                      <span className="text-sm font-medium text-[#1E1E1E]">{stats.totalRevenue}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Revenue Trends</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">This Week</span>
                      <span className="text-sm font-medium text-[#1E1E1E]">{stats.weeklyRevenue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">This Month</span>
                      <span className="text-sm font-medium text-[#1E1E1E]">{stats.monthlyRevenue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Growth Rate</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-emerald-600">+12.5%</span>
                        <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Disputes & Refunds Tab */}
          {activeTab === 'disputes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{stats.activeDisputes}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Active Disputes</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{stats.resolvedDisputes}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Resolved</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <RefreshCw className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{stats.pendingRefunds}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Pending Refunds</p>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Recent Disputes</h3>
                <div className="space-y-3">
                  {disputes.map((dispute) => (
                    <div key={dispute.id} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-[#1E1E1E]">Dispute {dispute.id}</p>
                          <p className="text-xs text-[#999999]">Transaction: {dispute.transactionId} • {dispute.createdAt}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${
                          dispute.status === 'resolved' ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' :
                          dispute.status === 'investigating' ? 'bg-amber-50/50 text-amber-600 border-amber-100' :
                          'bg-red-50/50 text-red-600 border-red-100'
                        }`}>
                          {dispute.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-[#999999]">Reason</p>
                          <p className="text-sm font-light text-[#1E1E1E]">{dispute.reason}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#999999]">Amount</p>
                          <p className="text-sm font-medium text-[#1E1E1E]">{dispute.amount}</p>
                        </div>
                      </div>
                      {dispute.status !== 'resolved' && (
                        <div className="mt-3 flex items-center gap-2">
                          <button className="px-3 py-1 bg-emerald-600 text-white text-xs font-light hover:bg-emerald-700 transition-colors">
                            Approve Refund
                          </button>
                          <button className="px-3 py-1 border border-[#00000008] hover:border-[#00000020] text-xs font-light transition-colors">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Verification Tab */}
          {activeTab === 'verification' && (
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Account Verification Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-[#999999] mb-3">Verification Overview</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-emerald-50/50 border-l-2 border-emerald-500">
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                        <span className="text-sm font-light text-[#1E1E1E]">Verified Accounts</span>
                      </div>
                      <span className="text-sm font-medium text-emerald-600">{stats.verifiedAccounts}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50/50 border-l-2 border-amber-500">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                        <span className="text-sm font-light text-[#1E1E1E]">Pending Verification</span>
                      </div>
                      <span className="text-sm font-medium text-amber-600">{stats.unverifiedAccounts}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-[#999999] mb-3">Verification Methods</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Bank Account</span>
                      <span className="text-sm font-light text-[#999999]">Stripe Connect</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Identity (KYC)</span>
                      <span className="text-sm font-light text-[#999999]">Automated</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Payment Methods</span>
                      <span className="text-sm font-light text-[#999999]">3D Secure</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
