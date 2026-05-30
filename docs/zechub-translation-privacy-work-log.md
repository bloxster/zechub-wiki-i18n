# ZecHub Translation And Privacy Upgrade Work Log

All times are recorded in Central European Summer Time (CEST).

| Date | Start | End | Elapsed | Work |
| --- | --- | --- | --- | --- |
| 2026-05-25 | Not captured | 11:13 | Duration unavailable | Proposal review, architecture decisions, private mirror setup, Italian routing/static content integration, terminology validation and CI, production build, and private-content runtime QA. |
| 2026-05-25 | 11:13 | 11:14 | 0:01 | Published validated feature branches through the GitHub API after Git ref-update failures and confirmed the content validation workflow succeeded. |
| 2026-05-25 | 18:32 | 18:44 | 0:12 | Resumed the pilot, confirmed the `next-intl` production runtime fix, rebuilt the application, smoke-tested locale redirects, translated Markdown retrieval and English fallback, rechecked protected terms and CI publication status, and recorded repository references. |
| 2026-05-25 | 18:50 | 18:56 | 0:06 | Served the pilot through Tailscale, reproduced the homepage language-switch issue, fixed locale selection to reload server-resolved messages, rebuilt production output, and verified English-to-Italian-to-English switching with Playwright. |
| 2026-05-30 | 14:59 | 16:35 | 1:36 | Switched content delivery from the runtime GitHub API to a build-time git submodule (`content/`): rewrote `authAndFetch.ts` to read Markdown from local disk (server-only), removed the dead `api/github/file` route and the `octokit` dependency, added `outputFileTracingIncludes` for `content/**/*.md`, and excluded `content/` from TypeScript/ESLint. Fixed the Italian zk-SNARKs page's dead Discord CDN images (repointed to the GitHub assets the English page uses). Synced the forked English source with upstream `ZecHub/zechub` (0 commits behind) and re-translated the affected Italian pages (Wallets: LeoDex rename + Sapling fix; zk-SNARKs: TL;DR alignment + new `Pagine correlate` section incl. the Post-Quantum link), protected-terms validation passing. Rotated the two leaked tokens and scrubbed `.env` from all Git history. Passed the zabaniya Worker→Verifier gate. Made both repositories public and renamed them (dropped `-private`). |

## Repository References (public)

- Application repository: [bloxster/zechub-wiki-i18n](https://github.com/bloxster/zechub-wiki-i18n), branch [`feature/static-it-translation-pilot`](https://github.com/bloxster/zechub-wiki-i18n/tree/feature/static-it-translation-pilot)
- Content repository: [bloxster/zechub-content-i18n](https://github.com/bloxster/zechub-content-i18n), branch [`feature/static-it-translation-pilot`](https://github.com/bloxster/zechub-content-i18n/tree/feature/static-it-translation-pilot)
- Content delivery: the app consumes the content repo as a git submodule at `content/` (pinned to the pilot branch). To publish updated translations: commit in the content repo → `git submodule update --remote content` in the app repo → commit the new pin → deploy.

## Tracking Rule

For subsequent sessions, record start time before work begins and end time
before pushing changes. The first session began before explicit time tracking
was requested, so it is retained as work performed without claiming a precise
duration.
