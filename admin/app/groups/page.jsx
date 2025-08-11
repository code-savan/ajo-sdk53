import { PageHeader, Table } from "../../components/ui";
import { groups } from "../../data/adminContent";
import Link from "next/link";

export default function GroupsPage() {
  const columns = [
    { key: 'name', title: 'Group' , render: (row) => <Link className="underline" href={`/groups/${row.id}`}>{row.name}</Link>},
    { key: 'members', title: 'Members' },
    { key: 'cycle', title: 'Cycle' },
    { key: 'balance', title: 'Balance' },
  ];
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Group Management" />
      <main className="p-4 sm:p-6 space-y-4 bg-[var(--bg-content)]">
        <Table columns={columns} data={groups} />
      </main>
    </div>
  );
}
