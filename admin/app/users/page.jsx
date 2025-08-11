import { PageHeader, Card, Table } from "../../components/ui";
import { users } from "../../data/adminContent";

export default function UsersIndex() {
  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'status', title: 'Status' },
    { key: 'joinedAt', title: 'Joined' },
  ];
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="User Management" />
      <main className="p-4 sm:p-6 space-y-4 bg-[var(--bg-content)]">
        <Table columns={columns} data={users} />
      </main>
    </div>
  );
}
