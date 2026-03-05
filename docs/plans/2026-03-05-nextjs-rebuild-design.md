# City Kebab - Next.js Rebuild Design

## Overview

Rebuild the City Kebab group ordering app from Vite + React + Firebase to Next.js 16+ with PostgreSQL, Clerk authentication, and i18n support. Same git repository, fresh data start.

**Live URL:** kebab.ilijaleko.com
**Deployment:** Docker on Coolify (self-hosted)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript |
| Auth | Clerk |
| Database | PostgreSQL (self-hosted on Coolify) |
| ORM | Prisma |
| UI | shadcn/ui + Tailwind CSS v4 |
| i18n | next-intl (URL-based locales) |
| Deployment | Dockerfile + Coolify |

---

## Route Structure

```
app/
  [locale]/
    layout.tsx              # Root layout (theme, i18n, Clerk providers)
    page.tsx                # Home - create/join group (public)
    group/
      [code]/
        page.tsx            # Group order page (public)
    sign-in/[[...sign-in]]/
      page.tsx              # Clerk sign-in
    sign-up/[[...sign-up]]/
      page.tsx              # Clerk sign-up
    dashboard/              # Protected by Clerk middleware
      layout.tsx            # Dashboard layout with nav
      page.tsx              # Order history
      recipes/
        page.tsx            # Saved recipes CRUD
      settings/
        page.tsx            # User preferences
```

**Public pages** work without authentication (same as current app). The `/dashboard` section is fully protected by Clerk middleware. Signed-in users see a profile button across all pages.

---

## Database Schema (Prisma)

```prisma
model Group {
  id        String   @id @default(cuid())
  code      String   @unique // 6-char short code (e.g. "K3BX9R")
  creatorId String?  // Clerk user ID (null if anonymous)
  createdAt DateTime @default(now())
  orders    Order[]
}

model Order {
  id        String   @id @default(cuid())
  groupId   String
  group     Group    @relation(fields: [groupId], references: [id], onDelete: Cascade)
  userId    String?  // Clerk user ID (null if anonymous)
  name      String   // Display name / nickname
  kebabType String   // pecivo, tortilja, vegetarijanski, tortilja mix salata
  kebabSize String?  // mali, veliki (null for types without size)
  sauce     String   // ljuti, blagi, mix, etc.
  hasCheese Boolean? // null for types without cheese option
  adds      String[] // array of addon strings
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Recipe {
  id        String   @id @default(cuid())
  userId    String   // Clerk user ID (required - private recipes only)
  name      String   // Recipe display name
  userName  String?  // Preferred name/nickname to auto-fill
  kebabType String
  kebabSize String?
  sauce     String
  hasCheese Boolean?
  adds      String[]
  createdAt DateTime @default(now())

  @@index([userId])
}
```

**Key decisions:**
- No `User` table - Clerk manages users, we store `userId` as a string reference
- `Order.userId` is nullable - anonymous orders work, signed-in orders get linked
- `Group.code` has a unique index for fast lookups by short code
- Cascade delete on orders when a group is deleted
- `Recipe` requires `userId` - only authenticated users can save recipes

---

## API Layer: Server Actions + Server Components

No separate API routes. Server Actions for mutations, Server Components for data fetching.

```
lib/
  actions/
    groups.ts      # createGroup, joinGroup
    orders.ts      # addOrder, updateOrder, deleteOrder
    recipes.ts     # saveRecipe, deleteRecipe, loadRecipe
  queries/
    groups.ts      # getGroupByCode, getGroupWithOrders
    orders.ts      # getUserOrderHistory
    recipes.ts     # getUserRecipes, getRecipeById
  db.ts            # Prisma client singleton
  utils/
    generate-code.ts  # Short code generator (6-char alphanumeric)
```

- Public pages fetch data via `queries/`, mutate via Server Actions
- Protected Server Actions check `auth()` from Clerk before executing
- Order editing/deletion checks `auth().userId === order.userId`
- Group updates via polling (refetch) or manual refresh - no WebSocket complexity

Input validation with `zod` schemas in Server Actions.

---

## i18n: next-intl

**Locales:** `hr` (default), `en`

**Files:**
```
messages/
  hr.json    # Croatian
  en.json    # English
```

