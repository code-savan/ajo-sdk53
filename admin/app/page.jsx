"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "../components/ui";
import { demoStats, users, groups, transactions } from "../data/adminContent";
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
  CircleDot
} from "lucide-react";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };

  const getIcon = (index) => {
    const icons = [
      <Users className="w-5 h-5" strokeWidth={1.5} />,
      <Building2 className="w-5 h-5" strokeWidth={1.5} />,
      <DollarSign className="w-5 h-5" strokeWidth={1.5} />,
      <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
    ];
    return icons[index];
  };

  const getStatColor = (index) => {
    const colors = [
      { bg: 'bg-blue-50/50', icon: 'text-blue-600', border: 'border-blue-100' },
      { bg: 'bg-emerald-50/50', icon: 'text-emerald-600', border: 'border-emerald-100' },
      { bg: 'bg-violet-50/50', icon: 'text-violet-600', border: 'border-violet-100' },
      { bg: 'bg-amber-50/50', icon: 'text-amber-600', border: 'border-amber-100' }
    ];
    return colors[index] || colors[0];
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
      <PageHeader title="Dashboard" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between border-b border-[#00000008] pb-4">
          <div>
            <h2 className="text-2xl font-light text-[#1E1E1E]">
              Welcome back, Oke
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

        {/* Stats Grid - Redesigned */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {demoStats.overview.map((stat, index) => {
            const color = getStatColor(index);
            const isPositive = stat.change.startsWith('+');
            return (
              <div
                key={stat.title}
                className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008] hover:border-[#00000020] transition-all duration-300 cursor-pointer group"
              >
                {/* Top Section */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${color.bg} ${color.border} border flex items-center justify-center ${color.icon}`}>
                    {getIcon(index)}
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

                {/* Value Section */}
                <div className="space-y-1">
                  <p className="text-3xl font-light text-[#1E1E1E] tracking-tight">
                    {stat.value}
                  </p>
                  <h3 className="text-[#999999] text-xs font-normal uppercase tracking-wider">
                    {stat.title}
                  </h3>
                </div>

                {/* Bottom accent line */}
                <div className={`h-0.5 ${color.bg} mt-4 w-0 group-hover:w-full transition-all duration-500`} />
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm p-6 mb-8 border border-[#00000008]">
          <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/users" className="group relative p-6 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <Eye className="w-6 h-6 mb-3 text-blue-500" strokeWidth={1.5} />
                  <span className="text-sm font-light text-[#1E1E1E]">View Users</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#999999] group-hover:text-blue-500 transition-colors" strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
            <Link href="/groups" className="group relative p-6 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <UsersRound className="w-6 h-6 mb-3 text-emerald-500" strokeWidth={1.5} />
                  <span className="text-sm font-light text-[#1E1E1E]">View Groups</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#999999] group-hover:text-emerald-500 transition-colors" strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
            <Link href="/financial/transactions" className="group relative p-6 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <Receipt className="w-6 h-6 mb-3 text-violet-500" strokeWidth={1.5} />
                  <span className="text-sm font-light text-[#1E1E1E]">View Transactions</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#999999] group-hover:text-violet-500 transition-colors" strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
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
