# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Website for Charlton Brown, a North London architecture firm. Built with Next.js 13 (Pages Router), fetching all content from DatoCMS via GraphQL. Hosted on Vercel — merges to `main` auto-deploy.

## Commands

```bash
npm run dev      # start local dev server
npm run build    # production build
npm run lint     # ESLint
```

No test suite. There is no `npm test` command.

## Environment variables

Required to run locally. Pull from Vercel:

```bash
vercel env pull
```

Key variable: `NEXT_DATOCMS_API_TOKEN` — used in `lib/datocms.js` for all GraphQL requests.

## Architecture

### Data fetching pattern

Every page uses the same pattern:

1. `getStaticProps` calls `lib/datocms.js` with a GraphQL query, including the shared `navigationFragment` and `globalSeoFragment`
2. The result is passed as a `subscription` prop — either a live preview subscription or `{ enabled: false, initialData: ... }` for static
3. The page component calls `useQuerySubscription(subscription)` from `react-datocms` to get `data`
4. `useLayoutQuery(subscription)` (in `hooks/useLayoutQuery.js`) extracts and shapes navigation data that every page needs

### DatoCMS preview mode

When `preview = true` (triggered via `/api/exit-preview` and DatoCMS preview links), `useQuerySubscription` subscribes to real-time draft content updates. The `Layout` component shows a banner when preview is active.

### Global state

Two React contexts (using `use-context-selector` for performance) live in `_app.js` and wrap the whole app:

- `navContext` — controls nav bar visibility and logo/link color theme (dark/light), which pages update via `setNavColor` in `useEffect`
- `scrollSnapContext` — when active, locks `overflow: hidden` on the root container to enable scroll-snap behavior

### Reusable GraphQL fragments

Fragments live in `lib/fragments/` and are co-located on components when they're component-specific (e.g., `components/footer-block/fragment.js`). All fragments are re-exported from `lib/fragments/index.js`.

### Navigation structure

Navigation has four parts, all fetched via `navigationFragment`:
- `mainNavigation` — top-level nav links
- `aboutUsNavigation` — sub-navigation for the About section
- `projectTypesNav` — built from `allProjectTypes`, used for project type filtering
- `legalNavigation` — footer legal links

### Routing

- `pages/index.js` — homepage
- `pages/contact.js` — contact page
- `pages/[...slug].js` — catch-all for CMS-managed pages (simple rich text body)
- `pages/sitemap.xml.js` — dynamically generated sitemap

### Styling

Tailwind CSS with a custom design system defined in `tailwind.config.js`:
- Custom color palette using CSS variables (`rgb(var(--color-bone-100) / <alpha-value>)` pattern)
- Custom font family: `savoyBold`, `savoyItalic`, `savoyRegular`, `savoyRoman` (Savoy typeface), plus Helvetica Neue for sans
- Global CSS variables and font-face declarations in `styles/global.css` and `styles/fonts.css`

### Component conventions

- Components live in `components/<name>/index.js`
- Mix of JS and JSX — no TypeScript in components despite `tsconfig.json` being present
- Framer Motion used for page transitions (in `_app.js` via `AnimatePresence`) and scroll-triggered animations
- `clsx` for conditional class names
- `react-datocms`'s `Image` (via `PlaceholderImage` wrapper) for all DatoCMS images

## Known gotcha

Changing a DatoCMS block field name while working on a feature branch can break `main` builds since there's only one Dato environment. This self-resolves once the feature branch is merged.