**Message structure:**
```json
{
  "home": { "title": "...", "createOrder": "...", "joinGroup": "..." },
  "group": { "title": "...", "addOrder": "...", "generateSms": "..." },
  "kebab": { "types": { "pecivo": "...", "tortilja": "..." } },
  "dashboard": { "history": "...", "recipes": "..." },
  "common": { "loading": "...", "copy": "...", "copied": "..." }
}
```

**Routing:** URL prefix for all locales (`/hr/...`, `/en/...`). Root `/` redirects to `/hr`.

**Language switcher:** dropdown in the header, next to theme toggle. Preserves current path when switching.

---

## Auth Flow & UI

**Approach:** Anonymous-first. No sign-in wall for group ordering. Signing in links orders to account and unlocks dashboard features.

**Header behavior:**

| Context | Left | Right |
|---|---|---|
| Public (not signed in) | Back button (group page) | Language switcher, Theme toggle, "Prijavi se" link |
| Public (signed in) | Back button (group page) | Language switcher, Theme toggle, Clerk UserButton |
| Dashboard | Back to home | Language switcher, Theme toggle, Clerk UserButton |

**Signed-in extras on group page:**
- Edit/delete buttons on own orders (matched by `userId`)
- "Save as recipe" button saves to DB
- Link to order history in dashboard

**Dashboard pages:**
- **Order history** - paginated list of past orders across groups (group code, date, order details)
- **Recipes** - saved recipes with load/edit/delete. "Use recipe" pre-fills form via URL param
- **Settings** - preferred language, default name/nickname (auto-fills order form)

---

## Project Structure

```
city-kebab/
  app/
    [locale]/
      layout.tsx
      page.tsx
      group/[code]/page.tsx
      sign-in/[[...sign-in]]/page.tsx
      sign-up/[[...sign-up]]/page.tsx
      dashboard/
        layout.tsx
        page.tsx
        recipes/page.tsx
        settings/page.tsx
  components/
    ui/                        # shadcn/ui components
    header.tsx                 # Shared header
    order-form.tsx             # Kebab order form (reused)
    order-list.tsx             # Orders display
    sms-modal.tsx              # SMS format modal
    recipe-modal.tsx           # Save/load recipe modals
    language-switcher.tsx
  lib/
    actions/                   # Server Actions
    queries/                   # Data fetching
    db.ts                      # Prisma client
    utils.ts
    utils/generate-code.ts
  prisma/
    schema.prisma
  messages/
    hr.json
    en.json
  middleware.ts                # Clerk + next-intl middleware
  i18n/
    routing.ts
    request.ts
  public/
    icon-192x192.svg
    icon-512x512.png
  Dockerfile
  docker-compose.yml           # Local dev (postgres)
  next.config.ts
  package.json
  .env.example
```

---

## Deployment

**Dockerfile** (multi-stage):
1. `deps` stage - install dependencies
2. `builder` stage - generate Prisma client, build Next.js
3. `runner` stage - production image with standalone output

**Next.js config:** `output: "standalone"` for Docker.

**Environment variables (Coolify):**
```
DATABASE_URL=postgresql://user:pass@host:5432/citykebab
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_APP_URL=https://kebab.ilijaleko.com
```

**Prisma migrations:** `prisma migrate deploy` runs as part of deploy pipeline.

**docker-compose.yml** for local development spins up a Postgres container.

---

## Kebab Menu (preserved from current app)

**Types:** pecivo, tortilja, vegetarijanski, tortilja mix salata
**Sizes:** mali, veliki (only for pecivo, tortilja)
**Sauces:** ljuti, ljuti (malo manje), blagi, blagi (malo manje), mix, mix (malo manje)
**Addons:** luk, rajcica, zelena salata, kupus, kukuruz, krastavci
**Cheese:** yes/no (only for pecivo, tortilja)

---

## Implementation Order

1. **Project setup** - Next.js 16+, TypeScript, Tailwind v4, shadcn/ui, ESLint
2. **Docker + local dev** - Dockerfile, docker-compose.yml with Postgres
3. **Prisma schema + migrations** - database setup
4. **i18n setup** - next-intl config, message files, middleware
5. **Public pages** - Home (create/join group), Group page (order form, order list, SMS modal)
6. **Clerk auth** - middleware, sign-in/sign-up pages, header integration
7. **Protected features** - order edit/delete on group page for signed-in users
8. **Dashboard** - order history, recipes CRUD, settings
9. **Theme** - dark/light mode with next-themes
10. **Polish** - error handling, loading states, responsive design, PWA consideration
