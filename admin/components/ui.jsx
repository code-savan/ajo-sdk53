"use client";
import { useSidebar } from "./SidebarContext";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown } from "lucide-react";
import { useMemo } from "react";

export function PageHeader({ title, actions }) {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

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
      "/admin": "Admin Management",
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
          <button
            className="p-2 rounded-lg text-[#666666] hover:bg-[#F8F9FA] hover:text-[#1E1E1E] transition-all duration-200 relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-white font-medium">3</span>
            </div>
          </button>
        </div>
        <div className="flex items-center gap-3 pl-3 border-l border-[#00000008]">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-[#F8F9FA] p-2 rounded-lg transition-all duration-200">
            <img
              src="https://api.dicebear.com/9.x/adventurer/svg?seed=Admin"
              alt="Admin avatar" 
              className="w-8 h-8 rounded-full border border-[#00000008]"
            />
            <div className="hidden sm:block">
              <p className="text-[13px] font-light text-[#1E1E1E]">Iren Kukoma</p>
              <p className="text-[11px] text-[#999999] font-light">Super Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-[#666666] ml-1" strokeWidth={1.5} />
          </div>
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
