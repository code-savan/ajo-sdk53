"use client";
import { useState } from "react";
import { PageHeader } from "../../components/ui";
import { users, userActivityLogs, supportTickets } from "../../data/adminContent";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  Filter,
  Download,
  Mail,
  Ban,
  CheckCircle,
  AlertCircle,
  Eye,
  MoreVertical,
  Activity,
  Ticket,
  UserPlus,
  TrendingUp,
  Shield,
  ChevronDown,
  RefreshCw
} from "lucide-react";

export default function UsersIndex() {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate stats
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100';
      case 'inactive': return 'bg-gray-50/50 text-gray-600 border-gray-100';
      case 'suspended': return 'bg-red-50/50 text-red-600 border-red-100';
      case 'pending': return 'bg-amber-50/50 text-amber-600 border-amber-100';
      default: return 'bg-gray-50/50 text-gray-600 border-gray-100';
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return 'text-emerald-600';
      case 'medium': return 'text-amber-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px]">
      <PageHeader title="User Management" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-wider text-emerald-600">Active</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{activeUsers}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Active Users</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-wider text-gray-600">Inactive</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{inactiveUsers}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Inactive Users</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <UserX className="w-5 h-5 text-red-600" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-wider text-red-600">Suspended</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{suspendedUsers}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Suspended Users</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-wider text-amber-600">Pending</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{pendingUsers}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Pending Verification</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-6 border-b border-[#00000008]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'overview' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            User Overview
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'activity' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Activity Logs
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'tickets' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Support Tickets
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'referrals' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Referral Tracking
          </button>
        </div>

        {/* Main Content - Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
            {/* Toolbar */}
            <div className="p-4 border-b border-[#00000008]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    />
                  </div>
                  
                  {/* Filter */}
                  <div className="relative">
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none px-4 py-2 pr-10 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  {selectedUsers.length > 0 && (
                    <div className="relative">
                      <button
                        onClick={() => setShowBulkActions(!showBulkActions)}
                        className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors"
                      >
                        Bulk Actions ({selectedUsers.length})
                      </button>
                      
                      {showBulkActions && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#00000020] z-10">
                          <button className="w-full px-4 py-2 text-left text-sm font-light hover:bg-[#FAFAFA] transition-colors flex items-center gap-2">
                            <Mail className="w-4 h-4" strokeWidth={1.5} />
                            Send Message
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm font-light hover:bg-[#FAFAFA] transition-colors flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                            Activate
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm font-light hover:bg-[#FAFAFA] transition-colors flex items-center gap-2">
                            <Ban className="w-4 h-4" strokeWidth={1.5} />
                            Suspend
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm font-light hover:bg-[#FAFAFA] transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" strokeWidth={1.5} />
                            Export
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button className="p-2 hover:bg-[#FAFAFA] transition-colors">
                    <RefreshCw className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  </button>
                  
                  <button className="p-2 hover:bg-[#FAFAFA] transition-colors">
                    <Download className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#00000008]">
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 border border-[#00000020]"
                      />
                    </th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">User</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Verification</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Groups</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Savings</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Risk</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Last Login</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA] transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="w-4 h-4 border border-[#00000020]"
                        />
                      </td>
                      <td className="p-4">
                        <Link href={`/users/${user.id}`} className="hover:text-blue-600 transition-colors">
                          <div>
                            <p className="text-sm font-light text-[#1E1E1E]">{user.name}</p>
                            <p className="text-xs text-[#999999]">{user.email}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {user.verificationStatus === 'verified' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                          )}
                          <span className="text-xs text-[#999999]">{user.verificationStatus}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-light text-[#1E1E1E]">{user.groupCount}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-[#1E1E1E]">{user.totalSavings}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Shield className={`w-4 h-4 ${getRiskColor(user.riskLevel)}`} strokeWidth={1.5} />
                          <span className={`text-xs ${getRiskColor(user.riskLevel)}`}>{user.riskLevel}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-[#999999]">{user.lastLogin}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/users/${user.id}`}>
                            <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                              <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            </button>
                          </Link>
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

        {/* Activity Logs Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
            <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Recent Activity Logs</h3>
            <div className="space-y-3">
              {userActivityLogs.map((log) => {
                const user = users.find(u => u.id === log.userId);
                return (
                  <div key={log.id} className="flex items-center justify-between p-3 border-l-2 border-transparent hover:border-blue-500 hover:bg-[#FAFAFA] transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <Activity className={`w-4 h-4 ${log.status === 'success' ? 'text-emerald-600' : log.status === 'failed' ? 'text-red-600' : 'text-amber-600'}`} strokeWidth={1.5} />
                      <div>
                        <p className="text-sm font-light text-[#1E1E1E]">
                          <span className="font-medium">{user?.name}</span> - {log.action}
                        </p>
                        <p className="text-xs text-[#999999]">
                          {log.timestamp} {log.ip && `• IP: ${log.ip}`} {log.details && `• ${log.details}`}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${
                      log.status === 'success' ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' :
                      log.status === 'failed' ? 'bg-red-50/50 text-red-600 border-red-100' :
                      'bg-amber-50/50 text-amber-600 border-amber-100'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Support Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
            <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Support Tickets</h3>
            <div className="space-y-3">
              {supportTickets.map((ticket) => {
                const user = users.find(u => u.id === ticket.userId);
                return (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <Ticket className={`w-5 h-5 ${
                        ticket.priority === 'high' ? 'text-red-600' :
                        ticket.priority === 'medium' ? 'text-amber-600' :
                        'text-gray-600'
                      }`} strokeWidth={1.5} />
                      <div>
                        <p className="text-sm font-light text-[#1E1E1E]">{ticket.subject}</p>
                        <p className="text-xs text-[#999999]">
                          {user?.name} • {ticket.createdAt} • Assigned to: {ticket.assignedTo}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${
                        ticket.status === 'open' ? 'bg-red-50/50 text-red-600 border-red-100' :
                        ticket.status === 'in-progress' ? 'bg-amber-50/50 text-amber-600 border-amber-100' :
                        'bg-emerald-50/50 text-emerald-600 border-emerald-100'
                      }`}>
                        {ticket.status}
                      </span>
                      <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                        <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Referral Tracking Tab */}
        {activeTab === 'referrals' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
            <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-6">Referral Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Direct', 'User Referral', 'Social Media', 'Google Ads'].map((source) => {
                const count = users.filter(u => u.referralSource === source).length;
                const percentage = ((count / users.length) * 100).toFixed(1);
                return (
                  <div key={source} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <UserPlus className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                      <span className="text-sm font-medium text-[#1E1E1E]">{percentage}%</span>
                    </div>
                    <p className="text-lg font-light text-[#1E1E1E]">{count} users</p>
                    <p className="text-xs text-[#999999] uppercase tracking-wider mt-1">{source}</p>
                    <div className="h-0.5 bg-[#00000008] mt-3">
                      <div 
                        className="h-full bg-blue-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8">
              <h4 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Recent Onboarding</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#00000008]">
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">User</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Source</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Joined Date</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map((user) => (
                      <tr key={user.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA]">
                        <td className="p-3">
                          <p className="text-sm font-light text-[#1E1E1E]">{user.name}</p>
                          <p className="text-xs text-[#999999]">{user.email}</p>
                        </td>
                        <td className="p-3">
                          <span className="text-xs text-[#999999]">{user.referralSource}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-xs text-[#999999]">{user.joinedAt}</span>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
