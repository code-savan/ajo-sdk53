import { PageHeader, Card } from "../../components/ui";
import Link from "next/link";

export default function FinancialPage() {
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Financial Management" />
      <main className="p-4 sm:p-6 space-y-4 bg-[var(--bg-content)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <h3 className="text-[16px] font-medium text-[#1E1E1E] mb-2">Transactions</h3>
            <Link href="/financial/transactions" className="text-[#1E1E1E] underline">View all</Link>
          </Card>
          <Card>
            <h3 className="text-[16px] font-medium text-[#1E1E1E] mb-2">Payouts</h3>
            <Link href="/financial/payouts" className="text-[#1E1E1E] underline">View all</Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
