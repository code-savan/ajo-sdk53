"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "../../components/ui";
import Link from "next/link";
import {
  Bell,
  BellRing,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Clock,
  Mail,
  MessageSquare,
  Settings,
  Users,
  DollarSign,
  Shield,
  Calendar,
  Search,
  Filter,
  ChevronDown,
  Eye,
  EyeOff,
  Trash2,
  MoreVertical,
  ArrowRight,
  Star,
  Archive,
  RefreshCw,
  Zap,
  UserPlus,
  FileText,
  CreditCard,
  Database,
  Activity,
  TrendingUp,
  AlertCircle,
  Ban,
  Globe
} from "lucide-react";

export default function NotificationsMePage() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock notification data for the admin
  useEffect(() => {
    const mockNotifications = [
      {
        id: "notif-001",
        type: "security",
        priority: "high",
        title: "Multiple Failed Login Attempts Detected",
        message: "There have been 5 failed login attempts from IP 197.210.45.88 in the last 10 minutes. Account security measures have been activated.",
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        isRead: false,
        isStarred: true,
        category: "security",
        actionRequired: true,
        relatedEntity: { type: "system", id: "security-alert-001" }
      },
      {
        id: "notif-002",
        type: "admin",
        priority: "medium",
        title: "New Admin Role Request",
        message: "Sarah Johnson has requested to be promoted from Customer Support to Admin role. Reason: Need elevated permissions to handle complex user issues.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        isStarred: false,
        category: "admin",
        actionRequired: true,
        relatedEntity: { type: "roleRequest", id: "req-001" }
      },
      {
        id: "notif-003",
        type: "system",
        priority: "medium",
        title: "System Maintenance Scheduled",
        message: "Scheduled maintenance is planned for Sunday, January 28, 2025 from 2:00 AM to 4:00 AM WAT. All services will be temporarily unavailable.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isRead: true,
        isStarred: false,
        category: "system",
        actionRequired: false,
        relatedEntity: { type: "maintenance", id: "maint-001" }
      },
      {
        id: "notif-004",
        type: "transaction",
        priority: "high",
        title: "Large Transaction Flagged for Review",
        message: "Transaction TXN-789456 for ₦500,000 has been flagged by the fraud detection system and requires manual review.",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: false,
        isStarred: false,
        category: "transaction",
        actionRequired: true,
        relatedEntity: { type: "transaction", id: "TXN-789456" }
      },
      {
        id: "notif-005",
        type: "user",
        priority: "medium",
        title: "User Account Verification Required",
        message: "User John Doe (ID: user-12345) has submitted verification documents that require admin approval. Documents include: National ID, Bank Statement.",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        isRead: true,
        isStarred: false,
        category: "user",
        actionRequired: true,
        relatedEntity: { type: "user", id: "user-12345" }
      },
      {
        id: "notif-006",
        type: "alert",
        priority: "low",
        title: "Weekly Analytics Report Ready",
        message: "Your weekly analytics report for January 20-26, 2025 is now available for download. Key highlights: 15% increase in user registrations, 8% growth in transaction volume.",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        isRead: true,
        isStarred: true,
        category: "analytics",
        actionRequired: false,
        relatedEntity: { type: "report", id: "weekly-001" }
      },
      {
        id: "notif-007",
        type: "system",
        priority: "medium",
        title: "Database Storage Alert",
        message: "Database storage utilization has reached 85%. Consider archiving old data or upgrading storage capacity to prevent performance issues.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: false,
        isStarred: false,
        category: "system",
        actionRequired: true,
        relatedEntity: { type: "system", id: "storage-alert-001" }
      },
      {
        id: "notif-008",
        type: "compliance",
        priority: "high",
        title: "Regulatory Compliance Update Required",
        message: "New CBN regulations require updates to our KYC verification process. Compliance deadline: February 15, 2025. Review and implement changes immediately.",
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
        isRead: true,
        isStarred: true,
        category: "compliance",
        actionRequired: true,
        relatedEntity: { type: "compliance", id: "cbn-update-001" }
      },
      {
        id: "notif-009",
        type: "group",
        priority: "low",
        title: "New Group Created - Premium Savers",
        message: "A new savings group 'Premium Savers' has been created with 12 initial members and a monthly contribution of ₦25,000 per member.",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        isRead: true,
        isStarred: false,
        category: "group",
        actionRequired: false,
        relatedEntity: { type: "group", id: "group-789" }
      },
      {
        id: "notif-010",
        type: "payout",
        priority: "medium",
        title: "Payout Processing Completed",
        message: "Monthly payout of ₦300,000 to 'Lagos Entrepreneurs Group' has been processed successfully. All 12 members have been notified.",
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
        isRead: true,
        isStarred: false,
        category: "payout",
        actionRequired: false,
        relatedEntity: { type: "payout", id: "payout-456" }
      }
    ];

    setNotifications(mockNotifications);
    setFilteredNotifications(mockNotifications);
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...notifications];

    // Apply category filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(notif => notif.category === activeFilter);
    }

    // Apply unread filter
    if (showUnreadOnly) {
      filtered = filtered.filter(notif => !notif.isRead);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(notif =>
        notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredNotifications(filtered);
  }, [notifications, activeFilter, showUnreadOnly, searchTerm]);

  const getNotificationIcon = (type, priority) => {
    const iconProps = { className: "w-4 h-4", strokeWidth: 1.5 };
    
    switch (type) {
      case "security":
        return <Shield {...iconProps} className={`w-4 h-4 ${priority === "high" ? "text-red-600" : "text-amber-600"}`} />;
      case "admin":
        return <Users {...iconProps} className="w-4 h-4 text-blue-600" />;
      case "system":
        return <Settings {...iconProps} className="w-4 h-4 text-gray-600" />;
      case "transaction":
        return <DollarSign {...iconProps} className="w-4 h-4 text-green-600" />;
      case "user":
        return <UserPlus {...iconProps} className="w-4 h-4 text-purple-600" />;
      case "alert":
        return <TrendingUp {...iconProps} className="w-4 h-4 text-indigo-600" />;
      case "compliance":
        return <FileText {...iconProps} className="w-4 h-4 text-orange-600" />;
      case "group":
        return <Users {...iconProps} className="w-4 h-4 text-teal-600" />;
      case "payout":
        return <CreditCard {...iconProps} className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell {...iconProps} className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-amber-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-300";
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    
    if (diff < 60 * 1000) return "Just now";
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const toggleStar = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isStarred: !notif.isStarred } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const starredCount = notifications.filter(n => n.isStarred).length;

  const categories = [
    { key: "all", label: "All Notifications", count: notifications.length },
    { key: "security", label: "Security", count: notifications.filter(n => n.category === "security").length },
    { key: "admin", label: "Admin", count: notifications.filter(n => n.category === "admin").length },
    { key: "system", label: "System", count: notifications.filter(n => n.category === "system").length },
    { key: "transaction", label: "Transactions", count: notifications.filter(n => n.category === "transaction").length },
    { key: "user", label: "Users", count: notifications.filter(n => n.category === "user").length },
    { key: "compliance", label: "Compliance", count: notifications.filter(n => n.category === "compliance").length }
  ];

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
      <PageHeader title="My Notifications" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-light text-[#1E1E1E]">Personal Notifications</h2>
              <p className="text-[#999999] text-xs mt-1 font-light">
                Your administrative alerts, updates, and important messages
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[#1E1E1E] text-sm font-light">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} WAT
                </p>
                <p className="text-[#999999] text-xs mt-1">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                Mark All Read
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
              <div className="flex items-center justify-between mb-2">
                <Bell className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                <span className="text-xs text-blue-600">{notifications.length}</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">{notifications.length}</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Notifications</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
              <div className="flex items-center justify-between mb-2">
                <BellRing className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                <span className="text-xs text-amber-600">{unreadCount}</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">{unreadCount}</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Unread</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-5 h-5 text-yellow-600" strokeWidth={1.5} />
                <span className="text-xs text-yellow-600">{starredCount}</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">{starredCount}</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Starred</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" strokeWidth={1.5} />
                <span className="text-xs text-red-600">
                  {notifications.filter(n => n.actionRequired && !n.isRead).length}
                </span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">
                {notifications.filter(n => n.actionRequired).length}
              </p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Action Required</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008] mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="unreadOnly"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="unreadOnly" className="text-sm font-light text-[#1E1E1E]">
                  Unread only
                </label>
              </div>

              <div className="relative">
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors cursor-pointer"
                >
                  {categories.map(category => (
                    <option key={category.key} value={category.key}>
                      {category.label} ({category.count})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
              </div>

              <button className="p-2 hover:bg-[#FAFAFA] transition-colors">
                <RefreshCw className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-[#999999] mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-light text-[#1E1E1E] mb-2">No notifications found</h3>
              <p className="text-[#999999] text-sm">
                {searchTerm || activeFilter !== "all" || showUnreadOnly
                  ? "Try adjusting your filters or search terms."
                  : "You're all caught up! No new notifications at this time."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#00000008]">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-[#FAFAFA] transition-colors cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                  onClick={() => {
                    if (!notification.isRead) markAsRead(notification.id);
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className={`text-sm font-light ${!notification.isRead ? 'text-[#1E1E1E] font-medium' : 'text-[#1E1E1E]'} truncate`}>
                            {notification.title}
                            {!notification.isRead && (
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                            )}
                          </h4>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-[#999999]">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            
                            {notification.priority === "high" && (
                              <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] uppercase tracking-wider border border-red-100">
                                High Priority
                              </span>
                            )}
                            
                            {notification.actionRequired && (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] uppercase tracking-wider border border-amber-100">
                                Action Required
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-[#666666] font-light mb-3 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-[#FAFAFA] text-[#666666] text-xs capitalize border border-[#00000008]">
                              {notification.category}
                            </span>
                            
                            {notification.relatedEntity && (
                              <span className="text-xs text-[#999999]">
                                Related: {notification.relatedEntity.type} #{notification.relatedEntity.id}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(notification.id);
                              }}
                              className={`p-1 hover:bg-[#F8F9FA] transition-colors ${
                                notification.isStarred ? 'text-yellow-500' : 'text-[#999999]'
                              }`}
                            >
                              <Star className="w-4 h-4" strokeWidth={1.5} fill={notification.isStarred ? 'currentColor' : 'none'} />
                            </button>

                            <Link
                              href={`/notifications-me/${notification.id}`}
                              className="p-1 hover:bg-[#F8F9FA] transition-colors text-[#999999]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
