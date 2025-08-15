"use client";
import React, { useState, use } from "react";
import { PageHeader } from "../../../components/ui";
import { users, userActivityLogs, supportTickets, transactions, groups } from "../../../data/adminContent";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  Ban,
  Edit,
  Trash2,
  Download,
  Activity,
  Users,
  DollarSign,
  Clock,
  Ticket,
  TrendingUp,
  MapPin,
  CreditCard,
  Lock,
  Unlock,
  MessageSquare,
  RefreshCw,
  MoreVertical,
  UserCheck,
  UserX,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function UserDetail({ params }) {
  // Unwrap params if it's a Promise (Next.js 14+)
  const unwrappedParams = typeof params?.then === "function" ? use(params) : params;
  const userId = unwrappedParams?.id;

  const user = users.find((u) => u.id === userId) || users[0];
  const [activeTab, setActiveTab] = useState("overview");
  const [showActionMenu, setShowActionMenu] = useState(false);

  // Get user's activity logs
  const userLogs = userActivityLogs.filter(log => log.userId === user.id);

  // Get user's support tickets
  const userTickets = supportTickets.filter(ticket => ticket.userId === user.id);

  // Get user's transactions
  const userTransactions = transactions.filter(t => t.userId === user.id);

  // Get user's groups (simulated)
  const userGroups = groups.slice(0, user.groupCount || 0);

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
      case 'low': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100';
      case 'medium': return 'bg-amber-50/50 text-amber-600 border-amber-100';
      case 'high': return 'bg-red-50/50 text-red-600 border-red-100';
      default: return 'bg-gray-50/50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px]">
      <PageHeader title="User Details" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">

        {/* Back Navigation */}
        <Link href="/users" className="inline-flex items-center gap-2 text-sm text-[#999999] hover:text-[#1E1E1E] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to Users
        </Link>

        {/* User Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* User Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-light">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-2xl font-light text-[#1E1E1E] mb-2">{user.name}</h1>
                <div className="flex items-center gap-4 mb-3">
                  <span className={`text-[10px] px-3 py-1 font-light uppercase tracking-wider border ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                  <span className={`text-[10px] px-3 py-1 font-light uppercase tracking-wider border ${getRiskColor(user.riskLevel)}`}>
                    Risk: {user.riskLevel}
                  </span>
                  <div className="flex items-center gap-1">
                    {user.verificationStatus === 'verified' ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                        <span className="text-xs text-emerald-600">Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                        <span className="text-xs text-amber-600">Pending Verification</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-[#999999]">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" strokeWidth={1.5} />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" strokeWidth={1.5} />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" strokeWidth={1.5} />
                    <span>Joined {user.joinedAt}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2">
                <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                Send Message
              </button>
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
                    {user.status === 'suspended' ? (
                      <button className="w-full px-4 py-2 text-left text-sm font-light hover:bg-[#FAFAFA] transition-colors flex items-center gap-2">
                        <Unlock className="w-4 h-4" strokeWidth={1.5} />
                        Activate Account
                      </button>
                    ) : (
                      <button className="w-full px-4 py-2 text-left text-sm font-light hover:bg-[#FAFAFA] transition-colors flex items-center gap-2">
                        <Lock className="w-4 h-4" strokeWidth={1.5} />
                        Suspend Account
                      </button>
                    )}
                    <button className="w-full px-4 py-2 text-left text-sm font-light hover:bg-[#FAFAFA] transition-colors flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
                      Reset Password
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm font-light hover:bg-[#FAFAFA] transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" strokeWidth={1.5} />
                      Export Data
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm font-light hover:bg-[#FAFAFA] transition-colors flex items-center gap-2 text-red-600">
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      Delete Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{user.totalSavings}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Savings</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              <span className="text-xs text-blue-600">{user.groupCount}</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{user.groupCount}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Active Groups</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
              <span className="text-xs text-violet-600">{userTransactions.length}</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">{userTransactions.length}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Transactions</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              <ChevronRight className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-light text-[#1E1E1E]">{user.lastLogin}</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Last Login</p>
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
            Profile Overview
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'activity'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Activity History
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'groups'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Groups
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
            onClick={() => setActiveTab('tickets')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'tickets'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Support Tickets
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">

          {/* Profile Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">User ID</span>
                      <span className="text-sm font-light text-[#1E1E1E]">{user.id}</span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Full Name</span>
                      <span className="text-sm font-light text-[#1E1E1E]">{user.name}</span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Email</span>
                      <span className="text-sm font-light text-[#1E1E1E]">{user.email}</span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Phone</span>
                      <span className="text-sm font-light text-[#1E1E1E]">{user.phone}</span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Referral Source</span>
                      <span className="text-sm font-light text-[#1E1E1E]">{user.referralSource}</span>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Account Status</span>
                      <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Verification</span>
                      <div className="flex items-center gap-1">
                        {user.verificationStatus === 'verified' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                        )}
                        <span className="text-sm font-light text-[#1E1E1E]">{user.verificationStatus}</span>
                      </div>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Risk Level</span>
                      <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getRiskColor(user.riskLevel)}`}>
                        {user.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Join Date</span>
                      <span className="text-sm font-light text-[#1E1E1E]">{user.joinedAt}</span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-[#00000008]">
                      <span className="text-xs uppercase tracking-wider text-[#999999]">Last Login</span>
                      <span className="text-sm font-light text-[#1E1E1E]">{user.lastLogin}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="mt-8">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Financial Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-[#00000008]">
                    <p className="text-2xl font-light text-[#1E1E1E]">{user.totalSavings}</p>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mt-1">Total Savings</p>
                  </div>
                  <div className="p-4 border border-[#00000008]">
                    <p className="text-2xl font-light text-[#1E1E1E]">{user.groupCount}</p>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mt-1">Active Groups</p>
                  </div>
                  <div className="p-4 border border-[#00000008]">
                    <p className="text-2xl font-light text-[#1E1E1E]">{userTransactions.length}</p>
                    <p className="text-xs uppercase tracking-wider text-[#999999] mt-1">Total Transactions</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity History Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Activity History</h3>
              <div className="space-y-3">
                {userLogs.length > 0 ? (
                  userLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border-l-2 border-transparent hover:border-blue-500 hover:bg-[#FAFAFA] transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <Activity className={`w-4 h-4 ${log.status === 'success' ? 'text-emerald-600' : log.status === 'failed' ? 'text-red-600' : 'text-amber-600'}`} strokeWidth={1.5} />
                        <div>
                          <p className="text-sm font-light text-[#1E1E1E]">{log.action}</p>
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
                  ))
                ) : (
                  <div className="text-center py-8 text-[#999999] text-sm font-light">
                    No activity logs found for this user
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div className="p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">User Groups ({userGroups.length})</h3>
              <div className="space-y-4">
                {userGroups.length > 0 ? (
                  userGroups.map((group) => (
                    <div key={group.id} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-[#1E1E1E]">{group.name}</h4>
                        <span className="text-[10px] px-2 py-1 uppercase tracking-wider text-[#999999] border border-[#00000008]">
                          {group.cycle}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-xs text-[#999999]">Members: </span>
                          <span className="font-light text-[#1E1E1E]">{group.members}</span>
                        </div>
                        <div>
                          <span className="text-xs text-[#999999]">Balance: </span>
                          <span className="font-medium text-emerald-600">{group.balance}</span>
                        </div>
                      </div>
                      <div className="mt-3 h-1 bg-[#00000008]">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                          style={{ width: `${(group.members / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[#999999] text-sm font-light">
                    User is not part of any groups
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Transaction History</h3>
              <div className="overflow-x-auto">
                {userTransactions.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#00000008]">
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">ID</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Type</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Amount</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Date</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA]">
                          <td className="p-3">
                            <span className="text-xs text-[#999999]">{transaction.id}</span>
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
                ) : (
                  <div className="text-center py-8 text-[#999999] text-sm font-light">
                    No transactions found for this user
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Support Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="p-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Support Tickets</h3>
              <div className="space-y-3">
                {userTickets.length > 0 ? (
                  userTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Ticket className={`w-5 h-5 ${
                            ticket.priority === 'high' ? 'text-red-600' :
                            ticket.priority === 'medium' ? 'text-amber-600' :
                            'text-gray-600'
                          }`} strokeWidth={1.5} />
                          <div>
                            <p className="text-sm font-light text-[#1E1E1E]">{ticket.subject}</p>
                            <p className="text-xs text-[#999999]">Created: {ticket.createdAt}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${
                          ticket.status === 'open' ? 'bg-red-50/50 text-red-600 border-red-100' :
                          ticket.status === 'in-progress' ? 'bg-amber-50/50 text-amber-600 border-amber-100' :
                          'bg-emerald-50/50 text-emerald-600 border-emerald-100'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#00000008] flex items-center justify-between text-xs text-[#999999]">
                        <span>Assigned to: {ticket.assignedTo}</span>
                        <span className={`uppercase ${
                          ticket.priority === 'high' ? 'text-red-600' :
                          ticket.priority === 'medium' ? 'text-amber-600' :
                          'text-gray-600'
                        }`}>
                          {ticket.priority} priority
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[#999999] text-sm font-light">
                    No support tickets found for this user
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
