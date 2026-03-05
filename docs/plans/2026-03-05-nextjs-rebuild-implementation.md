# City Kebab Next.js Rebuild - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the City Kebab group ordering app as a Next.js 16+ application with PostgreSQL, Clerk auth, and i18n support.

**Architecture:** Next.js App Router with Server Actions for mutations, Server Components for data fetching. Clerk middleware protects `/dashboard` routes. `next-intl` handles URL-based i18n with Croatian (default) and English. Prisma ORM connects to self-hosted PostgreSQL.

**Tech Stack:** Next.js 16+, TypeScript, Prisma, PostgreSQL, Clerk, next-intl, shadcn/ui, Tailwind CSS v4, Docker, Coolify

**Design doc:** `docs/plans/2026-03-05-nextjs-rebuild-design.md`

---

## Task 1: Clean up old project and scaffold Next.js

**Files:**
- Delete: All files in `src/`, `index.html`, `vite.config.js`, `eslint.config.js`, `jsconfig.json`, `.firebaserc`, `firebase.json`, `.firebase/`
- Keep: `docs/`, `public/icon-192x192.svg`, `public/icon-512x512.png`, `public/icon-512x512.svg`, `.github/`, `README.md`, `.git/`
- Create: Fresh Next.js project files

**Step 1: Create a branch for the rebuild**

```bash
git checkout -b feature/nextjs-rebuild
```

**Step 2: Remove old Vite/React/Firebase files**

Remove all old source files but keep `docs/`, `public/` icons, `.github/`, `README.md`:

```bash
rm -rf src/ .firebase/ .firebaserc firebase.json index.html vite.config.js eslint.config.js jsconfig.json components.json package.json package-lock.json node_modules/
```

**Step 3: Initialize Next.js project in the same directory**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
```

When prompted:
- Would you like to use `src/` directory? **No** (we use `app/` at root)
- Would you like to use App Router? **Yes**
- Would you like to use Turbopack? **Yes**

**Step 4: Verify the scaffold works**

```bash
npm run dev
```

Expected: Next.js dev server starts on http://localhost:3000 with the default page.

**Step 5: Clean up the default Next.js boilerplate**

Replace `app/layout.tsx` with a minimal layout:

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "City Kebab",
  description: "Grupna naruzba kebaba s prijateljima",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}
```

Replace `app/page.tsx` with a placeholder:

```tsx
// app/page.tsx
export default function Home() {
  return <h1>City Kebab - Coming Soon</h1>;
}
```

Delete `app/favicon.ico` (we have our own icons in `public/`).

**Step 6: Verify dev server still works**

```bash
npm run dev
```

Expected: Page shows "City Kebab - Coming Soon".

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 16+ project, remove old Vite/Firebase app"
```

---

## Task 2: Configure Tailwind CSS v4 + shadcn/ui

**Files:**
- Modify: `app/globals.css`
- Create: `components.json`
- Create: `lib/utils.ts`
- Create: `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/input.tsx`, `components/ui/select.tsx`, `components/ui/checkbox.tsx`

**Step 1: Set up globals.css with the existing theme variables**

Replace `app/globals.css` with the theme from the old app (`src/App.css`), adapted for Next.js:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.13 0.028 261.692);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.13 0.028 261.692);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.13 0.028 261.692);
  --primary: oklch(0.21 0.034 264.665);
  --primary-foreground: oklch(0.985 0.002 247.839);
  --secondary: oklch(0.967 0.003 264.542);
  --secondary-foreground: oklch(0.21 0.034 264.665);
  --muted: oklch(0.967 0.003 264.542);
  --muted-foreground: oklch(0.551 0.027 264.364);
  --accent: oklch(0.967 0.003 264.542);
  --accent-foreground: oklch(0.21 0.034 264.665);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.928 0.006 264.531);
  --input: oklch(0.928 0.006 264.531);
  --ring: oklch(0.707 0.022 261.325);
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}

.dark {
  --background: oklch(0.13 0.028 261.692);
  --foreground: oklch(0.985 0.002 247.839);
  --card: oklch(0.21 0.034 264.665);
  --card-foreground: oklch(0.985 0.002 247.839);
  --popover: oklch(0.21 0.034 264.665);
  --popover-foreground: oklch(0.985 0.002 247.839);
  --primary: oklch(0.928 0.006 264.531);
  --primary-foreground: oklch(0.21 0.034 264.665);
  --secondary: oklch(0.278 0.033 256.848);
  --secondary-foreground: oklch(0.985 0.002 247.839);
  --muted: oklch(0.278 0.033 256.848);
  --muted-foreground: oklch(0.707 0.022 261.325);
  --accent: oklch(0.278 0.033 256.848);
  --accent-foreground: oklch(0.985 0.002 247.839);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Step 2: Install tw-animate-css**

```bash
npm install tw-animate-css
```

**Step 3: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:
- Style: **New York**
- Base color: **Gray**
- CSS variables: **Yes**

This creates `components.json` and `lib/utils.ts`.

**Step 4: Add the required shadcn/ui components**

```bash
npx shadcn@latest add button card input select checkbox sonner
```

**Step 5: Verify by updating the placeholder page**

```tsx
// app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-orange-600">City Kebab</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Test Button
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

```bash
npm run dev
```

