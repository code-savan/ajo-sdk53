"use client";
import { PageHeader, Card } from "../components/ui";
import { demoStats } from "../data/adminContent";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PageHeader title="Overview" />
      <main className="flex-1 bg-[var(--bg-content)] p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {demoStats.overview.map((stat) => (
          <Card key={stat.title}>
            <h2 className="text-xl font-semibold mb-2">{stat.title}</h2>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm text-green-500">{stat.change}</span>
            </div>
          </Card>
        ))}
      </main>
    </div>
  );
}
