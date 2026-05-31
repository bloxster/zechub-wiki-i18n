import MdxContainer from "@/components/MdxContainer";
import ResearchIndexGrid from "@/components/Research/ResearchIndexGrid";
import SideMenu from "@/components/SideMenu/SideMenu";
import { getLocalizedFileContentCached, getRootCached } from "@/lib/authAndFetch";
import { getDictionary } from "@/lib/getDictionary";
import { getRequestLocale } from "@/i18n/request-locale";
import { genMetadata, getBanner, getDynamicRoute } from "@/lib/helpers";
import { normalizeMdx } from "@/lib/normalizeMdx";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';   // ← NEW: enables GitHub-style tables
import { createMdxComponents } from "@/components/MdxComponents/MdxComponent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const locale = await getRequestLocale();
  const localizedPrefix = locale === "it" ? "/it" : "";
  const { slug = [] } = await params;
  if (slug.length === 0) {
    return genMetadata({ title: "Zechub", url: `https://zechub.wiki${localizedPrefix}` });
  }
  const folder = slug[0] || "";
  const capitalized = folder.charAt(0).toUpperCase() + folder.slice(1).replace(/-/g, " ");
  const title = slug.length > 1 && slug[1]
    ? `Zechub - ${capitalized} | ${slug[1].replace(/-/g, " ")}`
    : `Zechub - ${capitalized}`;
  return genMetadata({ title, url: `https://zechub.wiki${localizedPrefix}/${slug.join("/")}` });
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const locale = await getRequestLocale();
  const dictionary = (await getDictionary(locale)) as {
    pages?: { folder?: { browse?: string } };
    home?: { explore?: Record<string, string> };
  };
  let slug: string[] = [];
  try {
    const resolved = await props.params;
    slug = resolved.slug || [];
  } catch {
    return notFound();
  }
  if (slug.length === 0) return notFound();
  if (slug[0] === ".well-known") return null;

  const url = getDynamicRoute(slug);
  const urlRoot = `/site/${slug[0]}`;
  let markdown: any = null;
  let roots: any[] = [];
  try {
    const [md, rootsRaw] = await Promise.all([
      getLocalizedFileContentCached(url, locale).catch(() => null),
      getRootCached(urlRoot).catch(() => []),
    ]);
    markdown = md;
    roots = Array.isArray(rootsRaw) ? rootsRaw : [];
  } catch (e) {
    console.error('Failed to fetch and parse .md file: ', e)
    markdown = null;
    roots = [];
  }

  const imgUrl = getBanner(slug[0]) || "";
  const imgUrlDark = getBanner(`${slug[0]}-dark`) || imgUrl;

  const showSideMenu = slug[0] !== "research" && roots.length > 0;

  const slugToTitle = (segment: string) =>
    segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const isResearchArticle =
    slug[0] === "research" && slug.length > 1 && Boolean(markdown);
  const researchSegment = slug.length > 1 ? slug[slug.length - 1] : "";
  const researchBreadcrumbLabel = researchSegment ? slugToTitle(researchSegment) : "";
  const canonicalWikiUrl = `https://zechub.wiki/${slug.join("/")}`;

  if (slug.length === 1 && slug[0] === "research") {
    return (
      <MdxContainer
        hasSideMenu={showSideMenu}
        sideMenu={showSideMenu ? <SideMenu folder={slug[0]} roots={roots} /> : null}
        roots={roots}
        heroImage={{ src: imgUrl, darkSrc: imgUrlDark }}
      >
        <ResearchIndexGrid roots={roots} />
      </MdxContainer>
    );
  }

  if (!markdown) {
    const exploreKey = (
      {
        "start-here": "startHere",
        "tutorials": "tutorials",
        "using-zcash": "usingZcash",
        "guides": "guides",
        "zcash-tech": "zcashTech",
        "zcash-organizations": "organizations",
        "zcash-community": "community",
        "zkav-club": "zkavClub",
        "privacy-tools": "privacyTools",
        "research": "research",
        "glossary-and-faqs": "glossary",
        "contribute": "contribute",
      } as Record<string, string>
    )[slug[0]];
    const folderTitle =
      exploreKey && dictionary.home?.explore?.[exploreKey]
        ? dictionary.home.explore[exploreKey].replace(/_/g, " ")
        : slug[0].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return (
      <MdxContainer
        hasSideMenu={showSideMenu}
        sideMenu={showSideMenu ? <SideMenu folder={slug[0]} roots={roots} /> : null}
        roots={roots}
        heroImage={{ src: imgUrl, darkSrc: imgUrlDark }}
      >
        <div className="px-6 py-12 text-center">
          <h1 className="text-5xl font-bold mb-6">{folderTitle}</h1>
          <p className="text-xl text-muted-foreground">
            {dictionary.pages?.folder?.browse ?? "Browse the articles using the sidebar on the left"}
          </p>
        </div>
      </MdxContainer>
    );
  }

  return (
    <MdxContainer
      hasSideMenu={showSideMenu}
      sideMenu={showSideMenu ? <SideMenu folder={slug[0]} roots={roots} /> : null}
      roots={roots}
      heroImage={{ src: imgUrl, darkSrc: imgUrlDark }}
      layoutVariant={isResearchArticle ? "research" : "default"}
      researchMeta={
        isResearchArticle
          ? {
              breadcrumbLabel: researchBreadcrumbLabel,
              shareUrl: canonicalWikiUrl,
              pageTitle: researchBreadcrumbLabel,
            }
          : undefined
      }
    >
      <MDXRemote
        source={normalizeMdx(String(markdown || ""))}
        components={createMdxComponents(locale)}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </MdxContainer>
  );
}

export const dynamic = "force-dynamic";
