import { PageHeader, Card } from "../../../../components/ui";
import { settingsDemo } from "../../../../data/adminContent";

export default function SecuritySettings() {
  const { twoFactorRequired, passwordPolicy } = settingsDemo.security;
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader title="Settings · Security" />
      <main className="p-4 sm:p-6 space-y-4 bg-[var(--bg-content)]">
        <Card>
          <div className="space-y-2 text-[14px] text-[#1E1E1E]">
            <div><span className="text-[#7E7E7E] mr-2">2FA Required:</span>{twoFactorRequired ? 'Yes' : 'No'}</div>
            <div><span className="text-[#7E7E7E] mr-2">Password Policy:</span>{passwordPolicy}</div>
          </div>
        </Card>
      </main>
    </div>
  );
}

