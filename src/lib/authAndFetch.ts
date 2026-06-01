import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import { transformUri } from "@/lib/helpers";
import type { Locale } from "@/i18n/config";

// Content is served from the `content/` git submodule (the ZecHub content
// repo) checked out at build time. There is no longer a runtime GitHub API
// dependency or token: Markdown is read directly from local disk.
const CONTENT_ROOT = path.join(process.cwd(), "content");

// Resolve a repo-relative content path (with or without a leading slash) to an
// absolute path inside the submodule.
function resolveContentPath(p: string): string {
  const clean = p.replace(/^\/+/, "");
  return path.join(CONTENT_ROOT, clean);
}

// Normalize string for fuzzy matching
function normalize(str: string): string {
  return str
    .replace(/\.md$/i, "")
    .toLowerCase()
    .replace(/[-_ ]+/g, "");
}

// List the `.md` files directly inside a content folder, returned as
// repo-relative paths (e.g. `site/Using_Zcash/Wallets.md`) — the same shape the
// GitHub API previously produced, so callers (SideMenu, helpers) are unchanged.
export const getRootCached = cache(async (p: string) => {
  const transformed = transformUri(p).replace("/Site", "/site");
  const base = transformed.replace(/^\/+/, "");
  try {
    const entries = await fs.readdir(resolveContentPath(transformed), {
      withFileTypes: true,
    });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => `${base}/${e.name}`)
      .sort();
  } catch {
    return [];
  }
});

export const getFileContentCached = cache(async (filePath: string) => {
  try {
    // Try the exact path first
    try {
      return await fs.readFile(resolveContentPath(filePath), "utf-8");
    } catch {
      // Exact path missing → fuzzy fallback
    }

    // Fuzzy fallback: list real files in the folder and match by slug
    const folderPath = filePath.split("/").slice(0, -1).join("/");
    const realFiles = await getRootCached(folderPath);

    if (realFiles && realFiles.length > 0) {
      const slugPart = filePath.split("/").pop()?.replace(/\.md$/i, "") || "";
      const normalizedSlug = normalize(slugPart);

      for (const file of realFiles) {
        if (
          normalize(file) === normalizedSlug ||
          normalize(file).includes(normalizedSlug)
        ) {
          try {
            return await fs.readFile(resolveContentPath(file), "utf-8");
          } catch {
            // keep scanning
          }
        }
      }
    }

    return null;
  } catch {
    return null;
  }
});

export async function getLocalizedFileContentCached(
  path: string,
  locale: Locale,
) {
  if (locale === "it") {
    const itPath = `/translations/it${path}`;
    const translated = await getFileContentCached(itPath);
    if (translated) {
      return translated;
    }
    // Direct fuzzy fallback within the localized folder. getFileContentCached's
    // own fuzzy path routes through getRootCached -> transformUri, which mangles
    // the "/translations/it" prefix, so nested/oddly-cased pages (e.g.
    // Spend_Zcash/Top_10_Places_to_spend_ZEC) silently fall back to English.
    // Read the IT folder directly and slug-match instead.
    try {
      const dir = itPath.split("/").slice(0, -1).join("/");
      const entries = await fs.readdir(resolveContentPath(dir), {
        withFileTypes: true,
      });
      const wantSlug = normalize(
        itPath.split("/").pop()?.replace(/\.md$/i, "") || "",
      );
      for (const e of entries) {
        if (!e.isFile() || !e.name.endsWith(".md")) continue;
        const n = normalize(e.name.replace(/\.md$/i, ""));
        if (n === wantSlug || n.includes(wantSlug)) {
          return await fs.readFile(
            resolveContentPath(`${dir}/${e.name}`),
            "utf-8",
          );
        }
      }
    } catch {
      // fall through to English
    }
  }

  return getFileContentCached(path);
}

// All entries (files and folders) inside a content folder, as repo-relative
// paths. Kept for API parity with the previous GitHub-backed implementation.
export async function getSiteFolders(p: string) {
  const base = p.replace(/^\/+/, "");
  try {
    const entries = await fs.readdir(resolveContentPath(p), {
      withFileTypes: true,
    });
    return entries.map((e) => `${base}/${e.name}`).sort();
  } catch {
    return [];
  }
}

export async function getRootFileName(p: string) {
  const transformed = transformUri(p).replace("/Site", "/site");
  try {
    const entries = await fs.readdir(resolveContentPath(transformed), {
      withFileTypes: true,
    });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => e.name.replace(/\.md$/, ""))
      .sort();
  } catch {
    return [];
  }
}
