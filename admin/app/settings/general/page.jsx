import { PageHeader, Card } from "../../../../components/ui";
import { settingsDemo } from "../../../../data/adminContent";

export default function GeneralSettings() {
  const { appName, timezone } = settingsDemo.general;
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Settings · General" />
      <main className="p-4 sm:p-6 space-y-4 bg-[var(--bg-content)]">
        <Card>
          <div className="space-y-2 text-[14px] text-[#1E1E1E]">
            <div><span className="text-[#7E7E7E] mr-2">App Name:</span>{appName}</div>
            <div><span className="text-[#7E7E7E] mr-2">Timezone:</span>{timezone}</div>
          </div>
        </Card>
      </main>
    </div>
  );
}

