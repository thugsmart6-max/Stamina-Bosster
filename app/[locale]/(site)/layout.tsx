import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SiteRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1 pt-20 has-[#studio-hero]:pt-0">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
