"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Clock, User, Shield } from "lucide-react";

export default function SessionStatus() {
  const { user, signOut } = useAuth();
  const [sessionTime, setSessionTime] = useState("");
  const [cachedProfile, setCachedProfile] = useState(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && user?.id) {
        const cacheKey = `admin_profile_${user.id}`;
        const raw = window.sessionStorage.getItem(cacheKey) || window.localStorage.getItem(cacheKey);
        if (raw) setCachedProfile(JSON.parse(raw));
      }
    } catch (_) {}
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;

    const updateSessionTime = () => {
      const now = new Date();
      const effectiveLastLoginISO = cachedProfile?.lastLoginISO || user.lastLogin;
      if (!effectiveLastLoginISO) {
        setSessionTime("—");
        return;
      }
      const lastLogin = new Date(effectiveLastLoginISO);
      if (isNaN(lastLogin.getTime())) {
        setSessionTime("—");
        return;
      }
      const diffMs = now - lastLogin;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffHours > 0) {
        setSessionTime(`${diffHours}h ${diffMins % 60}m`);
      } else {
        setSessionTime(`${diffMins}m`);
      }
    };

    updateSessionTime();
    const interval = setInterval(updateSessionTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user, cachedProfile?.lastLoginISO]);

  if (!user) return null;

  const effectiveRole = (cachedProfile?.role || user.role || '').toLowerCase();
  const normalizedRole = (() => {
    if (effectiveRole === 'super admin') return 'super_admin';
    if (effectiveRole === 'customer support') return 'support';
    if (effectiveRole === 'compliance officer') return 'compliance';
    return effectiveRole || 'admin';
  })();

  const getRoleColor = (roleKey) => {
    switch (roleKey) {
      case 'super_admin': return 'text-red-600 bg-red-50 border-red-100';
      case 'admin': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'support': return 'text-green-600 bg-green-50 border-green-100';
      case 'analyst': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'compliance': return 'text-amber-700 bg-amber-50 border-amber-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 p-3 text-xs text-gray-600 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <User className="w-3 h-3" />
        <span className="font-medium">{cachedProfile?.name || user.fullName}</span>
        <span className={`px-2 py-0.5 border ${getRoleColor(normalizedRole)}`}>
          {(cachedProfile?.role || user.role || '').replace('_', ' ')}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <Clock className="w-3 h-3" />
        <span>Session: {sessionTime}</span>
      </div>
    </div>
  );
}
