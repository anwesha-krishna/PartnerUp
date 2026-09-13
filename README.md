# PartnerUp

A student-partner-finder web app built for GCSRM Recruitment 2026 (Web Development Track, Option B).

PartnerUp helps university students find hackathon teammates and project collaborators based on skills, availability, and interests, using a weighted matching engine.

## What's new for this submission

The frontend UI (candidate cards, matching dashboard, dark theme, layout) is adapted from an earlier personal project of mine, ProjectMatch, built during the PromptWars x F.A.S.T SRM hackathon. For this submission, I rebuilt the entire backend and auth layer from scratch using Supabase:

- Real user authentication (sign up, login, session persistence) via Supabase Auth
- A `profiles` table with Row Level Security, so users can only edit their own data
- Profile data (bio, skills, department, availability, etc.) now persists in a real Postgres database instead of localStorage
- A working demo account for quick evaluator access, authenticated for real (not mocked)

## Tech Stack

- **Frontend:** React + Vite, Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Row Level Security)
- **Deployment:** Vercel

## Architecture Overview
```
src/
├── components/       # UI components (AuthModal, Navbar, CandidateCard, etc.)
├── context/
│   └── AuthContext.jsx   # Supabase auth + profile state management
├── lib/
│   └── supabaseClient.js # Supabase client initialization
├── utils/            # Sanitization and security helpers
└── data/             # Mock candidate data for the matching demo
```

**Auth flow:** `AuthModal` collects credentials → `AuthContext` calls Supabase Auth (`signUp` / `signInWithPassword`) → on success, a matching row is fetched or created in the `profiles` table → merged user object (auth + profile data) is exposed via `useAuth()` to the rest of the app.

**Data model:**
- `auth.users` (managed by Supabase) — email, password, session
- `public.profiles` — name, role, department, bio, skills, availability, socials, linked 1:1 to `auth.users.id`

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env.local` file with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Demo Access

Click **Quick Demo Login** on the sign-in screen for instant access without creating an account.
