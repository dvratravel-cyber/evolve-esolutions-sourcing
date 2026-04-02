# Evolve ESolutions — AI Client Sourcing

AI-powered recruitment client sourcing platform built for Evolve ESolutions.

## Features

- 🔍 **AI Client Discovery** — search by industry or 18 specialist niches
- 🧠 **Deep Enrichment** — classified emails (Work/Personal) and phones (Direct/Mobile/Office/HQ)
- ✉️ **Multi-step Outreach** — AI-generated email sequences with Evolve's value proposition
- 📞 **Phone Outreach** — call scripts, SMS follow-ups, ElevenLabs voice notes
- 💼 **LinkedIn Outreach** — personalised connection notes (separate from email sequence)
- 🏷️ **Instantly.ai Integration** — push campaign drafts with merge tags
- 👥 **Multi-user** — admin and user roles, per-user lead ownership, activity log
- ⚙️ **Settings Manager** — manage niches, industries, users and API keys from the app

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

### 3. Deploy to Vercel

Connect this repo to [vercel.com](https://vercel.com) and deploy. No environment variables needed — all API keys are entered inside the app's Settings panel.

### 4. First login

Default admin credentials:
- **Username:** `evadmin`
- **Password:** `evolve2024`

**Change the password immediately** via Settings → Users → Reset pw.

### 5. Configure API keys (Settings → API Keys)

| Key | Where to get it | Required |
|-----|----------------|----------|
| Anthropic API key | [console.anthropic.com](https://console.anthropic.com) | ✅ Required on Vercel |
| ElevenLabs API key | [elevenlabs.io](https://elevenlabs.io) → Profile | For voice notes |
| Supabase URL + Key | [supabase.com](https://supabase.com) → Settings → API | For persistent DB |
| Apollo.io API key | [apollo.io](https://apollo.io) → Settings → API | For verified contacts |
| Instantly.ai API key | [instantly.ai](https://instantly.ai) → Settings → API | For campaign push |

### 6. Supabase setup (optional but recommended)

Run this SQL once in your Supabase SQL editor:

```sql
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  owner_id text,
  owner_name text,
  data jsonb,
  created_at timestamptz default now()
);

create table if not exists enrichments (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  company text,
  data jsonb,
  created_at timestamptz default now()
);

create table if not exists config (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  value jsonb,
  updated_at timestamptz default now()
);
```

## User roles

| Username prefix | Role | Access |
|----------------|------|--------|
| `evadmin...` | Admin | All leads, Settings, User management |
| `evuser...` | User | Own leads only, no Settings |

## Project structure

```
src/
  App.jsx        — full application (single file)
  main.jsx       — React entry point
  index.css      — Tailwind base styles
index.html
package.json
vite.config.js
tailwind.config.js
postcss.config.js
```

## Tech stack

- React 18 + Vite
- Tailwind CSS
- Claude API (Anthropic) — all AI generation
- ElevenLabs — voice notes
- Supabase — database
- Apollo.io — contact enrichment
- Instantly.ai — email campaign automation
