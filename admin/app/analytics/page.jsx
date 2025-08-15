"use client";
import { useState } from "react";
import { PageHeader } from "../../components/ui";
import { users, groups, transactions, payouts } from "../../data/adminContent";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  Activity,
  DollarSign,
  Target,
  MapPin,
  Globe,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Percent,
  Coins,
  Receipt,
  Shield,
  Eye,
  MousePointer,
  MessageSquare,
  LogIn,
  RefreshCw,
  Award,
  Zap,
  Info,
  AlertTriangle
} from "lucide-react";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState(null);

  // Calculate user growth metrics
  const userMetrics = {
    totalUsers: users.length + 245,
    newUsersToday: 12,
    newUsersWeek: 45,
    newUsersMonth: 178,
    activeUsers: users.filter(u => u.status === 'active').length + 180,
    inactiveUsers: users.filter(u => u.status === 'inactive').length + 45,
    churnRate: 8.5,
    retentionRate: 91.5,
    reengagementRate: 15.2,
    avgSessionDuration: '12m 34s',
    dailyActiveUsers: 145,
    weeklyActiveUsers: 220,
    monthlyActiveUsers: 248
  };

  // Group success metrics
  const groupMetrics = {
    totalGroups: groups.length + 47,
    activeGroups: 35,
    completedGroups: 12,
    successRate: 78.5,
    avgCompletionTime: '3.2 months',
    avgGroupSize: 24,
    totalMembers: 576,
    disputeRate: 4.2,
    onTimePaymentRate: 92.3,
    cycleCompletionRate: 85.7
  };

  // Financial metrics
  const financialMetrics = {
    totalVolume: '$12,450,000',
    dailyVolume: '$450,000',
    weeklyVolume: '$2,100,000',
    monthlyVolume: '$8,750,000',
    avgTransactionSize: '$65,000',
    totalTransactions: transactions.length + 1250,
    successfulTransactions: 1180,
    failedTransactions: 45,
    pendingTransactions: 25,
    transactionSuccessRate: 94.4
  };

  // Revenue metrics
  const revenueMetrics = {
    totalRevenue: '$45,600',
    monthlyRevenue: '$12,400',
    weeklyRevenue: '$2,850',
    dailyRevenue: '$408',
    transactionFees: '$28,500',
    subscriptionFees: '$12,600',
    lateFees: '$4,500',
    avgRevenuePerUser: '$185',
    revenueGrowth: 23.5,
    targetRevenue: '$50,000',
    targetProgress: 91.2
  };

  // Engagement metrics
  const engagementMetrics = {
    avgLoginsPerDay: 3.2,
    avgSessionsPerUser: 8.5,
    groupJoinRate: 65.3,
    messageResponseRate: 78.2,
    featureAdoption: {
      groups: 85,
      transactions: 92,
      messages: 67,
      settings: 45
    },
    platformHealthScore: 87
  };

  // Geographic data
  const geographicData = [
    { city: 'Lagos', users: 125, groups: 15, volume: '$3,200,000', growth: 12.5 },
    { city: 'Abuja', users: 98, groups: 12, volume: '$2,800,000', growth: 18.2 },
    { city: 'Kano', users: 76, groups: 8, volume: '$1,950,000', growth: 8.7 },
    { city: 'Port Harcourt', users: 54, groups: 6, volume: '$1,420,000', growth: 15.3 },
    { city: 'Ibadan', users: 42, groups: 5, volume: '$980,000', growth: 22.1 },
  ];

  // Admin activity logs
  const adminActivity = [
    { id: 1, admin: 'Super Admin', action: 'Approved payout', target: 'Payout #p-4001', time: '2 mins ago', type: 'financial' },
    { id: 2, admin: 'Admin John', action: 'Suspended user', target: 'User #u-1003', time: '15 mins ago', type: 'user' },
    { id: 3, admin: 'Admin Sarah', action: 'Created group', target: 'New Savers Group', time: '1 hour ago', type: 'group' },
    { id: 4, admin: 'Super Admin', action: 'Resolved dispute', target: 'Dispute #d-234', time: '2 hours ago', type: 'dispute' },
    { id: 5, admin: 'Admin Mike', action: 'Updated settings', target: 'System Settings', time: '3 hours ago', type: 'system' },
  ];

  // Mock chart data for user growth
  const userGrowthData = [
    { month: 'Jan', users: 120, active: 95 },
    { month: 'Feb', users: 145, active: 118 },
    { month: 'Mar', users: 178, active: 142 },
    { month: 'Apr', users: 210, active: 175 },
    { month: 'May', users: 248, active: 210 },
    { month: 'Jun', users: 285, active: 245 },
    { month: 'Jul', users: 320, active: 280 },
    { month: 'Aug', users: 365, active: 325 },
  ];

  // Mock chart data for revenue
  const revenueData = [
    { month: 'Jan', revenue: 5200, fees: 3200, subscriptions: 2000 },
    { month: 'Feb', revenue: 6100, fees: 3800, subscriptions: 2300 },
    { month: 'Mar', revenue: 7400, fees: 4500, subscriptions: 2900 },
    { month: 'Apr', revenue: 8200, fees: 5000, subscriptions: 3200 },
    { month: 'May', revenue: 9500, fees: 5800, subscriptions: 3700 },
    { month: 'Jun', revenue: 10200, fees: 6200, subscriptions: 4000 },
    { month: 'Jul', revenue: 11400, fees: 6900, subscriptions: 4500 },
    { month: 'Aug', revenue: 12400, fees: 7400, subscriptions: 5000 },
  ];

  const getGrowthColor = (value) => {
    if (value > 0) return 'text-emerald-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-600" strokeWidth={1.5} />;
    return <ArrowUpRight className="w-4 h-4 text-gray-600" strokeWidth={1.5} />;
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px]">
      <PageHeader title="Analytics Dashboard" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">

        {/* Date Range Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-[#00000008] bg-white/50 text-sm font-light focus:outline-none focus:border-[#00000020]"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors flex items-center gap-2 text-sm font-light">
              <Filter className="w-4 h-4" strokeWidth={1.5} />
              Filters
            </button>
          </div>
          <button className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors flex items-center gap-2 text-sm font-light">
            <Download className="w-4 h-4" strokeWidth={1.5} />
            Export Report
          </button>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              <div className="flex items-center gap-1">
                {getGrowthIcon(12.5)}
                <span className={`text-xs ${getGrowthColor(12.5)}`}>+12.5%</span>
              </div>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{userMetrics.totalUsers}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Users</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <span className="text-xs text-emerald-600">{groupMetrics.successRate}%</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{groupMetrics.successRate}%</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Group Success Rate</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
              <div className="flex items-center gap-1">
                {getGrowthIcon(23.5)}
                <span className={`text-xs ${getGrowthColor(23.5)}`}>+23.5%</span>
              </div>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{financialMetrics.monthlyVolume}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Monthly Volume</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              <div className="flex items-center gap-1">
                {getGrowthIcon(revenueMetrics.revenueGrowth)}
                <span className={`text-xs ${getGrowthColor(revenueMetrics.revenueGrowth)}`}>+{revenueMetrics.revenueGrowth}%</span>
              </div>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{revenueMetrics.monthlyRevenue}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Monthly Revenue</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#00000008] mb-6">
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
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'users'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            User Analytics
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'groups'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Group Analytics
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'financial'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Financial Analytics
          </button>
          <button
            onClick={() => setActiveTab('engagement')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'engagement'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Engagement
          </button>
          <button
            onClick={() => setActiveTab('geographic')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'geographic'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Geographic
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'admin'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Admin Activity
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Platform Health Score */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Platform Health Score</h3>
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="#00000008" strokeWidth="16" fill="none" />
                      <circle
                        cx="64" cy="64" r="56"
                        stroke="url(#gradient)"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${engagementMetrics.platformHealthScore * 3.51} 351.86`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-light text-[#1E1E1E]">{engagementMetrics.platformHealthScore}</p>
                        <p className="text-xs text-[#999999]">Score</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-[#999999] mb-1">User Retention</p>
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-[#1E1E1E]">{userMetrics.retentionRate}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#999999] mb-1">Transaction Success</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-[#1E1E1E]">{financialMetrics.transactionSuccessRate}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#999999] mb-1">Group Success</p>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-[#1E1E1E]">{groupMetrics.successRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">User Growth Trend</h3>
                  <div className="space-y-3">
                    {userGrowthData.slice(-4).map((data, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">{data.month}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#1E1E1E]">{data.users}</span>
                          <div className="w-24 h-1 bg-[#00000008]">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                              style={{ width: `${(data.users / 365) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Revenue Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Transaction Fees</span>
                      <span className="text-sm font-medium text-emerald-600">{revenueMetrics.transactionFees}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Subscriptions</span>
                      <span className="text-sm font-medium text-blue-600">{revenueMetrics.subscriptionFees}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Late Fees</span>
                      <span className="text-sm font-medium text-amber-600">{revenueMetrics.lateFees}</span>
                    </div>
                    <div className="pt-3 border-t border-[#00000008] flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1E1E1E]">Total</span>
                      <span className="text-sm font-medium text-[#1E1E1E]">{revenueMetrics.totalRevenue}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Top Locations</h3>
                  <div className="space-y-3">
                    {geographicData.slice(0, 4).map((location) => (
                      <div key={location.city} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-[#999999]" strokeWidth={1.5} />
                          <span className="text-sm font-light text-[#1E1E1E]">{location.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#1E1E1E]">{location.users}</span>
                          <span className="text-xs text-emerald-600">+{location.growth}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* User Analytics Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <UserPlus className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{userMetrics.newUsersMonth}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">New This Month</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{userMetrics.dailyActiveUsers}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Daily Active</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <Percent className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{userMetrics.retentionRate}%</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Retention Rate</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <UserMinus className="w-5 h-5 text-red-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{userMetrics.churnRate}%</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Churn Rate</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">User Growth & Retention</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-[#999999] mb-3">Growth Metrics</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Total Users</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{userMetrics.totalUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Active Users</span>
                        <span className="text-sm font-medium text-emerald-600">{userMetrics.activeUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Inactive Users</span>
                        <span className="text-sm font-medium text-amber-600">{userMetrics.inactiveUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Re-engagement Rate</span>
                        <span className="text-sm font-medium text-blue-600">{userMetrics.reengagementRate}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#999999] mb-3">Activity Metrics</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Daily Active Users</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{userMetrics.dailyActiveUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Weekly Active Users</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{userMetrics.weeklyActiveUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Monthly Active Users</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{userMetrics.monthlyActiveUsers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Avg Session Duration</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{userMetrics.avgSessionDuration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Group Analytics Tab */}
          {activeTab === 'groups' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{groupMetrics.totalGroups}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Groups</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{groupMetrics.successRate}%</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Success Rate</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{groupMetrics.avgCompletionTime}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Avg Completion</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{groupMetrics.disputeRate}%</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Dispute Rate</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Group Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-[#999999] mb-3">Success Metrics</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Active Groups</span>
                        <span className="text-sm font-medium text-emerald-600">{groupMetrics.activeGroups}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Completed Groups</span>
                        <span className="text-sm font-medium text-blue-600">{groupMetrics.completedGroups}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Cycle Completion Rate</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{groupMetrics.cycleCompletionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">On-Time Payment Rate</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{groupMetrics.onTimePaymentRate}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#999999] mb-3">Group Statistics</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Average Group Size</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{groupMetrics.avgGroupSize}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Total Members</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{groupMetrics.totalMembers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Dispute Rate</span>
                        <span className="text-sm font-medium text-amber-600">{groupMetrics.disputeRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Avg Completion Time</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{groupMetrics.avgCompletionTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Analytics Tab */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{financialMetrics.totalVolume}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Volume</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <Receipt className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{financialMetrics.totalTransactions}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Transactions</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <Coins className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{revenueMetrics.totalRevenue}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Revenue</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{revenueMetrics.avgRevenuePerUser}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Revenue/User</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Financial Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-[#999999] mb-3">Transaction Volumes</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Daily Volume</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{financialMetrics.dailyVolume}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Weekly Volume</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{financialMetrics.weeklyVolume}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Monthly Volume</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{financialMetrics.monthlyVolume}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Avg Transaction Size</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{financialMetrics.avgTransactionSize}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#999999] mb-3">Revenue Metrics</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Daily Revenue</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{revenueMetrics.dailyRevenue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Weekly Revenue</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{revenueMetrics.weeklyRevenue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Monthly Revenue</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{revenueMetrics.monthlyRevenue}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[#1E1E1E]">Revenue Growth</span>
                        <span className="text-sm font-medium text-emerald-600">+{revenueMetrics.revenueGrowth}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#00000008]">
                  <p className="text-xs text-[#999999] mb-3">Revenue Target Progress</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-3 bg-[#00000008]">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-emerald-600"
                          style={{ width: `${revenueMetrics.targetProgress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#1E1E1E]">{revenueMetrics.targetProgress}%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#999999]">Current: {revenueMetrics.totalRevenue}</span>
                    <span className="text-xs text-[#999999]">Target: {revenueMetrics.targetRevenue}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Engagement Tab */}
          {activeTab === 'engagement' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <LogIn className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{engagementMetrics.avgLoginsPerDay}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Avg Logins/Day</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <MousePointer className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{engagementMetrics.avgSessionsPerUser}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Sessions/User</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{engagementMetrics.groupJoinRate}%</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Group Join Rate</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <MessageSquare className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{engagementMetrics.messageResponseRate}%</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Response Rate</p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Feature Adoption</h3>
                <div className="space-y-4">
                  {Object.entries(engagementMetrics.featureAdoption).map(([feature, adoption]) => (
                    <div key={feature}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-light text-[#1E1E1E] capitalize">{feature}</span>
                        <span className="text-sm font-medium text-[#1E1E1E]">{adoption}%</span>
                      </div>
                      <div className="h-2 bg-[#00000008]">
                        <div
                          className={`h-full ${
                            adoption >= 80 ? 'bg-emerald-500' :
                            adoption >= 60 ? 'bg-blue-500' :
                            adoption >= 40 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${adoption}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Geographic Tab */}
          {activeTab === 'geographic' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Geographic Distribution</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#00000008]">
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">City</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Users</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Groups</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Volume</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {geographicData.map((location) => (
                        <tr key={location.city} className="border-b border-[#00000008] hover:bg-[#FAFAFA]">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              <span className="text-sm font-light text-[#1E1E1E]">{location.city}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-medium text-[#1E1E1E]">{location.users}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E]">{location.groups}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-medium text-emerald-600">{location.volume}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getGrowthIcon(location.growth)}
                              <span className={`text-sm font-medium ${getGrowthColor(location.growth)}`}>
                                +{location.growth}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Top Performing Regions</h3>
                  <div className="space-y-3">
                    {geographicData.slice(0, 3).map((location) => (
                      <div key={location.city} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                          <span className="text-sm font-light text-[#1E1E1E]">{location.city}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-emerald-600">{location.volume}</p>
                          <p className="text-xs text-[#999999]">{location.users} users</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Growth Leaders</h3>
                  <div className="space-y-3">
                    {geographicData
                      .sort((a, b) => b.growth - a.growth)
                      .slice(0, 3)
                      .map((location) => (
                        <div key={location.city} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                            <span className="text-sm font-light text-[#1E1E1E]">{location.city}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getGrowthIcon(location.growth)}
                            <span className={`text-sm font-medium ${getGrowthColor(location.growth)}`}>
                              +{location.growth}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Activity Tab */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Admin Activity Log</h3>
                <div className="space-y-3">
                  {adminActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border-l-2 border-transparent hover:border-blue-500 hover:bg-[#FAFAFA] transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <Shield className={`w-4 h-4 ${
                          activity.type === 'financial' ? 'text-emerald-600' :
                          activity.type === 'user' ? 'text-blue-600' :
                          activity.type === 'group' ? 'text-violet-600' :
                          activity.type === 'dispute' ? 'text-amber-600' :
                          'text-gray-600'
                        }`} strokeWidth={1.5} />
                        <div>
                          <p className="text-sm font-light text-[#1E1E1E]">
                            <span className="font-medium">{activity.admin}</span> {activity.action}
                          </p>
                          <p className="text-xs text-[#999999]">
                            {activity.target} • {activity.time}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Admin Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Total Actions Today</span>
                      <span className="text-sm font-medium text-[#1E1E1E]">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Active Admins</span>
                      <span className="text-sm font-medium text-emerald-600">4</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Avg Response Time</span>
                      <span className="text-sm font-medium text-[#1E1E1E]">2.3 mins</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Action Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">User Management</span>
                      <span className="text-sm font-medium text-[#1E1E1E]">18</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Financial Actions</span>
                      <span className="text-sm font-medium text-[#1E1E1E]">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Group Management</span>
                      <span className="text-sm font-medium text-[#1E1E1E]">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">System Settings</span>
                      <span className="text-sm font-medium text-[#1E1E1E]">9</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Top Admins</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Super Admin</span>
                      <span className="text-sm font-medium text-emerald-600">24 actions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Admin John</span>
                      <span className="text-sm font-medium text-blue-600">12 actions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-light text-[#1E1E1E]">Admin Sarah</span>
                      <span className="text-sm font-medium text-violet-600">8 actions</span>
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
