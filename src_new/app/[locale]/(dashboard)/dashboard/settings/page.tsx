import { DashboardSettings } from "@/components/dashboard/dashboard-settings";
import { getCurrentUser } from "@/lib/auth/guards";

export default async function DashboardSettingsPage() {
  const user = await getCurrentUser();
  return <DashboardSettings user={user!} />;
}