Expected: Orange-themed card with a button renders correctly.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: configure Tailwind CSS v4, shadcn/ui with existing theme"
```

---

## Task 3: Docker + local dev environment

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `.env.example`
- Modify: `.gitignore`
- Modify: `next.config.ts`

**Step 1: Create docker-compose.yml for local Postgres**

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: citykebab
      POSTGRES_PASSWORD: citykebab
      POSTGRES_DB: citykebab
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

**Step 2: Create .env.example**

```env
# Database
DATABASE_URL="postgresql://citykebab:citykebab@localhost:5432/citykebab"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/hr/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/hr/sign-up

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Step 3: Create .env.local from the example (not committed)**

```bash
cp .env.example .env.local
```

**Step 4: Update next.config.ts for standalone output**

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

**Step 5: Create Dockerfile (multi-stage)**

```dockerfile
# Dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Step 6: Update .gitignore**

Add to `.gitignore`:

```
# env
.env
.env.local
.env.production

# next
.next/
out/

# prisma
prisma/migrations/*.sql.bak

# docker
pgdata/
```

**Step 7: Start local Postgres and verify**

```bash
docker compose up -d db
docker compose ps
```

Expected: Postgres container running on port 5432.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Docker setup, docker-compose for local dev, env config"
```

---

## Task 4: Prisma schema + database migration

**Files:**
- Create: `prisma/schema.prisma`
- Create: `lib/db.ts`
- Create: `lib/utils/generate-code.ts`

**Step 1: Install Prisma**

```bash
npm install prisma --save-dev
npm install @prisma/client
```

**Step 2: Initialize Prisma**

```bash
npx prisma init
```

This creates `prisma/schema.prisma` and updates `.env` (we already have `.env.local`).

**Step 3: Write the schema**

Replace `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Group {
  id        String   @id @default(cuid())
  code      String   @unique
  creatorId String?
  createdAt DateTime @default(now())
  orders    Order[]
}

model Order {
  id        String   @id @default(cuid())
  groupId   String
  group     Group    @relation(fields: [groupId], references: [id], onDelete: Cascade)
  userId    String?
  name      String
  kebabType String
  kebabSize String?
  sauce     String
  hasCheese Boolean?
  adds      String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Recipe {
  id        String   @id @default(cuid())
  userId    String
  name      String
  userName  String?
  kebabType String
  kebabSize String?
  sauce     String
  hasCheese Boolean?
  adds      String[]
  createdAt DateTime @default(now())

  @@index([userId])
}
```

**Step 4: Run the initial migration**

Make sure Postgres is running (`docker compose up -d db`), then:

```bash
npx prisma migrate dev --name init
```

Expected: Migration created and applied. Output shows "Your database is now in sync with your schema."

**Step 5: Create Prisma client singleton**

```ts
// lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

**Step 6: Create short code generator**

```ts
// lib/utils/generate-code.ts
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No 0/O/1/I to avoid confusion

export function generateCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}
```

**Step 7: Verify Prisma Studio works**

```bash
npx prisma studio
```

Expected: Opens browser at http://localhost:5555 showing the 3 tables.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Prisma schema with Group, Order, Recipe models"
```

---

## Task 5: i18n setup with next-intl

**Files:**
- Create: `messages/hr.json`
- Create: `messages/en.json`
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Modify: `middleware.ts` (create)
- Modify: `next.config.ts`
- Restructure: `app/` into `app/[locale]/`

**Step 1: Install next-intl**

```bash
npm install next-intl
```

**Step 2: Create i18n routing config**

```ts
// i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["hr", "en"],
  defaultLocale: "hr",
});
```

**Step 3: Create i18n request config**

```ts
// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "hr" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

**Step 4: Create Croatian message file**

```json
// messages/hr.json
{
  "common": {
    "loading": "Ucitavanje...",
    "copy": "Kopiraj",
    "copied": "Kopirano!",
    "close": "Zatvori",
    "cancel": "Odustani",
    "save": "Spremi",
    "delete": "Obrisi",
    "edit": "Uredi",
    "back": "Natrag",
    "home": "Pocetna",
    "signIn": "Prijavi se",
    "signUp": "Registriraj se"
  },
  "home": {
    "title": "City Kebab naruzba",
    "subtitle": "Pokreni ili se pridruzi grupnoj naruzbi s prijateljima",
    "createOrder": "Kreiraj naruzbu",
    "creating": "Stvaranje...",
    "joinGroup": "Pridruzi se grupi",
    "joining": "Pretrazivanje...",
    "enterGroupId": "Unesite kod grupe",
    "groupNotFound": "Grupa s kodom \"{code}\" ne postoji.",
    "createNewInstead": "Stvori novu grupu umjesto toga",
    "howItWorks": "Kako funkcionira naruzba?",
    "step1Title": "Kreiraj naruzbu i pozovi prijatelje",
    "step1Desc": "Stvori grupnu naruzbu i podijeli kod ili poveznicu s prijateljima kako bi se mogli pridruziti.",
    "step2Title": "Provjeri je li City Kebab dostupan",
    "step2Desc": "Nazovi restoran, potvrdi da primaju naruzbe i zatrazi SMS naruzbu.",
    "step3Title": "Posalji SMS naruzbu",
    "step3Desc": "Kopiraj generirani SMS iz grupe i posalji ga na broj restorana.",
    "step4Title": "Preuzmi svoju naruzbu",
    "step4Desc": "Preuzmi naruzbu u City Kebabu u dogovoreno vrijeme. Sve ce biti spremno za preuzimanje.",
    "madeBy": "Made with love by"
  },
  "group": {
    "title": "Grupna naruzba",
    "subtitle": "Dodajte svoju kebab naruzbu u grupu",
    "copyLink": "Kopiraj poveznicu",
    "linkCopied": "Poveznica kopirana!",
    "groupCode": "Kod grupe",
    "shareLink": "Posalji ovu poveznicu prijateljima kako bi dodali svoj kebab u zajednicku naruzbu.",
    "addOrder": "Dodaj naruzbu",
    "adding": "Dodavanje...",
    "orderAdded": "Naruzba dodana!",
    "orders": "Naruzbe",
    "noOrders": "Jos nema naruzbi. Budite prvi!",
    "generateSms": "Generiraj SMS format",
    "smsTitle": "SMS Format",
    "smsSubtitle": "Kopirajte ovaj tekst i posaljite SMS-om",
    "copySms": "Kopiraj u medusprenik",
    "smsCopied": "SMS format kopiran!",
    "notFound": "Ups! Grupa nije pronadena",
    "notFoundDesc": "Izgleda da ova grupa ne postoji ili je mozda obrisana. Provjerite poveznicu ili stvorite novu grupu.",
    "goHome": "Idite na pocetnu",
    "tryAgain": "Pokusajte ponovo"
  },
  "kebab": {
    "name": "Ime ili nadimak",
    "namePlaceholder": "Vase ime ili nadimak",
    "type": "Vrsta kebaba",
    "typePlaceholder": "Odaberite vrstu kebaba",
    "sauce": "Umak",
    "saucePlaceholder": "Odaberite umak",
    "size": "Velicina kebaba",
    "sizePlaceholder": "Odaberite velicinu",
    "cheese": "Sir",
    "cheeseYes": "Da",
    "cheeseNo": "Ne",
    "addons": "Dodaci (neobavezno):",
    "addonsAll": "Sve",
    "types": {
      "pecivo": "Pecivo",
      "tortilja": "Tortilja",
      "vegetarijanski": "Vegetarijanski",
      "tortilja_mix_salata": "Tortilja mix salata"
    },
    "sizes": {
      "mali": "Mali",
      "veliki": "Veliki"
    },
    "sauces": {
      "ljuti": "Ljuti",
      "ljuti_manje": "Ljuti (malo manje)",
      "blagi": "Blagi",
      "blagi_manje": "Blagi (malo manje)",
      "mix": "Mix",
      "mix_manje": "Mix (malo manje)"
    },
    "adds": {
      "luk": "Luk",
      "rajcica": "Rajcica",
      "zelena_salata": "Zelena salata",
      "kupus": "Kupus",
      "kukuruz": "Kukuruz",
      "krastavci": "Krastavci"
    },
    "validation": {
      "nameRequired": "Molimo unesite ime.",
      "typeRequired": "Molimo odaberite vrstu kebaba.",
      "sizeRequired": "Molimo odaberite velicinu.",
      "sauceRequired": "Molimo odaberite umak."
    }
  },
  "recipe": {
    "save": "Spremi recept",
    "myRecipes": "Moji recepti",
    "saveTitle": "Spremi recept",
    "saveSubtitle": "Spremite trenutnu konfiguraciju kebaba kao recept",
    "recipeName": "Ime recepta",
    "recipeNamePlaceholder": "npr. Moj omiljeni kebab",
    "preview": "Pregled recepta:",
    "saved": "Recept je uspjesno spremljen!",
    "deleted": "Recept \"{name}\" je obrisan!",
    "loaded": "Recept \"{name}\" je ucitan!",
    "noRecipes": "Jos nemate spremljenih recepata",
    "load": "Ucitaj",
    "chooseRecipe": "Odaberite svoj omiljeni recept"
  },
  "dashboard": {
    "title": "Upravljacka ploca",
    "history": "Povijest naruzbi",
    "historyDesc": "Pregled svih vasih proslosih naruzbi",
    "recipes": "Moji recepti",
    "recipesDesc": "Upravljajte spremljenim receptima",
    "settings": "Postavke",
    "settingsDesc": "Prilagodite svoje korisnicke postavke",
    "noHistory": "Nemate jos naruzbi.",
    "defaultName": "Zadano ime/nadimak",
    "defaultNameDesc": "Automatski popunjava polje za ime kod narucivanja",
    "preferredLanguage": "Preferirani jezik",
    "settingsSaved": "Postavke spremljene!"
  }
}
```

**Step 5: Create English message file**

```json
// messages/en.json
{
  "common": {
    "loading": "Loading...",
    "copy": "Copy",
    "copied": "Copied!",
    "close": "Close",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "back": "Back",
    "home": "Home",
    "signIn": "Sign in",
    "signUp": "Sign up"
  },
  "home": {
    "title": "City Kebab Order",
    "subtitle": "Start or join a group order with friends",
    "createOrder": "Create order",
    "creating": "Creating...",
    "joinGroup": "Join group",
    "joining": "Searching...",
    "enterGroupId": "Enter group code",
    "groupNotFound": "Group with code \"{code}\" does not exist.",
    "createNewInstead": "Create a new group instead",
    "howItWorks": "How does ordering work?",
    "step1Title": "Create an order and invite friends",
    "step1Desc": "Create a group order and share the code or link with friends so they can join.",
    "step2Title": "Check if City Kebab is available",
    "step2Desc": "Call the restaurant, confirm they accept orders and request SMS ordering.",
    "step3Title": "Send SMS order",
    "step3Desc": "Copy the generated SMS from the group and send it to the restaurant number.",
    "step4Title": "Pick up your order",
    "step4Desc": "Pick up the order at City Kebab at the agreed time. Everything will be ready.",
    "madeBy": "Made with love by"
  },
  "group": {
    "title": "Group Order",
    "subtitle": "Add your kebab order to the group",
    "copyLink": "Copy link",
    "linkCopied": "Link copied!",
    "groupCode": "Group code",
    "shareLink": "Send this link to friends so they can add their kebab to the group order.",
    "addOrder": "Add order",
    "adding": "Adding...",
    "orderAdded": "Order added!",
    "orders": "Orders",
    "noOrders": "No orders yet. Be the first!",
    "generateSms": "Generate SMS format",
    "smsTitle": "SMS Format",
    "smsSubtitle": "Copy this text and send it via SMS",
    "copySms": "Copy to clipboard",
    "smsCopied": "SMS format copied!",
    "notFound": "Oops! Group not found",
    "notFoundDesc": "This group doesn't exist or may have been deleted. Check the link or create a new group.",
    "goHome": "Go to homepage",
    "tryAgain": "Try again"
  },
  "kebab": {
    "name": "Name or nickname",
    "namePlaceholder": "Your name or nickname",
    "type": "Kebab type",
    "typePlaceholder": "Select kebab type",
    "sauce": "Sauce",
    "saucePlaceholder": "Select sauce",
    "size": "Kebab size",
    "sizePlaceholder": "Select size",
    "cheese": "Cheese",
    "cheeseYes": "Yes",
    "cheeseNo": "No",
    "addons": "Add-ons (optional):",
    "addonsAll": "All",
    "types": {
      "pecivo": "Bread roll",
      "tortilja": "Tortilla",
      "vegetarijanski": "Vegetarian",
      "tortilja_mix_salata": "Tortilla mix salad"
    },
    "sizes": {
      "mali": "Small",
      "veliki": "Large"
    },
    "sauces": {
      "ljuti": "Hot",
      "ljuti_manje": "Hot (less)",
      "blagi": "Mild",
      "blagi_manje": "Mild (less)",
      "mix": "Mix",
      "mix_manje": "Mix (less)"
    },
    "adds": {
      "luk": "Onion",
      "rajcica": "Tomato",
      "zelena_salata": "Lettuce",
      "kupus": "Cabbage",
      "kukuruz": "Corn",
      "krastavci": "Cucumber"
    },
    "validation": {
      "nameRequired": "Please enter your name.",
      "typeRequired": "Please select a kebab type.",
      "sizeRequired": "Please select a size.",
      "sauceRequired": "Please select a sauce."
    }
  },
  "recipe": {
    "save": "Save recipe",
    "myRecipes": "My recipes",
    "saveTitle": "Save Recipe",
    "saveSubtitle": "Save current kebab configuration as a recipe",
    "recipeName": "Recipe name",
    "recipeNamePlaceholder": "e.g. My favorite kebab",
    "preview": "Recipe preview:",
    "saved": "Recipe saved successfully!",
    "deleted": "Recipe \"{name}\" deleted!",
    "loaded": "Recipe \"{name}\" loaded!",
    "noRecipes": "You don't have any saved recipes yet",
    "load": "Load",
    "chooseRecipe": "Choose your favorite recipe"
  },
  "dashboard": {
    "title": "Dashboard",
    "history": "Order History",
    "historyDesc": "View all your past orders",
    "recipes": "My Recipes",
    "recipesDesc": "Manage your saved recipes",
    "settings": "Settings",
    "settingsDesc": "Customize your user preferences",
    "noHistory": "You don't have any orders yet.",
    "defaultName": "Default name/nickname",
    "defaultNameDesc": "Auto-fills the name field when ordering",
    "preferredLanguage": "Preferred language",
    "settingsSaved": "Settings saved!"
  }
}
```

**Step 6: Create middleware.ts**

```ts
// middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(hr|en)/:path*"],
};
```

**Step 7: Update next.config.ts for next-intl**

```ts
// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
};

export default withNextIntl(nextConfig);
```

**Step 8: Restructure app/ to use [locale]**

Move `app/page.tsx` and `app/layout.tsx` into the locale structure:

Create `app/[locale]/layout.tsx`:

```tsx
// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  title: "City Kebab",
  description: "Grupna naruzba kebaba s prijateljima",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "hr" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

Create `app/[locale]/page.tsx`:

```tsx
// app/[locale]/page.tsx
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-slate-800">
      <h1 className="text-3xl font-bold text-orange-600">{t("title")}</h1>
    </div>
  );
}
```

Remove the old `app/layout.tsx` and `app/page.tsx` (they are now under `[locale]/`). Keep `app/globals.css` at the root `app/` level.

**Step 9: Verify i18n works**

```bash
npm run dev
```

Visit:
- `http://localhost:3000/hr` - Expected: "City Kebab naruzba"
- `http://localhost:3000/en` - Expected: "City Kebab Order"
- `http://localhost:3000/` - Expected: Redirects to `/hr`

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: add next-intl i18n with Croatian and English locales"
```

---

## Task 6: Theme provider (dark/light mode)

**Files:**
- Create: `components/theme-provider.tsx`
- Create: `components/theme-toggle.tsx`
- Modify: `app/[locale]/layout.tsx`

**Step 1: Install next-themes**

```bash
npm install next-themes
```

**Step 2: Create theme provider**

```tsx
// components/theme-provider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Step 3: Create theme toggle (port from existing)**

```tsx
// components/theme-toggle.tsx
"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const icon =
    theme === "dark" ? (
      <Moon className="h-full w-full" />
    ) : theme === "light" ? (
      <Sun className="h-full w-full" />
    ) : (
      <Monitor className="h-full w-full" />
    );

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="h-10 w-10 sm:h-9 sm:w-9 p-2 touch-manipulation cursor-pointer"
    >
      <div className="h-5 w-5 sm:h-4 sm:w-4">{icon}</div>
    </Button>
  );
}
```

**Step 4: Add ThemeProvider to locale layout**

Update `app/[locale]/layout.tsx` - wrap children with `ThemeProvider`:

```tsx
// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";

export const metadata: Metadata = {
  title: "City Kebab",
  description: "Grupna naruzba kebaba s prijateljima",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "hr" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey="city-kebab-theme"
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Step 5: Verify theme toggle works**

Add `<ThemeToggle />` to the test page temporarily and verify dark/light toggle works.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add dark/light/system theme with next-themes"
```

---

## Task 7: Shared header + language switcher

**Files:**
- Create: `components/language-switcher.tsx`
- Create: `components/header.tsx`

**Step 1: Install lucide-react if not already**

```bash
npm install lucide-react
```

**Step 2: Create language switcher**

```tsx
// components/language-switcher.tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <Select value={locale} onValueChange={switchLocale}>
      <SelectTrigger className="w-[70px] h-9 cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="hr">HR</SelectItem>
        <SelectItem value="en">EN</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

**Step 3: Create shared header**

```tsx
// components/header.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

type HeaderProps = {
  showBack?: boolean;
  backHref?: string;
};

export function Header({ showBack = false, backHref }: HeaderProps) {
  const t = useTranslations("common");
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("home")}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );
}
```

Note: Clerk auth buttons will be added to this header in Task 9.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add shared header with language switcher and theme toggle"
```

---

## Task 8: Public pages - Home and Group

This is the largest task. It ports the existing Home and Group functionality.

**Files:**
- Create: `lib/actions/groups.ts`
- Create: `lib/actions/orders.ts`
- Create: `lib/queries/groups.ts`
- Create: `lib/kebab-config.ts` (shared kebab menu data)
- Create: `lib/validations.ts` (zod schemas)
- Modify: `app/[locale]/page.tsx` (Home page)
- Create: `app/[locale]/group/[code]/page.tsx` (Group page)
- Create: `components/order-form.tsx`
- Create: `components/order-list.tsx`
- Create: `components/sms-modal.tsx`

**Step 1: Install zod**

```bash
npm install zod
```

**Step 2: Create kebab configuration constants**

```ts
// lib/kebab-config.ts
export const KEBAB_TYPES = [
  "pecivo",
  "tortilja",
  "vegetarijanski",
  "tortilja mix salata",
] as const;

export const KEBAB_SIZES = ["mali", "veliki"] as const;

export const SAUCE_OPTIONS = [
  "ljuti",
  "ljuti (malo manje)",
  "blagi",
  "blagi (malo manje)",
  "mix",
  "mix (malo manje)",
] as const;

export const KEBAB_ADDS = [
  "luk",
  "rajcica",
  "zelena salata",
  "kupus",
  "kukuruz",
  "krastavci",
] as const;

export const ADDONS_EMOJIS: Record<string, string> = {
  luk: "🧅",
  rajcica: "🍅",
  "zelena salata": "🥬",
  kupus: "🥦",
  kukuruz: "🌽",
  krastavci: "🥒",
};

export type KebabType = (typeof KEBAB_TYPES)[number];

export function shouldShowSize(type: string): boolean {
  return !!type && type !== "tortilja mix salata" && type !== "vegetarijanski";
}

export function shouldShowCheese(type: string): boolean {
  return !!type && (type === "pecivo" || type === "tortilja");
}
```

**Step 3: Create zod validation schemas**

```ts
// lib/validations.ts
import { z } from "zod";
import { KEBAB_TYPES, SAUCE_OPTIONS, KEBAB_SIZES, KEBAB_ADDS } from "./kebab-config";

export const createGroupSchema = z.object({
  creatorId: z.string().nullable().optional(),
});

export const addOrderSchema = z.object({
  groupCode: z.string().min(1),
  name: z.string().min(1).max(30),
  kebabType: z.enum(KEBAB_TYPES),
  kebabSize: z.enum(KEBAB_SIZES).nullable(),
  sauce: z.enum(SAUCE_OPTIONS),
  hasCheese: z.boolean().nullable(),
  adds: z.array(z.enum(KEBAB_ADDS)),
  userId: z.string().nullable().optional(),
});

export const updateOrderSchema = z.object({
  orderId: z.string().min(1),
  name: z.string().min(1).max(30),
  kebabType: z.enum(KEBAB_TYPES),
  kebabSize: z.enum(KEBAB_SIZES).nullable(),
  sauce: z.enum(SAUCE_OPTIONS),
  hasCheese: z.boolean().nullable(),
  adds: z.array(z.enum(KEBAB_ADDS)),
});

export const deleteOrderSchema = z.object({
  orderId: z.string().min(1),
});
```

**Step 4: Create group queries**

```ts
// lib/queries/groups.ts
import { db } from "@/lib/db";

export async function getGroupByCode(code: string) {
  return db.group.findUnique({
    where: { code },
    include: {
      orders: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function groupExists(code: string) {
  const group = await db.group.findUnique({
    where: { code },
    select: { id: true },
  });
  return !!group;
}
```

**Step 5: Create group server actions**

```ts
// lib/actions/groups.ts
"use server";

import { db } from "@/lib/db";
import { generateCode } from "@/lib/utils/generate-code";
import { redirect } from "next/navigation";

export async function createGroup(locale: string, creatorId?: string | null) {
  let code = generateCode();

  // Ensure uniqueness
  let existing = await db.group.findUnique({ where: { code } });
  while (existing) {
    code = generateCode();
    existing = await db.group.findUnique({ where: { code } });
  }

  await db.group.create({
    data: {
      code,
      creatorId: creatorId ?? null,
    },
  });

  redirect(`/${locale}/group/${code}`);
}
```

**Step 6: Create order server actions**

```ts
// lib/actions/orders.ts
"use server";

import { db } from "@/lib/db";
import { addOrderSchema, deleteOrderSchema, updateOrderSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function addOrder(data: {
  groupCode: string;
  name: string;
  kebabType: string;
  kebabSize: string | null;
  sauce: string;
  hasCheese: boolean | null;
  adds: string[];
  userId?: string | null;
}) {
  const parsed = addOrderSchema.parse(data);

  const group = await db.group.findUnique({
    where: { code: parsed.groupCode },
  });

  if (!group) {
    throw new Error("Group not found");
  }

  await db.order.create({
    data: {
      groupId: group.id,
      userId: parsed.userId ?? null,
      name: parsed.name,
      kebabType: parsed.kebabType,
      kebabSize: parsed.kebabSize,
      sauce: parsed.sauce,
      hasCheese: parsed.hasCheese,
      adds: parsed.adds,
    },
  });

  revalidatePath(`/group/${parsed.groupCode}`);
}

export async function deleteOrder(orderId: string, userId: string) {
  const parsed = deleteOrderSchema.parse({ orderId });

  const order = await db.order.findUnique({ where: { id: parsed.orderId } });

  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Unauthorized");

  await db.order.delete({ where: { id: parsed.orderId } });

  const group = await db.group.findUnique({ where: { id: order.groupId } });
  if (group) revalidatePath(`/group/${group.code}`);
}

export async function updateOrder(
  data: {
    orderId: string;
    name: string;
    kebabType: string;
    kebabSize: string | null;
    sauce: string;
    hasCheese: boolean | null;
    adds: string[];
  },
  userId: string
) {
  const parsed = updateOrderSchema.parse(data);

  const order = await db.order.findUnique({ where: { id: parsed.orderId } });

  if (!order) throw new Error("Order not found");
  if (order.userId !== userId) throw new Error("Unauthorized");

  await db.order.update({
    where: { id: parsed.orderId },
    data: {
      name: parsed.name,
      kebabType: parsed.kebabType,
      kebabSize: parsed.kebabSize,
      sauce: parsed.sauce,
      hasCheese: parsed.hasCheese,
      adds: parsed.adds,
    },
  });

  const group = await db.group.findUnique({ where: { id: order.groupId } });
  if (group) revalidatePath(`/group/${group.code}`);
}
```

**Step 7: Build Home page**

Build `app/[locale]/page.tsx` - port from the existing `src/components/Home.jsx`. Use `useTranslations` for all strings. Use `createGroup` server action. The form for joining a group checks `groupExists` query and navigates to `/[locale]/group/[code]`.

This is a Client Component (`"use client"`) because it uses `useState` for the join form. Wrap the `createGroup` action call in a form.

The full implementation should match the current Home page layout:
- Card with title + subtitle
- "Create order" button → calls `createGroup` server action
- Divider "or"
- Input for group code + "Join group" button
- "Group not found" state with "create new" option
- "How it works" info section with 4 steps
- Footer with author link

**Step 8: Build order form component**

Create `components/order-form.tsx` as a Client Component. Port the form from `src/components/Group.jsx:439-659`. Uses `useTranslations("kebab")` for labels. Calls `addOrder` server action on submit. Props:

```ts
type OrderFormProps = {
  groupCode: string;
  userId?: string | null;
};
```

**Step 9: Build order list component**

Create `components/order-list.tsx` - displays the list of orders. Port from `src/components/Group.jsx:662-741`. Shows edit/delete buttons only when `userId` matches `order.userId`. Props:

```ts
type OrderListProps = {
  orders: Array<{
    id: string;
    name: string;
    kebabType: string;
    kebabSize: string | null;
    sauce: string;
    hasCheese: boolean | null;
    adds: string[];
    userId: string | null;
  }>;
  currentUserId?: string | null;
};
```

**Step 10: Build SMS modal component**

Create `components/sms-modal.tsx` - port from `src/components/Group.jsx:764-809`. Uses the `formatOrdersForSms` logic. Props:

```ts
type SmsModalProps = {
  orders: Array<{ ... }>;
  open: boolean;
  onClose: () => void;
};
```

**Step 11: Build Group page**

Create `app/[locale]/group/[code]/page.tsx` - Server Component that fetches the group data, renders order form, order list, and SMS button. Passes data to client components.

```tsx
// app/[locale]/group/[code]/page.tsx
import { getGroupByCode } from "@/lib/queries/groups";
import { notFound } from "next/navigation";
// ... imports

type Props = {
  params: Promise<{ locale: string; code: string }>;
};

export default async function GroupPage({ params }: Props) {
  const { locale, code } = await params;
  const group = await getGroupByCode(code);

  if (!group) {
    // Render "group not found" UI
  }

  return (
    // Header + OrderForm + OrderList + SMS button
  );
}
```

**Step 12: Verify the full public flow**

```bash
npm run dev
```

Test:
1. Visit `/hr` - Create a group -> redirects to `/hr/group/XXXXXX`
2. Add an order with all fields
3. Copy link, open in another tab, add another order
4. Generate SMS format, copy
5. Visit `/en` - same flow in English
6. Visit a non-existent group code -> shows not found UI

**Step 13: Commit**

```bash
git add -A
git commit -m "feat: add public Home and Group pages with ordering flow"
```

---

## Task 9: Clerk authentication

**Files:**
- Modify: `middleware.ts` (add Clerk)
- Create: `app/[locale]/sign-in/[[...sign-in]]/page.tsx`
- Create: `app/[locale]/sign-up/[[...sign-up]]/page.tsx`
- Modify: `components/header.tsx` (add auth buttons)
- Modify: `app/[locale]/layout.tsx` (add ClerkProvider)

**Step 1: Install Clerk**

```bash
npm install @clerk/nextjs
```

**Step 2: Add Clerk env vars to .env.local**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/hr/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/hr/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

You must create a Clerk app at https://dashboard.clerk.com first and get these keys.

**Step 3: Add ClerkProvider to locale layout**

Wrap children in `app/[locale]/layout.tsx` with `<ClerkProvider>`:

```tsx
import { ClerkProvider } from "@clerk/nextjs";

// Inside the component, wrap:
<ClerkProvider>
  <NextIntlClientProvider messages={messages}>
    <ThemeProvider ...>
      {children}
    </ThemeProvider>
  </NextIntlClientProvider>
</ClerkProvider>
```

**Step 4: Update middleware for Clerk + next-intl**

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/(hr|en)/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  return intlMiddleware(req);
});

export const config = {
  matcher: ["/", "/(hr|en)/:path*"],
};
```

**Step 5: Create sign-in page**

```tsx
// app/[locale]/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-slate-800">
      <SignIn />
    </div>
  );
}
```

**Step 6: Create sign-up page**

```tsx
// app/[locale]/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-slate-800">
      <SignUp />
    </div>
  );
}
```

**Step 7: Update header with auth buttons**

Modify `components/header.tsx` to show sign-in link or Clerk `<UserButton>`:

```tsx
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// In the right side of the header:
<SignedOut>
  <SignInButton mode="modal">
    <Button variant="outline" size="sm" className="cursor-pointer">
      {t("signIn")}
    </Button>
  </SignInButton>
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

**Step 8: Pass userId to order form and list**

In the Group page server component, get the current user:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
// Pass userId to OrderForm and OrderList
```

**Step 9: Verify auth flow**

1. Visit `/hr` - should see "Sign in" button in header
2. Click sign in -> Clerk modal appears
3. Sign in -> "Sign in" button replaced by user avatar
4. Visit a group -> add order -> order is linked to your userId
5. Visit `/hr/dashboard` while signed out -> redirected to sign in

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: add Clerk authentication with sign-in/sign-up and protected routes"
```

---

## Task 10: Protected features on Group page

**Files:**
- Modify: `components/order-list.tsx` (add edit/delete for own orders)
- Modify: `components/order-form.tsx` (add "save as recipe" for signed-in)
- Create: `lib/actions/recipes.ts`
- Create: `lib/queries/recipes.ts`
- Modify: `components/recipe-modal.tsx`

**Step 1: Add edit/delete to order list**

When `currentUserId` matches `order.userId`, show edit and delete buttons. Delete calls `deleteOrder` server action. Edit opens inline edit mode.

**Step 2: Create recipe server actions**

```ts
// lib/actions/recipes.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveRecipe(data: {
  name: string;
  userName?: string | null;
  kebabType: string;
  kebabSize: string | null;
  sauce: string;
  hasCheese: boolean | null;
  adds: string[];
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.recipe.create({
    data: {
      userId,
      name: data.name,
      userName: data.userName ?? null,
      kebabType: data.kebabType,
      kebabSize: data.kebabSize,
      sauce: data.sauce,
      hasCheese: data.hasCheese,
      adds: data.adds,
    },
  });

  revalidatePath("/dashboard/recipes");
}

export async function deleteRecipe(recipeId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const recipe = await db.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe || recipe.userId !== userId) throw new Error("Unauthorized");

  await db.recipe.delete({ where: { id: recipeId } });
  revalidatePath("/dashboard/recipes");
}
```

**Step 3: Create recipe queries**

```ts
// lib/queries/recipes.ts
import { db } from "@/lib/db";

export async function getUserRecipes(userId: string) {
  return db.recipe.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRecipeById(recipeId: string) {
  return db.recipe.findUnique({ where: { id: recipeId } });
}
```

**Step 4: Create recipe modal**

Port `components/recipe-modal.tsx` from the existing save/load recipe modals in `src/components/Group.jsx:812-1030`. Now calls `saveRecipe` server action instead of localStorage.

**Step 5: Verify protected features**

1. Sign in -> go to group -> add order -> see edit/delete buttons on your order
2. Open same group in incognito (no auth) -> no edit/delete buttons
3. Sign in -> fill kebab form -> click "Save recipe" -> saves to DB
4. Verify recipe appears in dashboard (next task)

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add edit/delete orders and save recipes for signed-in users"
```

---

## Task 11: Dashboard - Order history

**Files:**
- Create: `app/[locale]/dashboard/layout.tsx`
- Create: `app/[locale]/dashboard/page.tsx`
- Create: `lib/queries/orders.ts`

**Step 1: Create order history query**

```ts
// lib/queries/orders.ts
import { db } from "@/lib/db";

export async function getUserOrderHistory(userId: string, page = 1, perPage = 20) {
  const orders = await db.order.findMany({
    where: { userId },
    include: {
      group: {
        select: { code: true },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  const total = await db.order.count({ where: { userId } });

  return { orders, total, page, perPage };
}
```

**Step 2: Create dashboard layout**

```tsx
// app/[locale]/dashboard/layout.tsx
import { Header } from "@/components/header";
import { useLocale } from "next-intl";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <Header showBack backHref="/" />
        {children}
      </div>
    </div>
  );
}
```

**Step 3: Create order history page**

```tsx
// app/[locale]/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { getUserOrderHistory } from "@/lib/queries/orders";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function DashboardPage() {
  const { userId } = await auth();
  const t = await getTranslations("dashboard");

  if (!userId) return null; // Protected by middleware

  const { orders, total } = await getUserOrderHistory(userId);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-orange-600">{t("history")}</CardTitle>
          <CardDescription>{t("historyDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {t("noHistory")}
            </p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                // Render order card with group code, date, kebab details
                // Similar to order-list.tsx but with group code and date
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation cards to Recipes and Settings */}
    </div>
  );
}
```

**Step 4: Verify dashboard**

1. Sign in -> visit `/hr/dashboard`
2. Should show empty history initially
3. Go add some orders to groups while signed in
4. Return to dashboard -> orders appear with group codes and dates

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add dashboard with order history page"
```

