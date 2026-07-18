# GradPath — Project Guide for Claude Code

> This file is read automatically by Claude Code at the start of every session.
> Keep it accurate and concise. It is the single source of truth for how this project is built.

---

## 1. Overview

**GradPath** is a web application that helps students find postgraduate scholarships and degree
programs (Master's and PhD) in **Australia** after graduation. It matches a student's academic
profile to suitable universities and courses, tracks their applications and documents, and
surfaces relevant scholarships.

There are **two roles**:

- **Student** — the primary user. Browses universities/courses/scholarships, gets AI-powered
  recommendations (premium only), and manages their own applications and documents.
- **Admin** — manages the catalog (universities, courses, scholarships), users, and subscriptions.

The interface uses a **yellow accent theme** (see Design section) and should feel clean, modern,
trustworthy, and academic.

---

## 2. Tech stack

- **Frontend:** React + TypeScript (use **Vite** for fast setup). Routing with `react-router-dom`.
  State with React Query (server state) + Context (auth). Styling with **Tailwind CSS**.
- **Backend:** Django + **Django REST Framework** (JSON API consumed by the React app — this is an
  API/SPA architecture, not Django templates).
- **Auth:** JWT (via `djangorestframework-simplejwt`).
- **Database:** PostgreSQL.
- **AI features:** Use an **LLM API** (e.g. Anthropic Claude API) for profile→course matching and
  for summarizing course details, rather than training a custom ML model from scratch — there is no
  training dataset available, and an LLM gives better results faster for this use case. See the
  "AI features" section for the pragmatic approach.
- **Payments:** **Stripe in test mode** for the premium upgrade (test keys only — no real money).

> The brief mentioned "a machine learning model." For an academic deadline, an LLM-based
> recommendation is the realistic, defensible choice. If your rubric specifically requires a
> trained ML model, note it and we can add a simple scikit-learn similarity model as an alternative
> matcher — but treat that as a later enhancement, not part of the MVP.

---

## 3. Project structure

```
GradPath/
├── CLAUDE.md                  # this file
├── .gitignore
├── backend/
│   ├── .env                   # secrets — NEVER commit (see Security)
│   ├── .env.example           # committed template, no real values
│   ├── manage.py
│   ├── requirements.txt
│   ├── gradpath/              # Django project (settings, urls, wsgi)
│   └── apps/
│       ├── accounts/          # custom user, profiles, auth
│       ├── catalog/           # universities, courses, scholarships
│       ├── applications/      # application tracker, document checklist
│       ├── recommendations/   # AI matching endpoints
│       └── billing/           # Stripe / premium subscriptions
└── frontend/
    ├── .env                   # frontend env (API base URL, Stripe pk)
    ├── index.html
    ├── package.json
    └── src/
        ├── assets/            # logo lives here (see Logo section)
        ├── components/        # reusable UI (Button, Card, Sidebar, etc.)
        ├── layouts/           # DashboardLayout with left-side menu
        ├── pages/             # one folder per route
        ├── features/          # auth, catalog, tracker, documents, billing
        ├── lib/               # api client, query hooks
        └── context/           # AuthContext
```

---

## 4. Security (read carefully)

- **Never** hard-code database credentials, secret keys, Stripe keys, or LLM API keys in source
  files or in this document. Load them from environment variables.
- All secrets live in `backend/.env` and `frontend/.env`, both listed in `.gitignore`.
- Commit a `.env.example` with the **keys only** (no values) so others know what's required.
- Django reads env vars via `python-decouple` or `os.environ`.

`backend/.env.example` (committed — placeholders only):

```
SECRET_KEY=
DEBUG=True
DB_NAME=GradPathV2
DB_USER=postgres
DB_PASSWORD=nimansala
DB_HOST=localhost
DB_PORT=5432
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

The actual `backend/.env` (NOT committed) holds the real values, including the Postgres password.
The database name is **GradPathV2**, user **postgres**, host **localhost**, port **5432**.

---

## 5. Data models (Django)

- **User** (custom, extends `AbstractUser`): `role` (`student` | `admin`), `is_premium` (bool),
  email used as login.
- **StudentProfile** (1–1 with User): `field_of_study`, `current_degree`, `gpa`, `graduation_year`,
  `target_level` (`masters` | `phd`), `ielts_score`, `gre_score`, `work_experience_years`,
  `preferred_intake`, `bio`, `country_of_origin`.
- **University**: `name`, `country` (default Australia), `world_ranking`, `city`, `logo_url`,
  `description`, `website_url`.
- **Course**: FK→University, `title`, `level` (`masters` | `phd`), `field`, `duration`,
  `tuition_fee`, `requirements`, `description`, `application_url` (link to the real application page).
- **Scholarship**: `name`, `type` (`full` | `partial` | `full_ride`), `amount`, `eligibility`,
  `deadline`, `link`, optional FK→University.
- **ApplicationTracker**: FK→User, FK→Course, `status`
  (`hope_to_apply` | `not_yet` | `applied` | `interviewed` | `rejected` | `accepted` | `waitlisted`),
  `notes`, `applied_date`, `deadline`.
- **DocumentItem**: FK→User, `doc_type` (`sop` | `visa` | `passport` | `transcript` | `cv` | `other`),
  `file` (upload), `status`, `uploaded_at`.
- **Subscription**: FK→User, `plan`, `status`, `stripe_customer_id`, `stripe_subscription_id`,
  `started_at`, `expires_at`.

---

## 6. Student features (left-side menu order)

1. **Landing page** (public): hero explaining GradPath, key features, testimonials/stats, and
   clear Register / Login calls to action.
2. **Auth**: Register + Login, then redirect into the dashboard.
3. **Dashboard** (menu item 1): greeting, **AI-suggested degrees matching the profile**
   (premium only — non-premium users see a blurred preview + "Upgrade to Premium" prompt),
   **upcoming deadlines** pulled from the application tracker, and quick stats.
4. **Universities** (menu item 2): AI-suggested universities (premium), search + filter, each card
   showing ranking and key details before the user clicks in. Clicking a university lists its
   **Master's and PhD courses** with filters; clicking a course shows full details (AI-assembled —
   see AI section) and a **link to the original application page**.
5. **Application Tracker** (menu item 3): add courses and manage status (hope to apply, not yet,
   applied, interviewed, rejected, accepted, waitlisted) with notes and deadlines.
6. **Document Checklist** (menu item 4): track required documents (SOP, visa, passport, transcript,
   etc.), **upload and delete** files, mark complete.
7. **Scholarships** (menu item 5): search/filter scholarships by type (fully free / partial /
   full-ride) and field.
8. **My Account**: edit the student profile (the academic fields the AI matcher uses).
9. **Premium upgrade**: Stripe-test-mode checkout that flips `is_premium` to true on success.

**Premium gating:** AI suggestions (dashboard recommendations + suggested universities) are premium
only. Everything else is available to all logged-in students.

---

## 7. Admin features

- Secure admin area (role-gated; Django admin can back the MVP, a custom React admin panel is a
  later enhancement).
- CRUD for **Universities**, **Courses**, and **Scholarships** (the catalog students browse).
- **User management**: view students, see/toggle premium status.
- **Subscription overview**: view active premium subscriptions.
- **Dashboard stats**: total students, premium count, most-tracked courses.

---

## 8. AI features (pragmatic approach)

- **Profile → course matching (premium):** send the student's profile fields and the available
  course list to the LLM API; ask it to return a ranked JSON list of best-fit courses with a short
  reason for each. Cache the result so you don't call the API on every page load.
- **Course detail assembly:** the brief asks to pull course details "from the internet using AI."
  Live scraping is fragile and slow for a demo. **For the MVP, seed the database with realistic
  sample universities/courses/scholarships** (Claude Code can generate this seed data). Keep the
  `application_url` pointing to the real institution page. A live-fetch enhancement can come later.
- Always return **structured JSON** from the LLM and validate it before use. Never block the UI on
  an API call — show a loading state and handle failures gracefully.

---

## 9. Design

- **Theme:** yellow accent. Suggested palette — primary `#FFC107` (amber), deep accent `#F59E0B`,
  near-black text `#1F2937`, soft background `#FFFDF5`, white cards. Keep it warm but readable;
  use yellow for highlights/CTAs, not large text blocks (contrast).
- Clean academic feel: generous spacing, rounded cards, a fixed **left-side navigation menu** in the
  dashboard layout, responsive on mobile and desktop.
- Accessibility: semantic HTML, alt text, sufficient contrast (don't put yellow text on white).

---

## 10. Logo

The logo file is at `D:\GradPath5\resources\GradPath_logo.png`.
**Copy it into `frontend/src/assets/GradPath_logo.png`** and import it from there — do not reference
the absolute Windows path in code (it isn't portable). Use it in the landing page header and the
dashboard sidebar.

---

## 11. Conventions

- TypeScript on the frontend; type all API responses.
- REST endpoints under `/api/`, e.g. `/api/courses/`, `/api/tracker/`, `/api/recommendations/`.
- Use DRF serializers + viewsets; paginate list endpoints.
- Frontend talks to the API through one typed client in `src/lib/api.ts`.
- Keep components small and reusable. No secrets in the frontend except the Stripe **publishable**
  key (safe to expose) and the API base URL.

---

## 12. Build plan (phased — MVP first)

**Phase 1 — Foundation (do this first):**
scaffold backend + frontend, configure Postgres via `.env`, custom User model, JWT auth,
register/login pages, dashboard layout with the left-side menu, landing page.

**Phase 2 — Core catalog:**
University / Course / Scholarship models + API + seed data; Universities page (search/filter),
university → courses → course detail with the real application link; Scholarships page.

**Phase 3 — Student tools:**
Application Tracker (add courses, change status), Document Checklist (upload/delete), My Account
profile editing.

**Phase 4 — Premium + AI:**
Stripe test-mode checkout flips `is_premium`; AI recommendation endpoint; premium gating on the
dashboard suggestions and suggested universities.

**Phase 5 — Admin + polish:**
Admin catalog CRUD and user/subscription views; responsive polish; empty/loading/error states.

> Aim to get Phases 1–3 working and demoable today. Phases 4–5 are the "wow" features to add next.

---

## 13. How I want Claude Code to work here

- Work **one phase at a time**. Use **Plan mode** and show me the plan before writing code.
- After each phase, tell me exactly how to run and test it.
- Never commit `.env`; keep secrets out of all tracked files and out of this document.
- If something in this file is ambiguous, ask before guessing on anything that affects the schema
  or the API contract.