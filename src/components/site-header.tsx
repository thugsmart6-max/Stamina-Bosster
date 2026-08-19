import { SiteHeaderShell } from "@/components/site-header-shell";
import { getCurrentUser } from "@/lib/auth/guards";

export async function SiteHeader() {
  const user = await getCurrentUser();
  return <SiteHeaderShell user={user} />;
}
