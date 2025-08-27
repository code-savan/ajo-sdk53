"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "../../components/ui";
import {
  Settings,
  Globe,
  Clock,
  DollarSign,
  Flag,
  Activity,
  Database,
  Shield,
  HardDrive,
  RefreshCw,
  Server,
  Code,
  GitBranch,
  Monitor,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Save,
  RotateCcw,
  Play,
  Pause,
  Download,
  Upload,
  Trash2,
  Copy,
  ExternalLink,
  Bell,
  Mail,
  Smartphone,
  Users,
  CreditCard,
  Calendar,
  MapPin,
  Gauge,
  BarChart3,
  TrendingUp,
  Cpu,
  MemoryStick,
  Network
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingEnvVar, setEditingEnvVar] = useState(null);
  const [showAddFeatureFlag, setShowAddFeatureFlag] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Demo data - would come from API in real implementation
  const systemStats = [
    { title: 'System Uptime', value: '99.9%', change: '+0.1%', icon: Monitor, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
    { title: 'API Response Time', value: '120ms', change: '-15ms', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
    { title: 'Active Features', value: '24/28', change: '+2', icon: Flag, color: 'text-violet-600', bg: 'bg-violet-50/50', border: 'border-violet-100' },
    { title: 'Last Backup', value: '2h ago', change: 'Success', icon: HardDrive, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100' }
  ];

  const appConfig = {
    general: {
      appName: 'AJO Savings Platform',
      timezone: 'Africa/Lagos',
      defaultCurrency: 'NGN',
      maintenanceMode: false,
      debugMode: false,
      environment: 'production'
    },
    contributions: {
      minContribution: 5000,
      maxContribution: 1000000,
      contributionWindow: 24,
      latePaymentGrace: 48,
      autoReminders: true
    },
    payouts: {
      defaultCycle: 'weekly',
      minWithdrawal: 1000,
      maxWithdrawal: 500000,
      processingFee: 100,
      instantPayouts: true
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorRequired: true,
      passwordExpiry: 90,
      ipWhitelisting: false
    },
    notifications: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      marketingEmails: true,
      systemAlerts: true
    }
  };

  const featureFlags = [
    { id: 'ff-001', name: 'group_chat', displayName: 'Group Chat Feature', enabled: true, environment: 'production', rollout: 100, description: 'Enable in-app messaging for group members' },
    { id: 'ff-002', name: 'biometric_auth', displayName: 'Biometric Authentication', enabled: true, environment: 'production', rollout: 85, description: 'Face ID and fingerprint authentication' },
    { id: 'ff-003', name: 'instant_payouts', displayName: 'Instant Payouts', enabled: false, environment: 'staging', rollout: 0, description: 'Real-time payout processing' },
    { id: 'ff-004', name: 'referral_system', displayName: 'Referral Program', enabled: true, environment: 'production', rollout: 100, description: 'User referral rewards system' },
    { id: 'ff-005', name: 'advanced_analytics', displayName: 'Advanced Analytics', enabled: false, environment: 'development', rollout: 10, description: 'Enhanced user analytics dashboard' }
  ];

  const environmentVariables = [
    { key: 'DATABASE_URL', value: 'postgresql://...****', category: 'Database', sensitive: true, lastModified: '2025-08-25' },
    { key: 'STRIPE_SECRET_KEY', value: 'sk_live_****', category: 'Payment', sensitive: true, lastModified: '2025-08-20' },
    { key: 'JWT_SECRET', value: '****', category: 'Authentication', sensitive: true, lastModified: '2025-08-15' },
    { key: 'FIREBASE_PROJECT_ID', value: 'ajo-app-prod', category: 'Notifications', sensitive: false, lastModified: '2025-08-10' },
    { key: 'API_RATE_LIMIT', value: '1000', category: 'Performance', sensitive: false, lastModified: '2025-08-27' },
    { key: 'MAINTENANCE_MODE', value: 'false', category: 'System', sensitive: false, lastModified: '2025-08-27' }
  ];

  const apiMetrics = {
    requests24h: 45672,
    requestsPerSecond: 12.3,
    errorRate: 0.02,
    avgResponseTime: 120,
    rateLimitHits: 34,
    uptime: 99.95
  };

  const systemMetrics = {
    cpuUsage: 35.2,
    memoryUsage: 68.7,
    diskUsage: 42.1,
    networkIn: 1.2,
    networkOut: 2.8,
    activeConnections: 156
  };

  const deploymentHistory = [
    { id: 'dep-001', version: 'v2.1.3', deployedBy: 'Admin', status: 'success', timestamp: '2025-08-27 08:30 AM', changes: ['Bug fixes', 'Performance improvements'] },
    { id: 'dep-002', version: 'v2.1.2', deployedBy: 'DevOps', status: 'success', timestamp: '2025-08-25 06:15 PM', changes: ['New group analytics', 'Security patches'] },
    { id: 'dep-003', version: 'v2.1.1', deployedBy: 'Admin', status: 'rolled-back', timestamp: '2025-08-23 02:45 PM', changes: ['Instant payout feature', 'UI updates'] },
    { id: 'dep-004', version: 'v2.1.0', deployedBy: 'DevOps', status: 'success', timestamp: '2025-08-20 11:20 AM', changes: ['Major feature release', 'Database migration'] }
  ];

  const backupStatus = [
    { type: 'Database', lastBackup: '2025-08-27 06:00 AM', status: 'success', size: '2.3GB', retention: '30 days' },
    { type: 'User Files', lastBackup: '2025-08-27 05:30 AM', status: 'success', size: '840MB', retention: '90 days' },
    { type: 'System Config', lastBackup: '2025-08-27 05:00 AM', status: 'success', size: '12MB', retention: '365 days' },
    { type: 'Analytics Data', lastBackup: '2025-08-26 11:45 PM', status: 'warning', size: '1.8GB', retention: '180 days' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100';
      case 'warning': return 'bg-amber-50/50 text-amber-600 border-amber-100';
      case 'error': case 'rolled-back': return 'bg-red-50/50 text-red-600 border-red-100';
      case 'running': case 'enabled': return 'bg-blue-50/50 text-blue-600 border-blue-100';
      case 'disabled': return 'bg-gray-50/50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50/50 text-gray-600 border-gray-100';
    }
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
      <PageHeader title="Settings" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">

        {/* System Status Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-light text-[#1E1E1E]">System Configuration</h2>
              <p className="text-[#999999] text-xs mt-1 font-light">
                Manage app settings, monitor performance, and configure system parameters
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#1E1E1E] text-sm font-light">
                {formatTime(currentTime)} WAT
              </p>
              <p className="text-[#999999] text-xs mt-1">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStats.map((stat, index) => {
              const Icon = stat.icon;
              const isPositive = !stat.change.startsWith('-') && stat.change !== 'Success';
              return (
                <div
                  key={stat.title}
                  className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008] hover:border-[#00000020] transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 ${stat.bg} ${stat.border} border flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div className="flex items-center gap-1">
                      {stat.change !== 'Success' ? (
                        isPositive ? (
                          <ArrowUp className="w-3 h-3 text-emerald-500" strokeWidth={2} />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-red-500" strokeWidth={2} />
                        )
                      ) : (
                        <CheckCircle className="w-3 h-3 text-emerald-500" strokeWidth={2} />
                      )}
                      <span className={`text-xs font-medium ${
                        stat.change === 'Success' ? 'text-emerald-500' :
                        isPositive ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-light text-[#1E1E1E] tracking-tight">
                      {stat.value}
                    </p>
                    <h3 className="text-[#999999] text-xs font-normal uppercase tracking-wider">
                      {stat.title}
                    </h3>
                  </div>
                  <div className={`h-0.5 ${stat.bg} mt-4 w-0 group-hover:w-full transition-all duration-500`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-6 border-b border-[#00000008] overflow-x-auto">
          {[
            { key: 'overview', label: 'System Overview' },
            { key: 'config', label: 'App Configuration' },
            { key: 'features', label: 'Feature Flags' },
            { key: 'api', label: 'API & Performance' },
            { key: 'database', label: 'Database & Backups' },
            { key: 'environment', label: 'Environment Variables' },
            { key: 'deployments', label: 'Deployments' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 text-sm font-light transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                  : 'text-[#999999] hover:text-[#1E1E1E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* System Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('config')}
                  className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-left"
                >
                  <Settings className="w-5 h-5 mb-2 text-blue-500" strokeWidth={1.5} />
                  <span className="text-sm font-light text-[#1E1E1E] block">App Settings</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-left"
                >
                  <Flag className="w-5 h-5 mb-2 text-violet-500" strokeWidth={1.5} />
                  <span className="text-sm font-light text-[#1E1E1E] block">Feature Flags</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => setActiveTab('api')}
                  className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-left"
                >
                  <Activity className="w-5 h-5 mb-2 text-emerald-500" strokeWidth={1.5} />
                  <span className="text-sm font-light text-[#1E1E1E] block">Performance</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => setActiveTab('database')}
                  className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-left"
                >
                  <Database className="w-5 h-5 mb-2 text-amber-500" strokeWidth={1.5} />
                  <span className="text-sm font-light text-[#1E1E1E] block">Database</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
                <div className="flex items-center justify-between mb-6 border-b border-[#00000008] pb-3">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Performance Metrics</h3>
                  <Monitor className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                      <span className="text-sm font-light text-[#1E1E1E]">CPU Usage</span>
                    </div>
                    <span className="text-sm font-medium text-[#1E1E1E]">{systemMetrics.cpuUsage}%</span>
                  </div>
                  <div className="h-2 bg-[#00000008] rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${systemMetrics.cpuUsage}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MemoryStick className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                      <span className="text-sm font-light text-[#1E1E1E]">Memory Usage</span>
                    </div>
                    <span className="text-sm font-medium text-[#1E1E1E]">{systemMetrics.memoryUsage}%</span>
                  </div>
                  <div className="h-2 bg-[#00000008] rounded-full">
                    <div className="h-2 bg-emerald-600 rounded-full" style={{ width: `${systemMetrics.memoryUsage}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                      <span className="text-sm font-light text-[#1E1E1E]">Disk Usage</span>
                    </div>
                    <span className="text-sm font-medium text-[#1E1E1E]">{systemMetrics.diskUsage}%</span>
                  </div>
                  <div className="h-2 bg-[#00000008] rounded-full">
                    <div className="h-2 bg-amber-600 rounded-full" style={{ width: `${systemMetrics.diskUsage}%` }} />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
                <div className="flex items-center justify-between mb-6 border-b border-[#00000008] pb-3">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Recent System Activity</h3>
                  <Activity className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                </div>
                <div className="space-y-3">
                  {[
                    { action: 'Database backup completed', time: '2h ago', status: 'success' },
                    { action: 'Feature flag updated: group_chat', time: '4h ago', status: 'success' },
                    { action: 'API rate limit threshold reached', time: '6h ago', status: 'warning' },
                    { action: 'System deployment v2.1.3', time: '8h ago', status: 'success' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border-l-2 border-transparent hover:border-blue-500 hover:bg-[#FAFAFA] transition-all duration-200">
                      <div>
                        <p className="text-sm font-light text-[#1E1E1E]">{activity.action}</p>
                        <p className="text-xs text-[#999999]">{activity.time}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* App Configuration Tab */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            {/* General Settings */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">General Configuration</h3>
                <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" strokeWidth={1.5} />
                  Save Changes
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Application Name</label>
                    <input
                      type="text"
                      defaultValue={appConfig.general.appName}
                      className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Default Timezone</label>
                    <select className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors">
                      <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Default Currency</label>
                    <select className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors">
                      <option value="NGN">Nigerian Naira (NGN)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="GBP">British Pound (GBP)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-[#00000008]">
                    <div>
                      <p className="text-sm font-light text-[#1E1E1E]">Maintenance Mode</p>
                      <p className="text-xs text-[#999999]">Temporarily disable app access</p>
                    </div>
                    <button className={`w-12 h-6 rounded-full transition-colors ${
                      appConfig.general.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        appConfig.general.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-[#00000008]">
                    <div>
                      <p className="text-sm font-light text-[#1E1E1E]">Debug Mode</p>
                      <p className="text-xs text-[#999999]">Enable detailed error logging</p>
                    </div>
                    <button className={`w-12 h-6 rounded-full transition-colors ${
                      appConfig.general.debugMode ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        appConfig.general.debugMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contribution Settings */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-6">Contribution Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Min Contribution (NGN)</label>
                  <input
                    type="number"
                    defaultValue={appConfig.contributions.minContribution}
                    className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Max Contribution (NGN)</label>
                  <input
                    type="number"
                    defaultValue={appConfig.contributions.maxContribution}
                    className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Contribution Window (hrs)</label>
                  <input
                    type="number"
                    defaultValue={appConfig.contributions.contributionWindow}
                    className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Late Payment Grace (hrs)</label>
                  <input
                    type="number"
                    defaultValue={appConfig.contributions.latePaymentGrace}
                    className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Payout Policies */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-6">Payout Policies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Default Cycle</label>
                  <select className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Min Withdrawal (NGN)</label>
                  <input
                    type="number"
                    defaultValue={appConfig.payouts.minWithdrawal}
                    className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Processing Fee (NGN)</label>
                  <input
                    type="number"
                    defaultValue={appConfig.payouts.processingFee}
                    className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Flags Tab */}
        {activeTab === 'features' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
            <div className="p-4 border-b border-[#00000008]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                    <input
                      type="text"
                      placeholder="Search feature flags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowAddFeatureFlag(true)}
                  className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                  Add Flag
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#00000008]">
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Feature Name</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Environment</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Rollout %</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Description</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {featureFlags.map((flag) => (
                    <tr key={flag.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA] transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-light text-[#1E1E1E]">{flag.displayName}</p>
                          <p className="text-xs text-[#999999] font-mono">{flag.name}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className={`w-8 h-4 rounded-full transition-colors ${
                            flag.enabled ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}>
                            <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${
                              flag.enabled ? 'translate-x-4' : 'translate-x-0.5'
                            }`} />
                          </button>
                          <span className={`text-xs font-light ${
                            flag.enabled ? 'text-emerald-600' : 'text-gray-600'
                          }`}>
                            {flag.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${
                          flag.environment === 'production' ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' :
                          flag.environment === 'staging' ? 'bg-amber-50/50 text-amber-600 border-amber-100' :
                          'bg-blue-50/50 text-blue-600 border-blue-100'
                        }`}>
                          {flag.environment}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[#00000008] rounded-full">
                            <div
                              className="h-2 bg-blue-600 rounded-full"
                              style={{ width: `${flag.rollout}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#999999]">{flag.rollout}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-[#999999] max-w-xs truncate">{flag.description}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                            <Edit className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                          </button>
                          <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                            <Copy className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                          </button>
                          <button className="p-1 hover:bg-[#FAFAFA] transition-colors text-red-500">
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* API & Performance Tab */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            {/* API Metrics */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">API Performance Metrics</h3>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors">
                    Configure Rate Limits
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-[#00000008]">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999] uppercase tracking-wider">24h Requests</span>
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{apiMetrics.requests24h.toLocaleString()}</p>
                  <p className="text-xs text-emerald-600 mt-1">+12% vs yesterday</p>
                </div>
                <div className="p-4 border border-[#00000008]">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999] uppercase tracking-wider">Requests/sec</span>
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{apiMetrics.requestsPerSecond}</p>
                  <p className="text-xs text-emerald-600 mt-1">Normal load</p>
                </div>
                <div className="p-4 border border-[#00000008]">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999] uppercase tracking-wider">Error Rate</span>
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{(apiMetrics.errorRate * 100).toFixed(2)}%</p>
                  <p className="text-xs text-emerald-600 mt-1">Below threshold</p>
                </div>
                <div className="p-4 border border-[#00000008]">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-violet-600" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999] uppercase tracking-wider">Avg Response</span>
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{apiMetrics.avgResponseTime}ms</p>
                  <p className="text-xs text-emerald-600 mt-1">-15ms vs last hour</p>
                </div>
                <div className="p-4 border border-[#00000008]">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999] uppercase tracking-wider">Rate Limit Hits</span>
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{apiMetrics.rateLimitHits}</p>
                  <p className="text-xs text-amber-600 mt-1">Last 24 hours</p>
                </div>
                <div className="p-4 border border-[#00000008]">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999] uppercase tracking-wider">Uptime</span>
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{apiMetrics.uptime}%</p>
                  <p className="text-xs text-emerald-600 mt-1">This month</p>
                </div>
              </div>
            </div>

            {/* Rate Limiting Configuration */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-6">Rate Limiting Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Global Rate Limit (requests/minute)</label>
                    <input
                      type="number"
                      defaultValue="1000"
                      className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Per User Limit (requests/minute)</label>
                    <input
                      type="number"
                      defaultValue="100"
                      className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">API Key Rate Limit (requests/hour)</label>
                    <input
                      type="number"
                      defaultValue="5000"
                      className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Burst Limit</label>
                    <input
                      type="number"
                      defaultValue="50"
                      className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Database & Backups Tab */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            {/* Database Status */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Database Status</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-blue-50 text-blue-600 text-xs hover:bg-blue-100 transition-colors">
                    Run Maintenance
                  </button>
                  <button className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs hover:bg-emerald-100 transition-colors">
                    Backup Now
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-[#00000008]">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999] uppercase tracking-wider">Connection Status</span>
                  </div>
                  <p className="text-lg font-light text-emerald-600 mb-1">Connected</p>
                  <p className="text-xs text-[#999999]">Pool: 15/20 connections</p>
                </div>
                <div className="p-4 border border-[#00000008]">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999] uppercase tracking-wider">Query Performance</span>
                  </div>
                  <p className="text-lg font-light text-[#1E1E1E] mb-1">45ms avg</p>
                  <p className="text-xs text-emerald-600">Excellent performance</p>
                </div>
                <div className="p-4 border border-[#00000008]">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="w-4 h-4 text-violet-600" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999] uppercase tracking-wider">Storage Used</span>
                  </div>
                  <p className="text-lg font-light text-[#1E1E1E] mb-1">2.3GB</p>
                  <p className="text-xs text-[#999999]">42% of allocated space</p>
                </div>
              </div>
            </div>

            {/* Backup Management */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Backup & Recovery</h3>
                <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors">
                  Schedule Backup
                </button>
              </div>
              <div className="space-y-3">
                {backupStatus.map((backup, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        backup.status === 'success' ? 'bg-emerald-500' :
                        backup.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="text-sm font-light text-[#1E1E1E]">{backup.type}</p>
                        <p className="text-xs text-[#999999]">{backup.lastBackup} • {backup.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#999999]">Retention: {backup.retention}</span>
                      <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(backup.status)}`}>
                        {backup.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                          <Download className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                        </button>
                        <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                          <RefreshCw className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Environment Variables Tab */}
        {activeTab === 'environment' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
            <div className="p-4 border-b border-[#00000008]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                    <input
                      type="text"
                      placeholder="Search environment variables..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" strokeWidth={1.5} />
                    Add Variable
                  </button>
                  <button className="px-4 py-2 bg-amber-50 text-amber-600 text-sm font-light hover:bg-amber-100 transition-colors">
                    Restart Services
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#00000008]">
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Variable Name</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Value</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Category</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Last Modified</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {environmentVariables.map((envVar, index) => (
                    <tr key={index} className="border-b border-[#00000008] hover:bg-[#FAFAFA] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-[#1E1E1E]">{envVar.key}</span>
                          {envVar.sensitive && (
                            <Shield className="w-3 h-3 text-amber-600" strokeWidth={1.5} />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {editingEnvVar === envVar.key ? (
                          <input
                            type="text"
                            defaultValue={envVar.value}
                            className="w-full px-2 py-1 bg-[#FAFAFA] border border-[#00000008] text-sm font-mono focus:outline-none focus:border-[#00000020] transition-colors"
                          />
                        ) : (
                          <span className={`text-sm font-mono ${
                            envVar.sensitive ? 'text-[#999999]' : 'text-[#1E1E1E]'
                          }`}>
                            {envVar.value}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${
                          envVar.category === 'Database' ? 'bg-blue-50/50 text-blue-600 border-blue-100' :
                          envVar.category === 'Payment' ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' :
                          envVar.category === 'Authentication' ? 'bg-violet-50/50 text-violet-600 border-violet-100' :
                          'bg-gray-50/50 text-gray-600 border-gray-100'
                        }`}>
                          {envVar.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-[#999999]">{envVar.lastModified}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {editingEnvVar === envVar.key ? (
                            <>
                              <button
                                onClick={() => setEditingEnvVar(null)}
                                className="p-1 hover:bg-[#FAFAFA] transition-colors"
                              >
                                <Save className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                              </button>
                              <button
                                onClick={() => setEditingEnvVar(null)}
                                className="p-1 hover:bg-[#FAFAFA] transition-colors"
                              >
                                <XCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingEnvVar(envVar.key)}
                                className="p-1 hover:bg-[#FAFAFA] transition-colors"
                              >
                                <Edit className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              </button>
                              <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                                <Copy className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              </button>
                              <button className="p-1 hover:bg-[#FAFAFA] transition-colors text-red-500">
                                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Deployments Tab */}
        {activeTab === 'deployments' && (
          <div className="space-y-6">
            {/* Deployment Status */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Deployment Management</h3>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-light hover:bg-blue-100 transition-colors">
                    View Logs
                  </button>
                  <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors">
                    Deploy New Version
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 border border-[#00000008]">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999] uppercase tracking-wider">Current Version</span>
                  </div>
                  <p className="text-lg font-light text-[#1E1E1E] mb-1">v2.1.3</p>
                  <p className="text-xs text-emerald-600">Deployed 8h ago</p>
                </div>
                <div className="p-4 border border-[#00000008]">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999] uppercase tracking-wider">Deployment Status</span>
                  </div>
                  <p className="text-lg font-light text-emerald-600 mb-1">Stable</p>
                  <p className="text-xs text-[#999999]">All services running</p>
                </div>
                <div className="p-4 border border-[#00000008]">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-violet-600" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999] uppercase tracking-wider">Next Scheduled</span>
                  </div>
                  <p className="text-lg font-light text-[#1E1E1E] mb-1">v2.1.4</p>
                  <p className="text-xs text-[#999999]">Tomorrow 3:00 AM</p>
                </div>
              </div>
            </div>

            {/* Deployment History */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-6">Deployment History</h3>
              <div className="space-y-4">
                {deploymentHistory.map((deployment) => (
                  <div key={deployment.id} className="flex items-start justify-between p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        deployment.status === 'success' ? 'bg-emerald-500' :
                        deployment.status === 'rolled-back' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-sm font-light text-[#1E1E1E]">{deployment.version}</h4>
                          <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(deployment.status)}`}>
                            {deployment.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-[#999999] mb-2">
                          Deployed by {deployment.deployedBy} • {deployment.timestamp}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {deployment.changes.map((change, index) => (
                            <span key={index} className="text-[10px] px-2 py-1 bg-[#FAFAFA] text-[#999999] border border-[#00000008]">
                              {change}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                        <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                      </button>
                      {deployment.status === 'success' && (
                        <button className="px-3 py-1 bg-amber-50 text-amber-600 text-xs hover:bg-amber-100 transition-colors">
                          Rollback
                        </button>
                      )}
                      <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                        <ExternalLink className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
