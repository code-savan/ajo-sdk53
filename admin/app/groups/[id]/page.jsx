import { PageHeader, Card, Table } from "../../../components/ui";
import { groups } from "../../../data/adminContent";

export default function GroupDetail({ params }) {
  const group = groups.find((g) => g.id === params.id) || groups[0];
  const summary = [
    { key: 'ID', value: group.id },
    { key: 'Name', value: group.name },
    { key: 'Members', value: group.members },
    { key: 'Cycle', value: group.cycle },
    { key: 'Balance', value: group.balance },
  ];
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title={`Group: ${group.name}`} />
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
