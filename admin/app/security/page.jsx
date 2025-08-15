"use client";
import { useState } from "react";
import { PageHeader } from "../../components/ui";
import { users, transactions } from "../../data/adminContent";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  AlertTriangle,
  AlertCircle,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  UserX,
  UserCheck,
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  MapPin,
  Globe,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  Key,
  KeyRound,
  FileWarning,
  FileCheck,
  Database,
  DatabaseBackup,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Settings,
  Bell,
  BellOff,
  CheckCircle,
  XCircle,
  Info,
  Clock,
  Calendar,
  User,
  Users,
  Ban,
  Zap,
  AlertOctagon,
  FileText,
  Mail,
  MessageSquare,
  ExternalLink,
  Copy,
  MoreVertical
} from "lucide-react";

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Mock data for fraud alerts
  const fraudAlerts = [
    { id: 1, type: 'payment', severity: 'high', user: 'User #u-1045', description: 'Multiple failed payment attempts from different cards', amount: '₦250,000', time: '10 mins ago', status: 'investigating' },
    { id: 2, type: 'pattern', severity: 'medium', user: 'User #u-2031', description: 'Unusual transaction pattern detected', amount: '₦180,000', time: '25 mins ago', status: 'flagged' },
    { id: 3, type: 'velocity', severity: 'high', user: 'User #u-3012', description: 'High velocity transactions in short time', amount: '₦450,000', time: '1 hour ago', status: 'blocked' },
    { id: 4, type: 'location', severity: 'low', user: 'User #u-4001', description: 'Login from new geographic location', amount: '-', time: '2 hours ago', status: 'monitoring' },
  ];
  
  // Mock data for suspicious activities
  const suspiciousActivities = [
    { id: 1, activity: 'Multiple Login Attempts', ip: '192.168.1.45', location: 'Lagos, Nigeria', device: 'Chrome/Windows', time: '5 mins ago', status: 'blocked', riskScore: 85 },
    { id: 2, activity: 'Rapid Account Changes', ip: '10.0.0.12', location: 'Abuja, Nigeria', device: 'Safari/iOS', time: '15 mins ago', status: 'monitoring', riskScore: 65 },
    { id: 3, activity: 'Unusual IP Access', ip: '45.23.108.91', location: 'Unknown', device: 'Firefox/Linux', time: '30 mins ago', status: 'flagged', riskScore: 75 },
    { id: 4, activity: 'Group Dispute Spike', ip: '172.16.0.5', location: 'Kano, Nigeria', device: 'Chrome/Android', time: '1 hour ago', status: 'investigating', riskScore: 70 },
  ];
  
  // Mock data for AML compliance
  const amlAlerts = [
    { id: 1, type: 'Large Transaction', amount: '₦5,000,000', parties: 'User #u-1002 → User #u-2003', risk: 'high', status: 'under_review', reportStatus: 'pending', time: '2 hours ago' },
    { id: 2, type: 'Structured Transactions', amount: '₦2,400,000', parties: 'Multiple Users', risk: 'medium', status: 'flagged', reportStatus: 'not_required', time: '4 hours ago' },
    { id: 3, type: 'Rapid Fund Movement', amount: '₦1,800,000', parties: 'User #u-3001 → External', risk: 'high', status: 'reported', reportStatus: 'submitted', time: '1 day ago' },
  ];
  
  // Mock data for security audits
  const securityAudits = [
    { id: 1, audit: 'Data Encryption Check', lastRun: '2024-01-15 09:00', status: 'passed', issues: 0, nextRun: '2024-01-22 09:00' },
    { id: 2, audit: 'Access Control Review', lastRun: '2024-01-14 14:00', status: 'passed', issues: 2, nextRun: '2024-01-21 14:00' },
    { id: 3, audit: 'Database Security Scan', lastRun: '2024-01-13 03:00', status: 'warning', issues: 5, nextRun: '2024-01-20 03:00' },
    { id: 4, audit: 'API Security Test', lastRun: '2024-01-12 18:00', status: 'failed', issues: 12, nextRun: '2024-01-19 18:00' },
  ];
  
  // Mock data for data requests
  const dataRequests = [
    { id: 1, user: 'User #u-1234', type: 'export', requestDate: '2024-01-15', status: 'pending', dataSize: '45 MB', compliance: 'GDPR' },
    { id: 2, user: 'User #u-2345', type: 'deletion', requestDate: '2024-01-14', status: 'processing', dataSize: '120 MB', compliance: 'GDPR' },
    { id: 3, user: 'User #u-3456', type: 'export', requestDate: '2024-01-13', status: 'completed', dataSize: '78 MB', compliance: 'CCPA' },
    { id: 4, user: 'User #u-4567', type: 'deletion', requestDate: '2024-01-12', status: 'completed', dataSize: '234 MB', compliance: 'GDPR' },
  ];
  
  // Mock data for security incidents
  const securityIncidents = [
    { id: 1, incident: 'Brute Force Attack Detected', severity: 'critical', affectedUsers: 45, status: 'contained', responseTime: '2 mins', time: '3 hours ago' },
    { id: 2, incident: 'Suspicious API Activity', severity: 'high', affectedUsers: 12, status: 'investigating', responseTime: '5 mins', time: '6 hours ago' },
    { id: 3, incident: 'Failed Authentication Spike', severity: 'medium', affectedUsers: 89, status: 'resolved', responseTime: '8 mins', time: '1 day ago' },
  ];
  
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical':
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'investigating':
      case 'processing':
      case 'under_review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'blocked':
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'monitoring':
      case 'flagged':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'resolved':
      case 'completed':
      case 'passed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'contained':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  
  const getRiskScoreColor = (score) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-amber-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px]">
      <PageHeader title="Security Management" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">
        
        {/* Security Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <ShieldAlert className="w-5 h-5 text-red-600" strokeWidth={1.5} />
              <span className="text-xs text-red-600">4 Active</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">12</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Fraud Alerts</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              <span className="text-xs text-amber-600">7 High Risk</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">23</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Suspicious Activities</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <span className="text-xs text-emerald-600">92%</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">92%</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Security Score</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <AlertOctagon className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
              <span className="text-xs text-violet-600">1 Active</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">3</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Incidents Today</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-4 mb-6">
          <button className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-light">
            <AlertOctagon className="w-4 h-4" strokeWidth={1.5} />
            Emergency Lockdown
          </button>
          <button className="px-4 py-2 bg-[#1E1E1E] text-white hover:bg-[#2E2E2E] transition-colors flex items-center gap-2 text-sm font-light">
            <Shield className="w-4 h-4" strokeWidth={1.5} />
            Run Security Audit
          </button>
          <button className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors flex items-center gap-2 text-sm font-light">
            <FileText className="w-4 h-4" strokeWidth={1.5} />
            Generate Report
          </button>
          <button className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors flex items-center gap-2 text-sm font-light">
            <Settings className="w-4 h-4" strokeWidth={1.5} />
            Security Settings
          </button>
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
            onClick={() => setActiveTab('fraud')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'fraud' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Fraud Detection
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'monitoring' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Activity Monitoring
          </button>
          <button
            onClick={() => setActiveTab('aml')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'aml' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            AML Compliance
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'privacy' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Data Privacy
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'incidents' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Incident Response
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Threats */}
                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Recent Threats</h3>
                    <button className="text-xs text-blue-600 hover:text-blue-700">
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {fraudAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex items-start justify-between p-3 border border-[#00000008] hover:border-[#00000020] transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 ${getSeverityColor(alert.severity)}`}>
                            <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1E1E1E]">{alert.description}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-[#999999]">{alert.user}</span>
                              {alert.amount !== '-' && (
                                <span className="text-xs text-red-600">{alert.amount}</span>
                              )}
                              <span className="text-xs text-[#999999]">{alert.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Security Health */}
                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Security Health</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-light text-[#1E1E1E]">Fraud Prevention</span>
                        <span className="text-sm font-medium text-emerald-600">95%</span>
                      </div>
                      <div className="h-2 bg-[#00000008]">
                        <div className="h-full bg-emerald-500" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-light text-[#1E1E1E]">AML Compliance</span>
                        <span className="text-sm font-medium text-emerald-600">88%</span>
                      </div>
                      <div className="h-2 bg-[#00000008]">
                        <div className="h-full bg-emerald-500" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-light text-[#1E1E1E]">Data Encryption</span>
                        <span className="text-sm font-medium text-emerald-600">100%</span>
                      </div>
                      <div className="h-2 bg-[#00000008]">
                        <div className="h-full bg-emerald-500" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-light text-[#1E1E1E]">Access Control</span>
                        <span className="text-sm font-medium text-amber-600">72%</span>
                      </div>
                      <div className="h-2 bg-[#00000008]">
                        <div className="h-full bg-amber-500" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Activity Summary */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">24 Hour Activity Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-[#999999] mb-2">Login Attempts</p>
                    <p className="text-2xl font-light text-[#1E1E1E]">3,456</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-emerald-600">92% successful</span>
                      <span className="text-xs text-red-600">8% blocked</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#999999] mb-2">Transactions Screened</p>
                    <p className="text-2xl font-light text-[#1E1E1E]">1,234</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-emerald-600">98% clean</span>
                      <span className="text-xs text-amber-600">2% flagged</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#999999] mb-2">IP Addresses Blocked</p>
                    <p className="text-2xl font-light text-[#1E1E1E]">45</p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-3 h-3 text-red-600" strokeWidth={1.5} />
                      <span className="text-xs text-red-600">+23% from yesterday</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#999999] mb-2">Security Alerts</p>
                    <p className="text-2xl font-light text-[#1E1E1E]">18</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-red-600">4 critical</span>
                      <span className="text-xs text-amber-600">6 high</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Fraud Detection Tab */}
          {activeTab === 'fraud' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
                <div className="p-4 border-b border-[#00000008]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Fraud Detection Alerts</h3>
                    <div className="flex items-center gap-2">
                      <select className="px-3 py-1.5 border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020]">
                        <option>All Severities</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                      <button className="p-1.5 border border-[#00000008] hover:border-[#00000020]">
                        <Filter className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#00000008]">
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Type</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">User</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Description</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Amount</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Severity</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Time</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fraudAlerts.map((alert) => (
                        <tr key={alert.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA]">
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E] capitalize">{alert.type}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-medium text-[#1E1E1E]">{alert.user}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E]">{alert.description}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-medium text-red-600">{alert.amount}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs border ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs border ${getStatusColor(alert.status)}`}>
                              {alert.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#999999]">{alert.time}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-[#00000008]">
                                <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              </button>
                              <button className="p-1 hover:bg-[#00000008]">
                                <Ban className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                              </button>
                              <button className="p-1 hover:bg-[#00000008]">
                                <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Fraud Prevention Rules */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Active Prevention Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-[#00000008]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-[#1E1E1E]">Velocity Check</h4>
                      <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-xs text-[#999999]">Block transactions exceeding ₦500,000 within 1 hour</p>
                  </div>
                  <div className="p-4 border border-[#00000008]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-[#1E1E1E]">Geographic Anomaly</h4>
                      <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-xs text-[#999999]">Flag logins from unusual locations</p>
                  </div>
                  <div className="p-4 border border-[#00000008]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-[#1E1E1E]">Pattern Detection</h4>
                      <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-xs text-[#999999]">Identify unusual transaction patterns using ML</p>
                  </div>
                  <div className="p-4 border border-[#00000008]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-[#1E1E1E]">Device Fingerprinting</h4>
                      <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-xs text-[#999999]">Track and verify device authenticity</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Activity Monitoring Tab */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
                <div className="p-4 border-b border-[#00000008]">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Suspicious Activity Log</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#00000008]">
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Activity</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">IP Address</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Location</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Device</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Risk Score</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Time</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suspiciousActivities.map((activity) => (
                        <tr key={activity.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA]">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                              <span className="text-sm font-medium text-[#1E1E1E]">{activity.activity}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-mono text-[#1E1E1E]">{activity.ip}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#999999]" strokeWidth={1.5} />
                              <span className="text-sm font-light text-[#1E1E1E]">{activity.location}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E]">{activity.device}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-[#00000008]">
                                <div 
                                  className={`h-full ${
                                    activity.riskScore >= 80 ? 'bg-red-500' :
                                    activity.riskScore >= 60 ? 'bg-amber-500' :
                                    'bg-yellow-500'
                                  }`}
                                  style={{ width: `${activity.riskScore}%` }}
                                ></div>
                              </div>
                              <span className={`text-sm font-medium ${getRiskScoreColor(activity.riskScore)}`}>
                                {activity.riskScore}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs border ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#999999]">{activity.time}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-[#00000008]">
                                <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              </button>
                              <button className="p-1 hover:bg-[#00000008]">
                                <Ban className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* AML Compliance Tab */}
          {activeTab === 'aml' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">₦12.5M</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Daily Transaction Volume</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <FileWarning className="w-5 h-5 text-red-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">3</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Pending Reports</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">98.5%</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Compliance Score</p>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
                <div className="p-4 border-b border-[#00000008]">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">AML Alerts & Reports</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#00000008]">
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Type</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Amount</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Parties</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Risk Level</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Report Status</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Time</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amlAlerts.map((alert) => (
                        <tr key={alert.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA]">
                          <td className="p-3">
                            <span className="text-sm font-medium text-[#1E1E1E]">{alert.type}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-medium text-red-600">{alert.amount}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E]">{alert.parties}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs border ${getSeverityColor(alert.risk)}`}>
                              {alert.risk}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs border ${getStatusColor(alert.status)}`}>
                              {alert.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E]">{alert.reportStatus.replace('_', ' ')}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#999999]">{alert.time}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-[#00000008]">
                                <FileText className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              </button>
                              <button className="p-1 hover:bg-[#00000008]">
                                <ExternalLink className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Data Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              {/* Security Audits */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Security Audits</h3>
                <div className="space-y-3">
                  {securityAudits.map((audit) => (
                    <div key={audit.id} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${getStatusColor(audit.status)}`}>
                            {audit.status === 'passed' ? (
                              <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                            ) : audit.status === 'warning' ? (
                              <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />
                            ) : (
                              <ShieldOff className="w-4 h-4" strokeWidth={1.5} />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-[#1E1E1E]">{audit.audit}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-[#999999]">Last: {audit.lastRun}</span>
                              <span className="text-xs text-[#999999]">Next: {audit.nextRun}</span>
                              {audit.issues > 0 && (
                                <span className="text-xs text-red-600">{audit.issues} issues found</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button className="px-3 py-1 border border-[#00000008] hover:border-[#00000020] text-xs font-light">
                          Run Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Data Requests */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
                <div className="p-4 border-b border-[#00000008]">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">User Data Requests (GDPR/CCPA)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#00000008]">
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">User</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Request Type</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Request Date</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Data Size</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Compliance</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataRequests.map((request) => (
                        <tr key={request.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA]">
                          <td className="p-3">
                            <span className="text-sm font-medium text-[#1E1E1E]">{request.user}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {request.type === 'export' ? (
                                <Download className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                              )}
                              <span className="text-sm font-light text-[#1E1E1E] capitalize">{request.type}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E]">{request.requestDate}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E]">{request.dataSize}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200">
                              {request.compliance}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs border ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-[#00000008]">
                                <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              </button>
                              {request.status === 'pending' && (
                                <button className="p-1 hover:bg-[#00000008]">
                                  <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Incident Response Tab */}
          {activeTab === 'incidents' && (
            <div className="space-y-6">
              {/* Quick Response Actions */}
              <div className="bg-red-50 border border-red-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertOctagon className="w-5 h-5 text-red-600" strokeWidth={1.5} />
                    <div>
                      <h3 className="text-sm font-medium text-red-900">Emergency Response Actions</h3>
                      <p className="text-xs text-red-700 mt-1">Quick actions for immediate threat response</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 text-xs font-light">
                      Lock All Accounts
                    </button>
                    <button className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 text-xs font-light">
                      Disable Transactions
                    </button>
                    <button className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 text-xs font-light">
                      Force Logout All
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Active Incidents */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
                <div className="p-4 border-b border-[#00000008]">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Security Incidents</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {securityIncidents.map((incident) => (
                      <div key={incident.id} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 ${getSeverityColor(incident.severity)}`}>
                              <AlertOctagon className="w-4 h-4" strokeWidth={1.5} />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-[#1E1E1E]">{incident.incident}</h4>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-[#999999]">Affected: {incident.affectedUsers} users</span>
                                <span className="text-xs text-[#999999]">Response: {incident.responseTime}</span>
                                <span className="text-xs text-[#999999]">{incident.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs border ${getStatusColor(incident.status)}`}>
                              {incident.status}
                            </span>
                            <button className="p-1 hover:bg-[#00000008]">
                              <MoreVertical className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Incident Response Log */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Response Log</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 border-l-2 border-red-500">
                    <Clock className="w-3 h-3 text-[#999999]" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999]">10:45 AM</span>
                    <span className="text-sm font-light text-[#1E1E1E]">Suspicious activity detected from IP 45.23.108.91</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 border-l-2 border-amber-500">
                    <Clock className="w-3 h-3 text-[#999999]" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999]">10:47 AM</span>
                    <span className="text-sm font-light text-[#1E1E1E]">Automated response triggered - IP blocked</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 border-l-2 border-blue-500">
                    <Clock className="w-3 h-3 text-[#999999]" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999]">10:50 AM</span>
                    <span className="text-sm font-light text-[#1E1E1E]">Security team notified</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 border-l-2 border-emerald-500">
                    <Clock className="w-3 h-3 text-[#999999]" strokeWidth={1.5} />
                    <span className="text-xs text-[#999999]">10:55 AM</span>
                    <span className="text-sm font-light text-[#1E1E1E]">Incident contained - no data breach detected</span>
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
