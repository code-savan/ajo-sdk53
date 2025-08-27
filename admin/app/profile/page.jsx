"use client";
import { useState } from "react";
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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: "Iren Kukoma",
    email: "iren.kukoma@ajo.com",
    phone: "+234 801 234 5678",
    location: "Lagos, Nigeria",
    role: "Super Admin",
    department: "Administration",
    joinedDate: "January 15, 2025",
    lastLogin: "Today at 10:30 AM",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Admin",
    bio: "Experienced administrator overseeing platform operations and security. Focused on ensuring seamless user experience and maintaining system integrity.",
    twoFactorEnabled: true,
    emailNotifications: true,
    securityAlerts: true
  });

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

  const handleSave = () => {
    // Handle save profile logic here
    console.log("Saving profile:", profile);
    setIsEditing(false);
    // Show success message
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    // Handle password change logic here
    console.log("Changing password");
    setShowChangePassword(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const adminStats = [
    { title: 'Total Logins', value: '342', icon: Activity, color: 'text-blue-600' },
    { title: 'Last Login', value: 'Today', icon: Clock, color: 'text-emerald-600' },
    { title: 'Account Status', value: 'Active', icon: CheckCircle, color: 'text-emerald-600' },
    { title: '2FA Status', value: 'Enabled', icon: Shield, color: 'text-violet-600' }
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
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4 text-white" strokeWidth={1.5} />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-light text-[#1E1E1E]">{profile.name}</h1>
                    <span className="px-3 py-1 bg-violet-50 text-violet-600 text-xs font-medium border border-violet-100 rounded-full">
                      {profile.role}
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
                  <p className="text-sm text-[#666666] max-w-2xl">{profile.bio}</p>
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
                return (
                  <div key={stat.title} className="p-4 bg-[#FAFAFA] border border-[#00000008]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border border-[#00000008] flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-lg font-light text-[#1E1E1E]">{stat.value}</p>
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
                    <span className="text-xs text-emerald-600 font-medium">Enabled</span>
                    <button className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs hover:bg-emerald-100 transition-colors">
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
                      onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
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
                      onChange={(e) => handleInputChange('securityAlerts', e.target.checked)}
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

                <div className="flex items-center gap-3 pt-6">
                  <button
                    onClick={handlePasswordChange}
                    className="flex-1 px-4 py-2 bg-[#1E1E1E] text-white text-sm font-light hover:bg-[#2E2E2E] transition-colors flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4" strokeWidth={1.5} />
                    Update Password
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
    </div>
  );
}
