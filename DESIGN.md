---
name: ScienceFit Admin
description: Performance dashboard for evidence-based fitness coaching — dark authority, clinical precision, zero fluff.
colors:
  primary: "#C62828"
  primary-deep: "#8B0000"
  primary-faint: "#FFEBEE"
  canvas: "#FAFAF8"
  surface: "#FFFFFF"
  navy: "#1a1a2e"
  navy-dark: "#16213e"
  text-primary: "#1a1a1a"
  text-secondary: "#6B6B6B"
  border: "#E8E4E0"
  success: "#2E7D32"
  success-faint: "#E8F5E9"
  warning: "#F57F17"
  warning-faint: "#FFF8E1"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "22px"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "0.1em"
  title:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
rounded:
  pill: "20px"
  modal: "16px"
  card: "14px"
  icon: "12px"
  btn: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  content: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.btn}"
    padding: "8px 16px"
  button-ghost-hover:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.btn}"
    padding: "8px 16px"
  nav-item-active:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "12px 20px"
  nav-item-default:
    backgroundColor: "transparent"
    textColor: "#94a3b8"
    rounded: "{rounded.btn}"
    padding: "12px 20px"
  badge:
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  stat-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "20px"
---

# Design System: ScienceFit Admin

## 1. Overview

**Creative North Star: "The Performance Instrument"**

ScienceFit Admin is not a dashboard — it is an instrument. Like a Garmin sports watch or a Whoop band, it exists to give precision-hungry users direct, unmediated access to performance data. The aesthetic vocabulary comes from this analogy: a dark, authoritative navigation rail (the device casing), bright cream content surfaces (the display face), and a single red accent that functions like a status indicator light — used only where it earns its presence.

The surface is built for density without noise. Admins and coaches are in operational mode: they need to see user counts, subscription states, and workout logs at a glance — not wade through chrome or illustration. The system communicates confidence through exact spacing, sharp typographic contrast, and restraint. Nothing decorates for decoration's sake. Every visual decision can be traced to a functional reason.

