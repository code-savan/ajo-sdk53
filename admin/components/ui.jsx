"use client";
import { useSidebar } from "./SidebarContext";

export function PageHeader({ title, actions }) {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="h-16 bg-white border-b border-[#D9D9D9] flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-md text-[color:#1E1E1E] hover:bg-[#F0F0F0]"
          aria-label="Open sidebar"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <h1 className="heading-20">{title}</h1>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
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

