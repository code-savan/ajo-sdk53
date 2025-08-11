import { PageHeader, Card } from "../../components/ui";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Analytics" />
      <main className="p-4 sm:p-6 space-y-4 bg-[var(--bg-content)]">
        <Card>
          <div className="text-sm text-[#7E7E7E]">Demo content placeholder for Analytics. Update per PDF.</div>
        </Card>
      </main>
    </div>
  );
}

