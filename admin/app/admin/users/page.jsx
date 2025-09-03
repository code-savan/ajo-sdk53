"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "../../../components/ui";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  UserPlus,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Crown,
  CheckCircle,
  XCircle,
  LogOut,
  RefreshCw,
  Download,
  MapPin,
  Smartphone,
  Clock,
  Shield,
  Mail,
  Globe,
  Activity,
  AlertTriangle,
  Star,
  UserCheck,
  UserX
} from "lucide-react";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 15 demo admin users
  const adminUsers = [
    {
      id: 'admin-001',
      name: 'Iren Kukoma',
      email: 'iren.kukoma@ajo.com',
      role: 'Super Admin',
      status: 'active',
      lastLogin: '2025-09-03 10:30 AM',
      loginLocation: 'Lagos, Nigeria',
      deviceInfo: 'Chrome on MacOS',
      sessionActive: true,
      twoFactorEnabled: true,
      invitedAt: '2025-01-15',
      invitedBy: 'System',
      totalLogins: 342,
      permissions: 147,
      actionsToday: 12,
      phoneNumber: '+234 801 234 5678',
      department: 'Executive',
      joinDate: '2025-01-15',
      ipAddress: '102.89.33.145'
    },
    {
      id: 'admin-002',
      name: 'Adaeze Obi',
      email: 'adaeze.obi@ajo.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2025-09-03 09:15 AM',
      loginLocation: 'Abuja, Nigeria',
      deviceInfo: 'Firefox on Windows',
      sessionActive: true,
      twoFactorEnabled: true,
      invitedAt: '2025-02-20',
      invitedBy: 'Iren Kukoma',
      totalLogins: 189,
      permissions: 98,
      actionsToday: 8,
      phoneNumber: '+234 803 567 8901',
      department: 'Operations',
      joinDate: '2025-02-20',
      ipAddress: '197.210.226.60'
    },
    {
      id: 'admin-003',
      name: 'Tunde Ade',
      email: 'tunde.ade@ajo.com',
      role: 'Customer Support',
      status: 'active',
      lastLogin: '2025-09-03 08:45 AM',
      loginLocation: 'Port Harcourt, Nigeria',
      deviceInfo: 'Chrome on Android',
      sessionActive: false,
      twoFactorEnabled: false,
      invitedAt: '2025-03-15',
      invitedBy: 'Adaeze Obi',
      totalLogins: 145,
      permissions: 45,
      actionsToday: 3,
      phoneNumber: '+234 805 123 4567',
      department: 'Support',
      joinDate: '2025-03-15',
      ipAddress: '41.203.115.22'
    },
    {
      id: 'admin-004',
      name: 'Fatima Ibrahim',
      email: 'fatima.ibrahim@ajo.com',
      role: 'Analyst',
      status: 'inactive',
      lastLogin: '2025-09-01 04:20 PM',
      loginLocation: 'Kano, Nigeria',
      deviceInfo: 'Safari on iOS',
      sessionActive: false,
      twoFactorEnabled: true,
      invitedAt: '2025-04-10',
      invitedBy: 'Iren Kukoma',
      totalLogins: 87,
      permissions: 67,
      actionsToday: 0,
      phoneNumber: '+234 807 890 1234',
      department: 'Analytics',
      joinDate: '2025-04-10',
      ipAddress: '105.112.45.88'
    },
    {
      id: 'admin-005',
      name: 'Chidi Okonkwo',
      email: 'chidi.okonkwo@ajo.com',
      role: 'Compliance Officer',
      status: 'pending',
      lastLogin: 'Never',
      loginLocation: 'N/A',
      deviceInfo: 'N/A',
      sessionActive: false,
      twoFactorEnabled: false,
      invitedAt: '2025-08-25',
      invitedBy: 'Iren Kukoma',
      totalLogins: 0,
      permissions: 89,
      actionsToday: 0,
      phoneNumber: '+234 809 234 5678',
      department: 'Compliance',
      joinDate: '2025-08-25',
      ipAddress: 'N/A'
    },
    {
      id: 'admin-006',
      name: 'Blessing Okoro',
      email: 'blessing.okoro@ajo.com',
      role: 'Customer Support',
      status: 'active',
      lastLogin: '2025-09-03 07:30 AM',
      loginLocation: 'Enugu, Nigeria',
      deviceInfo: 'Chrome on Windows',
      sessionActive: true,
      twoFactorEnabled: true,
      invitedAt: '2025-05-12',
      invitedBy: 'Tunde Ade',
      totalLogins: 78,
      permissions: 45,
      actionsToday: 6,
      phoneNumber: '+234 811 345 6789',
      department: 'Support',
      joinDate: '2025-05-12',
      ipAddress: '154.113.44.67'
    },
    {
      id: 'admin-007',
      name: 'Kemi Adesola',
      email: 'kemi.adesola@ajo.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2025-09-03 06:45 AM',
      loginLocation: 'Ibadan, Nigeria',
      deviceInfo: 'Edge on Windows',
      sessionActive: false,
      twoFactorEnabled: true,
      invitedAt: '2025-06-08',
      invitedBy: 'Adaeze Obi',
      totalLogins: 95,
      permissions: 98,
      actionsToday: 4,
      phoneNumber: '+234 813 456 7890',
      department: 'Operations',
      joinDate: '2025-06-08',
      ipAddress: '197.149.89.23'
    },
    {
      id: 'admin-008',
      name: 'Emeka Nwankwo',
      email: 'emeka.nwankwo@ajo.com',
      role: 'Analyst',
      status: 'active',
      lastLogin: '2025-09-02 11:20 PM',
      loginLocation: 'Owerri, Nigeria',
      deviceInfo: 'Chrome on MacOS',
      sessionActive: false,
      twoFactorEnabled: false,
      invitedAt: '2025-07-14',
      invitedBy: 'Fatima Ibrahim',
      totalLogins: 52,
      permissions: 67,
      actionsToday: 0,
      phoneNumber: '+234 815 567 8901',
      department: 'Analytics',
      joinDate: '2025-07-14',
      ipAddress: '41.190.45.89'
    },
    {
      id: 'admin-009',
      name: 'Hauwa Musa',
      email: 'hauwa.musa@ajo.com',
      role: 'Customer Support',
      status: 'suspended',
      lastLogin: '2025-08-28 03:15 PM',
      loginLocation: 'Kaduna, Nigeria',
      deviceInfo: 'Firefox on Linux',
      sessionActive: false,
      twoFactorEnabled: true,
      invitedAt: '2025-04-22',
      invitedBy: 'Tunde Ade',
      totalLogins: 123,
      permissions: 45,
      actionsToday: 0,
      phoneNumber: '+234 817 678 9012',
      department: 'Support',
      joinDate: '2025-04-22',
      ipAddress: '196.46.78.234'
    },
    {
      id: 'admin-010',
      name: 'Gabriel Ojo',
      email: 'gabriel.ojo@ajo.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2025-09-03 08:00 AM',
      loginLocation: 'Benin City, Nigeria',
      deviceInfo: 'Safari on MacOS',
      sessionActive: true,
      twoFactorEnabled: true,
      invitedAt: '2025-03-28',
      invitedBy: 'Iren Kukoma',
      totalLogins: 167,
      permissions: 98,
      actionsToday: 9,
      phoneNumber: '+234 819 789 0123',
      department: 'Operations',
      joinDate: '2025-03-28',
      ipAddress: '197.234.67.12'
    },
    {
      id: 'admin-011',
      name: 'Ngozi Okafor',
      email: 'ngozi.okafor@ajo.com',
      role: 'Compliance Officer',
      status: 'active',
      lastLogin: '2025-09-02 05:30 PM',
      loginLocation: 'Awka, Nigeria',
      deviceInfo: 'Chrome on Android',
      sessionActive: false,
      twoFactorEnabled: true,
      invitedAt: '2025-06-30',
      invitedBy: 'Chidi Okonkwo',
      totalLogins: 43,
      permissions: 89,
      actionsToday: 2,
      phoneNumber: '+234 821 890 1234',
      department: 'Compliance',
      joinDate: '2025-06-30',
      ipAddress: '41.67.134.89'
    },
    {
      id: 'admin-012',
      name: 'Segun Adebayo',
      email: 'segun.adebayo@ajo.com',
      role: 'Customer Support',
      status: 'inactive',
      lastLogin: '2025-08-30 12:45 PM',
      loginLocation: 'Abeokuta, Nigeria',
      deviceInfo: 'Opera on Windows',
      sessionActive: false,
      twoFactorEnabled: false,
      invitedAt: '2025-05-18',
      invitedBy: 'Blessing Okoro',
      totalLogins: 67,
      permissions: 45,
      actionsToday: 0,
      phoneNumber: '+234 823 901 2345',
      department: 'Support',
      joinDate: '2025-05-18',
      ipAddress: '105.67.89.134'
    },
    {
      id: 'admin-013',
      name: 'Amina Bello',
      email: 'amina.bello@ajo.com',
      role: 'Analyst',
      status: 'active',
      lastLogin: '2025-09-03 09:30 AM',
      loginLocation: 'Sokoto, Nigeria',
      deviceInfo: 'Chrome on Windows',
      sessionActive: true,
      twoFactorEnabled: true,
      invitedAt: '2025-07-03',
      invitedBy: 'Emeka Nwankwo',
      totalLogins: 38,
      permissions: 67,
      actionsToday: 5,
      phoneNumber: '+234 825 012 3456',
      department: 'Analytics',
      joinDate: '2025-07-03',
      ipAddress: '196.201.67.45'
    },
    {
      id: 'admin-014',
      name: 'Victor Udoh',
      email: 'victor.udoh@ajo.com',
      role: 'Admin',
      status: 'pending',
      lastLogin: 'Never',
      loginLocation: 'N/A',
      deviceInfo: 'N/A',
      sessionActive: false,
      twoFactorEnabled: false,
      invitedAt: '2025-09-01',
      invitedBy: 'Gabriel Ojo',
      totalLogins: 0,
      permissions: 98,
      actionsToday: 0,
      phoneNumber: '+234 827 123 4567',
      department: 'Operations',
      joinDate: '2025-09-01',
      ipAddress: 'N/A'
    },
    {
      id: 'admin-015',
      name: 'Grace Etim',
      email: 'grace.etim@ajo.com',
      role: 'Customer Support',
      status: 'active',
      lastLogin: '2025-09-03 07:15 AM',
      loginLocation: 'Calabar, Nigeria',
      deviceInfo: 'Firefox on Android',
      sessionActive: true,
      twoFactorEnabled: true,
      invitedAt: '2025-08-10',
      invitedBy: 'Kemi Adesola',
      totalLogins: 24,
      permissions: 45,
      actionsToday: 7,
      phoneNumber: '+234 829 234 5678',
      department: 'Support',
      joinDate: '2025-08-10',
      ipAddress: '41.76.189.234'
    }
  ];

  const roles = [
    { name: 'Super Admin', count: 1 },
    { name: 'Admin', count: 4 },
    { name: 'Customer Support', count: 6 },
    { name: 'Analyst', count: 3 },
    { name: 'Compliance Officer', count: 2 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-50/50 text-emerald-600 border-emerald-100';
      case 'inactive': return 'bg-gray-50/50 text-gray-600 border-gray-100';
      case 'pending': return 'bg-amber-50/50 text-amber-600 border-amber-100';
      case 'suspended': return 'bg-red-50/50 text-red-600 border-red-100';
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

  const adminStats = [
    { title: 'Total Admins', value: adminUsers.length.toString(), active: adminUsers.filter(a => a.status === 'active').length },
    { title: 'Active Sessions', value: adminUsers.filter(a => a.sessionActive).length.toString(), active: adminUsers.filter(a => a.sessionActive).length },
    { title: 'Pending Invites', value: adminUsers.filter(a => a.status === 'pending').length.toString(), active: adminUsers.filter(a => a.status === 'pending').length },
    { title: '2FA Enabled', value: adminUsers.filter(a => a.twoFactorEnabled).length.toString(), active: adminUsers.filter(a => a.twoFactorEnabled).length }
  ];

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  };

  const handleViewMore = (admin) => {
    setSelectedAdmin(admin);
    setShowUserModal(true);
  };

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
      <PageHeader title="Admin Users Management" />

      <main className="flex-1 bg-[#FAFAFA] flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col pr-80">
          {/* Back Navigation and Header - Fixed */}
          <div className="p-6 pb-0 flex-shrink-0">
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#999999] hover:text-[#1E1E1E] transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Back to Admin Management
            </Link>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-light text-[#1E1E1E]">Admin Users</h2>
                <p className="text-[#999999] text-xs mt-1 font-light">
                  Manage administrator accounts, permissions, and access
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#1E1E1E] text-sm font-light">
                  {formatTime(currentTime)} WAT
                </p>
                <p className="text-[#999999] text-xs mt-1">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {adminStats.map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm p-4 border border-[#00000008]">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                    <span className="text-xs text-blue-600">{stat.active}</span>
                  </div>
                  <p className="text-2xl font-light text-[#1E1E1E]">{stat.value}</p>
                  <p className="text-[10px] text-[#999999] uppercase tracking-wider mt-1">{stat.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Users List - Scrollable Content */}
          <div className="flex-1 px-6 pb-6 flex flex-col min-h-0">
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] flex-1 flex flex-col">
              <div className="p-6 border-b border-[#00000008] flex-shrink-0">
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
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2">
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

                {/* Filters moved to bottom */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="appearance-none px-4 py-2 pr-10 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors cursor-pointer"
                    >
                      <option value="all">All Roles</option>
                      {roles.map(role => (
                        <option key={role.name} value={role.name}>{role.name}</option>
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

                  <span className="text-xs text-[#999999]">
                    Showing {filteredAdmins.length} of {adminUsers.length} admins
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b border-[#00000008]">
                      <th className="text-left p-6 text-[10px] font-light uppercase tracking-wider text-[#999999]">Admin</th>
                      <th className="text-left p-6 text-[10px] font-light uppercase tracking-wider text-[#999999]">Role</th>
                      <th className="text-left p-6 text-[10px] font-light uppercase tracking-wider text-[#999999]">Status</th>
                      <th className="text-left p-6 text-[10px] font-light uppercase tracking-wider text-[#999999]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((admin) => (
                      <tr key={admin.id} className="border-b border-[#00000008] hover:bg-[#FAFAFA] transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${admin.name}`}
                              alt={`${admin.name} avatar`}
                              className="w-12 h-12 rounded-full border border-[#00000008]"
                            />
                            <div>
                              <p className="text-sm font-light text-[#1E1E1E]">{admin.name}</p>
                              <p className="text-xs text-[#999999] mt-1">{admin.email}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1">
                                  {admin.twoFactorEnabled ? (
                                    <CheckCircle className="w-3 h-3 text-emerald-600" strokeWidth={1.5} />
                                  ) : (
                                    <XCircle className="w-3 h-3 text-red-600" strokeWidth={1.5} />
                                  )}
                                  <span className="text-[10px] text-[#999999]">2FA</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className={`w-2 h-2 rounded-full ${admin.sessionActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                  <span className="text-[10px] text-[#999999]">
                                    {admin.sessionActive ? 'Online' : 'Offline'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            {admin.role === 'Super Admin' && <Crown className="w-4 h-4 text-amber-500" strokeWidth={1.5} />}
                            <span className="text-sm font-light text-[#1E1E1E]">{admin.role}</span>
                          </div>
                          <p className="text-xs text-[#999999] mt-1">{admin.department}</p>
                        </td>
                        <td className="p-6">
                          <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(admin.status)}`}>
                            {admin.status}
                          </span>
                          <p className="text-xs text-[#999999] mt-2">{admin.lastLogin}</p>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewMore(admin)}
                              className="p-2 hover:bg-[#F8F9FA] transition-colors rounded"
                            >
                              <Eye className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            </button>
                            <button className="p-2 hover:bg-[#F8F9FA] transition-colors rounded">
                              <Edit className="w-4 h-4 text-[#999999]" strokeWidth={1.5} />
                            </button>
                            {admin.sessionActive && (
                              <button className="p-2 hover:bg-[#FEF3CD] transition-colors text-amber-600 rounded">
                                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                            )}
                            <button className="p-2 hover:bg-[#F8F9FA] transition-colors rounded">
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
          </div>
        </div>

        {/* Right Sidebar - Role Call - Fixed Height */}
        <div className="w-80 bg-white border-l border-[#00000008] p-6 flex-shrink-0 overflow-y-auto h-[94dvh] fixed top-14 right-0">
          <div className="mb-6">
            <h3 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-4">Role Call</h3>

            {/* Active Admins Summary */}
            <div className="space-y-3 mb-6">
              {roles.map((role, index) => (
                <div key={index} className="flex items-center justify-between p-2 border border-[#00000008] hover:border-[#00000020] transition-colors">
                  <div className="flex items-center gap-2">
                    {role.name === 'Super Admin' && <Crown className="w-3 h-3 text-amber-500" strokeWidth={1.5} />}
                    <span className="text-xs font-light text-[#1E1E1E]">{role.name}</span>
                  </div>
                  <span className="text-xs text-[#999999]">{role.count} user{role.count !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Online Status */}
          <div className="mb-6">
            <h4 className="text-xs font-light uppercase tracking-wider text-[#999999] mb-3">Online Now</h4>
            <div className="space-y-2">
              {adminUsers.filter(admin => admin.sessionActive).map((admin) => (
                <div key={admin.id} className="flex items-center gap-2 p-2 hover:bg-[#FAFAFA] transition-colors">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <img
                    src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${admin.name}`}
                    alt={`${admin.name} avatar`}
                    className="w-6 h-6 rounded-full border border-[#00000008]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-light text-[#1E1E1E] truncate">{admin.name}</p>
                    <p className="text-[10px] text-[#999999]">{admin.role}</p>
                  </div>
                  <span className="text-[10px] text-[#666666]">{admin.actionsToday}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="text-xs font-light uppercase tracking-wider text-[#999999] mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {adminUsers
                .filter(admin => admin.actionsToday > 0)
                .sort((a, b) => b.actionsToday - a.actionsToday)
                .slice(0, 5)
                .map((admin) => (
                  <div key={admin.id} className="flex items-center gap-2 p-2 hover:bg-[#FAFAFA] transition-colors">
                    <img
                      src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${admin.name}`}
                      alt={`${admin.name} avatar`}
                      className="w-6 h-6 rounded-full border border-[#00000008]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-light text-[#1E1E1E] truncate">{admin.name.split(' ')[0]}</p>
                      <p className="text-[10px] text-[#999999]">{admin.actionsToday} actions today</p>
                    </div>
                    <Activity className="w-3 h-3 text-[#666666]" strokeWidth={1.5} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      {/* Admin Details Modal */}
      {showUserModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-[#00000008] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${selectedAdmin.name}`}
                    alt={`${selectedAdmin.name} avatar`}
                    className="w-12 h-12 rounded-full border border-[#00000008]"
                  />
                  <div>
                    <h3 className="text-lg font-light text-[#1E1E1E] flex items-center gap-2">
                      {selectedAdmin.role === 'Super Admin' && <Crown className="w-4 h-4 text-amber-500" strokeWidth={1.5} />}
                      {selectedAdmin.name}
                    </h3>
                    <p className="text-sm text-[#999999]">{selectedAdmin.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-[#999999]" strokeWidth={1.5} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-3">Basic Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#666666]">Role</span>
                        <span className="text-sm font-light text-[#1E1E1E]">{selectedAdmin.role}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#666666]">Department</span>
                        <span className="text-sm font-light text-[#1E1E1E]">{selectedAdmin.department}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#666666]">Phone</span>
                        <span className="text-sm font-light text-[#1E1E1E]">{selectedAdmin.phoneNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#666666]">Join Date</span>
                        <span className="text-sm font-light text-[#1E1E1E]">{selectedAdmin.joinDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#666666]">Status</span>
                        <span className={`text-[10px] px-2 py-1 font-light uppercase tracking-wider border ${getStatusColor(selectedAdmin.status)}`}>
                          {selectedAdmin.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-3">Activity & Security</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#666666]">Total Logins</span>
                        <span className="text-sm font-light text-[#1E1E1E]">{selectedAdmin.totalLogins}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#666666]">Permissions</span>
                        <span className="text-sm font-light text-[#1E1E1E]">{selectedAdmin.permissions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#666666]">Actions Today</span>
                        <span className="text-sm font-light text-[#1E1E1E]">{selectedAdmin.actionsToday}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#666666]">2FA Status</span>
                        <div className="flex items-center gap-1">
                          {selectedAdmin.twoFactorEnabled ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                          )}
                          <span className={`text-xs ${selectedAdmin.twoFactorEnabled ? 'text-emerald-600' : 'text-red-600'}`}>
                            {selectedAdmin.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#666666]">Session Status</span>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${selectedAdmin.sessionActive ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                          <span className="text-xs text-[#999999]">
                            {selectedAdmin.sessionActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div className="mt-6 pt-6 border-t border-[#00000008]">
                <h4 className="text-sm font-light uppercase tracking-wider text-[#999999] mb-3">Current Session</h4>
                <div className="bg-[#F8F9FA] p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#666666]" strokeWidth={1.5} />
                    <span className="text-sm text-[#666666]">IP Address:</span>
                    <span className="text-sm font-mono text-[#1E1E1E]">{selectedAdmin.ipAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#666666]" strokeWidth={1.5} />
                    <span className="text-sm text-[#666666]">Location:</span>
                    <span className="text-sm text-[#1E1E1E]">{selectedAdmin.loginLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#666666]" strokeWidth={1.5} />
                    <span className="text-sm text-[#666666]">Device:</span>
                    <span className="text-sm text-[#1E1E1E]">{selectedAdmin.deviceInfo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#666666]" strokeWidth={1.5} />
                    <span className="text-sm text-[#666666]">Last Login:</span>
                    <span className="text-sm text-[#1E1E1E]">{selectedAdmin.lastLogin}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <button className="flex-1 px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" strokeWidth={1.5} />
                  Edit Admin
                </button>
                {selectedAdmin.sessionActive && (
                  <button className="px-4 py-2 bg-amber-50 text-amber-600 text-sm font-light hover:bg-amber-100 transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    End Session
                  </button>
                )}
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-[#F8F9FA] text-[#666666] text-sm font-light hover:bg-[#F0F0F0] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
