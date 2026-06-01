# Agent Task

This folder is being worked on by an automated agent.

## Project Context

# Context

- Project: ZecHub wiki app (Next.js 16, App Router, `next-intl`), package manager **yarn**.
- Content lives in a git submodule at `content/` (repo `zechub-content-i18n`,
  branch `feature/static-it-translation-pilot`). It is already checked out.
- This run VERIFIES a translation expansion that was just made. The changed files
  are the Italian translations under `content/translations/it/...`, the protected-terms
  config `content/translation/protected-terms.json`, and the UI dictionary
  `dictionaries/it.json`. These ARE in scope for this verification.
- The content repo also contains a large `Hackathon/` tree of unrelated third-party
  source (`.tsx` etc.) — that is why `content/` is excluded from tsc/eslint. Do not
  touch it.
- Routing convention: English is canonical at unprefixed routes (`/wallets`,
  `/zcash-organizations/...`); Italian uses `/it/...`; `/en/...` redirects to
  canonical English; untranslated `/it/...` routes fall back to English. Internal
  Markdown links are auto-localized by the MDX renderer (`localizedPath`), so
  Markdown uses unprefixed paths.
- IMPORTANT: `yarn build` currently fails for an UNRELATED reason — the `/api/ai`
  route throws `Missing required environment variable: SUPABASE_URL` during page-data
  collection. This is pre-existing and OUT OF SCOPE. Do not try to fix it and do not
  use full-build success as the acceptance signal. Use the targeted checks + the
  isolated dev-server render checks in the objective.
- This is a VERIFICATION run. Do not commit, push, or touch any git remote. Prefer
  read-only checks; only make a minimal edit if a check genuinely fails.


## Specification

# Spec: serve ZecHub wiki content from a local git submodule

The ZecHub wiki app (`zechub-wiki-i18n-private`) must serve all Markdown wiki
content from a local **git submodule** at `content/` (the ZecHub content repo),
read from local disk — instead of fetching it at runtime via the GitHub API.

This work is believed to be already implemented; your job is to make the
working tree satisfy the objective. Only change code if a verification step
fails.

Required end state:

1. `src/lib/authAndFetch.ts` reads Markdown from the local `content/` submodule
   via the Node `fs` API (no `octokit`, no GitHub API, no `GITHUB_TOKEN`). It
   keeps the same exported function names and return shapes as before
   (`getFileContentCached`, `getLocalizedFileContentCached`, `getRootCached`,
   `getSiteFolders`, `getRootFileName`) and is guarded with `import "server-only"`.
2. The dead route `src/app/api/github/file/route.ts` is removed and the
   `octokit` / `@octokit/types` dependencies are gone from `package.json`.
3. `next.config.mjs` includes `outputFileTracingIncludes` for `./content/**/*.md`.
4. `content/` is excluded from TypeScript (`tsconfig.json`) and ESLint
   (`.eslintrc.json`) because it carries unrelated hackathon source.
5. Localized routing still works: English canonical pages render English;
   `/it/...` pages render the Italian translation; an `/it/...` route with no
   Italian translation falls back to English.
6. The Italian pilot pages (Wallets, Shielded Pools, zk-SNARKs, Arborist Calls)
   render their translated content, and the protected-terminology validation
   passes.

Do NOT modify anything under `content/` (it is a submodule). Do NOT add back any
GitHub API content fetching. Do NOT introduce a `GITHUB_TOKEN` requirement.


## Success Criteria (Objective)

# Objective (verification — all steps must pass)

Run from project root (`/home/bloxster/zechub-wiki-i18n-private`). Verifies the
Use Zcash Italian fixes + the nested-path resolver fix. Do NOT use full
`yarn build` (unrelated `/api/ai` SUPABASE_URL failure). Use targeted + dev checks.

## Static
1. `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "authAndFetch"` prints nothing
   (test-file `@testing-library` errors are out of scope).
2. Protected-terms gate passes: `cd content && node scripts/check-protected-terms.mjs` exits 0.
3. Specific fixes present (grep, each must match):
   - `grep -q "Guida all'integrazione Zcash Snap di Metamask" content/translations/it/site/Using_Zcash/Metamask_Snap.md`
   - `grep -q "piattaforme per mance e profili" content/translations/it/site/Using_Zcash/Creators_and_Tips.md`
   - `grep -q "Wrappa i tuoi token" content/translations/it/site/Using_Zcash/Encifher_Swaps.md`
   - `grep -q "credito telefonico" content/translations/it/site/Using_Zcash/Mobile_Top_Ups.md`
   - `grep -q "stessa chain" content/translations/it/site/Using_Zcash/Solswap.md` and `grep -q "lo \*\*slippage\*\*" content/translations/it/site/Using_Zcash/Solswap.md`
   - `grep -q "Cos'è la Zcash Testnet" content/translations/it/site/Using_Zcash/Testnet.md` and `grep -q "(in italiano rubinetto)" content/translations/it/site/Using_Zcash/Testnet.md`
   - `grep -q "Guida al mining di Zcash" content/translations/it/site/Using_Zcash/Zcash_Mining_Guide.md`
   - mining-guide has NO "estrazione" and NO "minator": `! grep -qiE "estrazione|minator" content/translations/it/site/Using_Zcash/Zcash_Mining_Guide.md`

## Functional (dev server)
4. Start dev, verify nested-path resolver, then stop:
   ```bash
   rm -f .next/dev/lock 2>/dev/null
   (yarn dev -p 3071 > /tmp/zbn-dev.log 2>&1 &) ; for i in $(seq 1 90); do grep -q "Ready in" /tmp/zbn-dev.log && break; sleep 2; done
   ```
   - `curl -s localhost:3071/it/using-zcash/spend-zcash/top-10-places-to-spend-zec` contains `spendere ZEC` AND `Perché un` and does NOT contain `Places to Spend` or `Why does`.
   - `curl -s localhost:3071/using-zcash/spend-zcash/top-10-places-to-spend-zec` (English) still contains `Places to Spend`.
   Stop: `pkill -f "next dev -p 3071" || true`.

Report APPROVED only if all pass.


## Important Notes

- A **strict verifier agent** will independently check your work when you are done.
- The verifier has no access to your session — it only reads the actual files.
- Claims you make that are not backed by real file changes will be caught.
- Do not leave TODOs, stubs, or placeholder code. Every criterion must be fully met.
- Run tests / build commands to confirm your work is correct before finishing.
