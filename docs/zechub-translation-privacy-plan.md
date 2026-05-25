# ZecHub Static Italian Translation And Privacy Pilot

## Goal

Replace runtime third-party translation with repository-controlled Italian
pages while keeping English as the default experience. The pilot eliminates
Google Translate runtime loading, protects Zcash terminology, and establishes
a contributor workflow that can be extended to additional locales.

## Private Development Repositories

- Application: `bloxster/zechub-wiki-i18n-private`
- Content: `bloxster/zechub-content-i18n-private`

Work is prepared in these private mirrors and submitted upstream only after
technical QA and Italian-language review.

## Implemented Application Architecture

- `next-intl` provides the client translation message boundary.
- English remains canonical at unprefixed routes, for example `/wallets`.
- Italian routes are prefixed, for example `/it/wallets`.
- `/en/...` redirects to the unprefixed canonical English route.
- `src/proxy.ts` resolves the locale and rewrites `/it/...` onto the existing
  application route tree, avoiding a high-risk duplicate route migration.
- `LanguageContext` now switches routes and dictionaries only. It no longer
  injects Google Translate scripts, cookies, widgets, or DOM translation.
- Internal links in the main navigation, article UI, homepage calls to action,
  wallet cards, breadcrumbs, and footer retain the current locale.

## Content Contract

English Markdown in the content repository remains the source of truth:

```txt
site/Using_Zcash/Shielded_Pools.md
```

Italian content is stored at the same relative path below `translations/it/`:

```txt
translations/it/site/Using_Zcash/Shielded_Pools.md
```

When an Italian article does not exist, an `/it/...` route deliberately falls
back to the current English source article. The pilot includes:

- Wallets
- Shielded Pools
- ZK-SNARKs
- Arborist Calls Markdown page
- Interactive Arborist Calls UI labels

## Terminology And Publication Review

The content mirror stores the protected terminology manifest at
`translation/protected-terms.json` and validates pilot articles with:

```bash
node scripts/check-protected-terms.mjs
```

The initial Italian pages are implementation drafts. They must receive review
from an Italian-speaking contributor before any upstream publication PR.

## Verification And Delivery

Before upstream delivery:

1. Run application type/build checks and verify no Google Translate runtime
   references remain under `src/`.
2. Run protected terminology validation in the content repository.
3. Manually check English canonical routes, `/it/...` localized routes, English
   fallback for untranslated pages, locale switching, and navigation links.
4. Obtain Italian editorial approval for translated Markdown and visible UI
   terminology.
5. Open coordinated application and content PRs against ZecHub upstream.

## Private Content Preview Configuration

To preview translated content from the private content mirror, configure the
application environment with a GitHub token that can read the private repo and:

```bash
OWNER=bloxster
REPO=zechub-content-i18n-private
BRANCH=feature/static-it-translation-pilot
```
