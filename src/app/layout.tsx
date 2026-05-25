import { Footer, Navigation } from "@/components";
import ProgressBar from "@/components/UI/ProgressBar";
import { DarkModeProvider } from "@/provider/DarkModeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/getDictionary";
import { getRequestLocale } from "@/i18n/request-locale";
import { NextIntlClientProvider } from "next-intl";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import FloatingExplore from "@/components/FloatingExplore";
import "./globals.css";
import NavigationWrapper from "@/components/NavigationWrapper";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZecHub Wiki",
  description: "An open source education hub for Zcash",
  icons: "/ZecHubBlue.png",
  alternates: {
    types: {
      "application/rss+xml": [
        {
          url: "https://zechub.wiki/rss.xml",
          title: "ZecHub Dashboard Updates",
        },
      ],
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  const messages = await getDictionary(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Manual RSS link as backup for better feed detection (Brave, Feedly, etc.) */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="ZecHub Dashboard Updates"
          href="https://zechub.wiki/rss.xml"
        />
      </head>
      <body className={`px-0 ${inter.className} dark:bg-slate-900 dark:text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={true}
          enableColorScheme={true}
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <LanguageProvider initialLocale={locale} messages={messages}>
              <DarkModeProvider>
                <NavigationWrapper>{children}</NavigationWrapper>
              </DarkModeProvider>
            </LanguageProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
