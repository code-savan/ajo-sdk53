"use client";
import { useState } from "react";
import { PageHeader } from "../../components/ui";
import { groups, transactions, payouts, users } from "../../data/adminContent";
import Link from "next/link";
import {
  Search,
  Filter,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  PauseCircle,
  Calendar,
  DollarSign,
  Clock,
  Activity,
  BarChart3,
  Download,
  Plus,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  UserCheck,
  AlertTriangle,
  ChevronRight,
  Target,
  Shield,
  RefreshCw
} from "lucide-react";

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cycleFilter, setCycleFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced groups data with additional properties
  const enhancedGroups = groups.map(group => ({
    ...group,
    status: group.id === 'g-2001' ? 'active' : group.id === 'g-2002' ? 'paused' : 'active',
    completionRate: group.id === 'g-2001' ? 85 : group.id === 'g-2002' ? 60 : 92,
    nextPayout: group.id === 'g-2001' ? '2025-08-20' : group.id === 'g-2002' ? '2025-08-25' : '2025-08-18',
    totalContributions: group.id === 'g-2001' ? '$3,450,000' : group.id === 'g-2002' ? '$2,100,000' : '$5,780,000',
    disputes: group.id === 'g-2001' ? 2 : group.id === 'g-2002' ? 5 : 1,
    onTimePayments: group.id === 'g-2001' ? 95 : group.id === 'g-2002' ? 78 : 98,
    startDate: group.id === 'g-2001' ? '2024-06-15' : group.id === 'g-2002' ? '2024-07-01' : '2024-05-20',
    adminId: 'admin-001',
    description: group.id === 'g-2001' ? 'Professional savings group for Miami Vacation' :
                 group.id === 'g-2002' ? 'Trading community savings circle' :
                 'Daily contributions for Drent Club'
  }));

  // Filter groups based on search and filters
  const filteredGroups = enhancedGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          group.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || group.status === statusFilter;
    const matchesCycle = cycleFilter === 'all' || group.cycle.toLowerCase() === cycleFilter;
    return matchesSearch && matchesStatus && matchesCycle;
  });

  // Calculate statistics
  const stats = {
    totalGroups: enhancedGroups.length,
    activeGroups: enhancedGroups.filter(g => g.status === 'active').length,
    pausedGroups: enhancedGroups.filter(g => g.status === 'paused').length,
    completedGroups: enhancedGroups.filter(g => g.status === 'completed').length,
    totalMembers: enhancedGroups.reduce((sum, g) => sum + g.members, 0),
    totalBalance: '$4,210,000',
    avgCompletionRate: Math.round(enhancedGroups.reduce((sum, g) => sum + g.completionRate, 0) / enhancedGroups.length),
    upcomingPayouts: payouts.filter(p => p.status === 'scheduled').length
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100';
      case 'paused': return 'bg-amber-50/50 text-amber-600 border-amber-100';
      case 'completed': return 'bg-blue-50/50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50/50 text-gray-600 border-gray-100';
    }
  };

  const getPerformanceColor = (rate) => {
    if (rate >= 90) return 'text-emerald-600';
    if (rate >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px]">
      <PageHeader title="Group Management" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              <span className="text-xs text-[#999999]">
                {stats.activeGroups} active
              </span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.totalGroups}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Groups</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <UserCheck className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.totalMembers}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Members</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
              <span className="text-xs font-medium text-violet-600">{stats.totalBalance}</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.totalBalance}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Balance</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              <span className="text-xs text-amber-600">{stats.avgCompletionRate}%</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.avgCompletionRate}%</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Avg Completion</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6 border-b border-[#00000008]">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                  : 'text-[#999999] hover:text-[#1E1E1E]'
              }`}
            >
              Groups Overview
            </button>
            <button
              onClick={() => setActiveTab('schedules')}
              className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
                activeTab === 'schedules'
                  ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                  : 'text-[#999999] hover:text-[#1E1E1E]'
              }`}
            >
              Contribution Schedules
            </button>
            <button
              onClick={() => setActiveTab('distributions')}
              className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
                activeTab === 'distributions'
                  ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                  : 'text-[#999999] hover:text-[#1E1E1E]'
              }`}
            >
              Fund Distributions
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
                activeTab === 'performance'
                  ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                  : 'text-[#999999] hover:text-[#1E1E1E]'
              }`}
            >
              Performance Analysis
            </button>
          </div>

          {/* <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Create Group
          </button> */}
        </div>

        {/* Groups Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Search groups by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#00000008] bg-white/50 text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors flex items-center gap-2 text-sm font-light"
                >
                  <Filter className="w-4 h-4" strokeWidth={1.5} />
                  Filters
                </button>
                <button className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors flex items-center gap-2 text-sm font-light">
                  <Download className="w-4 h-4" strokeWidth={1.5} />
                  Export
                </button>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-[#00000008] flex flex-wrap gap-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-[#00000008] bg-white/50 text-sm font-light focus:outline-none focus:border-[#00000020]"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                  <select
                    value={cycleFilter}
                    onChange={(e) => setCycleFilter(e.target.value)}
                    className="px-3 py-2 border border-[#00000008] bg-white/50 text-sm font-light focus:outline-none focus:border-[#00000020]"
                  >
                    <option value="all">All Cycles</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </div>

            {/* Groups List */}
            <div className="space-y-3">
              {filteredGroups.map((group) => (
                <div key={group.id} className="bg-white/80 backdrop-blur-sm border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Link href={`/groups/${group.id}`} className="text-lg font-medium text-[#1E1E1E] hover:text-blue-600 transition-colors flex items-center gap-2">
                          {group.name}
                          <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                        </Link>
                        <p className="text-xs text-[#999999] mt-1">{group.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-3 py-1 font-light uppercase tracking-wider border ${getStatusColor(group.status)}`}>
                          {group.status}
                        </span>
                        <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                          <MoreVertical className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div>
                        <p className="text-[10px] text-[#999999] uppercase tracking-wider mb-1">Members</p>
                        <p className="text-sm font-medium text-[#1E1E1E] flex items-center gap-1">
                          <Users className="w-3 h-3" strokeWidth={1.5} />
                          {group.members}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#999999] uppercase tracking-wider mb-1">Cycle</p>
                        <p className="text-sm font-medium text-[#1E1E1E]">{group.cycle}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#999999] uppercase tracking-wider mb-1">Balance</p>
                        <p className="text-sm font-medium text-emerald-600">{group.balance}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#999999] uppercase tracking-wider mb-1">Next Payout</p>
                        <p className="text-sm font-light text-[#1E1E1E]">{group.nextPayout}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#999999] uppercase tracking-wider mb-1">Completion</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-[#00000008]">
                            <div
                              className={`h-full ${
                                group.completionRate >= 90 ? 'bg-emerald-500' :
                                group.completionRate >= 70 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${group.completionRate}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${getPerformanceColor(group.completionRate)}`}>
                            {group.completionRate}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#999999] uppercase tracking-wider mb-1">On-Time</p>
                        <p className={`text-sm font-medium ${getPerformanceColor(group.onTimePayments)}`}>
                          {group.onTimePayments}%
                        </p>
                      </div>
                    </div>

                    {group.disputes > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#00000008] flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                        <span className="text-xs text-amber-600">{group.disputes} active disputes</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contribution Schedules Tab */}
        {activeTab === 'schedules' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
            <div className="p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Upcoming Contributions</h3>
              <div className="space-y-4">
                {enhancedGroups.map((group) => (
                  <div key={group.id} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-[#1E1E1E]">{group.name}</h4>
                        <p className="text-xs text-[#999999]">{group.cycle} contributions</p>
                      </div>
                      <Calendar className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-[#999999]">Next Due: </span>
                        <span className="font-light text-[#1E1E1E]">{group.nextPayout}</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#999999]">Amount: </span>
                        <span className="font-medium text-emerald-600">$50,000</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#999999]">Collected: </span>
                        <span className="font-light text-[#1E1E1E]">{Math.floor(group.members * 0.8)}/{group.members}</span>
                      </div>
                    </div>
                    <div className="mt-3 h-2 bg-[#00000008]">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                        style={{ width: `${(Math.floor(group.members * 0.8) / group.members) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Fund Distributions Tab */}
        {activeTab === 'distributions' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
            <div className="p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Scheduled Distributions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#00000008]">
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Group</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Recipient</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Amount</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Schedule</th>
                      <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout) => {
                      const group = enhancedGroups.find(g => g.id === payout.groupId);
                      return (
                        <tr key={payout.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA]">
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E]">{group?.name || 'Unknown'}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E]">Member #{Math.floor(Math.random() * 20) + 1}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-medium text-emerald-600">{payout.amount}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-xs text-[#999999]">{payout.scheduledFor}</span>
                          </td>
                          <td className="p-3">
                            <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${
                              payout.status === 'scheduled' ? 'bg-blue-50/50 text-blue-600 border-blue-100' :
                              payout.status === 'processing' ? 'bg-amber-50/50 text-amber-600 border-amber-100' :
                              'bg-emerald-50/50 text-emerald-600 border-emerald-100'
                            }`}>
                              {payout.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Performance Analysis Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Top Performing Groups</h3>
                  <Shield className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                </div>
                <div className="space-y-3">
                  {enhancedGroups
                    .sort((a, b) => b.onTimePayments - a.onTimePayments)
                    .slice(0, 3)
                    .map((group) => (
                      <div key={group.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-light text-[#1E1E1E]">{group.name}</p>
                          <p className="text-xs text-[#999999]">{group.members} members</p>
                        </div>
                        <span className="text-sm font-medium text-emerald-600">{group.onTimePayments}%</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Groups with Issues</h3>
                  <AlertTriangle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                </div>
                <div className="space-y-3">
                  {enhancedGroups
                    .filter(g => g.disputes > 0)
                    .map((group) => (
                      <div key={group.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-light text-[#1E1E1E]">{group.name}</p>
                          <p className="text-xs text-[#999999]">{group.disputes} disputes</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(group.status)}`}>
                          {group.status}
                        </span>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Completion Metrics</h3>
                  <BarChart3 className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#999999]">Average Rate</span>
                    <span className="text-sm font-medium text-[#1E1E1E]">{stats.avgCompletionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#999999]">Completed Cycles</span>
                    <span className="text-sm font-medium text-emerald-600">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#999999]">Active Cycles</span>
                    <span className="text-sm font-medium text-blue-600">{stats.activeGroups}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Historical Performance</h3>
              <div className="space-y-4">
                {enhancedGroups.map((group) => (
                  <div key={group.id} className="border-b border-[#00000008] pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-[#1E1E1E]">{group.name}</h4>
                      <span className="text-xs text-[#999999]">Since {group.startDate}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-xs text-[#999999]">Total Contributions: </span>
                        <span className="font-medium text-emerald-600">{group.totalContributions}</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#999999]">Completion Rate: </span>
                        <span className={`font-medium ${getPerformanceColor(group.completionRate)}`}>
                          {group.completionRate}%
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-[#999999]">On-Time Payments: </span>
                        <span className={`font-medium ${getPerformanceColor(group.onTimePayments)}`}>
                          {group.onTimePayments}%
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-[#999999]">Disputes: </span>
                        <span className={`font-medium ${group.disputes > 2 ? 'text-red-600' : 'text-[#1E1E1E]'}`}>
                          {group.disputes}
                        </span>
                      </div>
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