---

## Task 12: Dashboard - Recipes page

**Files:**
- Create: `app/[locale]/dashboard/recipes/page.tsx`
- Create: `components/recipe-list.tsx`

**Step 1: Build recipes page**

```tsx
// app/[locale]/dashboard/recipes/page.tsx
import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";
import { getUserRecipes } from "@/lib/queries/recipes";
import { RecipeList } from "@/components/recipe-list";

export default async function RecipesPage() {
  const { userId } = await auth();
  const t = await getTranslations("recipe");

  if (!userId) return null;

  const recipes = await getUserRecipes(userId);

  return <RecipeList recipes={recipes} />;
}
```

**Step 2: Build recipe list component**

Client component that displays recipes with delete button. Each recipe shows a "Use recipe" button that navigates to a group with the recipe pre-filled via URL search params.

**Step 3: Verify recipes CRUD**

1. Sign in -> go to a group -> fill form -> save recipe
2. Visit `/hr/dashboard/recipes` -> recipe appears
3. Delete recipe -> removed
4. "Use recipe" -> navigates to group form pre-filled

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add dashboard recipes page with CRUD"
```

---

## Task 13: Dashboard - Settings page

**Files:**
- Create: `app/[locale]/dashboard/settings/page.tsx`

**Step 1: Build settings page**

Simple form with:
- Default name/nickname (stored in localStorage or a UserSettings model - localStorage is simpler and sufficient)
- Preferred language (links to the language switcher - switches locale)

```tsx
// app/[locale]/dashboard/settings/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function SettingsPage() {
  const t = useTranslations("dashboard");

  // defaultName stored in localStorage
  // On save, persist to localStorage

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-orange-600">{t("settings")}</CardTitle>
        <CardDescription>{t("settingsDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default name input */}
        {/* Language switcher */}
        {/* Save button */}
      </CardContent>
    </Card>
  );
}
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add dashboard settings page"
```

---

## Task 14: GitHub star component (port)

**Files:**
- Create: `components/github-star.tsx`
- Modify: `app/[locale]/page.tsx` (add to footer)
- Modify: `components/header.tsx` (add to group page header)

**Step 1: Port GitHubStar from existing app**

Convert `src/components/ui/github-star.jsx` to TypeScript. Same functionality - fetches star count from GitHub API.

**Step 2: Add to Home footer and Group header**

Same placement as the current app.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: port GitHub star component"
```

