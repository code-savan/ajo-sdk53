"use client";
import { useState } from "react";
import { PageHeader } from "../../../components/ui";
import { payouts, groups, users } from "../../../data/adminContent";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Banknote,
  Calendar,
  Users,
  Play,
  Pause,
  MoreVertical,
  Eye,
  DollarSign,
  TrendingUp,
  Activity,
  Send,
  ChevronRight,
  AlertTriangle,
  Info
} from "lucide-react";

export default function PayoutsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  
  // Enhanced payouts data
  const enhancedPayouts = payouts.map(p => {
    const group = groups.find(g => g.id === p.groupId);
    const recipientIndex = Math.floor(Math.random() * users.length);
    const recipient = users[recipientIndex];
    return {
      ...p,
      groupName: group?.name || 'Unknown Group',
      groupCycle: group?.cycle || 'Unknown',
      groupMembers: group?.members || 0,
      recipientId: recipient?.id,
      recipientName: recipient?.name || 'Unknown Recipient',
      recipientEmail: recipient?.email || 'unknown@email.com',
      recipientBank: 'First Bank',
      recipientAccount: '******' + Math.floor(Math.random() * 9000 + 1000),
      method: 'Bank Transfer',
      reference: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      createdAt: '2025-08-10',
      processedBy: 'System',
      approvedBy: p.status === 'processing' || p.status === 'completed' ? 'Admin' : null,
      attempts: p.status === 'failed' ? 3 : 1
    };
  });
  
  // Add more payouts for demonstration
  const allPayouts = [
    ...enhancedPayouts,
    {
      id: 'p-4003',
      groupId: 'g-2003',
      groupName: 'Lagos Crew',
      groupCycle: 'Daily',
      groupMembers: 32,
      amount: '$200,000',
      scheduledFor: '2025-08-18',
      status: 'completed',
      recipientId: 'u-1004',
      recipientName: 'Fatima Ibrahim',
      recipientEmail: 'fatima.i@example.com',
      recipientBank: 'GTBank',
      recipientAccount: '******7890',
      method: 'Bank Transfer',
      reference: 'PAY-XYZ123ABC',
      createdAt: '2025-08-11',
      processedBy: 'System',
      approvedBy: 'Admin',
      attempts: 1
    },
    {
      id: 'p-4004',
      groupId: 'g-2001',
      groupName: 'Abuja Savers',
      groupCycle: 'Weekly',
      groupMembers: 24,
      amount: '$150,000',
      scheduledFor: '2025-08-22',
      status: 'failed',
      recipientId: 'u-1005',
      recipientName: 'Chidi Okonkwo',
      recipientEmail: 'chidi.ok@example.com',
      recipientBank: 'Access Bank',
      recipientAccount: '******4567',
      method: 'Bank Transfer',
      reference: 'PAY-DEF456UVW',
      createdAt: '2025-08-12',
      processedBy: 'System',
      approvedBy: null,
      attempts: 3
    }
  ];
  
  // Filter payouts
  const filteredPayouts = allPayouts.filter(p => {
    const matchesSearch = 
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Calculate statistics
  const stats = {
    totalPayouts: allPayouts.length,
    scheduledPayouts: allPayouts.filter(p => p.status === 'scheduled').length,
    processingPayouts: allPayouts.filter(p => p.status === 'processing').length,
    completedPayouts: allPayouts.filter(p => p.status === 'completed').length,
    failedPayouts: allPayouts.filter(p => p.status === 'failed').length,
    totalVolume: '$750,000',
    todayPayouts: 3,
    weekPayouts: 12
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100';
      case 'processing': return 'bg-blue-50/50 text-blue-600 border-blue-100';
      case 'scheduled': return 'bg-violet-50/50 text-violet-600 border-violet-100';
      case 'failed': return 'bg-red-50/50 text-red-600 border-red-100';
      default: return 'bg-gray-50/50 text-gray-600 border-gray-100';
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />;
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" strokeWidth={1.5} />;
      case 'scheduled': return <Clock className="w-4 h-4 text-violet-600" strokeWidth={1.5} />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" strokeWidth={1.5} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px]">
      <PageHeader title="Payout Management" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">
        
        {/* Back Navigation */}
        <Link href="/financial" className="inline-flex items-center gap-2 text-sm text-[#999999] hover:text-[#1E1E1E] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to Financial Dashboard
        </Link>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Banknote className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.totalVolume}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Volume</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
              <span className="text-xs text-violet-600">{stats.scheduledPayouts}</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.scheduledPayouts}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Scheduled</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <RefreshCw className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              <span className="text-xs text-blue-600">{stats.processingPayouts}</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.processingPayouts}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Processing</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <span className="text-xs text-emerald-600">{Math.round((stats.completedPayouts / stats.totalPayouts) * 100)}%</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.completedPayouts}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Completed</p>
          </div>
        </div>
        
        {/* Alerts */}
        {stats.failedPayouts > 0 && (
          <div className="bg-red-50/50 border border-red-100 p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" strokeWidth={1.5} />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">{stats.failedPayouts} Failed Payouts</p>
                <p className="text-xs text-red-700">These payouts require immediate attention and manual processing</p>
              </div>
              <button className="px-3 py-1 bg-red-600 text-white text-xs font-light hover:bg-red-700 transition-colors">
                Review Failed
              </button>
            </div>
          </div>
        )}
        
        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search by ID, group, recipient, or reference..."
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
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-[#00000008] bg-white/50 text-sm font-light focus:outline-none focus:border-[#00000020]"
            >
              <option value="24h">Today</option>
              <option value="7d">This Week</option>
              <option value="30d">This Month</option>
              <option value="90d">Last 3 Months</option>
            </select>
            <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2">
              <Send className="w-4 h-4" strokeWidth={1.5} />
              Process Payouts
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
                <option value="scheduled">Scheduled</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          )}
        </div>
        
        {/* Payouts Table */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#00000008]">
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Payout</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Group</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Recipient</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Amount</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Bank Details</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Schedule</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA] transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-[#1E1E1E]">{payout.id}</p>
                        <p className="text-xs text-[#999999]">{payout.reference}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <Link href={`/groups/${payout.groupId}`} className="text-sm font-light text-[#1E1E1E] hover:text-blue-600 transition-colors">
                          {payout.groupName}
                        </Link>
                        <p className="text-xs text-[#999999]">{payout.groupCycle} • {payout.groupMembers} members</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <Link href={`/users/${payout.recipientId}`} className="text-sm font-light text-[#1E1E1E] hover:text-blue-600 transition-colors">
                          {payout.recipientName}
                        </Link>
                        <p className="text-xs text-[#999999]">{payout.recipientEmail}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-[#1E1E1E]">{payout.amount}</p>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-light text-[#1E1E1E]">{payout.recipientBank}</p>
                        <p className="text-xs text-[#999999]">{payout.recipientAccount}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-light text-[#1E1E1E]">{payout.scheduledFor}</p>
                        <p className="text-xs text-[#999999]">10:00 AM</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payout.status)}
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(payout.status)}`}>
                          {payout.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {payout.status === 'scheduled' && (
                          <button className="p-1 hover:bg-[#FAFAFA] transition-colors" title="Process Now">
                            <Play className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                          </button>
                        )}
                        {payout.status === 'processing' && (
                          <button className="p-1 hover:bg-[#FAFAFA] transition-colors" title="Pause">
                            <Pause className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                          </button>
                        )}
                        {payout.status === 'failed' && (
                          <button className="p-1 hover:bg-[#FAFAFA] transition-colors" title="Retry">
                            <RefreshCw className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedPayout(payout)}
                          className="p-1 hover:bg-[#FAFAFA] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                        </button>
                        <button className="p-1 hover:bg-[#FAFAFA] transition-colors" title="More Options">
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
        
        {/* Payout Detail Modal */}
        {selectedPayout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedPayout(null)}>
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-[#00000008]">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-light text-[#1E1E1E]">Payout Details</h3>
                  <button
                    onClick={() => setSelectedPayout(null)}
                    className="p-1 hover:bg-[#FAFAFA] transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-[#999999]" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Payout ID</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedPayout.id}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Reference</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedPayout.reference}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Amount</p>
                    <p className="text-lg font-medium text-[#1E1E1E]">{selectedPayout.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Status</p>
                    <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(selectedPayout.status)}`}>
                      {selectedPayout.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Group</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedPayout.groupName}</p>
                    <p className="text-xs text-[#999999]">{selectedPayout.groupCycle} cycle</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Recipient</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedPayout.recipientName}</p>
                    <p className="text-xs text-[#999999]">{selectedPayout.recipientEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Bank Account</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedPayout.recipientBank}</p>
                    <p className="text-xs text-[#999999]">{selectedPayout.recipientAccount}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Method</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedPayout.method}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Scheduled For</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedPayout.scheduledFor}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Created</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedPayout.createdAt}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-[#00000008]">
                  <p className="text-xs uppercase tracking-wider text-[#999999] mb-3">Processing Information</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#999999]">Processed By</span>
                      <span className="text-sm font-light text-[#1E1E1E]">{selectedPayout.processedBy}</span>
                    </div>
                    {selectedPayout.approvedBy && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#999999]">Approved By</span>
                        <span className="text-sm font-light text-[#1E1E1E]">{selectedPayout.approvedBy}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#999999]">Attempts</span>
                      <span className="text-sm font-light text-[#1E1E1E]">{selectedPayout.attempts}</span>
                    </div>
                  </div>
                </div>
                
                {selectedPayout.status === 'failed' && (
                  <div className="mt-6 p-4 bg-red-50/50 border border-red-100">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" strokeWidth={1.5} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">Payout Failed</p>
                        <p className="text-xs text-red-700">Bank account verification failed after {selectedPayout.attempts} attempts</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="px-3 py-1 bg-red-600 text-white text-xs font-light hover:bg-red-700 transition-colors">
                        Retry Payout
                      </button>
                      <button className="px-3 py-1 border border-red-200 text-red-600 text-xs font-light hover:bg-red-50 transition-colors">
                        Contact Recipient
                      </button>
                    </div>
                  </div>
                )}
                
                {selectedPayout.status === 'scheduled' && (
                  <div className="mt-6 flex items-center gap-2">
                    <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2">
                      <Send className="w-4 h-4" strokeWidth={1.5} />
                      Process Now
                    </button>
                    <button className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] text-sm font-light transition-colors">
                      Cancel Payout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
