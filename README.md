# Campus 2 Career

A student success platform built for engineering colleges. It gives students, faculty, and placement coordinators a unified view of academic health, attendance, career readiness, and personalised AI-driven action plans — all in one place.

The platform is currently a working prototype with a full frontend and two live AI API endpoints backed by Google Gemini Flash.

---

## What it does

Students log in and land on a personalised dashboard that pulls together everything scattered across college systems — RFID attendance records, LMS submissions, coding diagnostic scores, and placement drives — into a single coherent picture. The AI analyses this data and generates a prioritised action plan: which subject needs immediate attention, which coding gaps block tier-1 recruiters, and which pending assignments are eating into internal marks.

Faculty get a parallel view: class attendance heat maps, at-risk student radar, gradebook analytics, and the ability to approve leave and OD requests without routing through paper.

The KPMG analytics module (admin-level) surfaces cohort benchmarks, a what-if score simulator, and an explainable AI engine so administrators can see exactly why a student was flagged and what intervention is recommended.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 with a custom design system |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| AI Backend | Google Gemini Flash (via REST, server-side) |
| QR Codes | qrcode.react |
| Deployment | Vercel |

---

## Project structure

```
campus-2-career/
├── app/
│   ├── api/
│   │   ├── action-plan-advisor/   # AI endpoint — generates 4 prioritised recommendations
│   │   └── attendance-advisor/    # AI endpoint — attendance recovery guidance
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Main shell — login gate + dashboard tabs
│
├── components/
│   ├── auth/
│   │   └── LoginGateway.tsx       # Role-based login (Student / Faculty / Admin)
│   ├── overview/
│   │   ├── OverviewDashboard.tsx  # Main student dashboard
│   │   ├── OverviewHero.tsx       # Student hero card with success score
│   │   ├── KpiMetricsGrid.tsx     # CGPA, attendance, coding, placement KPIs
│   │   ├── RiskAlertBanner.tsx    # Urgent alerts for at-risk students
│   │   ├── CareerPathwayHub.tsx   # Career pathway selector
│   │   ├── UpcomingDrivesCard.tsx # Placement drive calendar
│   │   └── ...
│   ├── action-plan/
│   │   ├── WeeklyRoadmapSection.tsx      # AI-generated weekly plan
│   │   ├── GoalsTrackingSection.tsx      # Goal creation and tracking
│   │   ├── ImpactMeasurementSection.tsx  # Score improvement projections
│   │   ├── SupportMentoringSection.tsx   # Mentoring and support requests
│   │   └── RiskBasedActionsSection.tsx   # Gemini-powered action recommendations
│   ├── attendance/
│   │   ├── AttendanceDashboard.tsx       # Subject-wise attendance breakdown
│   │   └── StudentPermissionsView.tsx    # Leave and OD request management
│   ├── faculty/
│   │   ├── FacultyMarkAttendance.tsx     # Mark attendance interface
│   │   ├── FacultyEarlyWarningRadar.tsx  # At-risk student detection
│   │   ├── FacultyGradebook.tsx          # Marks entry and analysis
│   │   └── ...
│   ├── kpmg/
│   │   ├── KPMGAnalyticsStudio.tsx       # Admin analytics hub
│   │   ├── ExplainableAIEngine.tsx       # XAI transparency dashboard
│   │   ├── WhatIfScoreSimulator.tsx      # Score impact simulator
│   │   └── ...
│   ├── success-score/
│   │   └── SuccessScoreScreen.tsx        # Composite success score breakdown
│   ├── CareerAIOrb.tsx                   # Animated AI assistant orb
│   └── PathwayOrbHub.tsx                 # Career pathway visual hub
│
├── public/brand/                         # Logo, brand assets, pathway reference images
├── types/
│   └── permissions.ts                    # Permission and role type definitions
├── tailwind.config.js                    # Extended design system tokens
├── vercel.json                           # Vercel deployment config
└── .env.example                          # Environment variable template
```

---

## Local setup

**Requirements:** Node.js 18+ and npm

```bash
# 1. Clone the repository
git clone https://github.com/your-username/campus-2-career.git
cd campus-2-career

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Open .env.local and add your Gemini API key

# 4. Start the dev server
npm run dev
```

Open `http://localhost:3000`. The login screen lets you pick a role (Student, Faculty, or Admin) — no credentials needed in the prototype.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Recommended | Google Gemini Flash API key. Without it, the AI endpoints fall back to grounded static recommendations — the app still works fully. |

