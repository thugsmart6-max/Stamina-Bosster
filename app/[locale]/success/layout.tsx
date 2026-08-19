import { FunnelMinimalHeader } from "@/components/funnel-minimal-header";
import { SiteFooter } from "@/components/site-footer";

export default function SuccessRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="start-app start-shell flex min-h-dvh flex-col">
      <FunnelMinimalHeader variant="night" />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
