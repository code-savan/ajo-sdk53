"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Clock, User, Shield } from "lucide-react";

export default function SessionStatus() {
  const { user, signOut } = useAuth();
  const [sessionTime, setSessionTime] = useState("");

  useEffect(() => {
    if (!user) return;

    const updateSessionTime = () => {
      const now = new Date();
      const lastLogin = new Date(user.lastLogin);
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
  }, [user]);

  if (!user) return null;

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'text-red-600 bg-red-50 border-red-100';
      case 'admin': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'support': return 'text-green-600 bg-green-50 border-green-100';
      case 'analyst': return 'text-purple-600 bg-purple-50 border-purple-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 p-3 text-xs text-gray-600 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <User className="w-3 h-3" />
        <span className="font-medium">{user.fullName}</span>
        <span className={`px-2 py-0.5 border ${getRoleColor(user.role)}`}>
          {user.role.replace('_', ' ')}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <Clock className="w-3 h-3" />
        <span>Session: {sessionTime}</span>
      </div>
    </div>
  );
}
