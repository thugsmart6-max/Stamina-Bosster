import { routing } from "@/i18n/routing";
import { redirect } from "next/navigation";

/** Redirect bare `/` to default locale (middleware should also handle this). */
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