This system explicitly rejects the casual warmth of consumer fitness apps (MyFitnessPal's pastel greens, gamified celebration states), the sterile coldness of clinical UI (all-white backgrounds, form-heavy layouts without hierarchy), and the forgettable genericness of standard SaaS dashboards that look identical from one product to the next. ScienceFit's interface should feel like a tool built for athletes — not a wellness app built for everyone.

**Key Characteristics:**
- Dark navy sidebar as structural anchor; cream page canvas as neutral content surface
- Single red accent, used for primary actions, active navigation state, and critical status only
- Inter at extreme weights (700, 900) for data values; Inter 400/500 for reading copy
- Gently rounded corners (14px cards, 8px controls) — tactile but not playful
- Shadows as ambient depth signals, not decorative texture
- Skeleton loading states, not spinners; each animation serves a state transition

## 2. Colors: The Performance Palette

A two-surface palette built on strong contrast: a deep navy shell that communicates authority, a warm-cream canvas that carries data, and one red accent that acts as a precision signal.

### Primary
- **Blood Iron Red** (`#C62828`): The brand accent. Applied to primary buttons (as a gradient from `#C62828` to `#8B0000`), active sidebar navigation items, input focus rings, stat-card icon containers, badge indicators for MAX plan and blocked states. Its rarity is the point — on any given screen, this color occupies ≤15% of the surface.
- **Deep Crimson** (`#8B0000`): The gradient terminal for primary surfaces. Never used as a standalone fill; always paired with `#C62828` via `linear-gradient(135deg)` to add depth and prevent flatness.
- **Faint Rose** (`#FFEBEE`): Background for status badges (blocked, MAX plan, rejected). Too subtle to carry attention; exists only to tint a label.

### Neutral
- **Chalk Cream** (`#FAFAF8`): The page canvas — every authenticated screen's background. Also used as the table header background and ghost button hover surface. Warm enough to avoid clinical sterility; neutral enough to never compete with data.
- **Analytical White** (`#FFFFFF`): Card surfaces, modal backgrounds, input fields. The distinction between White and Chalk Cream creates a low-friction card-lifts-from-page effect without requiring shadows.
- **Midnight Navy** (`#1a1a2e`): Sidebar background (gradient start). The heaviest surface in the system — used only for the navigation rail, never for content areas.
- **Abyss Navy** (`#16213e`): Sidebar gradient terminal (`linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)`). Same function as Deep Crimson: depth without flatness.
- **Technical Black** (`#1a1a1a`): Primary text color. Used on all reading copy, data values, table cell content, and form labels. Near-black, not pure black — softer against the cream canvas.
- **Data Steel** (`#6B6B6B`): Secondary text, table headers as labels, stat-card sub-labels, sidebar nav items in rest state (as `#94a3b8` on navy). Communicates hierarchy without disappearing.
- **Warm Divider** (`#E8E4E0`): Table row borders, input field strokes, ghost button borders. Structural only — never decorative.

### Named Rules
**The One Signal Rule.** `#C62828` marks exactly one thing at a time: the currently active nav item, the primary CTA, or a status indicator. If more than one element on a screen is red, one of them is wrong.

**The Navy Shell Rule.** The dark navy (`#1a1a2e`) exists only in the sidebar. Never apply it to content cards, page backgrounds, or modals. Its darkness is the contrast that makes the content surface legible.

## 3. Typography

**Display Font:** Inter (weights 700, 900), with system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI' fallbacks
**Body Font:** Inter (weights 400, 500, 600), same stack

**Character:** A single-family system at extreme weight range. Inter at weight 900 carries brand identity (the "SCIENCEFIT" logotype in the sidebar at 22px with 0.1em tracking). Inter at weight 700 carries data values (stat-card counts at 30px). The rest of the UI runs at 400–600. No display-body pairing needed; the weight range IS the hierarchy.

### Hierarchy
- **Display** (700, 30px, lh 1.1, −0.02em tracking): Animated metric values in StatCard components. Tabular-nums enabled. Numbers that need to land with authority.
- **Headline** (900, 22px, lh 1.1, +0.1em tracking, uppercase): The product wordmark ("SCIENCEFIT") in the sidebar only. Wide tracking at extreme weight is a signature, not a pattern — use it once.
- **Title** (600, 16px, lh 1.3): Page section headings, modal titles, card group labels.
- **Body** (400, 14px, lh 1.5): Table cell content, body copy, form labels, nav item labels (weight 500 when active). The base size is 14px — not 16px — because this is a data-dense tool where every pixel of vertical rhythm counts.
- **Label** (700, 11px, lh 1.2, +0.06em tracking, UPPERCASE): Table column headers, badge text, secondary captions. Uppercase small caps are reserved for structural labeling — never for decorative headings on content pages.

### Named Rules
**The Weight-as-Hierarchy Rule.** Do not use font size alone to establish hierarchy. In this system, a 14px/700 stat label outranks a 16px/400 body paragraph. Weight communicates authority; size communicates scope.

**The One Uppercase Register.** Tracked uppercase (≥0.04em) appears only on: table `<th>` elements, badge text, and the product logotype. Not on page headings, section titles, card headers, or button labels.

## 4. Elevation

This system uses **ambient shadow elevation** — shadows signal depth, not focus. The palette has three shadow levels defined as CSS custom properties, each used in a specific structural role. The system is not flat (surfaces do not sit on the same plane) but it is not dramatized either (no deep drop shadows, no colored glows except the red primary-button glow which signals intent, not depth).

**Depth is also expressed tonally**: the white card surface (`#FFFFFF`) reads as elevated against the cream canvas (`#FAFAF8`) without requiring a shadow. This means cards in a neutral state may carry no shadow at all and still read as lifted.

### Shadow Vocabulary
- **Ambient Low** (`0 2px 8px rgba(0,0,0,0.06)`): Default resting state for cards and containers. Barely perceptible — implies separation without asserting it.
- **Ambient Mid** (`0 4px 20px rgba(0,0,0,0.10)`): Hover state elevation, active sidebar nav items (as a red-tinted glow: `0 4px 12px rgba(198,40,40,0.30)`). Signals interaction response.
- **Ambient High** (`0 8px 32px rgba(0,0,0,0.14)`): Modal overlay and elevated panels. The highest shadow in the system — reserved for surfaces that float above the page.
- **Primary Glow** (`0 2px 8px rgba(198,40,40,0.25)`, expands to `0 4px 14px rgba(198,40,40,0.35)` on hover): Applied only to the primary button. The sole colored shadow — it signals "this is the action" without requiring a tooltip.

### Named Rules
**The Flat-By-Default Rule.** Shadows appear as a response to state (hover, elevation, modal), not as decoration on static content. A card at rest may use Ambient Low or no shadow at all. Never apply Ambient High to a resting, non-modal surface.

## 5. Components

### Buttons
Tactile and unambiguous. The primary button uses a diagonal red gradient so it reads as an object, not a flat shape. Ghost buttons are invisible until interacted with — they disappear into the layout and emerge on hover.

- **Shape:** Gently curved (8px radius — `{rounded.btn}`)
- **Primary:** `linear-gradient(135deg, #C62828, #8B0000)` fill; white text; 8px 16px padding; 13px/600 Inter; Primary Glow shadow at rest, expanded on hover. Active: `scale(0.98)` press feedback.
- **Hover / Focus:** `filter: brightness(1.05)` + expanded red glow (`0 4px 14px rgba(198,40,40,0.35)`). No border-color shift on focus; use the expanded shadow as the focus indicator.
- **Ghost / Secondary:** Transparent background; `#6B6B6B` text; 1px `#E8E4E0` border. Hover: `#FAFAF8` background + `#1a1a1a` text. No shadow.
- **Semantic variants (danger, success, warning):** Flat fills (`#D32F2F`, `#2E7D32`, `#F57F17`) with `opacity: 0.88` on hover. No gradient.

### Badges
Status communication only. Pill shape, uppercase label, tinted background that echoes the status color without competing with content.

- **Shape:** Full pill (20px radius — `{rounded.pill}`)
- **Style:** 11px/700 Inter, uppercase, +0.03em tracking; 3px 10px padding. Background is the semantic color at ~12% opacity; text is the semantic color at full value.
- **Variants:** active (green), pending (amber), blocked/rejected (red), cancelled (neutral grey), admin (purple), coach (blue), usuario (green-light), FREE (neutral), MAX (red-tinted), MAX+Plicómetro (navy-tinted)

### Cards / Containers
The workhorse surface. White cards on cream canvas — the tonal contrast creates lift without shadows.

- **Corner Style:** Gently rounded (14px — `{rounded.card}`)
- **Background:** `#FFFFFF` on `#FAFAF8` canvas
- **Shadow Strategy:** Ambient Low at rest (`0 2px 8px rgba(0,0,0,0.06)`). No shadow needed in many cases — the white/cream contrast is sufficient.
- **Border:** None (tonal separation handles it)
- **Internal Padding:** 20px–28px depending on content density

### Inputs / Fields
Minimalist form controls. The border is the affordance; the red focus ring is the state indicator.

- **Style:** 1.5px `#E8E4E0` border; `#FFFFFF` background; 8px radius; 10px 14px padding; 14px/400 Inter
- **Focus:** Border shifts to `#C62828`; `0 0 0 3px rgba(198,40,40,0.10)` ring appears. No outline, no color fill change — the shift is surgical.
- **Placeholder:** `#B0B0B0` — dim enough not to be mistaken for content
- **Disabled / Error:** Not explicitly defined in current code; apply standard MUI defaults when needed.

### Navigation
The sidebar is the spatial anchor for the entire admin surface. Dark, fixed, always present — the instrument panel.

- **Structure:** Fixed-left, 240px wide, full viewport height. `linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)` background.
- **Logotype:** "SCIENCEFIT" — 22px/900 Inter, `#C62828`, 0.1em letter-spacing, uppercase. Below it: "Admin Panel" — 11px/500, `rgba(255,255,255,0.4)`, 0.08em tracking.
- **Nav items (rest):** `#94a3b8` text, transparent background, 10px border-radius, 12px 20px padding. On hover: white text, `translateX(4px)` shift, red fill (`rgba(198,40,40,0.15)`) slides in from left.
- **Nav items (active):** `linear-gradient(135deg, #C62828, #8B0000)` fill; white text; `0 4px 12px rgba(198,40,40,0.30)` glow shadow. No hover animation on active state.
- **Transition:** All state changes at 0.2s with `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Mobile:** Collapses off-screen at ≤768px; opens via hamburger in TopBar; `rgba(0,0,0,0.5)` overlay on body; `translateX(0)` reveal.

### StatCard (Signature Component)
The primary data surface for the dashboard. Combines an icon container, an animated numeric value, and a descriptive label. The count-up animation (16ms tick, 1500ms total) makes data arrival feel earned, not instant.

- **Shape:** 14px radius card; 20px 20px padding; white background
- **Icon container:** 52×52px; 12px radius; accent color at 9.4% opacity (`${accent}18`) as background; accent color for the icon stroke
- **Metric value:** 30px/700 Inter; −0.02em tracking; tabular-nums; `#1a1a1a`
- **Sub-label:** 13px/500 Inter; `#6B6B6B`; 4px top margin
- **Trend indicator:** 12px/600; green (`#2E7D32`) for positive, red (`#C62828`) for negative

### Tables
Dense information display. Cream header row distinguishes it from data rows without aggressive chrome.

- **Column headers:** 11px/700 Inter, uppercase, +0.06em tracking, `#6B6B6B`; 12px 16px padding; 2px solid `#E8E4E0` bottom border; `#FAFAF8` background
- **Data rows:** 14px/400 `#1a1a1a`; 14px 16px padding; 1px `#E8E4E0` bottom border; hover: `rgba(250,250,248,0.8)` background
- **Status rows:** `#FFF8E1` (warning) or `#FFEBEE` (danger) row tint via class
- **Last row:** no bottom border

### Modal
Full-page overlay with blur, centered dialog. The blur is intentional — it communicates that the main content is temporarily unreachable, not merely obscured.

- **Overlay:** `rgba(0,0,0,0.5)` + `backdrop-filter: blur(4px)`; fadeIn 0.2s
- **Dialog:** White; 16px radius; `0 8px 32px rgba(0,0,0,0.14)` shadow; 28px padding; max-width 520px; max-height 85vh with scroll; slideUp 0.25s animation on enter

## 6. Do's and Don'ts

### Do:
- **Do** use `#C62828` for exactly one prominent element per screen — the active nav item, the primary CTA, or a status indicator. Its impact depends on scarcity.
- **Do** use Inter weight 700 or 900 for numeric data values and key metrics. Weight communicates authority; the number should land.
- **Do** use the sidebar's dark navy (`#1a1a2e`) only for the navigation rail. Content backgrounds stay on the cream/white two-tone system.
- **Do** animate state transitions with `cubic-bezier(0.4, 0, 0.2, 1)` at 0.15s–0.3s. Transitions confirm interactions; they are not choreography.
- **Do** use skeleton loading states (`shimmer` animation over warm grey) for deferred data. A shimmer placeholder keeps the layout stable. A spinner in the center of a card is an admission that the layout isn't known.
- **Do** respect `prefers-reduced-motion` — wrap `fadeInUp`, `slideUp`, and the StatCard count-up animation in a media query check.
- **Do** keep badge text uppercase at 11px with at least +0.03em tracking. Below 11px uppercase, legibility collapses.
- **Do** differentiate the Chalk Cream canvas (`#FAFAF8`) from the Analytical White card surface (`#FFFFFF`) — this tonal separation is how cards lift from the page without shadows.

### Don't:
- **Don't** use casual pastel greens, gamified celebration animations, or streak-style progress indicators. ScienceFit is a scientific tool, not a wellness companion. The aesthetic of MyFitnessPal — friendly gradients, confetti, motivational copy — is the anti-reference by name.
- **Don't** apply `#1a1a2e` navy to content cards, page backgrounds, or modals. Dark surfaces are the sidebar's domain. A dark modal box breaks the instrument-panel metaphor.
- **Don't** use the standard SaaS dashboard pattern without craft: identical card grids with generic stat blocks, the same sidebar+topbar+table layout copied from a UI kit with no character. The system must feel built for performance athletes, not assembled from templates.
- **Don't** use clinical/hospital UI conventions: all-white everything, form-heavy layouts with zero spatial personality, cold sans-serif type with no weight differentiation. The science in ScienceFit is performance science, not medicine.
- **Don't** use gradient text (`background-clip: text`) on any surface. Gradient fills belong on buttons and the sidebar; text carries meaning and must stay solid.
- **Don't** use glassmorphism as a default card treatment. The `backdrop-filter: blur` exists on the modal overlay only — where it serves a specific purpose (communicate inaccessibility of the background). A glass-effect card on a normal page is decoration without purpose.
- **Don't** apply large colored side-stripe borders (`border-left: 4px solid #C62828`) to cards as a decorative pattern. If a card needs status emphasis, use a badge or a row background tint.
- **Don't** uppercase every section heading. Uppercase tracked labels belong on table `<th>` elements and badges only — structural labeling roles. Section headings and page titles use Title weight (600) in sentence case.
- **Don't** show a full-page spinner while the auth state loads. The current implementation (`<svg animateTransform>` spinning indicator with "Cargando...") is acceptable as a once-per-session transition; a spinner on every data fetch is not.
- **Don't** use heavy color or full-saturation accents on inactive or rest states. `#C62828` at full opacity on a resting, non-interactive element (like an icon in a card that has no CTA) is visual noise that dilutes the signal value of the color.
