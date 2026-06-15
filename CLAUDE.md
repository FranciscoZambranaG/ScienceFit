# ScienceFit — Project Guide for Claude

## What This Project Is

ScienceFit is a fitness app with three distinct surfaces:

1. **Mobile app** — React Native + Expo (SDK 54), targeting Android & iOS
2. **Admin web panel** — React 18 + Vite 5, deployed on Vercel
3. **Shared backend** — Firebase project `sciencefitoficialv2`

---

## Tech Stack

### Mobile App (root)

| Concern | Choice |
|---------|--------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Language | JavaScript (`.js`), TypeScript for constants |
| Navigation | `@react-navigation/stack` v6 |
| UI library | `react-native-paper` v5 |
| Charts | `react-native-chart-kit` + `react-native-svg` |
| Firebase | `firebase@^9.23.0` — **compat API** (`firebase/compat/*`) |
| Auth | Firebase Auth via compat `.auth()` |
| Database | Cloud Firestore via compat `.firestore()` |
| Storage | Firebase Storage via compat `.storage()` |
| State | React Context (`AuthContext`) |
| Testing | Jest + `@testing-library/react-native` |
| Entry point | `index.js` → `App.js` |

**Firebase compat import pattern (mobile):**
```js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// Usage: firebase.auth(), firebase.firestore()
import { auth, db, storage } from '../../firebase.config';
```

### Admin Web (`admin-web/`)

| Concern | Choice |
|---------|--------|
| Framework | React 18 + Vite 5 (ESM) |
| UI library | MUI v5 + Emotion |
| Charts | Recharts 2 |
| Routing | react-router-dom v6 |
| Firebase | `firebase@^10.7.1` — **modular v10 API** |
| Auth | `getAuth` from `firebase/auth` |
| Database | `getFirestore` from `firebase/firestore` |

**Firebase modular import pattern (admin-web):**
```js
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
```

> **Critical:** Never mix compat (`firebase/compat/*`) and modular (`firebase/auth`) imports. The mobile app uses compat; the admin web uses modular.

---

## Project Structure

```
ScienceFit/
├── App.js                        # Root component, AuthProvider wrapping
├── app.json                      # Expo config (bundle: com.sciencefit.app)
├── firebase.config.js            # Mobile Firebase init (compat API)
├── index.js                      # Expo entry point
├── babel.config.js
├── constants/
│   └── theme.ts                  # Colors + Fonts (light/dark tokens)
├── components/                   # Expo template components (ThemedText, etc.)
├── src/
│   ├── context/
│   │   └── AuthContext.js        # Auth state, login/register/logout/completeOnboarding
│   ├── navigation/
│   │   ├── AuthNavigator.js      # Unauthenticated stack
│   │   └── MainNavigator.js      # Role-based main stack
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── PhysicalDataScreen.js
│   │   │   ├── BiomechanicsScreen.js
│   │   │   └── RecommendationsScreen.js
│   │   ├── user/
│   │   │   ├── HomeScreen.js
│   │   │   ├── ProfileScreen.js       # User profile & settings
│   │   │   ├── PlansScreen.js         # FREE / MAX / MAX+Plicómetro plans
│   │   │   ├── PaymentScreen.js       # QR payment flow
│   │   │   ├── IMCScreen.js
│   │   │   ├── ScienceIAScreen.js
│   │   │   ├── AddWorkoutScreen.js
│   │   │   ├── ViewWorkoutsScreen.js
│   │   │   └── SplitDetailScreen.js
│   │   ├── coach/
│   │   │   └── CoachHomeScreen.js
│   │   └── admin/
│   │       └── AdminHomeScreen.js
│   ├── components/
│   │   ├── CustomButton.js
│   │   └── CustomInput.js
│   └── utils/
│       ├── plicometerData.js
│       └── splitsData.js
└── admin-web/                    # Standalone Vite project
    └── src/
        ├── App.jsx
        ├── firebase.js           # Admin Firebase init (modular v10)
        ├── main.jsx
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Login.jsx
        │   ├── Plans.jsx         # Plan management (FREE/MAX/MAX+)
        │   ├── Subscriptions.jsx # Subscription management
        │   ├── Users.jsx
        │   ├── Workouts.jsx
        │   └── Settings.jsx
        ├── components/
        │   ├── Sidebar.jsx
        │   ├── TopBar.jsx
        │   ├── StatCard.jsx
        │   ├── Table.jsx
        │   ├── Badge.jsx
        │   └── Modal.jsx
        └── styles/global.css
```

---

## User Roles

Three roles stored in Firestore `users/{uid}.role`:

| Role | Initial Screen | Description |
|------|---------------|-------------|
| `usuario` | `HomeScreen` | Regular fitness user |
| `coach` | `CoachHomeScreen` | Trainer / coach |
| `admin` | `AdminHomeScreen` | App administrator |

New users default to `role: 'usuario'` and must complete onboarding (`onboardingCompleted: false`).

---

## Subscription Plans (Mobile)

Three tiers shown in `PlansScreen` → payment handled in `PaymentScreen`:

| Plan | Key |
|------|-----|
| FREE | Free tier, limited features |
| MAX | Full access |
| MAX + Plicómetro | Full access + body composition device |

Payment flow uses QR codes. Subscriptions are managed from the admin web (`Plans.jsx`, `Subscriptions.jsx`).

---

## Color Scheme

ScienceFit uses a **dark navy / red / cream** palette:

| Token | Hex | Usage |
|-------|-----|-------|
| Dark navy (primary bg) | `#1a1a2e` | Screen backgrounds, cards |
| Red accent (brand) | `#C62828` | Buttons, splash, Android bg, CTAs |
| Cream white | `#FAFAF8` | Primary text on dark backgrounds |
| Secondary text | `#B0BEC5` | Subtitles, labels |
| Surface / card | `#1A2744` | Card backgrounds, input fields |

