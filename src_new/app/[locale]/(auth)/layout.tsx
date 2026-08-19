import { FunnelMinimalHeader } from "@/components/funnel-minimal-header";
import { SiteFooter } from "@/components/site-footer";

export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="start-app start-shell style-paper flex min-h-dvh flex-col">
      <FunnelMinimalHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
