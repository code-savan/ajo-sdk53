"use client";
import { useState } from "react";
import { PageHeader } from "../../../components/ui";
import { groups, users, transactions, payouts, userActivityLogs } from "../../../data/adminContent";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  PauseCircle,
  Activity,
  BarChart3,
  Settings,
  Shield,
  AlertTriangle,
  Wallet,
  Target,
  UserCheck,
  UserMinus,
  UserPlus,
  Download,
  Edit,
  MoreVertical,
  RefreshCw,
  Ban,
  PlayCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Receipt,
  FileText,
  MessageSquare
} from "lucide-react";

export default function GroupDetail({ params }) {
  const group = groups.find((g) => g.id === params.id) || groups[0];
  const [activeTab, setActiveTab] = useState('overview');
  const [showActionMenu, setShowActionMenu] = useState(false);
  
  // Enhanced group data
  const enhancedGroup = {
    ...group,
    status: group.id === 'g-2001' ? 'active' : group.id === 'g-2002' ? 'paused' : 'active',
    completionRate: group.id === 'g-2001' ? 85 : group.id === 'g-2002' ? 60 : 92,
    nextPayout: group.id === 'g-2001' ? '2025-08-20' : group.id === 'g-2002' ? '2025-08-25' : '2025-08-18',
    totalContributions: group.id === 'g-2001' ? '$3,450,000' : group.id === 'g-2002' ? '$2,100,000' : '$5,780,000',
    disputes: group.id === 'g-2001' ? 2 : group.id === 'g-2002' ? 5 : 1,
    onTimePayments: group.id === 'g-2001' ? 95 : group.id === 'g-2002' ? 78 : 98,
    startDate: group.id === 'g-2001' ? '2024-06-15' : group.id === 'g-2002' ? '2024-07-01' : '2024-05-20',
    adminId: 'admin-001',
    description: group.id === 'g-2001' ? 'Professional savings group for Abuja residents' : 
                 group.id === 'g-2002' ? 'Trading community savings circle' : 
                 'Daily contributions for Lagos professionals',
    contributionAmount: '$50,000',
    currentRound: 12,
    totalRounds: 24,
    missedPayments: group.id === 'g-2002' ? 8 : 2,
    rules: [
      'Contributions must be made by the 5th of each cycle',
      'Late payments incur a 5% penalty',
      'Members can request emergency withdrawals with group approval',
      'Minimum 70% member vote required for major decisions'
    ]
  };
  
  // Mock group members
  const groupMembers = users.slice(0, Math.min(enhancedGroup.members, users.length)).map((user, index) => ({
    ...user,
    position: index + 1,
    contributionStatus: Math.random() > 0.2 ? 'paid' : 'pending',
    lastContribution: '2025-08-10',
    totalContributed: `$${(50000 * (index + 5)).toLocaleString()}`,
    missedPayments: Math.floor(Math.random() * 3),
    isCurrentRecipient: index === 2
  }));
  
  // Mock contribution schedule
  const contributionSchedule = Array.from({ length: 5 }, (_, i) => ({
    round: enhancedGroup.currentRound + i,
    dueDate: `2025-${String(8 + i).padStart(2, '0')}-${15 + i * 2}`,
    recipient: groupMembers[i % groupMembers.length],
    amount: enhancedGroup.contributionAmount,
    collected: i === 0 ? Math.floor(enhancedGroup.members * 0.8) : 0,
    status: i === 0 ? 'collecting' : 'scheduled'
  }));
  
  // Mock group transactions
  const groupTransactions = transactions.map(t => ({
    ...t,
    memberName: users.find(u => u.id === t.userId)?.name || 'Unknown Member',
    groupId: enhancedGroup.id
  }));
  
  // Mock group activity
  const groupActivity = [
    { id: 'ga-001', action: 'Member joined', user: 'Fatima Ibrahim', timestamp: '2025-08-14 10:30 AM', type: 'member' },
    { id: 'ga-002', action: 'Contribution received', user: 'Kemi Johnson', timestamp: '2025-08-14 09:15 AM', type: 'payment', amount: '$50,000' },
    { id: 'ga-003', action: 'Payout completed', user: 'Admin', timestamp: '2025-08-13 03:00 PM', type: 'payout', amount: '$1,200,000' },
    { id: 'ga-004', action: 'Late payment penalty', user: 'Tunde Ade', timestamp: '2025-08-12 11:45 AM', type: 'penalty', amount: '$2,500' },
    { id: 'ga-005', action: 'Dispute raised', user: 'Chidi Okonkwo', timestamp: '2025-08-11 02:30 PM', type: 'dispute' },
  ];
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100';
      case 'paused': return 'bg-amber-50/50 text-amber-600 border-amber-100';
      case 'completed': return 'bg-blue-50/50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50/50 text-gray-600 border-gray-100';
    }
  };
  
  const getContributionStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-amber-50/50 text-amber-600 border-amber-100';
      case 'overdue': return 'bg-red-50/50 text-red-600 border-red-100';
      default: return 'bg-gray-50/50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px]">
      <PageHeader title="Group Details" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">
        
        {/* Back Navigation */}
        <Link href="/groups" className="inline-flex items-center gap-2 text-sm text-[#999999] hover:text-[#1E1E1E] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to Groups
        </Link>
        
        {/* Group Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-light text-[#1E1E1E] mb-2">{enhancedGroup.name}</h1>
              <p className="text-sm text-[#999999] mb-3">{enhancedGroup.description}</p>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] px-3 py-1 font-light uppercase tracking-wider border ${getStatusColor(enhancedGroup.status)}`}>
                  {enhancedGroup.status}
                </span>
                <span className="text-sm text-[#999999]">
                  <Calendar className="w-4 h-4 inline mr-1" strokeWidth={1.5} />
                  Started {enhancedGroup.startDate}
                </span>
                <span className="text-sm text-[#999999]">
                  <Users className="w-4 h-4 inline mr-1" strokeWidth={1.5} />
                  {enhancedGroup.members} members
                </span>
                <span className="text-sm text-[#999999]">
                  <Clock className="w-4 h-4 inline mr-1" strokeWidth={1.5} />
                  {enhancedGroup.cycle} cycle
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {enhancedGroup.status === 'paused' ? (
                <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-light hover:bg-emerald-700 transition-colors flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" strokeWidth={1.5} />
                  Resume Group
                </button>
              ) : (
                <button className="px-4 py-2 bg-amber-600 text-white text-sm font-light hover:bg-amber-700 transition-colors flex items-center gap-2">
                  <PauseCircle className="w-4 h-4" strokeWidth={1.5} />
                  Pause Group
                </button>
              )}
              <button className="p-2 border border-[#00000008] hover:border-[#00000020] transition-colors">
                <Edit className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowActionMenu(!showActionMenu)}
                  className="p-2 border border-[#00000008] hover:border-[#00000020] transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                </button>
                {showActionMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#00000020] z-10">
                    <button className="w-full px-4 py-2 text-left text-sm font-light hover:bg-[#FAFAFA] transition-colors flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                      Send Announcement
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm font-light hover:bg-[#FAFAFA] transition-colors flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
                      Reset Cycle
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm font-light hover:bg-[#FAFAFA] transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" strokeWidth={1.5} />
                      Export Data
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm font-light hover:bg-[#FAFAFA] transition-colors flex items-center gap-2 text-red-600">
                      <Ban className="w-4 h-4" strokeWidth={1.5} />
                      Terminate Group
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
            </div>
            <p className="text-xl font-light text-[#1E1E1E]">{enhancedGroup.balance}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Current Balance</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              <span className="text-xs text-blue-600">{enhancedGroup.totalContributions}</span>
            </div>
            <p className="text-xl font-light text-[#1E1E1E]">{enhancedGroup.totalContributions}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Contributions</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
              <span className="text-xs text-violet-600">{enhancedGroup.completionRate}%</span>
            </div>
            <p className="text-xl font-light text-[#1E1E1E]">{enhancedGroup.completionRate}%</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Completion Rate</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              <ChevronRight className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
            </div>
            <p className="text-xl font-light text-[#1E1E1E]">{enhancedGroup.currentRound}/{enhancedGroup.totalRounds}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Current Round</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-green-600" strokeWidth={1.5} />
              <span className="text-xs text-[#999999]">{enhancedGroup.nextPayout}</span>
            </div>
            <p className="text-sm font-light text-[#1E1E1E]">{enhancedGroup.nextPayout}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Next Payout</p>
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
            Overview
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'members' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Members ({enhancedGroup.members})
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'schedule' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Contribution Schedule
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'transactions' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'activity' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Activity Log
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'settings' 
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]' 
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Settings
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Group Information */}
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Group Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Group ID</span>
                      <span className="text-sm font-light text-[#1E1E1E]">{enhancedGroup.id}</span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Cycle Type</span>
                      <span className="text-sm font-light text-[#1E1E1E]">{enhancedGroup.cycle}</span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Contribution Amount</span>
                      <span className="text-sm font-medium text-emerald-600">{enhancedGroup.contributionAmount}</span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Admin</span>
                      <span className="text-sm font-light text-[#1E1E1E]">System Admin</span>
                    </div>
                  </div>
                </div>
                
                {/* Performance Metrics */}
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">On-Time Payments</span>
                      <span className={`text-sm font-medium ${
                        enhancedGroup.onTimePayments >= 90 ? 'text-emerald-600' :
                        enhancedGroup.onTimePayments >= 70 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>{enhancedGroup.onTimePayments}%</span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Missed Payments</span>
                      <span className={`text-sm font-light ${
                        enhancedGroup.missedPayments > 5 ? 'text-red-600' : 'text-[#1E1E1E]'
                      }`}>{enhancedGroup.missedPayments}</span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Active Disputes</span>
                      <span className={`text-sm font-light ${
                        enhancedGroup.disputes > 2 ? 'text-red-600' : 'text-[#1E1E1E]'
                      }`}>{enhancedGroup.disputes}</span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Completion Rate</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1 bg-[#00000008]">
                          <div
                            className={`h-full ${
                              enhancedGroup.completionRate >= 90 ? 'bg-emerald-500' :
                              enhancedGroup.completionRate >= 70 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${enhancedGroup.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-[#1E1E1E]">{enhancedGroup.completionRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Group Rules */}
              <div className="mt-8">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Group Rules</h3>
                <div className="space-y-2">
                  {enhancedGroup.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-[#FAFAFA] border-l-2 border-blue-500">
                      <Shield className="w-4 h-4 text-blue-500 mt-0.5" strokeWidth={1.5} />
                      <span className="text-sm font-light text-[#1E1E1E]">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              {enhancedGroup.disputes > 0 && (
                <div className="mt-6 p-4 bg-amber-50/50 border border-amber-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                      <div>
                        <p className="text-sm font-medium text-amber-900">{enhancedGroup.disputes} Active Disputes</p>
                        <p className="text-xs text-amber-700">Requires immediate attention</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-amber-600 text-white text-xs font-light hover:bg-amber-700 transition-colors">
                      View Disputes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Group Members</h3>
                <button className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors flex items-center gap-2 text-sm font-light">
                  <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                  Add Member
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#00000008]">
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Position</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Member</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Total Contributed</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Last Contribution</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Missed</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupMembers.map((member) => (
                      <tr key={member.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA]">
                        <td className="p-3">
                          <span className="text-sm font-light text-[#1E1E1E]">
                            {member.isCurrentRecipient && (
                              <CreditCard className="w-4 h-4 text-emerald-600 inline mr-1" strokeWidth={1.5} />
                            )}
                            #{member.position}
                          </span>
                        </td>
                        <td className="p-3">
                          <Link href={`/users/${member.id}`} className="text-sm font-light text-[#1E1E1E] hover:text-blue-600 transition-colors">
                            {member.name}
                          </Link>
                          <p className="text-xs text-[#999999]">{member.email}</p>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getContributionStatusColor(member.contributionStatus)}`}>
                            {member.contributionStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-medium text-emerald-600">{member.totalContributed}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-xs text-[#999999]">{member.lastContribution}</span>
                        </td>
                        <td className="p-3">
                          <span className={`text-sm font-light ${
                            member.missedPayments > 2 ? 'text-red-600' : 'text-[#1E1E1E]'
                          }`}>{member.missedPayments}</span>
                        </td>
                        <td className="p-3">
                          <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                            <MoreVertical className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Contribution Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Contribution Schedule</h3>
              <div className="space-y-4">
                {contributionSchedule.map((schedule) => (
                  <div key={schedule.round} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-[#1E1E1E]">Round {schedule.round}</h4>
                        <p className="text-xs text-[#999999]">Due: {schedule.dueDate}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${
                        schedule.status === 'collecting' ? 'bg-amber-50/50 text-amber-600 border-amber-100' :
                        'bg-blue-50/50 text-blue-600 border-blue-100'
                      }`}>
                        {schedule.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-xs text-[#999999]">Recipient: </span>
                        <span className="text-sm font-light text-[#1E1E1E]">{schedule.recipient.name}</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#999999]">Amount: </span>
                        <span className="text-sm font-medium text-emerald-600">{schedule.amount}</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#999999]">Collected: </span>
                        <span className="text-sm font-light text-[#1E1E1E]">
                          {schedule.collected}/{enhancedGroup.members}
                        </span>
                      </div>
                    </div>
                    {schedule.status === 'collecting' && (
                      <div className="mt-3">
                        <div className="h-2 bg-[#00000008]">
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                            style={{ width: `${(schedule.collected / enhancedGroup.members) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-[#999999] mt-1">
                          {((schedule.collected / enhancedGroup.members) * 100).toFixed(0)}% collected
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#00000008]">
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">ID</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Member</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Type</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Amount</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Date</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA]">
                        <td className="p-3">
                          <span className="text-xs text-[#999999]">{transaction.id}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-light text-[#1E1E1E]">{transaction.memberName}</span>
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
                          <span className="text-xs text-[#999999]">{transaction.date}</span>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${
                            transaction.status === 'success' ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' :
                            transaction.status === 'pending' ? 'bg-amber-50/50 text-amber-600 border-amber-100' :
                            'bg-red-50/50 text-red-600 border-red-100'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Activity Log Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Group Activity Log</h3>
              <div className="space-y-3">
                {groupActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border-l-2 border-transparent hover:border-blue-500 hover:bg-[#FAFAFA] transition-all duration-200">
                    <div className="flex items-center gap-4">
                      {activity.type === 'payment' && <Receipt className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />}
                      {activity.type === 'payout' && <Wallet className="w-4 h-4 text-blue-600" strokeWidth={1.5} />}
                      {activity.type === 'member' && <UserCheck className="w-4 h-4 text-violet-600" strokeWidth={1.5} />}
                      {activity.type === 'dispute' && <AlertTriangle className="w-4 h-4 text-red-600" strokeWidth={1.5} />}
                      {activity.type === 'penalty' && <AlertCircle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />}
                      <div>
                        <p className="text-sm font-light text-[#1E1E1E]">{activity.action}</p>
                        <p className="text-xs text-[#999999]">
                          {activity.user} • {activity.timestamp}
                          {activity.amount && ` • ${activity.amount}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Group Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#999999] mb-2">Group Name</label>
                  <input
                    type="text"
                    value={enhancedGroup.name}
                    className="w-full px-3 py-2 border border-[#00000008] bg-white/50 text-sm font-light focus:outline-none focus:border-[#00000020]"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#999999] mb-2">Description</label>
                  <textarea
                    value={enhancedGroup.description}
                    rows={3}
                    className="w-full px-3 py-2 border border-[#00000008] bg-white/50 text-sm font-light focus:outline-none focus:border-[#00000020]"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#999999] mb-2">Contribution Amount</label>
                    <input
                      type="text"
                      value={enhancedGroup.contributionAmount}
                      className="w-full px-3 py-2 border border-[#00000008] bg-white/50 text-sm font-light focus:outline-none focus:border-[#00000020]"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#999999] mb-2">Cycle Type</label>
                    <select className="w-full px-3 py-2 border border-[#00000008] bg-white/50 text-sm font-light focus:outline-none focus:border-[#00000020]">
                      <option value="daily">Daily</option>
                      <option value="weekly" selected={enhancedGroup.cycle === 'Weekly'}>Weekly</option>
                      <option value="monthly" selected={enhancedGroup.cycle === 'Monthly'}>Monthly</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#00000008]">
                  <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
