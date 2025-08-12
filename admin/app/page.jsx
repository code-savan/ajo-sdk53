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
  Activity,
  Eye
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
      <Users className="w-6 h-6 text-[#007AFF]" />,
      <Building2 className="w-6 h-6 text-[#007AFF]" />,
      <DollarSign className="w-6 h-6 text-[#007AFF]" />,
      <TrendingUp className="w-6 h-6 text-[#007AFF]" />
    ];
    return icons[index];
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
      <PageHeader title="Dashboard" />
      <main className="flex-1 bg-gradient-to-br from-[#F8F8F8] to-[#F0F0F0] p-4 sm:p-6 overflow-y-auto">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-medium text-[#1E1E1E]">
            Hey Ken,
          </h2>
          <p className="text-[#7E7E7E] text-[12px]">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} • {formatTime(currentTime)} EST
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-8">
          {demoStats.overview.map((stat, index) => (
            <div
              key={stat.title}
              className="bg-white  p-6 border border-[#E5E5E5] cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0  transition-opacity duration-300 " />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#DDE8FF]`}
                //    ${
                    // index === 0 ? 'bg-blue-100 text-blue-600' :
                    // index === 1 ? 'bg-green-100 text-green-600' :
                    // index === 2 ? 'bg-purple-100 text-purple-600' :
                    // 'bg-orange-100 text-orange-600'
                //   }

                  >
                    {getIcon(index)}
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-[30px] font-bold text-[#1E1E1E]">{stat.value}</p>
                <h3 className="text-[#7E7E7E] text-[12px] font-medium mb-1">{stat.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 mb-8 border border-[#E5E5E5]">
          <h3 className="text-lg font-semibold mb-4 text-[#1E1E1E]">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/users" className="flex flex-col items-center p-4  bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
              <Eye className="w-8 h-8 mb-2 text-blue-600" />
              <span className="text-sm font-medium text-[#1E1E1E]">View Users</span>
            </Link>
            <Link href="/groups" className="flex flex-col items-center p-4  bg-green-50 hover:bg-green-100 transition-colors duration-200">
              <UsersRound className="w-8 h-8 mb-2 text-green-600" />
              <span className="text-sm font-medium text-[#1E1E1E]">View Groups</span>
            </Link>
            <Link href="/financial/transactions" className="flex flex-col items-center p-4  bg-purple-50 hover:bg-purple-100 transition-colors duration-200">
              <Receipt className="w-8 h-8 mb-2 text-purple-600" />
              <span className="text-sm font-medium text-[#1E1E1E]">View Transactions</span>
            </Link>
            {/* <Link href="/analytics" className="flex flex-col items-center p-4  bg-orange-50 hover:bg-orange-100 transition-colors duration-200">
              <BarChart3 className="w-8 h-8 mb-2 text-orange-600" />
              <span className="text-sm font-medium text-[#1E1E1E]">View Analytics</span>
            </Link> */}
          </div>
        </div>

        {/* Activity Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <div className="bg-white  p-6 border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#1E1E1E]">Recent Users</h3>
              <Link href="/users" className="text-sm text-blue-500 hover:text-blue-600">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1E1E1E]">{user.name}</p>
                      <p className="text-xs text-[#7E7E7E]">{user.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-700' :
                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Groups */}
          <div className="bg-white  p-6 border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#1E1E1E]">Active Groups</h3>
              <Link href="/groups" className="text-sm text-blue-500 hover:text-blue-600">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {groups.slice(0, 3).map((group) => (
                <div key={group.id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-[#1E1E1E]">{group.name}</h4>
                    <span className="text-xs text-[#7E7E7E]">{group.cycle}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7E7E7E]">{group.members} members</span>
                    <span className="font-semibold text-green-600">{group.balance}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                      style={{ width: `${(group.members / 50) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white  p-6 border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#1E1E1E]">Recent Transactions</h3>
              <Link href="/financial/transactions" className="text-sm text-blue-500 hover:text-blue-600">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {transaction.type === 'deposit' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium text-[#1E1E1E] capitalize">
                        {transaction.type}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'success' ? 'bg-green-100 text-green-700' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-[#1E1E1E]">{transaction.amount}</span>
                    <span className="text-xs text-[#7E7E7E]">{transaction.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="mt-8 bg-white  p-6 border border-[#E5E5E5]">
          <h3 className="text-lg font-semibold mb-4 text-[#1E1E1E]">Performance Overview</h3>
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-16 h-16 mb-3 mx-auto text-[#7E7E7E]" />
              <p className="text-[#7E7E7E]">Chart visualization would go here</p>
              <p className="text-sm text-[#7E7E7E] mt-2">Connect to real-time data for insights</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
