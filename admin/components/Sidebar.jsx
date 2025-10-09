"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, UserSquare2, CircleDollarSign, PieChart, Bell, Settings, Headphones, Lock, Shield, LogOut } from "lucide-react";
import { useLogout } from "./ui";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const mainMenu = [
  { name: "Overview", href: "/", icon: Home },
  { name: "User Management", href: "/users", icon: Users },
  { name: "Group Management", href: "/groups", icon: UserSquare2 },
  { name: "Financial  Management", href: "/financial", icon: CircleDollarSign },
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Admin Management", href: "/admin", icon: Shield },
  { name: "Security", href: "/security", icon: Lock },
];

const supportMenu = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help & Support", href: "/help", icon: Headphones },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();
  const { setShowLogoutModal } = useLogout();
  const { user } = useAuth();
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

  const NavList = ({ items }) => (
    <div className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href === "/" && pathname === "/") || pathname.startsWith(item.href + '/');
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`sidebar-link flex items-center rounded-lg px-4 py-3 transition-all duration-200 group ${
              isActive
                ? "sidebar-link-active bg-[#DDE8FF] text-[#1E1E1E] border-l-2 border-blue-500"
                : "hover:bg-[#F8F9FA] hover:border-l-2 hover:border-gray-300 text-[#1E1E1E]"
            }`}
          >
            <Icon size={16} className={`mr-3 transition-colors duration-200 ${
              isActive ? "text-blue-600" : "text-[#666666] group-hover:text-[#1E1E1E]"
            }`} />
            <span className="text-[15px] font-light transition-colors duration-200">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col justify-between w-[306px] h-screen fixed top-0 left-0 bg-white/80 backdrop-blur-sm border-r border-[#00000008] shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-[#00000008]">
          <div className="flex items-center  cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Image src="/whitebg.jpeg" alt="Ajo Pay Logo" width={48} height={48} />
            </div>
            <div className="text-[18px] font-light text-[#1E1E1E]">Ajo Pay Admin</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div>
            <div className="sidebar-section px-2 mb-4 text-[11px] font-medium uppercase tracking-wider text-[#999999]">Main menu</div>
            <NavList items={mainMenu} />
          </div>

          <div>
            <div className="sidebar-section px-2 mb-4 text-[11px] font-medium uppercase tracking-wider text-[#999999]">Support</div>
            <NavList items={supportMenu} />
          </div>
        </div>

        <div className="border-t border-[#00000008] p-4 bg-[#FAFAFA]/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={cachedProfile?.avatar || "https://api.dicebear.com/9.x/adventurer/svg?seed=Admin"}
                alt="Admin avatar"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <div className="ml-3">
                <p className="text-[14px] font-light text-[#1E1E1E]">{cachedProfile?.name || user?.fullName || 'Admin User'}</p>
                <p className="text-[11px] text-[#999999] font-light">{cachedProfile?.email || user?.email || ''}</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-[#666666] group-hover:text-red-600" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </aside>


      {/* Mobile sidebar drawer */}
      <div
        className={`lg:hidden flex flex-col fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-base transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-base">
          <div className="text-[20px] font-semibold text-black">Ajo Logo</div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-[color:#1E1E1E] hover:bg-[#F0F0F0] text-[28px]"
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          <div>
            <div className="sidebar-section px-2 mb-3">Main menu</div>
            <NavList items={mainMenu} />
          </div>

          <div>
            <div className="sidebar-section px-2 mb-3">Support</div>
            <NavList items={supportMenu} />
          </div>
        </div>

        <div className="border-t border-base p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-[#E5E5E5]" />
              <div className="ml-3">
                <p className="text-[16px] text-[var(--text-primary)]">Iren Kukoma</p>
                <p className="text-[12px] text-[var(--text-section)]">irenkukoma@ncdmb.gov</p>
              </div>
            </div>
            <span className="text-[var(--text-section)] text-xl">›</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
