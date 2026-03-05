# City Kebab - Grupna Narudzba

> **Napravite grupnu naruzbu s prijateljima u City Kebabu - brzo, jednostavno i prakticno!**

[![Live Production](https://img.shields.io/badge/Live-kebab.ilijaleko.com-orange?style=for-the-badge)](https://kebab.ilijaleko.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## About

**City Kebab** is a web app for group kebab orders at City Kebab Bjelovar. Friends can organize, add their kebab combinations to a shared order, and generate SMS format for the restaurant.

### Features

- **Group orders** - Create groups with shareable short codes
- **SMS format** - Auto-generated SMS to send to the restaurant
- **User accounts** - Sign in with Clerk to save recipes and view order history
- **Saved recipes** - Save favorite kebab configurations to your account
- **Order history** - View all past orders in your dashboard
- **i18n** - Croatian and English language support
- **Dark/Light mode** - System, light, or dark theme
- **Responsive** - Works on all devices

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16+ (App Router) |
| Language | TypeScript |
| Auth | Clerk |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| UI | shadcn/ui + Tailwind CSS v4 |
| i18n | next-intl |
| Deployment | Docker + Coolify |

## Local Development

### Prerequisites

- Node.js 22+
- Docker (for PostgreSQL)
- Clerk account (for authentication)

### Setup

```bash
# Clone the repository
git clone https://github.com/ilijaleko/city-kebab.git
cd city-kebab

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Clerk keys

# Start PostgreSQL
docker compose up -d db

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

```env
DATABASE_URL="postgresql://citykebab:citykebab@localhost:5433/citykebab"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/hr/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/hr/sign-up
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Docker Build

```bash
docker build -t city-kebab .
docker run -p 3000:3000 --env-file .env.local city-kebab
```

## Contributing

1. Create an issue to discuss the feature/bug
2. Fork the repository
3. Create a feature branch (`git checkout -b feature/amazing-feature`)
4. Commit your changes
5. Push and open a Pull Request

## Author

**Ilija Leko**

- Website: [ilijaleko.com](https://ilijaleko.com)
- GitHub: [@ilijaleko](https://github.com/ilijaleko)

---

<div align="center">

[Live production](https://kebab.ilijaleko.com/) | [Report Bug](https://github.com/ilijaleko/city-kebab/issues)

</div>
