import { PageHeader, Card, Table } from "../../../../components/ui";
import { transactions } from "../../../../data/adminContent";

export default function TransactionsPage() {
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'userId', title: 'User' },
    { key: 'type', title: 'Type' },
    { key: 'amount', title: 'Amount' },
    { key: 'date', title: 'Date' },
    { key: 'status', title: 'Status' },
  ];
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Transactions" />
      <main className="p-4 sm:p-6 space-y-4 bg-[var(--bg-content)]">
        <Card>
          <Table columns={columns} data={transactions} />
        </Card>
      </main>
    </div>
  );
}

