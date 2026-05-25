import MdxContainer from "@/components/MdxContainer";
import SideMenu from "@/components/SideMenu/SideMenu";
import { getLocalizedFileContentCached, getRootCached } from "@/lib/authAndFetch";
import { getRequestLocale } from "@/i18n/request-locale";
import { genMetadata, getBanner } from "@/lib/helpers";
import { normalizeMdx } from "@/lib/normalizeMdx";
import { Metadata } from "next";
import { MDXRemote } from 'next-mdx-remote/rsc';
import { createMdxComponents } from "@/components/MdxComponents/MdxComponent";

export const metadata: Metadata = genMetadata({
  title: "Shielded pools",
  url: "https://zechub.wiki/using-zcash/shielded-pools",
  image: getBanner(`using-zcash`),
});

export default async function Page() {
  const locale = await getRequestLocale();
  const url = `/site/Using_Zcash/Shielded_Pools.md`;
  const urlRoot = `/site/using-zcash`;
  const [markdown, roots] = await Promise.all([
    getLocalizedFileContentCached(url, locale),
    getRootCached(urlRoot),
  ]);
  const content = markdown ? markdown : "No Data or Wrong file";

  return (
    <MdxContainer
      hasSideMenu={true}
      sideMenu={<SideMenu folder={urlRoot} roots={roots} />}
      roots={roots}
      heroImage={{ src: getBanner(`using-zcash`) }}
    >
      <MDXRemote
        source={normalizeMdx(String(content))}
        components={createMdxComponents(locale)}
      />
    </MdxContainer>
  );
}

export const dynamic = "force-dynamic";
