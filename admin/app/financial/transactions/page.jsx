"use client";
import { useState } from "react";
import { PageHeader } from "../../../components/ui";
import { transactions, users, groups } from "../../../data/adminContent";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Receipt,
  CreditCard,
  Banknote,
  Wallet,
  MoreVertical,
  Eye,
  Copy,
  ExternalLink,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity
} from "lucide-react";

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // Enhanced transactions data
  const enhancedTransactions = transactions.map(t => ({
    ...t,
    userName: users.find(u => u.id === t.userId)?.name || 'Unknown User',
    userEmail: users.find(u => u.id === t.userId)?.email || 'unknown@email.com',
    method: t.type === 'deposit' ? 'Bank Transfer' : t.type === 'withdrawal' ? 'Bank Account' : 'Wallet',
    fee: '$2.50',
    net: parseFloat(t.amount.replace('$', '').replace(',', '')) - 2.5,
    reference: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    gateway: ['Stripe', 'Paystack', 'Flutterwave'][Math.floor(Math.random() * 3)],
    ip: '192.168.1.' + Math.floor(Math.random() * 255),
    device: 'Chrome/Windows',
    groupId: groups[Math.floor(Math.random() * groups.length)]?.id,
    groupName: groups[Math.floor(Math.random() * groups.length)]?.name
  }));
  
  // Add more transactions for demonstration
  const allTransactions = [
    ...enhancedTransactions,
    {
      id: 't-3004',
      userId: 'u-1004',
      userName: 'Fatima Ibrahim',
      userEmail: 'fatima.i@example.com',
      type: 'payout',
      amount: '$120,000',
      date: '2025-08-14',
      status: 'processing',
      method: 'Bank Transfer',
      fee: '$5.00',
      net: 119995,
      reference: 'REF-ABC123XYZ',
      gateway: 'Stripe',
      ip: '192.168.1.100',
      device: 'Safari/Mac',
      groupId: 'g-2001',
      groupName: 'Abuja Savers'
    },
    {
      id: 't-3005',
      userId: 'u-1005',
      userName: 'Chidi Okonkwo',
      userEmail: 'chidi.ok@example.com',
      type: 'deposit',
      amount: '$75,000',
      date: '2025-08-13',
      status: 'success',
      method: 'Card',
      fee: '$3.00',
      net: 74997,
      reference: 'REF-DEF456UVW',
      gateway: 'Paystack',
      ip: '192.168.1.150',
      device: 'Firefox/Windows',
      groupId: 'g-2002',
      groupName: 'Kano Traders'
    }
  ];
  
  // Filter transactions
  const filteredTransactions = allTransactions.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Calculate statistics
  const stats = {
    totalVolume: '$6,620,000',
    totalTransactions: allTransactions.length,
    successfulTransactions: allTransactions.filter(t => t.status === 'success').length,
    pendingTransactions: allTransactions.filter(t => t.status === 'pending').length,
    failedTransactions: allTransactions.filter(t => t.status === 'failed').length,
    totalFees: '$125.50',
    averageTransaction: '$220,666'
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-amber-50/50 text-amber-600 border-amber-100';
      case 'processing': return 'bg-blue-50/50 text-blue-600 border-blue-100';
      case 'failed': return 'bg-red-50/50 text-red-600 border-red-100';
      default: return 'bg-gray-50/50 text-gray-600 border-gray-100';
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-600" strokeWidth={1.5} />;
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" strokeWidth={1.5} />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" strokeWidth={1.5} />;
    }
  };
  
  const getTypeIcon = (type) => {
    switch(type) {
      case 'deposit': return <ArrowUpRight className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />;
      case 'withdrawal': return <ArrowDownRight className="w-4 h-4 text-red-600" strokeWidth={1.5} />;
      case 'payout': return <Banknote className="w-4 h-4 text-blue-600" strokeWidth={1.5} />;
      default: return <Receipt className="w-4 h-4 text-gray-600" strokeWidth={1.5} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px]">
      <PageHeader title="Transaction Management" />
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
              <DollarSign className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.totalVolume}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Volume</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              <span className="text-xs text-blue-600">{stats.totalTransactions}</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.totalTransactions}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Transactions</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <span className="text-xs text-emerald-600">{Math.round((stats.successfulTransactions / stats.totalTransactions) * 100)}%</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.successfulTransactions}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Successful</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              <span className="text-xs text-amber-600">{stats.pendingTransactions}</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{stats.pendingTransactions}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Pending</p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search by ID, user, email, or reference..."
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
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#00000008] flex flex-wrap gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-[#00000008] bg-white/50 text-sm font-light focus:outline-none focus:border-[#00000020]"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-[#00000008] bg-white/50 text-sm font-light focus:outline-none focus:border-[#00000020]"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="payout">Payouts</option>
              </select>
            </div>
          )}
        </div>
        
        {/* Transactions Table */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#00000008]">
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Transaction</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">User</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Type</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Amount</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Method</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Gateway</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Date</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                  <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA] transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-[#1E1E1E]">{transaction.id}</p>
                        <p className="text-xs text-[#999999]">{transaction.reference}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <Link href={`/users/${transaction.userId}`} className="text-sm font-light text-[#1E1E1E] hover:text-blue-600 transition-colors">
                          {transaction.userName}
                        </Link>
                        <p className="text-xs text-[#999999]">{transaction.userEmail}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <span className="text-sm font-light text-[#1E1E1E] capitalize">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-[#1E1E1E]">{transaction.amount}</p>
                        <p className="text-xs text-[#999999]">Fee: {transaction.fee}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {transaction.method === 'Card' && <CreditCard className="w-3 h-3 text-[#999999]" strokeWidth={1.5} />}
                        {transaction.method === 'Bank Transfer' && <Banknote className="w-3 h-3 text-[#999999]" strokeWidth={1.5} />}
                        {transaction.method === 'Wallet' && <Wallet className="w-3 h-3 text-[#999999]" strokeWidth={1.5} />}
                        <span className="text-sm font-light text-[#1E1E1E]">{transaction.method}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-light text-[#1E1E1E]">{transaction.gateway}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-light text-[#1E1E1E]">{transaction.date}</p>
                        <p className="text-xs text-[#999999]">10:30 AM</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="p-1 hover:bg-[#FAFAFA] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                        </button>
                        <button className="p-1 hover:bg-[#FAFAFA] transition-colors" title="Copy Reference">
                          <Copy className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
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
        
        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedTransaction(null)}>
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-[#00000008]">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-light text-[#1E1E1E]">Transaction Details</h3>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="p-1 hover:bg-[#FAFAFA] transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-[#999999]" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Transaction ID</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Reference</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedTransaction.reference}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Amount</p>
                    <p className="text-lg font-medium text-[#1E1E1E]">{selectedTransaction.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Status</p>
                    <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(selectedTransaction.status)}`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">User</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedTransaction.userName}</p>
                    <p className="text-xs text-[#999999]">{selectedTransaction.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Group</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedTransaction.groupName}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Payment Method</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedTransaction.method}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Gateway</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedTransaction.gateway}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">IP Address</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedTransaction.ip}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mb-1">Device</p>
                    <p className="text-sm font-light text-[#1E1E1E]">{selectedTransaction.device}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-[#00000008]">
                  <p className="text-xs uppercase tracking-wider text-[#999999] mb-3">Transaction Timeline</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-light text-[#1E1E1E]">Transaction Initiated</p>
                        <p className="text-xs text-[#999999]">{selectedTransaction.date} 10:30:00 AM</p>
                      </div>
                    </div>
                    {selectedTransaction.status === 'success' && (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-light text-[#1E1E1E]">Payment Processed</p>
                            <p className="text-xs text-[#999999]">{selectedTransaction.date} 10:30:15 AM</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-light text-[#1E1E1E]">Transaction Completed</p>
                            <p className="text-xs text-[#999999]">{selectedTransaction.date} 10:30:45 AM</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
