import { Metadata } from "next";
import { genMetadata } from "@/lib/helpers";
import ArboristCallsPage from "./ArboristCallsPage";
import { getRequestLocale } from "@/i18n/request-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return genMetadata({
    title: "ZecHub Arborist Calls",
    url: locale === "it"
      ? "https://zechub.wiki/it/aborist-calls"
      : "https://zechub.wiki/aborist-calls",
  });
}

export default function Page() {
  return <ArboristCallsPage />;
}
