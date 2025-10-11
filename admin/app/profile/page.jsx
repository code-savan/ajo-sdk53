"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { PageHeader } from "../../components/ui";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Camera,
  Save,
  Edit3,
  Key,
  Bell,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Eye,
  EyeOff
} from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profile, setProfile] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = window.sessionStorage.getItem('admin_profile_last') || window.localStorage.getItem('admin_profile_last');
        if (raw) return JSON.parse(raw);
      }
    } catch (_) {}
    return {
      name: "—",
      email: "—",
      phone: "—",
      location: "—",
      role: "Admin",
      department: "—",
      joinedDate: "—",
      lastLogin: "—",
      lastLoginISO: null,
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Admin",
      bio: "—",
      twoFactorEnabled: false,
      emailNotifications: false,
      securityAlerts: false
    };
  });

  const avatarOptions = useMemo(() => [
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Admin',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Alpha',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Beta',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Gamma',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Delta',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Epsilon',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Zeta',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Eta',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Theta',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Iota',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Kappa',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Lambda',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Mu',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Nu',
    'https://api.dicebear.com/9.x/adventurer/svg?seed=Xi'
  ], []);

  const formatRole = (role) => {
    if (!role) return 'Admin';
    const map = {
      'super admin': 'Super Admin',
      'admin': 'Admin',
      'customer support': 'Customer Support',
      'analyst': 'Analyst',
      'Compliance officer': 'Compliance Officer'
    };
    const key = String(role).toLowerCase();
    if (map[key]) return map[key];
    return String(role).replace(/\b\w/g, c => c.toUpperCase());
  };

  const normalizeRoleKey = (role) => {
    const r = String(role || '').toLowerCase();
    if (r === 'super admin') return 'super_admin';
    if (r === 'customer support') return 'support';
    if (r === 'compliance officer') return 'compliance';
    if (r === 'analyst') return 'analyst';
    if (r === 'admin') return 'admin';
    return 'admin';
  };

  const roleBadgeClass = (roleKey) => {
    switch (roleKey) {
      case 'super_admin': return 'bg-red-50 text-red-600 border-red-100';
      case 'admin': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'support': return 'bg-green-50 text-green-600 border-green-100';
      case 'analyst': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'compliance': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        // try cache first (session storage)
        const cacheKey = `admin_profile_${user.id}`;
        const cached = typeof window !== 'undefined' ? window.sessionStorage.getItem(cacheKey) : null;
        if (cached) {
          const parsed = JSON.parse(cached);
          setProfile(prev => ({ ...prev, ...parsed }));
        }
        const res = await fetch('/api/admin/profile', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id })
        });
        const json = await res.json();
        if (!json?.profile) return;
        const p = json?.profile || {};
        const formatDate = (iso) => {
          if (!iso) return '—';
          const d = new Date(iso);
          return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        };
        const updated = {
          ...profile,
          name: p.full_name || user.user_metadata?.full_name || profile.name,
          email: p.email || user.email || profile.email,
          phone: p.phone || profile.phone,
          location: p.location || profile.location,
          role: p.role || profile.role,
          department: p.department || profile.department,
          joinedDate: formatDate(p.created_at),
          lastLogin: p.last_login ? new Date(p.last_login).toLocaleString() : profile.lastLogin,
          lastLoginISO: p.last_login || profile.lastLoginISO,
          avatar: p.avatar_url || profile.avatar,
          bio: p.bio || profile.bio,
          twoFactorEnabled: !!p.two_factor_enabled,
          emailNotifications: !!p.email_notifications,
          securityAlerts: !!p.security_alerts,
          is_active: p.is_active || profile.is_active,
          totalLogins: profile.totalLogins || '—',
        };
        setProfile(updated);
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(cacheKey, JSON.stringify(updated));
          window.sessionStorage.setItem('admin_profile_last', JSON.stringify(updated));
        }
      } catch (_) {}
    };
    load();
  }, []);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const payload = {
        user_id: user.id,
        full_name: profile.name !== '—' ? profile.name : null,
        phone: profile.phone !== '—' ? profile.phone : null,
        location: profile.location !== '—' ? profile.location : null,
        department: profile.department !== '—' ? profile.department : null,
        bio: profile.bio !== '—' ? profile.bio : null,
        two_factor_enabled: profile.twoFactorEnabled,
        email_notifications: profile.emailNotifications,
        security_alerts: profile.securityAlerts,
      };
      await fetch('/api/admin/profile/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      // cache update
      const cacheKey = `admin_profile_${user.id}`;
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(cacheKey, JSON.stringify(profile));
        window.sessionStorage.setItem('admin_profile_last', JSON.stringify(profile));
      }
    setIsEditing(false);
    } catch (e) {}
  };

  const persistPartialUpdate = async (partial) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await fetch('/api/admin/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, ...partial })
      });
      const cacheKey = `admin_profile_${user.id}`;
      const next = { ...profile, ...partial };
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(cacheKey, JSON.stringify(next));
        window.sessionStorage.setItem('admin_profile_last', JSON.stringify(next));
      }
      setProfile(next);
    } catch (_) {}
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("Please fill all password fields");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    setPasswordLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        setPasswordError("Unable to determine current user");
        setPasswordLoading(false);
        return;
      }
      // Re-authenticate with current password to verify
      const { error: verifyErr } = await supabase.auth.signInWithPassword({ email: user.email, password: passwordForm.currentPassword });
      if (verifyErr) {
        setPasswordError("Current password is incorrect");
        setPasswordLoading(false);
        return;
      }
      // Update password
      const { error: updateErr } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
      if (updateErr) {
        setPasswordError(updateErr.message || "Failed to update password");
        setPasswordLoading(false);
        return;
      }
      setPasswordSuccess("Password updated successfully");
    setShowChangePassword(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) {
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const adminStats = [
    { title: 'Total Logins', key: 'totalLogins', icon: Activity, color: 'text-blue-600' },
    { title: 'Last Login', key: 'lastLogin', icon: Clock, color: 'text-emerald-600' },
    { title: 'Account Status', key: 'accountStatus', icon: CheckCircle, color: 'text-emerald-600' },
    { title: '2FA Status', key: 'twoFactorStatus', icon: Shield, color: 'text-violet-600' }
  ];

  const recentActivity = [
    { action: 'Updated user permissions', timestamp: '2 hours ago', status: 'success' },
    { action: 'Reviewed transaction reports', timestamp: '4 hours ago', status: 'success' },
    { action: 'Modified security settings', timestamp: '1 day ago', status: 'success' },
    { action: 'Approved role change request', timestamp: '2 days ago', status: 'success' }
  ];

  return (
    <div className="flex-1 flex flex-col h-screen pt-[60px] w-full">
      <PageHeader title="Profile" />
      <main className="flex-1 bg-[#FAFAFA] p-6 overflow-y-auto">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-[#00000008] mb-8">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt="Profile avatar"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                  <button onClick={() => setShowAvatarPicker(true)} className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4 text-white" strokeWidth={1.5} />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-light text-[#1E1E1E]">{profile.name}</h1>
                    <span className={`px-3 py-1 text-xs font-medium border rounded-full ${roleBadgeClass(normalizeRoleKey(profile.role))}`}>
                      {formatRole(profile.role)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#999999] mb-4">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" strokeWidth={1.5} />
                      {profile.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" strokeWidth={1.5} />
                      {profile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" strokeWidth={1.5} />
                      Joined {profile.joinedDate}
                    </div>
                  </div>
                  <p className="text-sm text-[#666666] max-w-2xl">{profile.bio || "(Add Bio)"}  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" strokeWidth={1.5} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-emerald-600 text-white text-sm font-light hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" strokeWidth={1.5} />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-[#F8F9FA] text-[#666666] text-sm font-light hover:bg-[#F0F0F0] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {adminStats.map((stat, index) => {
                const Icon = stat.icon;
                const value = (() => {
                  switch (stat.key) {
                    case 'totalLogins':
                      return profile.totalLogins || '—';
                    case 'lastLogin':
                      if (profile.lastLoginISO) {
                        try {
                          return new Date(profile.lastLoginISO).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                        } catch (_) { return profile.lastLogin || '—'; }
                      }
                      return profile.lastLogin || '—';
                    case 'accountStatus':
                      return (profile.is_active ? String(profile.is_active) : '—')
                        .toString()
                        .replace(/\b\w/g, c => c.toUpperCase());
                    case 'twoFactorStatus':
                      return profile.twoFactorEnabled ? 'Enabled' : 'Disabled';
                    default:
                      return '—';
                  }
                })();
                return (
                  <div key={stat.title} className="p-4 bg-[#FAFAFA] border border-[#00000008]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border border-[#00000008] flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-lg font-light text-[#1E1E1E]">{value}</p>
                        <p className="text-xs text-[#999999] uppercase tracking-wider">{stat.title}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
              <div className="p-6 border-b border-[#00000008]">
                <h3 className="text-lg font-light text-[#1E1E1E]">Personal Information</h3>
                <p className="text-xs text-[#999999] mt-1">Update your personal details and information</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                      />
                    ) : (
                      <p className="text-sm text-[#1E1E1E] py-2">{profile.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                      />
                    ) : (
                      <p className="text-sm text-[#1E1E1E] py-2">{profile.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                      />
                    ) : (
                      <p className="text-sm text-[#1E1E1E] py-2">{profile.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                      />
                    ) : (
                      <p className="text-sm text-[#1E1E1E] py-2">{profile.location}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-light text-[#1E1E1E] mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors resize-none"
                    />
                  ) : (
                    <p className="text-sm text-[#1E1E1E] py-2">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
              <div className="p-6 border-b border-[#00000008]">
                <h3 className="text-lg font-light text-[#1E1E1E]">Security Settings</h3>
                <p className="text-xs text-[#999999] mt-1">Manage your account security and authentication</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#FAFAFA] border border-[#00000008]">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-light text-[#1E1E1E]">Two-Factor Authentication</p>
                      <p className="text-xs text-[#999999]">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${profile.twoFactorEnabled ? 'text-emerald-600' : 'text-red-600'}`}>{profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                    <button onClick={() => setShowTwoFactorModal(true)} className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs hover:bg-emerald-100 transition-colors">
                      Manage
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#FAFAFA] border border-[#00000008]">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-light text-[#1E1E1E]">Password</p>
                      <p className="text-xs text-[#999999]">Change your account password</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-xs hover:bg-blue-100 transition-colors"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
              <div className="p-6 border-b border-[#00000008]">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Preferences</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-[#666666]" strokeWidth={1.5} />
                    <span className="text-sm text-[#1E1E1E]">Email Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.emailNotifications}
                      onChange={(e) => persistPartialUpdate({ email_notifications: e.target.checked, emailNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-[#666666]" strokeWidth={1.5} />
                    <span className="text-sm text-[#1E1E1E]">Security Alerts</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.securityAlerts}
                      onChange={(e) => persistPartialUpdate({ security_alerts: e.target.checked, securityAlerts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm border border-[#00000008]">
              <div className="p-6 border-b border-[#00000008]">
                <h3 className="text-sm font-light uppercase tracking-wider text-[#999999]">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm text-[#1E1E1E]">{activity.action}</p>
                        <p className="text-xs text-[#999999]">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-[#00000008] w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-light text-[#1E1E1E]">Change Password</h3>
                  <button
                    onClick={() => setShowChangePassword(false)}
                    className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-[#999999]" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        className="w-full px-4 py-2 pr-10 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        className="w-full px-4 py-2 pr-10 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-light text-[#1E1E1E] mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        className="w-full px-4 py-2 pr-10 bg-[#FAFAFA] border border-[#00000008] text-sm font-light focus:outline-none focus:border-[#00000020] transition-colors"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {passwordError && <p className="text-xs text-red-600 mb-2">{passwordError}</p>}
                {passwordSuccess && <p className="text-xs text-emerald-600 mb-2">{passwordSuccess}</p>}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handlePasswordChange}
                    disabled={passwordLoading}
                    className="flex-1 px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Key className="w-4 h-4" strokeWidth={1.5} />
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button
                    onClick={() => setShowChangePassword(false)}
                    className="px-4 py-2 bg-[#F8F9FA] text-[#666666] text-sm font-light hover:bg-[#F0F0F0] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showAvatarPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-[#00000008] w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-light text-[#1E1E1E]">Choose an avatar</h3>
              <button onClick={() => setShowAvatarPicker(false)} className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors">
                <XCircle className="w-5 h-5 text-[#999999]" strokeWidth={1.5} />
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto">
              {avatarOptions.map((url) => (
                <button key={url} onClick={async () => {
                  try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) return;
                    await fetch('/api/admin/profile/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id, avatar_url: url }) });
                    setProfile(prev => ({ ...prev, avatar: url }));
                    const cacheKey = `admin_profile_${user?.id}`;
                    if (typeof window !== 'undefined') window.localStorage.setItem(cacheKey, JSON.stringify({ ...profile, avatar: url }));
                    setShowAvatarPicker(false);
                  } catch (_) {}
                }} className="border border-[#00000008] p-2 hover:border-[#00000020]">
                  <img src={url} alt="avatar" className="w-20 h-20 rounded-full" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showTwoFactorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-[#00000008] w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-light text-[#1E1E1E]">Two-Factor Authentication</h3>
              <button onClick={() => setShowTwoFactorModal(false)} className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors">
                <XCircle className="w-5 h-5 text-[#999999]" strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-sm text-[#666666] mb-4">Add an extra layer of security to your account. When enabled, you’ll need a code from your authenticator app to sign in.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#FAFAFA] border border-[#00000008]">
                <span className="text-sm text-[#1E1E1E]">Two-Factor Authentication</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.twoFactorEnabled}
                    onChange={async (e) => {
                      await persistPartialUpdate({ two_factor_enabled: e.target.checked, twoFactorEnabled: e.target.checked });
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="text-xs text-[#999999]">
                Use any TOTP authenticator app (Google Authenticator, Authy). When enabling, we’ll store your preference and require a code next time you sign in (backend enforcement to be added).
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowTwoFactorModal(false)} className="px-4 py-2 bg-[#F8F9FA] text-[#666666] text-sm font-light hover:bg-[#F0F0F0] transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
