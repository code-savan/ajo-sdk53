"use client";

import { PageHeader, Table } from "../../components/ui";
import { groups } from "../../data/adminContent";
import Link from "next/link";

function NameCell({ row }) {
  return <Link className="underline" href={`/groups/${row.id}`}>{row.name}</Link>;
}

export default function GroupsPage() {
  const columns = [
    { key: 'name', title: 'Group', render: (row) => <NameCell row={row} /> },
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
