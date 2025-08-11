import { PageHeader, Card, Table } from "../../../../components/ui";
import { payouts } from "../../../../data/adminContent";

export default function PayoutsPage() {
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'groupId', title: 'Group' },
    { key: 'amount', title: 'Amount' },
    { key: 'scheduledFor', title: 'Scheduled For' },
    { key: 'status', title: 'Status' },
  ];
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Payouts" />
      <main className="p-4 sm:p-6 space-y-4 bg-[var(--bg-content)]">
        <Card>
          <Table columns={columns} data={payouts} />
        </Card>
      </main>
    </div>
  );
}

