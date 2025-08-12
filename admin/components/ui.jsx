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
    <header className="h-16 bg-white border-b border-[#D9D9D9] flex items-center justify-between px-4 sm:px-6 fixed top-0 left-[306px] w-[calc(100%-306px)] z-30">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-md text-[color:#1E1E1E] hover:bg-[#F0F0F0]"
          aria-label="Open sidebar"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <h1 className="heading-20">{displayTitle}</h1>
      </div>
      <div className="flex items-center gap-4">
        {actions}
        <button
          className="p-2 rounded-md text-[color:#1E1E1E] hover:bg-[#F0F0F0]"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#E5E5E5] overflow-hidden" />
          <ChevronDown className="w-4 h-4 text-[#1E1E1E]" />
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