---

## Task 15: Polish and responsive design

**Files:**
- Various component tweaks

**Step 1: Review all pages on mobile**

Check all pages render correctly at 320px, 375px, 768px, 1024px widths.

**Step 2: Add loading states**

Create `app/[locale]/loading.tsx` and `app/[locale]/group/[code]/loading.tsx` with spinner animations matching the existing app.

**Step 3: Add error boundaries**

Create `app/[locale]/error.tsx` and `app/[locale]/group/[code]/error.tsx`.

**Step 4: Add Toaster**

Add `<Toaster />` from sonner to the locale layout for toast notifications.

**Step 5: Update public/ icons**

Ensure `public/icon-192x192.svg` and `public/icon-512x512.png` are preserved. Add a proper `app/icon.svg` or `app/favicon.ico`.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add loading states, error boundaries, responsive polish"
```

---

## Task 16: Update README and environment docs

**Files:**
- Modify: `README.md`
- Modify: `.env.example`

**Step 1: Rewrite README**

Update to reflect the new tech stack, setup instructions with Docker, Clerk configuration, etc.

**Step 2: Commit**

```bash
git add -A
git commit -m "docs: update README for Next.js rebuild"
```

---

## Task 17: Final verification and merge

**Step 1: Full build test**

```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 2: Docker build test**

```bash
docker build -t city-kebab .
```

Expected: Multi-stage build completes.

**Step 3: Lint check**

```bash
npm run lint
```

Expected: No errors.

**Step 4: Manual smoke test**

Run through the full flow:
1. Create group (anonymous) -> add order -> generate SMS -> copy
2. Sign in -> create group -> add order -> save recipe
3. Visit dashboard -> see order history -> see recipes
4. Switch language HR/EN on all pages
5. Toggle dark/light theme
6. Test on mobile viewport

**Step 5: Merge to main**

```bash
git checkout main
git merge feature/nextjs-rebuild
```

Or create a Pull Request for review.
