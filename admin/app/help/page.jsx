"use client";
import { useState } from "react";
import { PageHeader } from "../../components/ui";
import {
  Ticket,
  Flag,
  AlertTriangle,
  Shield,
  TrendingUp,
  FileText,
  Clock,
  Search,
  Filter,
  ChevronDown,
  Eye,
  MessageSquare,
  UserCheck,
  Ban,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Plus,
  RefreshCw,
  Download,
  MoreVertical,
  User,
  Users,
  Calendar,
  Target,
  Activity
} from "lucide-react";

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Demo data - would come from API in real implementation
  const supportStats = [
    { title: 'Open Tickets', value: '24', change: '+12%', icon: Ticket, color: 'text-red-600', bg: 'bg-red-50/50', border: 'border-red-100' },
    { title: 'Resolved Today', value: '18', change: '+8%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
    { title: 'Avg Response Time', value: '2.4h', change: '-15%', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
    { title: 'SLA Compliance', value: '94.2%', change: '+5%', icon: Target, color: 'text-violet-600', bg: 'bg-violet-50/50', border: 'border-violet-100' }
  ];

  const supportTickets = [
    { 
      id: 'ST-1001', 
      user: 'Iren Kukoma', 
      subject: 'Cannot access group funds', 
      status: 'open', 
      priority: 'high', 
      category: 'technical',
      createdAt: '2025-08-27 09:30 AM', 
      lastUpdate: '2025-08-27 10:15 AM',
      assignedTo: 'Admin Team',
      responseTime: '45m',
      description: 'User reports unable to withdraw from Hawaii Vacation group'
    },
    { 
      id: 'ST-1002', 
      user: 'Adaeze Obi', 
      subject: 'Verification documents rejected', 
      status: 'in-progress', 
      priority: 'medium', 
      category: 'verification',
      createdAt: '2025-08-26 02:15 PM', 
      lastUpdate: '2025-08-27 08:30 AM',
      assignedTo: 'KYC Team',
      responseTime: '18h',
      description: 'User submitted new documents after initial rejection'
    },
    { 
      id: 'ST-1003', 
      user: 'Tunde Ade', 
      subject: 'Group admin abuse report', 
      status: 'escalated', 
      priority: 'high', 
      category: 'dispute',
      createdAt: '2025-08-25 11:45 AM', 
      lastUpdate: '2025-08-27 09:00 AM',
      assignedTo: 'Senior Admin',
      responseTime: '2d 5h',
      description: 'Multiple reports of admin not distributing payouts fairly'
    },
    { 
      id: 'ST-1004', 
      user: 'Fatima Ibrahim', 
      subject: 'Payment not reflecting in wallet', 
      status: 'resolved', 
      priority: 'low', 
      category: 'payment',
      createdAt: '2025-08-24 08:00 AM', 
      lastUpdate: '2025-08-24 10:30 AM',
      assignedTo: 'Finance Team',
      responseTime: '2.5h',
      description: 'Payment sync issue resolved'
    }
  ];

  const reportedIssues = [
    {
      id: 'RI-2001',
      reportedBy: 'John Doe',
      reportedUser: 'Bad Actor',
      issueType: 'inappropriate_behavior',
      description: 'User making threatening comments in group chat',
      status: 'under_review',
      severity: 'high',
      createdAt: '2025-08-27 08:45 AM',
      evidence: '3 screenshots, 2 witness reports'
    },
    {
      id: 'RI-2002',
      reportedBy: 'Jane Smith',
      reportedUser: 'Spam Account',
      issueType: 'spam',
      description: 'User sending promotional messages to group members',
      status: 'resolved',
      severity: 'medium',
      createdAt: '2025-08-26 03:20 PM',
      evidence: '5 screenshot reports'
    }
  ];

  const groupDisputes = [
    {
      id: 'GD-3001',
      groupName: 'Miami Vacation',
      disputeType: 'payout_delay',
      parties: ['Group Admin', '8 Members'],
      status: 'mediation',
      priority: 'high',
      createdAt: '2025-08-25 10:00 AM',
      mediator: 'Senior Admin',
      description: 'Admin delayed payout without proper notice'
    },
    {
      id: 'GD-3002',
      groupName: 'JT Ins. Piggy Bank',
      disputeType: 'contribution_fraud',
      parties: ['2 Members'],
      status: 'investigation',
      priority: 'high',
      createdAt: '2025-08-24 02:15 PM',
      mediator: 'Fraud Team',
      description: 'Allegations of fake contribution proofs'
    }
  ];

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-red-50/50 text-red-600 border-red-100';
      case 'in-progress': return 'bg-amber-50/50 text-amber-600 border-amber-100';
      case 'escalated': return 'bg-violet-50/50 text-violet-600 border-violet-100';
      case 'resolved': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100';
      case 'under_review': return 'bg-blue-50/50 text-blue-600 border-blue-100';
      case 'mediation': return 'bg-orange-50/50 text-orange-600 border-orange-100';
      case 'investigation': return 'bg-purple-50/50 text-purple-600 border-purple-100';
      default: return 'bg-gray-50/50 text-gray-600 border-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-emerald-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-emerald-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
      <PageHeader title="Help & Support" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {supportStats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change.startsWith('+');
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
                    {isPositive ? (
                      <ArrowUp className="w-3 h-3 text-emerald-500" strokeWidth={2} />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-red-500" strokeWidth={2} />
                    )}
                    <span className={`text-xs font-medium ${
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

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-6 border-b border-[#00000008]">
          {[
            { key: 'overview', label: 'Support Overview' },
            { key: 'tickets', label: 'Support Tickets' },
            { key: 'reports', label: 'User Reports' },
            { key: 'disputes', label: 'Group Disputes' },
            { key: 'moderation', label: 'Content Moderation' },
            { key: 'analytics', label: 'Response Analytics' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
                activeTab === tab.key 
                  ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                  : 'text-[#999999] hover:text-[#1E1E1E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Support Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab('tickets')}
                  className="group relative p-6 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Ticket className="w-6 h-6 mb-3 text-red-500" strokeWidth={1.5} />
                      <span className="text-sm font-light text-[#1E1E1E]">Manage Tickets</span>
                      <p className="text-xs text-[#999999] mt-1">24 open tickets</p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
                <button 
                  onClick={() => setActiveTab('reports')}
                  className="group relative p-6 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Flag className="w-6 h-6 mb-3 text-amber-500" strokeWidth={1.5} />
                      <span className="text-sm font-light text-[#1E1E1E]">Review Reports</span>
                      <p className="text-xs text-[#999999] mt-1">5 pending review</p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
                <button 
                  onClick={() => setActiveTab('disputes')}
                  className="group relative p-6 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <AlertTriangle className="w-6 h-6 mb-3 text-violet-500" strokeWidth={1.5} />
                      <span className="text-sm font-light text-[#1E1E1E]">Resolve Disputes</span>
                      <p className="text-xs text-[#999999] mt-1">2 active disputes</p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Tickets */}
              <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
                <div className="flex items-center justify-between mb-6 border-b border-[#00000008] pb-3">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Recent Tickets</h3>
                  <button onClick={() => setActiveTab('tickets')} className="text-xs text-[#999999] hover:text-[#1E1E1E] transition-colors">
                    View all →
                  </button>
                </div>
                <div className="space-y-3">
                  {supportTickets.slice(0, 3).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 border-l-2 border-transparent hover:border-red-500 hover:bg-[#FAFAFA] transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#FAFAFA] border border-[#00000008] flex items-center justify-center text-[#1E1E1E] font-light text-sm">
                          <Ticket className="w-4 h-4" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-sm font-light text-[#1E1E1E]">{ticket.subject}</p>
                          <p className="text-xs text-[#999999]">{ticket.user} • {ticket.responseTime}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escalated Issues */}
              <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
                <div className="flex items-center justify-between mb-6 border-b border-[#00000008] pb-3">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Escalated Issues</h3>
                  <span className="text-xs text-[#999999]">Requires immediate attention</span>
                </div>
                <div className="space-y-3">
                  {[...supportTickets.filter(t => t.status === 'escalated'), ...groupDisputes.slice(0, 1)].map((item) => (
                    <div key={item.id} className="p-3 border-l-2 border-transparent hover:border-violet-500 hover:bg-[#FAFAFA] transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-light text-[#1E1E1E]">{item.subject || `${item.groupName} Dispute`}</h4>
                        <span className="text-[10px] uppercase tracking-wider text-red-600">URGENT</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#999999]">{item.user || item.mediator} • {item.responseTime || 'Pending'}</span>
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Support Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
            {/* Toolbar */}
            <div className="p-4 border-b border-[#00000008]">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                    <input
                      type="text"
                      placeholder="Search tickets by ID, user, or subject..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    />
                  </div>
                  
                  {/* Status Filter */}
                  <div className="relative">
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none px-4 py-2 pr-10 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="escalated">Escalated</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  </div>

                  {/* Priority Filter */}
                  <div className="relative">
                    <select 
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="appearance-none px-4 py-2 pr-10 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors cursor-pointer"
                    >
                      <option value="all">All Priority</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" strokeWidth={1.5} />
                    New Ticket
                  </button>
                  <button className="p-2 hover:bg-[#FAFAFA] transition-colors">
                    <RefreshCw className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  </button>
                  <button className="p-2 hover:bg-[#FAFAFA] transition-colors">
                    <Download className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tickets Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#00000008]">
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Ticket ID</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">User</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Subject</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Priority</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Assigned To</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Response Time</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Created</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA] transition-colors">
                      <td className="p-4">
                        <span className="text-sm font-medium text-[#1E1E1E]">{ticket.id}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-light text-[#1E1E1E]">{ticket.user}</p>
                          <p className="text-xs text-[#999999]">{ticket.category}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-light text-[#1E1E1E] truncate">{ticket.subject}</p>
                          <p className="text-xs text-[#999999] truncate mt-1">{ticket.description}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <AlertTriangle className={`w-4 h-4 ${getPriorityColor(ticket.priority)}`} strokeWidth={1.5} />
                          <span className={`text-xs ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-light text-[#1E1E1E]">{ticket.assignedTo}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-[#999999]">{ticket.responseTime}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-[#999999]">{ticket.createdAt}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                            <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                          </button>
                          <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                            <MessageSquare className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                          </button>
                          <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                            <MoreVertical className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
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

        {/* User Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">User-Reported Issues</h3>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors">
                  Review All
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {reportedIssues.map((report) => (
                <div key={report.id} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Flag className={`w-5 h-5 ${getSeverityColor(report.severity)}`} strokeWidth={1.5} />
                      <div>
                        <h4 className="text-sm font-light text-[#1E1E1E]">{report.issueType.replace('_', ' ')}</h4>
                        <p className="text-xs text-[#999999]">Reported by {report.reportedBy} against {report.reportedUser}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                      <span className={`text-xs ${getSeverityColor(report.severity)}`}>{report.severity} severity</span>
                    </div>
                  </div>
                  <p className="text-sm font-light text-[#1E1E1E] mb-3">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-[#999999]">
                      <span>{report.createdAt}</span>
                      <span>Evidence: {report.evidence}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs hover:bg-emerald-100 transition-colors">
                        Approve Action
                      </button>
                      <button className="px-3 py-1 bg-red-50 text-red-600 text-xs hover:bg-red-100 transition-colors">
                        Dismiss
                      </button>
                      <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                        <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Group Disputes Tab */}
        {activeTab === 'disputes' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Group Dispute Resolution</h3>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors">
                  Mediation Tools
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {groupDisputes.map((dispute) => (
                <div key={dispute.id} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-5 h-5 ${getPriorityColor(dispute.priority)}`} strokeWidth={1.5} />
                      <div>
                        <h4 className="text-sm font-light text-[#1E1E1E]">{dispute.groupName} - {dispute.disputeType.replace('_', ' ')}</h4>
                        <p className="text-xs text-[#999999]">Parties involved: {dispute.parties.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(dispute.status)}`}>
                        {dispute.status}
                      </span>
                      <span className={`text-xs ${getPriorityColor(dispute.priority)}`}>{dispute.priority} priority</span>
                    </div>
                  </div>
                  <p className="text-sm font-light text-[#1E1E1E] mb-3">{dispute.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-[#999999]">
                      <span>{dispute.createdAt}</span>
                      <span>Mediator: {dispute.mediator}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-blue-50 text-blue-600 text-xs hover:bg-blue-100 transition-colors">
                        Start Mediation
                      </button>
                      <button className="px-3 py-1 bg-amber-50 text-amber-600 text-xs hover:bg-amber-100 transition-colors">
                        Escalate
                      </button>
                      <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                        <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Moderation Tab */}
        {activeTab === 'moderation' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Content Moderation</h3>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors">
                  Auto-Moderation Settings
                </button>
              </div>
            </div>
            
            {/* Moderation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                  <span className="text-xs text-[#999999] uppercase tracking-wider">Pending Review</span>
                </div>
                <p className="text-2xl font-light text-[#1E1E1E]">12</p>
                <p className="text-xs text-[#999999] mt-1">Profile images, comments</p>
              </div>
              <div className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                  <span className="text-xs text-[#999999] uppercase tracking-wider">Approved Today</span>
                </div>
                <p className="text-2xl font-light text-[#1E1E1E]">45</p>
                <p className="text-xs text-[#999999] mt-1">Content approved</p>
              </div>
              <div className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                  <span className="text-xs text-[#999999] uppercase tracking-wider">Rejected Today</span>
                </div>
                <p className="text-2xl font-light text-[#1E1E1E]">8</p>
                <p className="text-xs text-[#999999] mt-1">Policy violations</p>
              </div>
              <div className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-violet-600" strokeWidth={1.5} />
                  <span className="text-xs text-[#999999] uppercase tracking-wider">Auto-Filtered</span>
                </div>
                <p className="text-2xl font-light text-[#1E1E1E]">156</p>
                <p className="text-xs text-[#999999] mt-1">AI-filtered content</p>
              </div>
            </div>

            <div className="text-center py-12 text-[#999999]">
              <Shield className="w-12 h-12 mb-4 mx-auto" strokeWidth={1} />
              <p className="text-sm font-light">Content moderation queue would be displayed here</p>
              <p className="text-xs mt-2">Profile images, comments, and user-generated content for review</p>
            </div>
          </div>
        )}

        {/* Response Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
            <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-6">Support Response Analytics</h3>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 border border-[#00000008]">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                  <span className="text-sm text-emerald-600">-15% vs last week</span>
                </div>
                <p className="text-2xl font-light text-[#1E1E1E] mb-1">2.4 hours</p>
                <p className="text-xs text-[#999999] uppercase tracking-wider">Average Response Time</p>
                <div className="h-0.5 bg-[#00000008] mt-3">
                  <div className="h-full bg-blue-600 w-3/4" />
                </div>
              </div>
              <div className="p-4 border border-[#00000008]">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                  <span className="text-sm text-emerald-600">+5% vs target</span>
                </div>
                <p className="text-2xl font-light text-[#1E1E1E] mb-1">94.2%</p>
                <p className="text-xs text-[#999999] uppercase tracking-wider">SLA Compliance Rate</p>
                <div className="h-0.5 bg-[#00000008] mt-3">
                  <div className="h-full bg-emerald-600 w-11/12" />
                </div>
              </div>
              <div className="p-4 border border-[#00000008]">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
                  <span className="text-sm text-emerald-600">+12% this month</span>
                </div>
                <p className="text-2xl font-light text-[#1E1E1E] mb-1">87.3%</p>
                <p className="text-xs text-[#999999] uppercase tracking-wider">Resolution Rate</p>
                <div className="h-0.5 bg-[#00000008] mt-3">
                  <div className="h-full bg-violet-600 w-5/6" />
                </div>
              </div>
            </div>

            {/* Team Performance */}
            <div className="mb-8">
              <h4 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Team Performance</h4>
              <div className="space-y-3">
                {[
                  { name: 'Admin Team', tickets: 45, avgResponse: '1.8h', satisfaction: '96%' },
                  { name: 'KYC Team', tickets: 23, avgResponse: '3.2h', satisfaction: '92%' },
                  { name: 'Finance Team', tickets: 31, avgResponse: '2.1h', satisfaction: '94%' },
                  { name: 'Senior Admin', tickets: 12, avgResponse: '4.5h', satisfaction: '98%' }
                ].map((team) => (
                  <div key={team.name} className="flex items-center justify-between p-3 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#FAFAFA] border border-[#00000008] flex items-center justify-center text-[#1E1E1E] font-light text-sm">
                        {team.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-light text-[#1E1E1E]">{team.name}</p>
                        <p className="text-xs text-[#999999]">{team.tickets} tickets handled</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <p className="text-sm font-light text-[#1E1E1E]">{team.avgResponse}</p>
                        <p className="text-xs text-[#999999]">Avg Response</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-emerald-600">{team.satisfaction}</p>
                        <p className="text-xs text-[#999999]">Satisfaction</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="h-64 bg-[#FAFAFA] border border-[#00000008] flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 mb-4 mx-auto text-[#999999]" strokeWidth={1} />
                <p className="text-[#999999] text-sm font-light">Support analytics charts would be displayed here</p>
                <p className="text-xs text-[#999999] mt-2">Response time trends, ticket volume, resolution rates over time</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

