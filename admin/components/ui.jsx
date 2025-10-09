"use client";
import { useSidebar } from "./SidebarContext";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, User, Settings, LogOut, AlertTriangle } from "lucide-react";
import { useMemo, useState, useRef, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

// Create logout context
const LogoutContext = createContext({
  showLogoutModal: false,
  setShowLogoutModal: () => {},
  handleLogout: () => {},
});

export function LogoutProvider({ children }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = () => {
    console.log('Logging out...');
    signOut();
  };

  return (
    <LogoutContext.Provider value={{ showLogoutModal, setShowLogoutModal, handleLogout }}>
      {children}
      {/* Global Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-[#00000008] w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-50/50 border border-red-100 flex items-center justify-center rounded-lg">
                  <LogOut className="w-5 h-5 text-red-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#1E1E1E]">Confirm Logout</h3>
                  <p className="text-sm text-[#999999]">Are you sure you want to log out?</p>
                </div>
              </div>

              <div className="bg-[#F8F9FA] p-4 rounded-lg mb-6">
                <p className="text-sm text-[#666666]">
                  You will be redirected to the login page and will need to enter your credentials again to access the admin panel.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors rounded-lg"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 bg-[#F8F9FA] text-[#666666] text-sm font-medium hover:bg-[#F0F0F0] transition-colors rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LogoutContext.Provider>
  );
}

export function useLogout() {
  const context = useContext(LogoutContext);
  if (!context) {
    throw new Error('useLogout must be used within LogoutProvider');
  }
  return context;
}

export function PageHeader({ title, actions }) {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const derivedTitle = useMemo(() => {
    const toTitleCase = (str) =>
      str
        .replace(/\/+$/, "")
        .split("/")
        .filter(Boolean)
        .pop()
        ?.replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    const map = {
      "/": "Overview",
      "/users": "User Management",
      "/groups": "Group Management",
      "/financial": "Financial Management",
      "/analytics": "Analytics",
      "/notifications": "Notifications",
      "/notifications-me": "My Notifications",
      "/admin": "Admin Management",
      "/profile": "Profile",
      "/settings": "Settings",
      "/help": "Help & Support",
    };

    if (!pathname || pathname === "/") return map["/"];

    // Exact base route match
    if (map[pathname]) return map[pathname];

    const segments = pathname.split("?")[0].split("/").filter(Boolean);
    if (segments.length === 0) return map["/"];

    const base = `/${segments[0]}`;

    // Prefer specific section names for known nested sections
    if (segments[0] === "financial" || segments[0] === "settings") {
      const last = segments[segments.length - 1];
      return toTitleCase(last) || map[base] || "";
    }

    // For detail pages like /users/:id or /groups/:id, fall back to base title
    if (map[base]) return map[base];

    // Fallback: title-case the last segment
    return toTitleCase(pathname) || "";
  }, [pathname]);

  const displayTitle = derivedTitle || title || "";

  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-[#00000008] flex items-center justify-between px-4 sm:px-6 fixed top-0 left-[306px] w-[calc(100%-306px)] z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 rounded-lg text-[#666666] hover:bg-[#F8F9FA] hover:text-[#1E1E1E] transition-all duration-200"
          aria-label="Open sidebar"
          onClick={toggleSidebar}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div>
          <h1 className="text-[20px] font-light text-[#1E1E1E]">{displayTitle}</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <div className="relative">
          <Link
            href="/notifications-me"
            className="p-2 rounded-lg text-[#666666] hover:bg-[#F8F9FA] hover:text-[#1E1E1E] transition-all duration-200 relative block"
            aria-label="My Notifications"
          >
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-white font-medium">3</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-3 pl-3 border-l border-[#00000008] relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-[#F8F9FA] p-2 rounded-lg transition-all duration-200"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <img
              src={cachedProfile?.avatar || "https://api.dicebear.com/9.x/adventurer/svg?seed=Admin"}
              alt="Admin avatar"
              className="w-8 h-8 rounded-full border border-[#00000008]"
            />
            <div className="hidden sm:block">
              <p className="text-[13px] font-light text-[#1E1E1E]">{cachedProfile?.name || user?.fullName || 'Admin User'}</p>
              <p className="text-[11px] text-[#999999] font-light">{cachedProfile?.email || user?.email || ''}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#666666] ml-1 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} strokeWidth={1.5} />
          </div>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#00000008] rounded-lg shadow-lg py-2 z-50">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-[#1E1E1E] hover:bg-[#F8F9FA] transition-colors"
                onClick={() => setShowProfileDropdown(false)}
              >
                <User className="w-4 h-4 text-[#666666]" strokeWidth={1.5} />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm text-[#1E1E1E] hover:bg-[#F8F9FA] transition-colors"
                onClick={() => setShowProfileDropdown(false)}
              >
                <Settings className="w-4 h-4 text-[#666666]" strokeWidth={1.5} />
                Settings
              </Link>
              <hr className="my-2 border-[#00000008]" />
              <button
                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                onClick={() => {
                  setShowProfileDropdown(false);
                  setShowLogoutModal(true);
                }}
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function Card({ children }) {
  return <div className="bg-white rounded-lg border border-[#D9D9D9] p-4">{children}</div>;
}

export function Table({ columns = [], data = [] }) {
  return (
    <div className="overflow-x-auto border border-[#D9D9D9] rounded-lg">
      <table className="min-w-full divide-y divide-[#D9D9D9]">
        <thead className="bg-[#F8F8F8]">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-2 text-left text-[12px] font-medium text-[#7E7E7E]">
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#D9D9D9] bg-white">
          {data.map((row, idx) => (
            <tr key={idx} className="text-[14px] text-[#1E1E1E]">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-2 whitespace-nowrap">
                  {typeof c.render === 'function' ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
