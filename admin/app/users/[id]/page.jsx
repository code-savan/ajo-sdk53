import { PageHeader, Card, Table } from "../../../components/ui";
import { users } from "../../../data/adminContent";

export default function UserDetail({ params }) {
  const user = users.find((u) => u.id === params.id) || users[0];
  const summary = [
    { key: 'ID', value: user.id },
    { key: 'Name', value: user.name },
    { key: 'Email', value: user.email },
    { key: 'Status', value: user.status },
    { key: 'Joined', value: user.joinedAt },
  ];
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title={`User: ${user.name}`} />
      <main className="p-4 sm:p-6 space-y-4 bg-[var(--bg-content)]">
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {summary.map((row) => (
              <div key={row.key} className="text-[14px] text-[#1E1E1E]">
                <span className="text-[#7E7E7E] mr-2">{row.key}:</span>
                <span>{row.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
