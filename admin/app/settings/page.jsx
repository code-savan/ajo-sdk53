import { PageHeader, Card } from "../../components/ui";
import Link from "next/link";

export default function SettingsPage() {
  const items = [
    { href: '/settings/general', title: 'General' },
    { href: '/settings/security', title: 'Security' },
    { href: '/settings/payouts', title: 'Payouts' },
  ];
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Settings" />
      <main className="p-4 sm:p-6 space-y-4 bg-[var(--bg-content)]">
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((it) => (
            <Card key={it.href}>
              <h3 className="text-[16px] font-medium text-[#1E1E1E] mb-2">{it.title}</h3>
              <Link href={it.href} className="text-[#1E1E1E] underline">Manage</Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
