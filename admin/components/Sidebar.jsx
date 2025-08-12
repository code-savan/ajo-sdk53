"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, UserSquare2, CircleDollarSign, PieChart, Bell, Settings, Headphones } from "lucide-react";

const mainMenu = [
  { name: "Overview", href: "/", icon: Home },
  { name: "User Management", href: "/users", icon: Users },
  { name: "Group Management", href: "/groups", icon: UserSquare2 },
  { name: "Financial  Management", href: "/financial", icon: CircleDollarSign },
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

const supportMenu = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help & Support", href: "/help", icon: Headphones },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const pathname = usePathname();

  const NavList = ({ items }) => (
    <div className="space-y-2">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href === "/" && pathname === "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`sidebar-link flex items-center rounded-xl px-4 py-3 ${
              isActive ? "sidebar-link-active" : "hover:bg-[#F0F4FF]"
            }`}
          >
            <Icon size={16} className="mr-3" color="#1E1E1E" />
            <span className="text-[16px] text-[#1E1E1E] font-normal">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col justify-between w-[306px] h-screen fixed top-0 left-0 bg-white border-r border-[#D9D9D9]">
      <div className="h-16 flex items-center px-6 border-b border-[#D9D9D9]">
        <div className="text-[20px] font-medium text-black">Ajo
        </div>
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

      <div className="border-t border-[#D9D9D9] p-4">
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
