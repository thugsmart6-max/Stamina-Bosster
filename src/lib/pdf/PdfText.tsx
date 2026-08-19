import { Text, type TextProps } from "@react-pdf/renderer";
import type { Locale } from "@/i18n/routing";
import { pdfText } from "./hindi-text";

export function PdfText({
  locale,
  children,
  ...props
}: TextProps & { locale: Locale; children: string | number | null | undefined }) {
  return (
    <Text {...props}>{pdfText(children, locale)}</Text>
  );
}