Get a free API key at [aistudio.google.com](https://aistudio.google.com/app/apikey).

---

## AI endpoints

Both endpoints are Next.js Route Handlers that call Gemini Flash server-side, so the API key is never exposed to the browser.

### `POST /api/action-plan-advisor`

Generates 4 prioritised academic and career recommendations for a student.

```json
// Request body (all optional — defaults are used for the prototype)
{
  "attendance": 68.4,
  "cgpa": 7.8,
  "pendingAssignments": 2,
  "codingDiagnostic": 45,
  "dbmsScore": 62,
  "studentName": "Ananya V."
}
```

```json
// Response
{
  "success": true,
  "source": "gemini-flash-latest",
  "latencyMs": 820,
  "recommendations": [
    {
      "id": "rec-1",
      "category": "Attendance",
      "title": "Improve DBMS Lab Attendance",
      "detectedInsight": "Attendance is 68.4% — below the 75% statutory bar.",
      "whyItMatters": "Risks semester detention and placement shortlisting.",
      "recommendedAction": "Book 2 Saturday make-up sessions and file OD regularization.",
      "priority": "Critical",
      "impact": "+7.8 pts",
      "evidence": { ... }
    }
  ]
}
```

If the API key is missing or the Gemini call fails, the endpoint returns a realistic grounded baseline so the frontend never breaks.

### `POST /api/attendance-advisor`

Generates attendance recovery guidance for a specific student.

```json
// Request body
{
  "prompt": "How can I restore my 75% attendance?",
  "currentRate": 68.4,
  "targetRate": 75.0,
  "requiredDays": 14,
  "studentName": "Ananya V.",
  "atRiskSubjects": ["CS702 Cloud Computing Lab (64%)"]
}
```

```json
// Response
{
  "success": true,
  "source": "gemini-flash-latest",
  "advice": "You need 14 consecutive days present...",
  "latencyMs": 640
}
```

---

## Deploying to Vercel

**Option 1 — Vercel CLI**

```bash
npm i -g vercel
vercel login
vercel --prod
```

During the first run, Vercel will detect Next.js automatically. When prompted:
- Framework: Next.js (auto-detected)
- Build command: `next build`
- Output directory: `.next`

**Option 2 — Vercel Dashboard**

1. Push the repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Add the `GEMINI_API_KEY` environment variable under **Project Settings → Environment Variables**.
4. Deploy.

The `vercel.json` in the project root is already configured. No additional setup needed.

---

## Design system

The UI is built on a 4-colour brand palette extracted from the product logo:

| Token | Hex | Usage |
|---|---|---|
| `brand.cyan` | `#00CEE6` | Primary actions, active states, highlights |
| `brand.navy` | `#11233D` | Headings, sidebar, primary text |
| `brand.purple` | `#825FEF` | AI features, success score, special callouts |
| `brand.silver` | `#ACBACC` | Muted labels, borders, secondary text |

Fonts: **Nunito** (default UI), **Outfit** (headings), **Plus Jakarta Sans** (data-dense views). All loaded from Google Fonts.

---

## Dashboard roles

The login gateway at `/` switches context based on role:

**Student** — Personal dashboard with KPI strip, AI action plan, attendance tracker, career pathway hub, leave/OD requests, and QR pass generation.

**Faculty** — Class attendance marking, at-risk student radar, gradebook, mentee groups, and leave approval queue.

**Admin (KPMG Analytics)** — Cohort benchmarks, batch cockpit, smart student segmentation, what-if simulator, explainable AI engine, and data pipeline monitoring.

---

## Known limitations

- All data is currently mocked/prototype-grade. There is no real database connection — integrating a live college ERP or Supabase backend is the obvious next step.
- Authentication is a role selector, not actual auth. JWT or Supabase Auth would be the production approach.
- The Gemini API calls use `gemini-flash-latest`. The model ID may need updating as Gemini's API evolves.

---

## Contributing

This is currently a solo prototype. If you're building on top of it, the cleanest extension points are:

- `app/api/` — add new AI endpoints here
- `components/` — each feature module is isolated in its own subfolder
- `types/permissions.ts` — extend roles and permissions here
- `tailwind.config.js` — design tokens are all centralised

---

## License

MIT — use freely, attribution appreciated.
