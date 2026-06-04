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

const CATEGORY_ROOT_FALLBACKS: Record<string, string[]> = {
  "start-here": [
    "site/Start_Here/Developer_Resources.md",
    "site/Start_Here/Development_Fund.md",
    "site/Start_Here/Network_Upgrades.md",
    "site/Start_Here/New_User_Guide.md",
    "site/Start_Here/Using_This_Wiki.md",
    "site/Start_Here/What_is_ZEC_and_Zcash.md",
    "site/Start_Here/What_is_ZecHub.md",
    "site/Start_Here/ZEC_Use_Cases.md",
    "site/Start_Here/Zcash_Monetary_Policy.md",
    "site/Start_Here/Zcash_Resources.md",
  ],
  "using-zcash": [
    "site/Using_Zcash/Blockchain_Explorers.md",
    "site/Using_Zcash/Buying_ZEC.md",
    "site/Using_Zcash/Custodial_Exchanges.md",
    "site/Using_Zcash/Faucets.md",
    "site/Using_Zcash/Memos.md",
    "site/Using_Zcash/Metamask_Snap.md",
    "site/Using_Zcash/Mobile_Top_Ups.md",
    "site/Using_Zcash/Payment_Processors.md",
    "site/Using_Zcash/Payment_Request_URIs.md",
    "site/Using_Zcash/Recovering_Funds.md",
    "site/Using_Zcash/Shielded_Pools.md",
    "site/Using_Zcash/Testnet.md",
    "site/Using_Zcash/Transactions.md",
    "site/Using_Zcash/Transparent_Exchange_Addresses.md",
    "site/Using_Zcash/Wallets.md",
  ],
  "zcash-community": [
    "site/Zcash_Community/Arborist_Calls.md",
    "site/Zcash_Community/Zcash_Governance.md",
    "site/Zcash_Community/Community_Blogs.md",
    "site/Zcash_Community/Community_Links.md",
    "site/Zcash_Community/Community_Projects.md",
    "site/Zcash_Community/Zcash_Global_Ambassadors.md",
    "site/Zcash_Community/Zcash_Media.md",
    "site/Zcash_Community/ZCAP.md",
    "site/Zcash_Community/Zcash_Podcasts.md",
    "site/Zcash_Community/Zcash_Ecosystem_Security.md",
    "site/Zcash_Community/Cypherpunk_Zero_NFT.md",
    "site/Zcash_Community/Zcon_Archive.md",
  ],
  "zcash-tech": [
    "site/Zcash_Tech/Crosslink_Protocol.md",
    "site/Zcash_Tech/FROST.md",
    "site/Zcash_Tech/Full_Nodes.md",
    "site/Zcash_Tech/Halo.md",
    "site/Zcash_Tech/Lightwallet_Nodes.md",
    "site/Zcash_Tech/Pepper_Sync.md",
    "site/Zcash_Tech/Post_Quantum_Security.md",
    "site/Zcash_Tech/Viewing_Keys.md",
    "site/Zcash_Tech/ZAP1_Attestation_Protocol.md",
    "site/Zcash_Tech/Zaino.md",
    "site/Zcash_Tech/Zcash_Shielded_Assets.md",
    "site/Zcash_Tech/Zcash_Wallet_Syncing.md",
    "site/Zcash_Tech/Zebra_Full_Node.md",
    "site/Zcash_Tech/zk_SNARKS.md",
  ],
  guides: [
    "site/guides/Akash_Network_Zebra.md",
    "site/guides/Avalanche_RedBridge.md",
    "site/guides/BTCPayServer_Zcash_Plugin.md",
    "site/guides/Blockchain_Explorers.md",
    "site/guides/Brave_Wallet_Guide.md",
    "site/guides/Free2z_Live.md",
    "site/guides/Keystone_Zashi.md",
    "site/guides/Maya_Protocol.md",
    "site/guides/Nym_VPN.md",
    "site/guides/Raspberry_Pi_4_Full_Node.md",
    "site/guides/Raspberry_pi5_Zebra_Lightwalletd_Zingo.md",
    "site/guides/Using_ZEC_Privately.md",
    "site/guides/Using_ZEC_in_DeFi.md",
    "site/guides/Visualizing_Zcash_Addresses.md",
    "site/guides/Visualizing_the_Zcash_Network.md",
    "site/guides/Ywallet_FROST_Demo.md",
    "site/guides/Zcash_Devtool.md",
    "site/guides/Zcash_Improvement_Proposals.md",
    "site/guides/Zenith_Installation.md",
    "site/guides/Zero-Knowledge_vs_Decoys.md",
    "site/guides/Zgo_Payment_Processor.md",
    "site/guides/Zingolib_and_Zaino_Tutorial.md",
    "site/guides/Zkool_Multisig.md",
  ],
  "zcash-organizations": [
    "site/Zcash_Organizations/ZODL.md",
    "site/Zcash_Organizations/Electric_Coin_Company.md",
    "site/Zcash_Organizations/Zcash_Foundation.md",
    "site/Zcash_Organizations/Zcash_Community_Grants.md",
    "site/Zcash_Organizations/Financial_Privacy_Foundation.md",
    "site/Zcash_Organizations/Shielded_Labs.md",
    "site/Zcash_Organizations/Zingo_Labs.md",
    "site/Zcash_Organizations/ZKAV.md",
  ],
};

const getCategoryRootFallback = (folder: string) =>
  CATEGORY_ROOT_FALLBACKS[folder] ?? [];

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
  if (roots.length === 0) {
    roots = getCategoryRootFallback(slug[0]);
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
