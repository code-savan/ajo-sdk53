"use client";
import { useState } from "react";
import { PageHeader } from "../../components/ui";
import { notificationsList, users, groups } from "../../data/adminContent";
import {
  Bell,
  BellRing,
  Send,
  MessageSquare,
  Megaphone,
  FileText,
  HelpCircle,
  Clock,
  Calendar,
  Edit3,
  Plus,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Globe,
  Users,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Settings,
  Mail,
  Smartphone,
  Monitor,
  MessageCircle,
  BookOpen,
  FileEdit,
  Copy,
  Trash2,
  Eye,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Target,
  Zap,
  ArrowRight,
  Download,
  Upload,
  Shield,
  DollarSign,
  Lock
} from "lucide-react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNewNotification, setShowNewNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('push');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Mock data for push notifications
  const pushNotifications = [
    { id: 1, title: 'Payment Due Reminder', message: 'Your payment of ₦25,000 is due tomorrow', status: 'sent', sentTo: 245, opened: 189, time: '2 hours ago', type: 'payment' },
    { id: 2, title: 'Payout Completed', message: 'Your payout of ₦150,000 has been processed', status: 'sent', sentTo: 12, opened: 12, time: '4 hours ago', type: 'payout' },
    { id: 3, title: 'Group Invitation', message: 'You have been invited to join Premium Savers', status: 'scheduled', sentTo: 0, opened: 0, time: 'Tomorrow 9:00 AM', type: 'group' },
    { id: 4, title: 'System Maintenance', message: 'Scheduled maintenance on Sunday 2-4 AM', status: 'draft', sentTo: 0, opened: 0, time: 'Not sent', type: 'system' },
  ];

  // Mock data for in-app messages
  const inAppMessages = [
    { id: 1, from: 'Admin', to: 'All Users', message: 'Welcome to our new feature update', time: '1 hour ago', status: 'delivered' },
    { id: 2, from: 'System', to: 'Group Leaders', message: 'New admin tools available', time: '3 hours ago', status: 'delivered' },
    { id: 3, from: 'Support', to: 'User #u-1002', message: 'Your issue has been resolved', time: '5 hours ago', status: 'read' },
  ];

  // Mock data for system announcements
  const systemAnnouncements = [
    { id: 1, title: 'Platform Update v2.5', message: 'New features including improved group management', status: 'active', priority: 'high', startDate: '2024-01-15', endDate: '2024-01-22' },
    { id: 2, title: 'Holiday Schedule', message: 'Customer support hours during festive period', status: 'scheduled', priority: 'medium', startDate: '2024-01-20', endDate: '2024-01-25' },
    { id: 3, title: 'Security Update', message: 'Enhanced 2FA now available for all accounts', status: 'active', priority: 'high', startDate: '2024-01-10', endDate: '2024-01-30' },
  ];

  // Mock data for message templates
  const messageTemplates = [
    { id: 1, name: 'Payment Reminder', category: 'payment', usage: 1250, lastUsed: '2 hours ago', status: 'active' },
    { id: 2, name: 'Welcome Message', category: 'onboarding', usage: 456, lastUsed: '1 day ago', status: 'active' },
    { id: 3, name: 'Payout Notification', category: 'payout', usage: 892, lastUsed: '3 hours ago', status: 'active' },
    { id: 4, name: 'Group Invitation', category: 'group', usage: 234, lastUsed: '5 hours ago', status: 'active' },
    { id: 5, name: 'Payment Failed', category: 'payment', usage: 45, lastUsed: '2 days ago', status: 'active' },
  ];

  // Mock data for scheduled communications
  const scheduledComms = [
    { id: 1, title: 'Weekly Payment Reminders', type: 'recurring', frequency: 'Weekly', nextRun: '2024-01-20 09:00', recipients: 245, status: 'active' },
    { id: 2, title: 'Monthly Newsletter', type: 'recurring', frequency: 'Monthly', nextRun: '2024-02-01 10:00', recipients: 'All Users', status: 'active' },
    { id: 3, title: 'Group Start Notification', type: 'triggered', trigger: 'Group Creation', nextRun: 'On trigger', recipients: 'Group Members', status: 'active' },
    { id: 4, title: 'Payment Due Alert', type: 'triggered', trigger: '24hrs before due', nextRun: 'On trigger', recipients: 'Affected Users', status: 'active' },
  ];

  // Mock data for help content
  const helpContent = [
    { id: 1, title: 'Getting Started Guide', category: 'onboarding', views: 4567, lastUpdated: '3 days ago', status: 'published' },
    { id: 2, title: 'How to Create a Group', category: 'groups', views: 2345, lastUpdated: '1 week ago', status: 'published' },
    { id: 3, title: 'Payment Methods FAQ', category: 'payments', views: 3456, lastUpdated: '2 days ago', status: 'published' },
    { id: 4, title: 'Security Best Practices', category: 'security', views: 1234, lastUpdated: '5 days ago', status: 'draft' },
  ];

  // Mock data for legal documents
  const legalDocuments = [
    { id: 1, title: 'Terms of Service', version: '2.3', lastUpdated: '2024-01-01', status: 'active', changes: 12 },
    { id: 2, title: 'Privacy Policy', version: '1.8', lastUpdated: '2023-12-15', status: 'active', changes: 8 },
    { id: 3, title: 'Cookie Policy', version: '1.2', lastUpdated: '2023-11-20', status: 'active', changes: 3 },
    { id: 4, title: 'Data Processing Agreement', version: '1.0', lastUpdated: '2023-10-10', status: 'draft', changes: 5 },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'sent':
      case 'delivered':
      case 'active':
      case 'published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'scheduled':
      case 'draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed':
      case 'inactive':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'read':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'payment':
        return <DollarSign className="w-4 h-4" strokeWidth={1.5} />;
      case 'group':
        return <Users className="w-4 h-4" strokeWidth={1.5} />;
      case 'system':
        return <Settings className="w-4 h-4" strokeWidth={1.5} />;
      case 'payout':
        return <Send className="w-4 h-4" strokeWidth={1.5} />;
      case 'onboarding':
        return <BookOpen className="w-4 h-4" strokeWidth={1.5} />;
      case 'security':
        return <Shield className="w-4 h-4" strokeWidth={1.5} />;
      default:
        return <Bell className="w-4 h-4" strokeWidth={1.5} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px]">
      <PageHeader title="Notifications Management" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <BellRing className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              <span className="text-xs text-emerald-600">+12%</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">3,456</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Notifications Sent Today</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              <span className="text-xs text-emerald-600">78.5%</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">2,712</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Open Rate</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
              <span className="text-xs text-blue-600">245</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">1,234</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">In-App Messages</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              <span className="text-xs text-amber-600">12</span>
            </div>
            <p className="text-2xl font-light text-[#1E1E1E]">45</p>
            <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Scheduled</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setShowNewNotification(true)}
            className="px-4 py-2 bg-[#1E1E1E] text-white hover:bg-[#2E2E2E] transition-colors flex items-center gap-2 text-sm font-light"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            New Notification
          </button>
          <button className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors flex items-center gap-2 text-sm font-light">
            <Megaphone className="w-4 h-4" strokeWidth={1.5} />
            Broadcast
          </button>
          <button className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors flex items-center gap-2 text-sm font-light">
            <Calendar className="w-4 h-4" strokeWidth={1.5} />
            Schedule
          </button>
          <button className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors flex items-center gap-2 text-sm font-light">
            <FileText className="w-4 h-4" strokeWidth={1.5} />
            Templates
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#00000008] mb-6">
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
            onClick={() => setActiveTab('push')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'push'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Push Notifications
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'messages'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            In-App Messages
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'announcements'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'templates'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'scheduled'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`pb-3 px-1 text-sm font-light transition-all duration-200 ${
              activeTab === 'legal'
                ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                : 'text-[#999999] hover:text-[#1E1E1E]'
            }`}
          >
            Legal & Help
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Push Notifications */}
                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Recent Push Notifications</h3>
                    <button className="text-xs text-blue-600 hover:text-blue-700">
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {pushNotifications.slice(0, 3).map((notif) => (
                      <div key={notif.id} className="flex items-start justify-between p-3 border border-[#00000008] hover:border-[#00000020] transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600">
                            <Bell className="w-4 h-4" strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1E1E1E]">{notif.title}</p>
                            <p className="text-xs text-[#999999] mt-1">{notif.message}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-[#999999]">{notif.time}</span>
                              <span className="text-xs text-emerald-600">{notif.opened}/{notif.sentTo} opened</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Announcements */}
                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Active Announcements</h3>
                    <button className="text-xs text-blue-600 hover:text-blue-700">
                      Manage →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {systemAnnouncements.filter(a => a.status === 'active').map((announcement) => (
                      <div key={announcement.id} className="p-3 border border-[#00000008] hover:border-[#00000020] transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Megaphone className={`w-4 h-4 ${getPriorityColor(announcement.priority)}`} strokeWidth={1.5} />
                              <p className="text-sm font-medium text-[#1E1E1E]">{announcement.title}</p>
                            </div>
                            <p className="text-xs text-[#999999] mt-1">{announcement.message}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs border ${getStatusColor(announcement.status)}`}>
                            {announcement.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Communication Stats */}
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Communication Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-[#999999] mb-2">Push Notifications</p>
                    <p className="text-2xl font-light text-[#1E1E1E]">3,456</p>
                    <div className="mt-2 h-1 bg-[#00000008]">
                      <div className="h-full bg-blue-500" style={{ width: '78%' }}></div>
                    </div>
                    <p className="text-xs text-emerald-600 mt-1">78% delivery rate</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#999999] mb-2">In-App Messages</p>
                    <p className="text-2xl font-light text-[#1E1E1E]">1,234</p>
                    <div className="mt-2 h-1 bg-[#00000008]">
                      <div className="h-full bg-violet-500" style={{ width: '92%' }}></div>
                    </div>
                    <p className="text-xs text-emerald-600 mt-1">92% read rate</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#999999] mb-2">Email Campaigns</p>
                    <p className="text-2xl font-light text-[#1E1E1E]">567</p>
                    <div className="mt-2 h-1 bg-[#00000008]">
                      <div className="h-full bg-emerald-500" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-xs text-amber-600 mt-1">45% open rate</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#999999] mb-2">SMS Messages</p>
                    <p className="text-2xl font-light text-[#1E1E1E]">892</p>
                    <div className="mt-2 h-1 bg-[#00000008]">
                      <div className="h-full bg-amber-500" style={{ width: '95%' }}></div>
                    </div>
                    <p className="text-xs text-emerald-600 mt-1">95% delivery rate</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Push Notifications Tab */}
          {activeTab === 'push' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
                <div className="p-4 border-b border-[#00000008]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Push Notification Management</h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Search notifications..."
                        className="px-3 py-1.5 border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020]"
                      />
                      <button className="p-1.5 border border-[#00000008] hover:border-[#00000020]">
                        <Filter className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#00000008]">
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Title</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Message</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Sent To</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Opened</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Time</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pushNotifications.map((notif) => (
                        <tr key={notif.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA]">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(notif.type)}
                              <span className="text-sm font-medium text-[#1E1E1E]">{notif.title}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E]">{notif.message}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs border ${getStatusColor(notif.status)}`}>
                              {notif.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E]">{notif.sentTo || '-'}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-emerald-600">{notif.opened || '-'}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#999999]">{notif.time}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-[#00000008]">
                                <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              </button>
                              <button className="p-1 hover:bg-[#00000008]">
                                <Edit3 className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              </button>
                              <button className="p-1 hover:bg-[#00000008]">
                                <Copy className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* In-App Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Message Oversight</h3>
                  <div className="space-y-3">
                    {inAppMessages.map((msg) => (
                      <div key={msg.id} className="p-3 border border-[#00000008] hover:border-[#00000020] transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <MessageCircle className="w-4 h-4 text-blue-600 mt-1" strokeWidth={1.5} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-[#1E1E1E]">{msg.from}</span>
                                <ArrowRight className="w-3 h-3 text-[#999999]" strokeWidth={1.5} />
                                <span className="text-sm font-light text-[#1E1E1E]">{msg.to}</span>
                              </div>
                              <p className="text-xs text-[#999999] mt-1">{msg.message}</p>
                              <p className="text-xs text-[#999999] mt-2">{msg.time}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs border ${getStatusColor(msg.status)}`}>
                            {msg.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Broadcast Message</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[#999999] uppercase tracking-wider">Recipients</label>
                      <select className="w-full mt-1 px-3 py-2 border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020]">
                        <option>All Users</option>
                        <option>Active Users</option>
                        <option>Group Leaders</option>
                        <option>Premium Members</option>
                        <option>Custom Selection</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#999999] uppercase tracking-wider">Message</label>
                      <textarea
                        rows={4}
                        className="w-full mt-1 px-3 py-2 border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020]"
                        placeholder="Enter your broadcast message..."
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="px-4 py-2 bg-[#1E1E1E] text-white hover:bg-[#2E2E2E] transition-colors text-sm font-light">
                        Send Now
                      </button>
                      <button className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors text-sm font-light">
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
                <div className="p-4 border-b border-[#00000008]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">System Announcements</h3>
                    <button className="px-3 py-1.5 bg-[#1E1E1E] text-white hover:bg-[#2E2E2E] transition-colors text-xs font-light">
                      New Announcement
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {systemAnnouncements.map((announcement) => (
                      <div key={announcement.id} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Megaphone className={`w-5 h-5 ${getPriorityColor(announcement.priority)}`} strokeWidth={1.5} />
                              <h4 className="text-sm font-medium text-[#1E1E1E]">{announcement.title}</h4>
                              <span className={`px-2 py-1 text-xs border ${getStatusColor(announcement.status)}`}>
                                {announcement.status}
                              </span>
                              <span className={`text-xs ${getPriorityColor(announcement.priority)}`}>
                                {announcement.priority} priority
                              </span>
                            </div>
                            <p className="text-sm font-light text-[#999999] mt-2">{announcement.message}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#999999]" strokeWidth={1.5} />
                                <span className="text-xs text-[#999999]">{announcement.startDate} - {announcement.endDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-[#00000008]">
                              <Edit3 className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            </button>
                            <button className="p-1 hover:bg-[#00000008]">
                              <Trash2 className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
                <div className="p-4 border-b border-[#00000008]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Message Templates</h3>
                    <button className="px-3 py-1.5 bg-[#1E1E1E] text-white hover:bg-[#2E2E2E] transition-colors text-xs font-light">
                      New Template
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#00000008]">
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Template Name</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Category</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Usage Count</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Last Used</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                        <th className="text-left p-3 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messageTemplates.map((template) => (
                        <tr key={template.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA]">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              <span className="text-sm font-medium text-[#1E1E1E]">{template.name}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(template.category)}
                              <span className="text-sm font-light text-[#1E1E1E] capitalize">{template.category}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#1E1E1E]">{template.usage}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-sm font-light text-[#999999]">{template.lastUsed}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-xs border ${getStatusColor(template.status)}`}>
                              {template.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1 hover:bg-[#00000008]">
                                <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              </button>
                              <button className="p-1 hover:bg-[#00000008]">
                                <Edit3 className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              </button>
                              <button className="p-1 hover:bg-[#00000008]">
                                <Copy className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Scheduled Tab */}
          {activeTab === 'scheduled' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
                <div className="p-4 border-b border-[#00000008]">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Scheduled Communications</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {scheduledComms.map((comm) => (
                      <div key={comm.id} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                              <h4 className="text-sm font-medium text-[#1E1E1E]">{comm.title}</h4>
                              <span className={`px-2 py-1 text-xs border ${getStatusColor(comm.status)}`}>
                                {comm.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-4 mt-3">
                              <div>
                                <p className="text-xs text-[#999999]">Type</p>
                                <p className="text-sm font-light text-[#1E1E1E] capitalize">{comm.type}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[#999999]">Frequency/Trigger</p>
                                <p className="text-sm font-light text-[#1E1E1E]">{comm.frequency || comm.trigger}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[#999999]">Next Run</p>
                                <p className="text-sm font-light text-[#1E1E1E]">{comm.nextRun}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[#999999]">Recipients</p>
                                <p className="text-sm font-light text-[#1E1E1E]">{comm.recipients}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-[#00000008]">
                              {comm.status === 'active' ? (
                                <PauseCircle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                              ) : (
                                <PlayCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                              )}
                            </button>
                            <button className="p-1 hover:bg-[#00000008]">
                              <Edit3 className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            </button>
                            <button className="p-1 hover:bg-[#00000008]">
                              <Trash2 className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legal & Help Tab */}
          {activeTab === 'legal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Legal Documents</h3>
                  <div className="space-y-3">
                    {legalDocuments.map((doc) => (
                      <div key={doc.id} className="p-3 border border-[#00000008] hover:border-[#00000020] transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Lock className="w-4 h-4 text-blue-600 mt-1" strokeWidth={1.5} />
                            <div>
                              <p className="text-sm font-medium text-[#1E1E1E]">{doc.title}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-[#999999]">v{doc.version}</span>
                                <span className="text-xs text-[#999999]">Updated: {doc.lastUpdated}</span>
                                <span className="text-xs text-blue-600">{doc.changes} changes</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs border ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                            <button className="p-1 hover:bg-[#00000008]">
                              <Edit3 className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Help Content</h3>
                  <div className="space-y-3">
                    {helpContent.map((content) => (
                      <div key={content.id} className="p-3 border border-[#00000008] hover:border-[#00000020] transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <HelpCircle className="w-4 h-4 text-violet-600 mt-1" strokeWidth={1.5} />
                            <div>
                              <p className="text-sm font-medium text-[#1E1E1E]">{content.title}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-[#999999] capitalize">{content.category}</span>
                                <span className="text-xs text-[#999999]">{content.views} views</span>
                                <span className="text-xs text-[#999999]">Updated: {content.lastUpdated}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs border ${getStatusColor(content.status)}`}>
                              {content.status}
                            </span>
                            <button className="p-1 hover:bg-[#00000008]">
                              <Edit3 className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
