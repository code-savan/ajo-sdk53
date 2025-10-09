"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "../components/ui";
import { demoStats, users, groups, transactions } from "../data/adminContent";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  UserPlus,
  UsersRound,
  Receipt,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUp,
  ArrowDown,
  Activity,
  Eye,
  Sparkles,
  CircleDot,
  Bell,
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  PieChart,
  TrendingDown,
  UserCheck,
  Settings
} from "lucide-react";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, refreshSession } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Refresh session on user activity
  useEffect(() => {
    const handleUserActivity = () => {
      refreshSession();
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [refreshSession]);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };

  // Comprehensive stats from all main menu sections
  const comprehensiveStats = [
    // Users section
    { title: 'Total Users', value: '2,845', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Verified Users', value: '2,634', change: '+8%', icon: UserCheck, color: 'emerald' },
    { title: 'New This Month', value: '156', change: '+23%', icon: UserPlus, color: 'violet' },
    { title: 'User Retention', value: '94.2%', change: '+2%', icon: TrendingUp, color: 'indigo' },

    // Groups section
    { title: 'Active Groups', value: '142', change: '+8%', icon: UsersRound, color: 'teal' },
    { title: 'Total Members', value: '1,268', change: '+15%', icon: Users, color: 'cyan' },
    { title: 'Groups Created', value: '18', change: '+6%', icon: Building2, color: 'green' },
    { title: 'Completion Rate', value: '87.5%', change: '+4%', icon: CheckCircle, color: 'emerald' },

    // Financial section
    { title: 'Total Volume', value: '$12.8M', change: '+23%', icon: DollarSign, color: 'yellow' },
    { title: 'Monthly Revenue', value: '$485K', change: '+18%', icon: TrendingUp, color: 'orange' },
    { title: 'Total Transactions', value: '8,429', change: '+31%', icon: Receipt, color: 'red' },
    { title: 'Pending Payouts', value: '$127K', change: '-5%', icon: Clock, color: 'amber' },

    // Analytics section
    { title: 'Growth Rate', value: '+23.5%', change: '+5%', icon: BarChart3, color: 'purple' },
    { title: 'Avg. Savings', value: '$4,250', change: '+12%', icon: PieChart, color: 'pink' },
    { title: 'Success Rate', value: '96.8%', change: '+1%', icon: Activity, color: 'blue' },
    { title: 'User Engagement', value: '78.9%', change: '+7%', icon: TrendingUp, color: 'indigo' },

    // Notifications section
    { title: 'Active Campaigns', value: '24', change: '+3%', icon: Bell, color: 'violet' },
    { title: 'Delivery Rate', value: '98.2%', change: '+0.5%', icon: CheckCircle, color: 'emerald' },
    { title: 'Open Rate', value: '67.4%', change: '+8%', icon: Eye, color: 'blue' },
    { title: 'Click Rate', value: '12.8%', change: '+15%', icon: ArrowUp, color: 'green' },

    // Security section
    { title: 'Security Score', value: '98.5%', change: '+1%', icon: Shield, color: 'green' },
    { title: 'Failed Logins', value: '23', change: '-12%', icon: Lock, color: 'red' },
    { title: '2FA Enabled', value: '89.4%', change: '+6%', icon: UserCheck, color: 'emerald' },
    { title: 'Risk Alerts', value: '7', change: '-18%', icon: AlertTriangle, color: 'amber' }
  ];

  const getStatColor = (colorName) => {
    const colors = {
      blue: { bg: 'bg-blue-50/50', icon: 'text-blue-600', border: 'border-blue-100' },
      emerald: { bg: 'bg-emerald-50/50', icon: 'text-emerald-600', border: 'border-emerald-100' },
      violet: { bg: 'bg-violet-50/50', icon: 'text-violet-600', border: 'border-violet-100' },
      amber: { bg: 'bg-amber-50/50', icon: 'text-amber-600', border: 'border-amber-100' },
      indigo: { bg: 'bg-indigo-50/50', icon: 'text-indigo-600', border: 'border-indigo-100' },
      teal: { bg: 'bg-teal-50/50', icon: 'text-teal-600', border: 'border-teal-100' },
      cyan: { bg: 'bg-cyan-50/50', icon: 'text-cyan-600', border: 'border-cyan-100' },
      green: { bg: 'bg-green-50/50', icon: 'text-green-600', border: 'border-green-100' },
      yellow: { bg: 'bg-yellow-50/50', icon: 'text-yellow-600', border: 'border-yellow-100' },
      orange: { bg: 'bg-orange-50/50', icon: 'text-orange-600', border: 'border-orange-100' },
      red: { bg: 'bg-red-50/50', icon: 'text-red-600', border: 'border-red-100' },
      purple: { bg: 'bg-purple-50/50', icon: 'text-purple-600', border: 'border-purple-100' },
      pink: { bg: 'bg-pink-50/50', icon: 'text-pink-600', border: 'border-pink-100' }
    };
    return colors[colorName] || colors.blue;
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
      <PageHeader title="Dashboard" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between border-b border-[#00000008] pb-4">
          <div>
            <h2 className="text-2xl font-light text-[#1E1E1E]">
              Welcome back, {user?.fullName?.split(' ')[0] || 'Admin'}
            </h2>
            <p className="text-[#999999] text-xs mt-1 font-light">
              Here's what's happening with your platform today
            </p>
          </div>
          <div className="text-right">
            <p className="text-[#1E1E1E] text-sm font-light">
              {formatTime(currentTime)} EST
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

        {/* Platform Overview - Minimal */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] mb-8">
          <div className="p-6 border-b border-[#00000008]">
            <h3 className="text-lg font-light text-[#1E1E1E]">Platform Overview</h3>
            <p className="text-xs text-[#999999] mt-1">Essential platform metrics at a glance</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Total Users */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50/50 border border-blue-100 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                </div>
                <p className="text-2xl font-light text-[#1E1E1E] mb-1">2,845</p>
                <p className="text-xs text-[#999999] uppercase tracking-wider mb-1">Total Users</p>
                <span className="text-xs text-emerald-600 font-medium">+12% this month</span>
              </div>

              {/* Active Groups */}
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-50/50 border border-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <UsersRound className="w-6 h-6 text-emerald-600" strokeWidth={1.5} />
                </div>
                <p className="text-2xl font-light text-[#1E1E1E] mb-1">142</p>
                <p className="text-xs text-[#999999] uppercase tracking-wider mb-1">Active Groups</p>
                <span className="text-xs text-emerald-600 font-medium">+8% this month</span>
              </div>

              {/* Monthly Revenue */}
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-50/50 border border-amber-100 flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-amber-600" strokeWidth={1.5} />
                </div>
                <p className="text-2xl font-light text-[#1E1E1E] mb-1">$485K</p>
                <p className="text-xs text-[#999999] uppercase tracking-wider mb-1">Monthly Revenue</p>
                <span className="text-xs text-emerald-600 font-medium">+18% this month</span>
              </div>

              {/* Platform Health */}
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50/50 border border-green-100 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" strokeWidth={1.5} />
                </div>
                <p className="text-2xl font-light text-[#1E1E1E] mb-1">96.8%</p>
                <p className="text-xs text-[#999999] uppercase tracking-wider mb-1">Platform Health</p>
                <span className="text-xs text-emerald-600 font-medium">All systems good</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Simplified */}
        <div className="bg-white/80 backdrop-blur-sm p-6 mb-8 border border-[#00000008]">
          <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link href="/users" className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-center">
              <Users className="w-5 h-5 mb-2 text-blue-500 mx-auto" strokeWidth={1.5} />
              <span className="text-sm font-light text-[#1E1E1E] block">Users</span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
            <Link href="/groups" className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-center">
              <UsersRound className="w-5 h-5 mb-2 text-emerald-500 mx-auto" strokeWidth={1.5} />
              <span className="text-sm font-light text-[#1E1E1E] block">Groups</span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
            <Link href="/financial" className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-center">
              <DollarSign className="w-5 h-5 mb-2 text-amber-500 mx-auto" strokeWidth={1.5} />
              <span className="text-sm font-light text-[#1E1E1E] block">Financial</span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
            <Link href="/analytics" className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-center">
              <BarChart3 className="w-5 h-5 mb-2 text-purple-500 mx-auto" strokeWidth={1.5} />
              <span className="text-sm font-light text-[#1E1E1E] block">Analytics</span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
            <Link href="/notifications" className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-center">
              <Bell className="w-5 h-5 mb-2 text-violet-500 mx-auto" strokeWidth={1.5} />
              <span className="text-sm font-light text-[#1E1E1E] block">Notifications</span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
            <Link href="/security" className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-center">
              <Shield className="w-5 h-5 mb-2 text-green-500 mx-auto" strokeWidth={1.5} />
              <span className="text-sm font-light text-[#1E1E1E] block">Security</span>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Activity Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Users */}
          <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
            <div className="flex items-center justify-between mb-6 border-b border-[#00000008] pb-3">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Recent Users</h3>
              <Link href="/users" className="text-xs text-[#999999] hover:text-[#1E1E1E] transition-colors">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border-l-2 border-transparent hover:border-blue-500 hover:bg-[#FAFAFA] transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#FAFAFA] border border-[#00000008] flex items-center justify-center text-[#1E1E1E] font-light text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-light text-[#1E1E1E]">{user.name}</p>
                      <p className="text-xs text-[#999999]">{user.email}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider ${
                    user.status === 'active' ? 'bg-emerald-50/50 text-emerald-600 border border-emerald-100' :
                    user.status === 'pending' ? 'bg-amber-50/50 text-amber-600 border border-amber-100' :
                    'bg-red-50/50 text-red-600 border border-red-100'
                  }`}>
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Groups */}
          <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
            <div className="flex items-center justify-between mb-6 border-b border-[#00000008] pb-3">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Active Groups</h3>
              <Link href="/groups" className="text-xs text-[#999999] hover:text-[#1E1E1E] transition-colors">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {groups.slice(0, 3).map((group) => (
                <div key={group.id} className="p-3 border-l-2 border-transparent hover:border-emerald-500 hover:bg-[#FAFAFA] transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-light text-[#1E1E1E]">{group.name}</h4>
                    <span className="text-[10px] uppercase tracking-wider text-[#999999]">{group.cycle}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-[#999999]">{group.members} members</span>
                    <span className="font-medium text-emerald-600">{group.balance}</span>
                  </div>
                  <div className="h-0.5 bg-[#00000008]">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      style={{ width: `${(group.members / 50) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
            <div className="flex items-center justify-between mb-6 border-b border-[#00000008] pb-3">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Recent Transactions</h3>
              <Link href="/financial/transactions" className="text-xs text-[#999999] hover:text-[#1E1E1E] transition-colors">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="p-3 border-l-2 border-transparent hover:border-violet-500 hover:bg-[#FAFAFA] transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 flex items-center justify-center ${
                        transaction.type === 'deposit' ? 'bg-emerald-50/50 text-emerald-600' : 'bg-red-50/50 text-red-600'
                      }`}>
                        {transaction.type === 'deposit' ? (
                          <ArrowUp className="w-3 h-3" strokeWidth={2} />
                        ) : (
                          <ArrowDown className="w-3 h-3" strokeWidth={2} />
                        )}
                      </div>
                      <span className="text-sm font-light text-[#1E1E1E] capitalize">
                        {transaction.type}
                      </span>
                    </div>
                    <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider ${
                      transaction.status === 'success' ? 'bg-emerald-50/50 text-emerald-600 border border-emerald-100' :
                      transaction.status === 'pending' ? 'bg-amber-50/50 text-amber-600 border border-amber-100' :
                      'bg-red-50/50 text-red-600 border border-red-100'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1E1E1E]">{transaction.amount}</span>
                    <span className="text-[10px] text-[#999999]">{transaction.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm p-8 border border-[#00000008]">
          <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-6">Performance Overview</h3>
          <div className="h-64 bg-[#FAFAFA] border border-[#00000008] flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 mb-4 mx-auto text-[#999999]" strokeWidth={1} />
              <p className="text-[#999999] text-sm font-light">Chart visualization would go here</p>
              <p className="text-xs text-[#999999] mt-2">Connect to real-time data for insights</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