The splash background and Android `backgroundColor` in `app.json` use the brand red.

**When writing any UI code:** use these tokens. Never introduce arbitrary colors.

---

## Firestore Collections

| Collection | Purpose |
|------------|---------|
| `users` | User profile, role, onboarding status, physical data |
| `workouts` | User workout logs |
| `plans` | Subscription plan definitions |
| `subscriptions` | User subscription records |

---

## Commands

```bash
# Mobile
npm start              # Expo dev server
npm run android        # Android
npm run ios            # iOS
npm test               # Jest

# Admin web (from admin-web/)
npm run dev            # Vite dev server
npm run build          # Production build
npm run preview        # Preview build locally
```

---

## Installed Skills

The following skills are active in `.claude/skills/` and should be applied automatically:

### Design & UI
- **`emil-design-eng`** — Apply when writing any UI component. Encodes Emil Kowalski's philosophy: micro-interactions, spring animations, tactile feedback, invisible polish details.
- **`design-taste-frontend`** — Anti-slop design taste. Apply to all frontend work to avoid generic, low-effort UI.
- **`high-end-visual-design`** — Premium visual design standards. Use for any new screen or major redesign.
- **`minimalist-ui`** — Minimalist UI patterns. Prefer when designing clean, focused screens.
- **`image-to-code`** — Convert design images/mockups to faithful React Native or React code.
- **`imagegen-frontend-mobile`** — Generate mobile UI visuals.
- **`imagegen-frontend-web`** — Generate web UI visuals (admin panel).
- **`impeccable`** — Design language system (pbakaus). Run `/impeccable init` to set up design context.
- **`gpt-taste`** — Design taste critique and anti-pattern detection.
- **`stitch-design-taste`** — Stitch-style design taste.
- **`industrial-brutalist-ui`** — Industrial brutalist style (use when appropriate).
- **`redesign-existing-projects`** — Full redesign workflow for existing screens.
- **`full-output-enforcement`** — Ensures complete code output without truncation.
- **`brandkit`** — Brand identity system.
- **`design-taste-frontend-v1`** — Design taste (v1 reference).

### Development Workflow
- **`skill-creator`** — Create, improve, and benchmark new Claude Code skills.
- **`debugging-network-issues`** — Evidence-driven network/streaming bug investigation. Use when debugging Firebase connection issues, SSE stalls, or API timeouts.
- **`auto-repo-setup`** — Environment setup and diagnosis. Use when the project won't run or dependencies are broken.
- **`continue-claude-work`** — Resume interrupted sessions from `.claude/` artifacts without `claude --resume`.
- **`docs-cleaner`** — Consolidate redundant documentation.
- **`i18n-expert`** — Internationalization setup and audit (if multi-language support is added).
- **`slides-creator`** — Narrative-first presentation creation (for project demos/pitches).

---

## Key Conventions

- **Firebase on mobile:** always use compat API (`firebase/compat/*`). Never switch to modular imports in the mobile codebase without migrating the entire `firebase.config.js`.
- **Firebase in admin-web:** always use modular v10 API. Never add compat imports here.
- **Roles:** check `userRole` from `AuthContext` before rendering role-specific UI. The navigator handles initial routing automatically.
- **Onboarding gate:** new `usuario` accounts start with `onboardingCompleted: false`. Auth flow must not skip the onboarding screens (`PhysicalDataScreen` → `BiomechanicsScreen` → `RecommendationsScreen`).
- **No comments explaining what code does** — only write comments for non-obvious WHY reasons.
- **No new colors** — use the palette above. If a new token is needed, define it explicitly and document it here.
- **headerShown: false** — all screens in `MainNavigator` have no header; build custom headers when needed.

---

## Design Context

> **Read `PRODUCT.md` at the start of any UI or design task.** It is the canonical source of strategic design intent. The summary below is for quick reference; `PRODUCT.md` is authoritative.

**Register:** `product` — design serves the product. Three first-class surfaces: usuario mobile app, coach mobile app, admin web dashboard.

**Personality:** Intense · Scientific · Disciplined. Voice: direct and precise, like a sports scientist. References: Whoop, Garmin Connect. The app speaks in data; it doesn't cheer.

**Anti-references (never produce these):**
- MyFitnessPal-style green health aesthetic — too casual and consumer-soft
- Clinical / hospital UI — sterile white, form-heavy, cold
- Standard SaaS dashboard — sidebar + stat-card grid + data-table with no character

**5 design principles (from `PRODUCT.md`):**
1. **Data earns trust** — every metric precisely rendered and immediately legible; "Science" is a promise the interface keeps
2. **Role clarity** — usuario / coach / admin surfaces are purpose-built, never one-size-fits-all with hidden panels
3. **Discipline over decoration** — refinement is exact spacing, sharp contrast, deliberate hierarchy; not gradients or glow
4. **Quiet authority** — density and restraint communicate competence; no motivational copy, no visual loudness
5. **Earned information** — serious users assumed; surface what matters now, depth one tap away

**Impeccable setup state:**
- `PRODUCT.md` — written, loaded by `context.mjs` each session
- `DESIGN.md` — not yet generated; run `/impeccable document` to capture visual tokens from existing code
- `.impeccable/live/config.json` — configured for `admin-web/index.html` (Vite SPA); no CSP patch needed
- Live mode: start `npm run dev` from `admin-web/`, then `/impeccable live`

**Absolute bans (impeccable rules that apply to this project):**
- No side-stripe `border-left` accent on cards or list items
- No gradient text (`background-clip: text`)
- No glassmorphism as default
- No hero-metric template (big number + gradient stat cards)
- No identical repeating card grids
- No uppercase tracked eyebrow on every section
