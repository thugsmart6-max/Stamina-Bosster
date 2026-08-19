import { DashboardHome } from "@/components/dashboard/dashboard-home";
import { StartPillars } from "@/components/start-pillars";
import { getCurrentUser } from "@/lib/auth/guards";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  return (
    <>
      <DashboardHome user={user!} />
      <div className="mt-10">
        <StartPillars ctaHref="/dashboard/reports" />
      </div>
    </>
  );
}
