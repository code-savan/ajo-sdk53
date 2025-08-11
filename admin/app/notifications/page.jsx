import { PageHeader, Table } from "../../components/ui";
import { notificationsList } from "../../data/adminContent";

export default function NotificationsPage() {
  const columns = [
    { key: 'date', title: 'Date' },
    { key: 'title', title: 'Title' },
    { key: 'body', title: 'Message' },
  ];
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Notifications" />
      <main className="p-4 sm:p-6 space-y-4 bg-[var(--bg-content)]">
        <Table columns={columns} data={notificationsList} />
      </main>
    </div>
  );
}
