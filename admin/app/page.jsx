"use client";
import { PageHeader } from "../components/ui";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PageHeader title="Overview" />
      <main className="flex-1 bg-[var(--bg-content)] p-4 sm:p-6">
        <div className="text-[#7E7E7E] text-sm">Welcome back, Admin</div>
      </main>
    </div>
  );
}
