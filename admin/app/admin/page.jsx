"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "../../components/ui";
import Link from "next/link";
import {
  Shield,
  Users,
  UserPlus,
  Key,
  Eye,
  Edit,
  Trash2,
  Save,
  Plus,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Clock,
  CheckCircle,
  MapPin,
  XCircle,
  AlertTriangle,
  Mail,
  Lock,
  Unlock,
  Activity,
  Settings,
  Database,
  CreditCard,
  BarChart3,
  Bell,
  FileText,
  UserCheck,
  UserX,
  Crown,
  Star,
  Copy,
  Download,
  RefreshCw,
  Calendar,
  ArrowUp,
  ArrowDown,
  Smartphone,
  Globe,
  LogOut
} from "lucide-react";

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showInviteAdmin, setShowInviteAdmin] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: {
      userManagement: { view: false, edit: false, delete: false },
      transactions: { view: false, edit: false, delete: false },
      creditScoring: { view: false, edit: false, delete: false },
      walletBanking: { view: false, edit: false, delete: false },
      analytics: { view: false, edit: false, delete: false },
      settings: { view: false, edit: false, delete: false },
      adminManagement: { view: false, edit: false, delete: false }
    }
  });
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    role: '',
    message: ''
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Demo data - would come from API in real implementation
  const adminStats = [
    { title: 'Total Admins', value: '12', change: '+2', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
    { title: 'Active Sessions', value: '8', change: '+1', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
    { title: 'Pending Requests', value: '4', change: '+1', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100' },
    { title: 'Roles Defined', value: '6', change: '0', icon: Key, color: 'text-violet-600', bg: 'bg-violet-50/50', border: 'border-violet-100' }
  ];

  // Admin role requests data
  const roleRequests = [
    {
      id: 'req-001',
      adminName: 'Sarah Johnson',
      adminEmail: 'sarah.johnson@ajo.com',
      currentRole: 'Customer Support',
      requestedRole: 'Admin',
      reason: 'Need elevated permissions to handle complex user issues and transaction disputes more efficiently.',
      requestedAt: '2025-08-26 02:30 PM',
      requestedBy: 'Adaeze Obi',
      status: 'pending',
      urgency: 'medium'
    },
    {
      id: 'req-002',
      adminName: 'Michael Chen',
      adminEmail: 'michael.chen@ajo.com',
      currentRole: 'Analyst',
      requestedRole: 'Compliance Officer',
      reason: 'Taking on regulatory compliance responsibilities for new jurisdictions. Need access to credit scoring and wallet banking controls.',
      requestedAt: '2025-08-25 11:15 AM',
      requestedBy: 'Fatima Ibrahim',
      status: 'pending',
      urgency: 'high'
    },
    {
      id: 'req-003',
      adminName: 'David Okafor',
      adminEmail: 'david.okafor@ajo.com',
      currentRole: 'Customer Support',
      requestedRole: 'Analyst',
      reason: 'Moving to analytics team to focus on user behavior analysis and fraud detection patterns.',
      requestedAt: '2025-08-24 09:45 AM',
      requestedBy: 'Tunde Ade',
      status: 'pending',
      urgency: 'low'
    },
    {
      id: 'req-004',
      adminName: 'Grace Adebayo',
      adminEmail: 'grace.adebayo@ajo.com',
      currentRole: 'Analyst',
      requestedRole: 'Admin',
      reason: 'Promotion to senior role with team leadership responsibilities.',
      requestedAt: '2025-08-23 04:20 PM',
      requestedBy: 'Iren Kukoma',
      status: 'approved',
      urgency: 'medium',
      reviewedAt: '2025-08-24 09:00 AM',
      reviewedBy: 'Iren Kukoma'
    }
  ];

  const roles = [
    {
      id: 'role-001',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      adminCount: 2,
      permissions: {
        userManagement: { view: true, edit: true, delete: true },
        transactions: { view: true, edit: true, delete: true },
        creditScoring: { view: true, edit: true, delete: true },
        walletBanking: { view: true, edit: true, delete: true },
        analytics: { view: true, edit: true, delete: true },
        settings: { view: true, edit: true, delete: true },
        adminManagement: { view: true, edit: true, delete: true }
      },
      isSystem: true,
      createdAt: '2025-01-15',
      updatedAt: '2025-08-20'
    },
    {
      id: 'role-002',
      name: 'Admin',
      description: 'Administrative access with limited system controls',
      adminCount: 4,
      permissions: {
        userManagement: { view: true, edit: true, delete: false },
        transactions: { view: true, edit: true, delete: false },
        creditScoring: { view: true, edit: false, delete: false },
        walletBanking: { view: true, edit: true, delete: false },
        analytics: { view: true, edit: false, delete: false },
        settings: { view: true, edit: false, delete: false },
        adminManagement: { view: true, edit: false, delete: false }
      },
      isSystem: false,
      createdAt: '2025-01-15',
      updatedAt: '2025-07-12'
    },
    {
      id: 'role-003',
      name: 'Customer Support',
      description: 'User support and basic transaction monitoring',
      adminCount: 4,
      permissions: {
        userManagement: { view: true, edit: true, delete: false },
        transactions: { view: true, edit: false, delete: false },
        creditScoring: { view: false, edit: false, delete: false },
        walletBanking: { view: true, edit: false, delete: false },
        analytics: { view: false, edit: false, delete: false },
        settings: { view: false, edit: false, delete: false },
        adminManagement: { view: false, edit: false, delete: false }
      },
      isSystem: false,
      createdAt: '2025-02-01',
      updatedAt: '2025-06-15'
    },
    {
      id: 'role-004',
      name: 'Analyst',
      description: 'Read-only access to analytics and reporting',
      adminCount: 2,
      permissions: {
        userManagement: { view: true, edit: false, delete: false },
        transactions: { view: true, edit: false, delete: false },
        creditScoring: { view: true, edit: false, delete: false },
        walletBanking: { view: true, edit: false, delete: false },
        analytics: { view: true, edit: true, delete: false },
        settings: { view: false, edit: false, delete: false },
        adminManagement: { view: false, edit: false, delete: false }
      },
      isSystem: false,
      createdAt: '2025-03-10',
      updatedAt: '2025-05-20'
    },
    {
      id: 'role-005',
      name: 'Compliance Officer',
      description: 'Specialized access for regulatory compliance',
      adminCount: 1,
      permissions: {
        userManagement: { view: true, edit: false, delete: false },
        transactions: { view: true, edit: true, delete: false },
        creditScoring: { view: true, edit: true, delete: false },
        walletBanking: { view: true, edit: true, delete: false },
        analytics: { view: true, edit: false, delete: false },
        settings: { view: false, edit: false, delete: false },
        adminManagement: { view: false, edit: false, delete: false }
      },
      isSystem: false,
      createdAt: '2025-04-05',
      updatedAt: '2025-08-01'
    }
  ];

  const adminUsers = [
    {
      id: 'admin-001',
      name: 'Iren Kukoma',
      email: 'iren.kukoma@ajo.com',
      role: 'Super Admin',
      roleId: 'role-001',
      status: 'active',
      lastLogin: '2025-08-27 10:30 AM',
      loginLocation: 'Lagos, Nigeria',
      deviceInfo: 'Chrome on MacOS',
      sessionActive: true,
      twoFactorEnabled: true,
      invitedAt: '2025-01-15',
      invitedBy: 'System',
      totalLogins: 342,
      permissions: 147
    },
    {
      id: 'admin-002',
      name: 'Adaeze Obi',
      email: 'adaeze.obi@ajo.com',
      role: 'Admin',
      roleId: 'role-002',
      status: 'active',
      lastLogin: '2025-08-27 09:15 AM',
      loginLocation: 'Abuja, Nigeria',
      deviceInfo: 'Firefox on Windows',
      sessionActive: true,
      twoFactorEnabled: true,
      invitedAt: '2025-02-20',
      invitedBy: 'Iren Kukoma',
      totalLogins: 189,
      permissions: 98
    },
    {
      id: 'admin-003',
      name: 'Tunde Ade',
      email: 'tunde.ade@ajo.com',
      role: 'Customer Support',
      roleId: 'role-003',
      status: 'active',
      lastLogin: '2025-08-27 08:45 AM',
      loginLocation: 'Port Harcourt, Nigeria',
      deviceInfo: 'Chrome on Android',
      sessionActive: false,
      twoFactorEnabled: false,
      invitedAt: '2025-03-15',
      invitedBy: 'Adaeze Obi',
      totalLogins: 145,
      permissions: 45
    },
    {
      id: 'admin-004',
      name: 'Fatima Ibrahim',
      email: 'fatima.ibrahim@ajo.com',
      role: 'Analyst',
      roleId: 'role-004',
      status: 'inactive',
      lastLogin: '2025-08-25 04:20 PM',
      loginLocation: 'Kano, Nigeria',
      deviceInfo: 'Safari on iOS',
      sessionActive: false,
      twoFactorEnabled: true,
      invitedAt: '2025-04-10',
      invitedBy: 'Iren Kukoma',
      totalLogins: 87,
      permissions: 67
    },
    {
      id: 'admin-005',
      name: 'Chidi Okonkwo',
      email: 'chidi.okonkwo@ajo.com',
      role: 'Compliance Officer',
      roleId: 'role-005',
      status: 'pending',
      lastLogin: 'Never',
      loginLocation: 'N/A',
      deviceInfo: 'N/A',
      sessionActive: false,
      twoFactorEnabled: false,
      invitedAt: '2025-08-25',
      invitedBy: 'Iren Kukoma',
      totalLogins: 0,
      permissions: 89
    }
  ];

  const auditLogs = [
    {
      id: 'audit-001',
      adminName: 'Iren Kukoma',
      action: 'User Suspended',
      target: 'John Doe (user-12345)',
      timestamp: '2025-08-27 10:15 AM',
      ipAddress: '102.89.33.145',
      userAgent: 'Chrome 116.0.0.0',
      status: 'success',
      details: 'Suspended user due to suspicious activity'
    },
    {
      id: 'audit-002',
      adminName: 'Adaeze Obi',
      action: 'Transaction Approved',
      target: 'TXN-789012',
      timestamp: '2025-08-27 09:30 AM',
      ipAddress: '197.210.226.60',
      userAgent: 'Firefox 117.0.1',
      status: 'success',
      details: 'Approved withdrawal request after verification'
    },
    {
      id: 'audit-003',
      adminName: 'Tunde Ade',
      action: 'Login Failed',
      target: 'Self',
      timestamp: '2025-08-27 08:42 AM',
      ipAddress: '41.203.115.22',
      userAgent: 'Chrome Mobile 116.0.0.0',
      status: 'warning',
      details: 'Failed login attempt - incorrect 2FA code'
    },
    {
      id: 'audit-004',
      adminName: 'Fatima Ibrahim',
      action: 'Role Permissions Updated',
      target: 'Customer Support Role',
      timestamp: '2025-08-26 02:15 PM',
      ipAddress: '105.112.45.88',
      userAgent: 'Safari 16.6',
      status: 'success',
      details: 'Modified transaction viewing permissions'
    }
  ];

  const activeSessions = [
    {
      id: 'session-001',
      adminName: 'Iren Kukoma',
      ipAddress: '102.89.33.145',
      location: 'Lagos, Nigeria',
      device: 'Chrome on MacOS',
      startTime: '2025-08-27 07:30 AM',
      lastActivity: '2025-08-27 10:30 AM',
      status: 'active'
    },
    {
      id: 'session-002',
      adminName: 'Adaeze Obi',
      ipAddress: '197.210.226.60',
      location: 'Abuja, Nigeria',
      device: 'Firefox on Windows',
      startTime: '2025-08-27 08:00 AM',
      lastActivity: '2025-08-27 10:25 AM',
      status: 'active'
    },
    {
      id: 'session-003',
      adminName: 'Tunde Ade',
      ipAddress: '41.203.115.22',
      location: 'Port Harcourt, Nigeria',
      device: 'Chrome on Android',
      startTime: '2025-08-27 08:45 AM',
      lastActivity: '2025-08-27 09:15 AM',
      status: 'idle'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100';
      case 'inactive': return 'bg-gray-50/50 text-gray-600 border-gray-100';
      case 'pending': return 'bg-amber-50/50 text-amber-600 border-amber-100';
      case 'suspended': return 'bg-red-50/50 text-red-600 border-red-100';
      case 'success': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100';
      case 'warning': return 'bg-amber-50/50 text-amber-600 border-amber-100';
      case 'error': return 'bg-red-50/50 text-red-600 border-red-100';
      case 'idle': return 'bg-gray-50/50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50/50 text-gray-600 border-gray-100';
    }
  };

  const filteredAdmins = adminUsers.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || admin.role === filterRole;
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };

  const getPermissionIcon = (module) => {
    switch(module) {
      case 'userManagement': return Users;
      case 'transactions': return CreditCard;
      case 'creditScoring': return BarChart3;
      case 'walletBanking': return Database;
      case 'analytics': return BarChart3;
      case 'settings': return Settings;
      case 'adminManagement': return Shield;
      default: return Key;
    }
  };

  const getPermissionLabel = (module) => {
    switch(module) {
      case 'userManagement': return 'User Management';
      case 'transactions': return 'Transactions';
      case 'creditScoring': return 'Credit Scoring';
      case 'walletBanking': return 'Wallet & Banking';
      case 'analytics': return 'Analytics';
      case 'settings': return 'Settings';
      case 'adminManagement': return 'Admin Management';
      default: return module;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
      <PageHeader title="Admin Management" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-light text-[#1E1E1E]">Admin Roles & Permissions</h2>
              <p className="text-[#999999] text-xs mt-1 font-light">
                Manage administrative access, roles, and security settings
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#1E1E1E] text-sm font-light">
                {formatTime(currentTime)} WAT
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminStats.map((stat, index) => {
              const Icon = stat.icon;
              const isPositive = stat.change.startsWith('+');
              const isNeutral = stat.change === '0';
              return (
                <div
                  key={stat.title}
                  className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008] hover:border-[#00000020] transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 ${stat.bg} ${stat.border} border flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div className="flex items-center gap-1">
                      {!isNeutral && (
                        isPositive ? (
                          <ArrowUp className="w-3 h-3 text-emerald-500" strokeWidth={2} />
                        ) : (
                          <ArrowDown className="w-3 h-3 text-red-500" strokeWidth={2} />
                        )
                      )}
                      <span className={`text-xs font-medium ${
                        isNeutral ? 'text-gray-500' :
                        isPositive ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-light text-[#1E1E1E] tracking-tight">
                      {stat.value}
                    </p>
                    <h3 className="text-[#999999] text-xs font-normal uppercase tracking-wider">
                      {stat.title}
                    </h3>
                  </div>
                  <div className={`h-0.5 ${stat.bg} mt-4 w-0 group-hover:w-full transition-all duration-500`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Users Section */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-light text-[#1E1E1E] flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                Admin Users Management
              </h3>
              <p className="text-[#999999] text-xs mt-1 font-light">
                Manage administrator accounts, permissions, and access control
              </p>
            </div>
            <Link
              href="/admin/users"
              className="px-6 py-3 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" strokeWidth={1.5} />
              Manage Admin Users
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border border-[#00000008] hover:border-[#00000020] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <UserCheck className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                <span className="text-xs text-emerald-600">10</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">15</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Total Admins</p>
            </div>
            <div className="p-4 border border-[#00000008] hover:border-[#00000020] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                <span className="text-xs text-blue-600">7</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">7</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Active Sessions</p>
            </div>
            <div className="p-4 border border-[#00000008] hover:border-[#00000020] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                <span className="text-xs text-amber-600">2</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">2</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">Pending Invites</p>
            </div>
            <div className="p-4 border border-[#00000008] hover:border-[#00000020] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5 text-violet-600" strokeWidth={1.5} />
                <span className="text-xs text-violet-600">11</span>
              </div>
              <p className="text-2xl font-light text-[#1E1E1E]">11</p>
              <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">2FA Enabled</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-6 border-b border-[#00000008] overflow-x-auto">
          {[
            { key: 'overview', label: 'Admin Overview' },
            { key: 'roles', label: 'Role Management' },
            { key: 'requests', label: 'Role Requests' },
            { key: 'permissions', label: 'Permissions' },
            { key: 'sessions', label: 'Active Sessions' },
            { key: 'audit', label: 'Audit Trail' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 text-sm font-light transition-all duration-200 whitespace-nowrap relative ${
                activeTab === tab.key
                  ? 'text-[#1E1E1E] border-b-2 border-[#1E1E1E]'
                  : 'text-[#999999] hover:text-[#1E1E1E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Admin Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setShowInviteAdmin(true)}
                  className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-left"
                >
                  <UserPlus className="w-5 h-5 mb-2 text-blue-500" strokeWidth={1.5} />
                  <span className="text-sm font-light text-[#1E1E1E] block">Invite Admin</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => setShowCreateRole(true)}
                  className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-left"
                >
                  <Key className="w-5 h-5 mb-2 text-violet-500" strokeWidth={1.5} />
                  <span className="text-sm font-light text-[#1E1E1E] block">Create Role</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => setActiveTab('sessions')}
                  className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-left"
                >
                  <Activity className="w-5 h-5 mb-2 text-emerald-500" strokeWidth={1.5} />
                  <span className="text-sm font-light text-[#1E1E1E] block">Active Sessions</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="group relative p-4 bg-[#FAFAFA] border border-[#00000008] hover:border-[#00000020] transition-all duration-300 text-left"
                >
                  <Clock className="w-5 h-5 mb-2 text-amber-500" strokeWidth={1.5} />
                  <span className="text-sm font-light text-[#1E1E1E] block">Role Requests</span>
                  <p className="text-xs text-[#999999] mt-1">{roleRequests.filter(r => r.status === 'pending').length} pending</p>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Dashboard Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pending Role Requests */}
              <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
                <div className="flex items-center justify-between mb-6 border-b border-[#00000008] pb-3">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Pending Role Requests</h3>
                  <button onClick={() => setActiveTab('requests')} className="text-xs text-[#999999] hover:text-[#1E1E1E] transition-colors">
                    View all →
                  </button>
                </div>
                <div className="space-y-3">
                  {roleRequests.filter(r => r.status === 'pending').slice(0, 3).map((request) => (
                    <div key={request.id} className="p-3 border-l-2 border-transparent hover:border-amber-500 hover:bg-[#FAFAFA] transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-light text-[#1E1E1E]">{request.adminName}</h4>
                        <span className={`text-[10px] uppercase tracking-wider ${
                          request.urgency === 'high' ? 'text-red-600' :
                          request.urgency === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {request.urgency} priority
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-[#999999]">{request.currentRole} → {request.requestedRole}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] hover:bg-emerald-100 transition-colors">
                          Approve
                        </button>
                        <button className="px-2 py-1 bg-red-50 text-red-600 text-[10px] hover:bg-red-100 transition-colors">
                          Deny
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Admin Activity */}
              <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
                <div className="flex items-center justify-between mb-6 border-b border-[#00000008] pb-3">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Recent Admin Activity</h3>
                  <button onClick={() => setActiveTab('audit')} className="text-xs text-[#999999] hover:text-[#1E1E1E] transition-colors">
                    View all →
                  </button>
                </div>
                <div className="space-y-3">
                  {auditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border-l-2 border-transparent hover:border-blue-500 hover:bg-[#FAFAFA] transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#FAFAFA] border border-[#00000008] flex items-center justify-center text-[#1E1E1E] font-light text-sm">
                          {log.adminName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-light text-[#1E1E1E]">{log.action}</p>
                          <p className="text-xs text-[#999999]">{log.adminName} • {log.timestamp}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Summary */}
              <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
                <div className="flex items-center justify-between mb-6 border-b border-[#00000008] pb-3">
                  <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Role Distribution</h3>
                  <button onClick={() => setActiveTab('roles')} className="text-xs text-[#999999] hover:text-[#1E1E1E] transition-colors">
                    Manage roles →
                  </button>
                </div>
                <div className="space-y-3">
                  {roles.slice(0, 4).map((role) => (
                    <div key={role.id} className="p-3 border-l-2 border-transparent hover:border-violet-500 hover:bg-[#FAFAFA] transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-light text-[#1E1E1E] flex items-center gap-2">
                          {role.isSystem && <Crown className="w-3 h-3 text-amber-500" strokeWidth={1.5} />}
                          {role.name}
                        </h4>
                        <span className="text-[10px] uppercase tracking-wider text-[#999999]">{role.adminCount} admins</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#999999]">{role.description}</span>
                      </div>
                      <div className="h-0.5 bg-[#00000008] mt-3">
                        <div
                          className="h-full bg-gradient-to-r from-violet-400 to-violet-600"
                          style={{ width: `${(role.adminCount / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Role Management Tab */}
        {activeTab === 'roles' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
            <div className="p-4 border-b border-[#00000008]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                    <input
                      type="text"
                      placeholder="Search roles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateRole(true)}
                  className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                  Create Role
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#00000008]">
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Role Name</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Description</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Admin Count</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Permissions</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Last Updated</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => {
                    const totalPermissions = Object.keys(role.permissions).length;
                    const activePermissions = Object.values(role.permissions).filter(p => p.view || p.edit || p.delete).length;
                    return (
                      <tr key={role.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {role.isSystem && <Crown className="w-4 h-4 text-amber-500" strokeWidth={1.5} />}
                            <span className="text-sm font-light text-[#1E1E1E]">{role.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-light text-[#999999] max-w-xs">{role.description}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            <span className="text-sm font-light text-[#1E1E1E]">{role.adminCount}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-light text-[#1E1E1E]">{activePermissions}/{totalPermissions}</span>
                            <div className="w-16 h-2 bg-[#00000008] rounded-full">
                              <div
                                className="h-2 bg-violet-600 rounded-full"
                                style={{ width: `${(activePermissions / totalPermissions) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-xs text-[#999999]">{role.updatedAt}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingRole(role)}
                              className="p-1 hover:bg-[#FAFAFA] transition-colors"
                            >
                              <Edit className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            </button>
                            <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                              <Copy className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            </button>
                            {!role.isSystem && (
                              <button className="p-1 hover:bg-[#FAFAFA] transition-colors text-red-500">
                                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Role Requests Tab */}
        {activeTab === 'requests' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
            <div className="p-4 border-b border-[#00000008]">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Admin Role Change Requests</h3>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-emerald-50 text-emerald-600 text-sm font-light hover:bg-emerald-100 transition-colors">
                    Approve All Pending
                  </button>
                  <button className="p-2 hover:bg-[#FAFAFA] transition-colors">
                    <RefreshCw className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#00000008]">
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Admin</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Role Change</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Requested By</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Reason</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Priority</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Date</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roleRequests.map((request) => (
                    <tr key={request.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${request.adminName}`}
                            alt={`${request.adminName} avatar`}
                            className="w-8 h-8 rounded-full border border-[#00000008]"
                          />
                          <div>
                            <p className="text-sm font-light text-[#1E1E1E]">{request.adminName}</p>
                            <p className="text-xs text-[#999999]">{request.adminEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#999999]">{request.currentRole}</span>
                          <ArrowUp className="w-3 h-3 text-[#666666]" strokeWidth={1.5} />
                          <span className="text-sm font-light text-[#1E1E1E]">{request.requestedRole}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-light text-[#1E1E1E]">{request.requestedBy}</span>
                      </td>
                      <td className="p-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-light text-[#999999] truncate" title={request.reason}>
                            {request.reason}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${
                          request.urgency === 'high' ? 'bg-red-50/50 text-red-600 border-red-100' :
                          request.urgency === 'medium' ? 'bg-amber-50/50 text-amber-600 border-amber-100' :
                          'bg-emerald-50/50 text-emerald-600 border-emerald-100'
                        }`}>
                          {request.urgency}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-xs text-[#999999]">{request.requestedAt}</p>
                          {request.reviewedAt && (
                            <p className="text-xs text-[#666666] mt-1">Reviewed: {request.reviewedAt}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {request.status === 'pending' ? (
                            <>
                              <button className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs hover:bg-emerald-100 transition-colors">
                                Approve
                              </button>
                              <button className="px-3 py-1 bg-red-50 text-red-600 text-xs hover:bg-red-100 transition-colors">
                                Deny
                              </button>
                            </>
                          ) : (
                            <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                              <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Admin Users Tab */}
        {activeTab === 'admins' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
            <div className="p-4 border-b border-[#00000008]">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                    <input
                      type="text"
                      placeholder="Search admin users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="appearance-none px-4 py-2 pr-10 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors cursor-pointer"
                    >
                      <option value="all">All Roles</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.name}>{role.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  </div>

                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="appearance-none px-4 py-2 pr-10 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowInviteAdmin(true)}
                    className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                    Invite Admin
                  </button>
                  <button className="p-2 hover:bg-[#FAFAFA] transition-colors">
                    <RefreshCw className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  </button>
                  <button className="p-2 hover:bg-[#FAFAFA] transition-colors">
                    <Download className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#00000008]">
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Admin</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Role</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Last Login</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">2FA</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Sessions</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${admin.name}`}
                            alt={`${admin.name} avatar`}
                            className="w-9 h-9 rounded-full border border-[#00000008]"
                          />
                          <div>
                            <p className="text-sm font-light text-[#1E1E1E]">{admin.name}</p>
                            <p className="text-xs text-[#999999]">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {admin.role === 'Super Admin' && <Crown className="w-3 h-3 text-amber-500" strokeWidth={1.5} />}
                          <span className="text-sm font-light text-[#1E1E1E]">{admin.role}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(admin.status)}`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-light text-[#1E1E1E]">{admin.lastLogin}</p>
                          <p className="text-xs text-[#999999]">{admin.loginLocation}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {admin.twoFactorEnabled ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                          )}
                          <span className={`text-xs ${admin.twoFactorEnabled ? 'text-emerald-600' : 'text-red-600'}`}>
                            {admin.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${admin.sessionActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                          <span className="text-xs text-[#999999]">
                            {admin.sessionActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                            <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                          </button>
                          <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                            <Edit className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                          </button>
                          {admin.sessionActive && (
                            <button className="p-1 hover:bg-[#FAFAFA] transition-colors text-amber-600">
                              <LogOut className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          )}
                          <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
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
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-6">Permission Matrix</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#00000008]">
                      <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Module</th>
                      {roles.map(role => (
                        <th key={role.id} className="text-center p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">
                          <div className="flex flex-col items-center gap-1">
                            {role.isSystem && <Crown className="w-3 h-3 text-amber-500" strokeWidth={1.5} />}
                            <span>{role.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(roles[0].permissions).map((module) => {
                      const Icon = getPermissionIcon(module);
                      return (
                        <tr key={module} className="border-b border-[#00000008] hover:bg-[#FAFAFA] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4 text-[#666666]" strokeWidth={1.5} />
                              <span className="text-sm font-light text-[#1E1E1E]">{getPermissionLabel(module)}</span>
                            </div>
                          </td>
                          {roles.map(role => {
                            const permissions = role.permissions[module];
                            return (
                              <td key={`${role.id}-${module}`} className="p-4">
                                <div className="flex justify-center gap-1">
                                  <div className={`w-2 h-2 rounded-full ${permissions.view ? 'bg-blue-500' : 'bg-gray-200'}`} title="View" />
                                  <div className={`w-2 h-2 rounded-full ${permissions.edit ? 'bg-emerald-500' : 'bg-gray-200'}`} title="Edit" />
                                  <div className={`w-2 h-2 rounded-full ${permissions.delete ? 'bg-red-500' : 'bg-gray-200'}`} title="Delete" />
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-center gap-6">
                <div className="text-xs text-[#999999]">Permission Legend:</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs text-[#999999]">View</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-[#999999]">Edit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs text-[#999999]">Delete</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="bg-white/80 backdrop-blur-sm p-6 border border-[#00000008]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Active Admin Sessions</h3>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-red-50 text-red-600 text-sm font-light hover:bg-red-100 transition-colors">
                  Terminate All Sessions
                </button>
                <button className="p-2 hover:bg-[#FAFAFA] transition-colors">
                  <RefreshCw className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="p-4 border border-[#00000008] hover:border-[#00000020] transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <img
                        src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${session.adminName}`}
                        alt={`${session.adminName} avatar`}
                        className="w-10 h-10 rounded-full border border-[#00000008]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-sm font-light text-[#1E1E1E]">{session.adminName}</h4>
                          <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#999999]">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" strokeWidth={1.5} />
                            <span>{session.ipAddress}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" strokeWidth={1.5} />
                            <span>{session.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Smartphone className="w-3 h-3" strokeWidth={1.5} />
                            <span>{session.device}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" strokeWidth={1.5} />
                            <span>Active: {session.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-amber-50 text-amber-600 text-xs hover:bg-amber-100 transition-colors">
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-red-50 text-red-600 text-xs hover:bg-red-100 transition-colors">
                        Terminate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Trail Tab */}
        {activeTab === 'audit' && (
          <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
            <div className="p-4 border-b border-[#00000008]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                    <input
                      type="text"
                      placeholder="Search audit logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    />
                  </div>
                  <input
                    type="date"
                    className="px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                  />
                </div>
                <button className="p-2 hover:bg-[#FAFAFA] transition-colors">
                  <Download className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#00000008]">
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Admin</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Action</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Target</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Timestamp</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">IP Address</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                    <th className="text-left p-4 text-[10px] font-light uppercase tracking-wider text-[#999999]">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${log.adminName}`}
                            alt={`${log.adminName} avatar`}
                            className="w-6 h-6 rounded-full border border-[#00000008]"
                          />
                          <span className="text-sm font-light text-[#1E1E1E]">{log.adminName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-light text-[#1E1E1E]">{log.action}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-light text-[#999999]">{log.target}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-[#999999]">{log.timestamp}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-mono text-[#999999]">{log.ipAddress}</span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="p-1 hover:bg-[#FAFAFA] transition-colors">
                          <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Invite Admin Modal */}
      {showInviteAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-[#00000008] w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-light text-[#1E1E1E]">Invite New Admin</h3>
                <button
                  onClick={() => setShowInviteAdmin(false)}
                  className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-[#999999]" strokeWidth={1.5} />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                    className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                    className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Assign Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                    className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                  >
                    <option value="">Select a role</option>
                    {roles.filter(role => !role.isSystem).map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Welcome Message (Optional)</label>
                  <textarea
                    value={inviteForm.message}
                    onChange={(e) => setInviteForm({...inviteForm, message: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors resize-none"
                    placeholder="Add a personal welcome message (optional)"
                  />
                </div>

                <div className="bg-[#F8F9FA] p-4 rounded-lg">
                  <h4 className="text-sm font-light text-[#1E1E1E] mb-2">Invitation Details</h4>
                  <div className="space-y-2 text-xs text-[#999999]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" strokeWidth={1.5} />
                      <span>Invitation will be sent via email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" strokeWidth={1.5} />
                      <span>Invitation expires in 7 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3" strokeWidth={1.5} />
                      <span>2FA setup will be required upon first login</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      // Handle invite logic here
                      console.log('Sending invitation:', inviteForm);
                      setShowInviteAdmin(false);
                      setInviteForm({ email: '', name: '', role: '', message: '' });
                    }}
                    className="flex-1 px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                    Send Invitation
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInviteAdmin(false)}
                    className="px-4 py-2 bg-[#F8F9FA] text-[#666666] text-sm font-light hover:bg-[#F0F0F0] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-[#00000008] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-light text-[#1E1E1E]">Create New Role</h3>
                <button
                  onClick={() => setShowCreateRole(false)}
                  className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-[#999999]" strokeWidth={1.5} />
                </button>
              </div>

              <form className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Role Name</label>
                    <input
                      type="text"
                      value={newRole.name}
                      onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                      className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                      placeholder="Enter role name (e.g. Finance Manager)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Description</label>
                    <textarea
                      value={newRole.description}
                      onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors resize-none"
                      placeholder="Describe the role's responsibilities and scope"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-light text-[#1E1E1E] mb-4">Permissions</h4>
                  <div className="space-y-4">
                    {Object.keys(newRole.permissions).map((module) => {
                      const Icon = getPermissionIcon(module);
                      const label = getPermissionLabel(module);
                      const perms = newRole.permissions[module];

                      return (
                        <div key={module} className="border border-[#00000008] rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Icon className="w-4 h-4 text-[#666666]" strokeWidth={1.5} />
                            <span className="text-sm font-light text-[#1E1E1E]">{label}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={perms.view}
                                onChange={(e) => setNewRole({
                                  ...newRole,
                                  permissions: {
                                    ...newRole.permissions,
                                    [module]: { ...perms, view: e.target.checked }
                                  }
                                })}
                                className="w-4 h-4"
                              />
                              <span className="text-xs text-[#666666]">View</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={perms.edit}
                                onChange={(e) => setNewRole({
                                  ...newRole,
                                  permissions: {
                                    ...newRole.permissions,
                                    [module]: { ...perms, edit: e.target.checked }
                                  }
                                })}
                                className="w-4 h-4"
                              />
                              <span className="text-xs text-[#666666]">Edit</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={perms.delete}
                                onChange={(e) => setNewRole({
                                  ...newRole,
                                  permissions: {
                                    ...newRole.permissions,
                                    [module]: { ...perms, delete: e.target.checked }
                                  }
                                })}
                                className="w-4 h-4"
                              />
                              <span className="text-xs text-[#666666]">Delete</span>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#F8F9FA] p-4 rounded-lg">
                  <h4 className="text-sm font-light text-[#1E1E1E] mb-2">Role Summary</h4>
                  <div className="space-y-2 text-xs text-[#999999]">
                    <div className="flex items-center justify-between">
                      <span>Total Modules:</span>
                      <span className="text-[#1E1E1E]">{Object.keys(newRole.permissions).length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Modules with Access:</span>
                      <span className="text-[#1E1E1E]">
                        {Object.values(newRole.permissions).filter(p => p.view || p.edit || p.delete).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Edit Permissions:</span>
                      <span className="text-[#1E1E1E]">
                        {Object.values(newRole.permissions).filter(p => p.edit).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Delete Permissions:</span>
                      <span className="text-[#1E1E1E]">
                        {Object.values(newRole.permissions).filter(p => p.delete).length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      // Handle role creation logic here
                      console.log('Creating role:', newRole);
                      setShowCreateRole(false);
                      setNewRole({
                        name: '',
                        description: '',
                        permissions: {
                          userManagement: { view: false, edit: false, delete: false },
                          transactions: { view: false, edit: false, delete: false },
                          creditScoring: { view: false, edit: false, delete: false },
                          walletBanking: { view: false, edit: false, delete: false },
                          analytics: { view: false, edit: false, delete: false },
                          settings: { view: false, edit: false, delete: false },
                          adminManagement: { view: false, edit: false, delete: false }
                        }
                      });
                    }}
                    className="flex-1 px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4" strokeWidth={1.5} />
                    Create Role
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateRole(false)}
                    className="px-4 py-2 bg-[#F8F9FA] text-[#666666] text-sm font-light hover:bg-[#F0F0F0] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
