"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "../../../components/ui";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Bell,
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Globe,
  Shield,
  Users,
  DollarSign,
  Settings,
  UserPlus,
  TrendingUp,
  FileText,
  CreditCard,
  Star,
  Archive,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  MessageSquare,
  Mail,
  Smartphone,
  Monitor,
  MapPin,
  Eye,
  EyeOff,
  MoreVertical,
  Download,
  Share,
  Flag,
  Copy,
  Bookmark,
  ChevronRight
} from "lucide-react";

export default function NotificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [notification, setNotification] = useState(null);
  const [isStarred, setIsStarred] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch notification by ID
    const fetchNotification = async () => {
      const mockNotifications = {
        "notif-001": {
          id: "notif-001",
          type: "security",
          priority: "high",
          title: "Multiple Failed Login Attempts Detected",
          message: "There have been 5 failed login attempts from IP 197.210.45.88 in the last 10 minutes. Account security measures have been activated.",
          fullContent: `
            <h3>Security Alert Details</h3>
            <p>We've detected unusual activity on your admin account that requires immediate attention:</p>

            <h4>Incident Summary</h4>
            <ul>
              <li><strong>Time Period:</strong> January 27, 2025 - 10:15 AM to 10:25 AM WAT</li>
              <li><strong>Source IP:</strong> 197.210.45.88</li>
              <li><strong>Location:</strong> Lagos, Nigeria (approximate)</li>
              <li><strong>Failed Attempts:</strong> 5 consecutive attempts</li>
              <li><strong>Account Targeted:</strong> iren.kukoma@ajo.com</li>
            </ul>

            <h4>Attempted Credentials</h4>
            <p>The attacker attempted various username/password combinations, suggesting this may be an automated attack rather than a targeted breach.</p>

            <h4>Security Measures Activated</h4>
            <ul>
              <li>Account temporarily locked for 30 minutes</li>
              <li>IP address added to watchlist</li>
              <li>Additional verification required for next login</li>
              <li>Security team notified</li>
            </ul>

            <h4>Recommended Actions</h4>
            <ol>
              <li>Review recent account activity in the Security section</li>
              <li>Consider enabling additional 2FA methods</li>
              <li>Review and update your password if it hasn't been changed recently</li>
              <li>Check if this IP address is familiar (office, home, etc.)</li>
            </ol>
          `,
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          isRead: false,
          isStarred: true,
          category: "security",
          actionRequired: true,
          relatedEntity: { type: "system", id: "security-alert-001" },
          metadata: {
            ipAddress: "197.210.45.88",
            location: "Lagos, Nigeria",
            attempts: 5,
            severity: "HIGH",
            affectedAccount: "iren.kukoma@ajo.com"
          },
          actions: [
            { id: "review-security", label: "Review Security Settings", type: "primary", link: "/security" },
            { id: "view-logs", label: "View Security Logs", type: "secondary", link: "/security#logs" },
            { id: "block-ip", label: "Block IP Address", type: "danger", action: "blockIP" }
          ]
        },
        "notif-002": {
          id: "notif-002",
          type: "admin",
          priority: "medium",
          title: "New Admin Role Request",
          message: "Sarah Johnson has requested to be promoted from Customer Support to Admin role. Reason: Need elevated permissions to handle complex user issues.",
          fullContent: `
            <h3>Role Request Details</h3>
            <p>A team member has requested a role change that requires your approval:</p>

            <h4>Requester Information</h4>
            <ul>
              <li><strong>Name:</strong> Sarah Johnson</li>
              <li><strong>Email:</strong> sarah.johnson@ajo.com</li>
              <li><strong>Current Role:</strong> Customer Support</li>
              <li><strong>Requested Role:</strong> Admin</li>
              <li><strong>Employee ID:</strong> EMP-2024-089</li>
              <li><strong>Department:</strong> Customer Success</li>
            </ul>

            <h4>Request Details</h4>
            <p><strong>Submitted:</strong> January 26, 2025 at 2:30 PM WAT</p>
            <p><strong>Requested by:</strong> Adaeze Obi (Supervisor)</p>

            <h4>Justification</h4>
            <p>Sarah has provided the following justification for this role change:</p>
            <blockquote>
              "I need elevated permissions to handle complex user issues and transaction disputes more efficiently. Many of the escalated tickets require admin-level access to user accounts and transaction records. This would reduce response times and improve customer satisfaction."
            </blockquote>

            <h4>Performance Review</h4>
            <p><strong>Current Performance Rating:</strong> 4.7/5.0</p>
            <p><strong>Time in Current Role:</strong> 8 months</p>
            <p><strong>Supervisor Recommendation:</strong> Strongly Recommended</p>

            <h4>Impact Assessment</h4>
            <ul>
              <li>Will gain access to user management features</li>
              <li>Can approve transaction disputes up to $100,000</li>
              <li>Access to customer financial information</li>
              <li>Ability to modify user account statuses</li>
            </ul>
          `,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: false,
          isStarred: false,
          category: "admin",
          actionRequired: true,
          relatedEntity: { type: "roleRequest", id: "req-001" },
          metadata: {
            requester: "Sarah Johnson",
            currentRole: "Customer Support",
            requestedRole: "Admin",
            supervisor: "Adaeze Obi",
            performanceRating: "4.7/5.0"
          },
          actions: [
            { id: "approve-request", label: "Approve Request", type: "primary", action: "approve" },
            { id: "reject-request", label: "Reject Request", type: "danger", action: "reject" },
            { id: "request-more-info", label: "Request More Information", type: "secondary", action: "requestInfo" },
            { id: "view-employee", label: "View Employee Profile", type: "secondary", link: "/admin/employees/sarah-johnson" }
          ]
        },
        "notif-003": {
          id: "notif-003",
          type: "system",
          priority: "medium",
          title: "System Maintenance Scheduled",
          message: "Scheduled maintenance is planned for Sunday, January 28, 2025 from 2:00 AM to 4:00 AM WAT. All services will be temporarily unavailable.",
          fullContent: `
            <h3>Scheduled Maintenance Notice</h3>
            <p>Important system maintenance has been scheduled to improve performance and security:</p>

            <h4>Maintenance Details</h4>
            <ul>
              <li><strong>Date:</strong> Sunday, January 28, 2025</li>
              <li><strong>Start Time:</strong> 2:00 AM WAT</li>
              <li><strong>End Time:</strong> 4:00 AM WAT (estimated)</li>
              <li><strong>Duration:</strong> Approximately 2 hours</li>
              <li><strong>Type:</strong> Planned Infrastructure Update</li>
            </ul>

            <h4>Services Affected</h4>
            <ul>
              <li>All web and mobile applications</li>
              <li>API endpoints</li>
              <li>Admin dashboard</li>
              <li>Payment processing</li>
              <li>User authentication</li>
              <li>Push notifications</li>
            </ul>

            <h4>What's Being Updated</h4>
            <ul>
              <li>Database server optimization</li>
              <li>Security patches installation</li>
              <li>Performance monitoring upgrades</li>
              <li>Load balancer configuration</li>
              <li>SSL certificate renewal</li>
            </ul>

            <h4>Preparation Required</h4>
            <ol>
              <li>Notify all admin staff about the downtime</li>
              <li>Prepare customer communication templates</li>
              <li>Ensure all pending transactions are processed by 1:30 AM</li>
              <li>Brief the support team on expected user inquiries</li>
            </ol>

            <h4>Communication Plan</h4>
            <ul>
              <li>User notification sent 48 hours in advance</li>
              <li>In-app banners displayed starting 24 hours prior</li>
              <li>Status page updated with progress</li>
              <li>Social media notifications</li>
            </ul>
          `,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isRead: true,
          isStarred: false,
          category: "system",
          actionRequired: false,
          relatedEntity: { type: "maintenance", id: "maint-001" },
          metadata: {
            maintenanceDate: "January 28, 2025",
            startTime: "2:00 AM WAT",
            endTime: "4:00 AM WAT",
            duration: "2 hours",
            type: "Infrastructure Update"
          },
          actions: [
            { id: "view-status", label: "View Status Page", type: "primary", link: "https://status.ajo.com" },
            { id: "download-checklist", label: "Download Prep Checklist", type: "secondary", action: "download" }
          ]
        }
      };

      const notificationData = mockNotifications[params.id];
      if (notificationData) {
        setNotification(notificationData);
        setIsStarred(notificationData.isStarred);
        setIsRead(notificationData.isRead);

        // Mark as read when viewed
        if (!notificationData.isRead) {
          setTimeout(() => {
            setIsRead(true);
          }, 1000);
        }
      }
      setLoading(false);
    };

    if (params.id) {
      fetchNotification();
    }
  }, [params.id]);

  const getNotificationIcon = (type, priority) => {
    const iconProps = { className: "w-5 h-5", strokeWidth: 1.5 };

    switch (type) {
      case "security":
        return <Shield {...iconProps} className={`w-5 h-5 ${priority === "high" ? "text-red-600" : "text-amber-600"}`} />;
      case "admin":
        return <Users {...iconProps} className="w-5 h-5 text-blue-600" />;
      case "system":
        return <Settings {...iconProps} className="w-5 h-5 text-gray-600" />;
      case "transaction":
        return <DollarSign {...iconProps} className="w-5 h-5 text-green-600" />;
      case "user":
        return <UserPlus {...iconProps} className="w-5 h-5 text-purple-600" />;
      case "alert":
        return <TrendingUp {...iconProps} className="w-5 h-5 text-indigo-600" />;
      case "compliance":
        return <FileText {...iconProps} className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell {...iconProps} className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const handleAction = async (action) => {
    console.log('Executing action:', action);
    // In a real app, this would make API calls
    setShowActionModal(false);
  };

  const toggleStar = () => {
    setIsStarred(!isStarred);
    // In real app, update via API
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
        <PageHeader title="Loading..." />
        <main className="flex-1 bg-[#FAFAFA] p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#1E1E1E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#999999]">Loading notification...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
        <PageHeader title="Not Found" />
        <main className="flex-1 bg-[#FAFAFA] p-6 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="text-xl font-light text-[#1E1E1E] mb-2">Notification Not Found</h3>
            <p className="text-[#999999] mb-6">The notification you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/notifications-me"
              className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Back to Notifications
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
      <PageHeader
        title="Notification Details"
        actions={
          <Link
            href="/notifications-me"
            className="px-4 py-2 border border-[#00000008] hover:border-[#00000020] transition-colors flex items-center gap-2 text-sm font-light"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Back to Notifications
          </Link>
        }
      />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type, notification.priority)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h1 className="text-xl font-light text-[#1E1E1E] leading-tight">
                      {notification.title}
                      {!isRead && (
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-3"></span>
                      )}
                    </h1>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-3 py-1 text-xs font-medium uppercase tracking-wider border ${getPriorityColor(notification.priority)}`}>
                        {notification.priority} Priority
                      </span>
                    </div>
                  </div>

                  <p className="text-[#666666] text-sm font-light mb-4 leading-relaxed">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-xs text-[#999999]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" strokeWidth={1.5} />
                        <span>{notification.timestamp.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" strokeWidth={1.5} />
                        <span className="capitalize">{notification.category}</span>
                      </div>

                      {notification.relatedEntity && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" strokeWidth={1.5} />
                          <span>
                            {notification.relatedEntity.type} #{notification.relatedEntity.id}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleStar}
                        className={`p-2 hover:bg-[#F8F9FA] transition-colors ${
                          isStarred ? 'text-yellow-500' : 'text-[#999999]'
                        }`}
                      >
                        <Star className="w-4 h-4" strokeWidth={1.5} fill={isStarred ? 'currentColor' : 'none'} />
                      </button>

                      <button className="p-2 hover:bg-[#F8F9FA] transition-colors text-[#999999]">
                        <Share className="w-4 h-4" strokeWidth={1.5} />
                      </button>

                      <button className="p-2 hover:bg-[#F8F9FA] transition-colors text-[#999999]">
                        <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Required Banner */}
            {notification.actionRequired && (
              <div className="bg-amber-50/80 border border-amber-200 p-4 mb-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Action Required</p>
                    <p className="text-sm text-amber-700">This notification requires your attention and action.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full Content */}
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
            <h3 className="text-lg font-light text-[#1E1E1E] mb-4">Details</h3>
            <div
              className="prose prose-sm max-w-none text-[#666666] font-light leading-relaxed"
              dangerouslySetInnerHTML={{ __html: notification.fullContent }}
            />
          </div>

          {/* Metadata */}
          {notification.metadata && (
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
              <h3 className="text-lg font-light text-[#1E1E1E] mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(notification.metadata).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-[#00000008] last:border-b-0">
                    <span className="text-sm font-light text-[#999999] capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-sm font-light text-[#1E1E1E]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
              <h3 className="text-lg font-light text-[#1E1E1E] mb-4">Available Actions</h3>
              <div className="flex flex-wrap gap-3">
                {notification.actions.map((action) => {
                  const buttonClasses = {
                    primary: "px-4 py-2 bg-[#1E1E1E] text-white hover:bg-[#2E2E2E]",
                    secondary: "px-4 py-2 border border-[#00000008] text-[#1E1E1E] hover:border-[#00000020]",
                    danger: "px-4 py-2 bg-red-600 text-white hover:bg-red-700"
                  };

                  if (action.link) {
                    return (
                      <Link
                        key={action.id}
                        href={action.link}
                        className={`${buttonClasses[action.type]} transition-colors text-sm font-light inline-flex items-center gap-2`}
                      >
                        {action.label}
                        <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action)}
                      className={`${buttonClasses[action.type]} transition-colors text-sm font-light`}
                    >
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Related Items */}
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6">
            <h3 className="text-lg font-light text-[#1E1E1E] mb-4">Related</h3>
            <div className="space-y-3">
              <Link
                href="/notifications-me"
                className="flex items-center justify-between p-3 border border-[#00000008] hover:border-[#00000020] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  <span className="text-sm font-light text-[#1E1E1E]">All Personal Notifications</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#999999] group-hover:text-[#1E1E1E] transition-colors" strokeWidth={1.5} />
              </Link>

              {notification.category === "security" && (
                <Link
                  href="/security"
                  className="flex items-center justify-between p-3 border border-[#00000008] hover:border-[#00000020] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                    <span className="text-sm font-light text-[#1E1E1E]">Security Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#999999] group-hover:text-[#1E1E1E] transition-colors" strokeWidth={1.5} />
                </Link>
              )}

              {notification.category === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center justify-between p-3 border border-[#00000008] hover:border-[#00000020] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                    <span className="text-sm font-light text-[#1E1E1E]">Admin Management</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#999999] group-hover:text-[#1E1E1E] transition-colors" strokeWidth={1.5} />
                </Link>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
