# Product

## Register

product

## Users

Three first-class roles, each with distinct workflows:

- **Usuario (end user)**: Gym-goers and fitness enthusiasts who log workouts, track body composition (IMC, plicometry), follow scientific split plans, and manage their subscription tier (FREE / MAX / MAX+Plicómetro). Primary context: quick in-gym or post-workout sessions on mobile.
- **Coach**: Trainers monitoring assigned athletes, reviewing workout logs, and guiding training programs. Context: desktop or mobile, reviewing multiple users' progress.
- **Admin**: System administrators managing users, subscription plans, and platform health via the web dashboard. Context: desktop-first, analytical and operational workflows.

Job to be done: every role needs the right data at a glance — not buried, not noisy.

## Product Purpose

ScienceFit applies sports science methodology to personal fitness. It connects users with evidence-based training splits, body composition analysis, and subscription-based coaching — bridging the gap between a gym app and a scientific training tool. Success means a user who trains consistently and can see measurable, tracked improvement in body composition over time.

## Brand Personality

**Intense · Scientific · Disciplined**

Voice: direct, precise, authoritative — like a sports scientist, not a wellness influencer. The app speaks in data and methodology. It doesn't cheer; it confirms. Emotional goal: users feel competent and in control, not motivated by hype.

References: Whoop, Garmin Connect — data density, dark themes, earned confidence, no fluff.

## Anti-references

- **MyFitnessPal / generic green health apps**: friendly pastel greens, gamified streaks, calorie-counting aesthetic — too casual and consumer-soft for ScienceFit's scientific positioning.
- **Clinical / hospital UI**: sterile white backgrounds, form-heavy layouts, cold typography — the science in "ScienceFit" is performance science, not medicine.
- **Standard SaaS dashboards**: the default sidebar + stat-card grid + data-table pattern with no character or craft — forgettable and indistinguishable.

## Design Principles

1. **Data earns trust.** Every metric and chart must be precisely rendered and immediately legible. "Science" in the name is a promise; the interface must keep it.
2. **Role clarity.** Each surface is purpose-built for its user. A usuario training screen should feel nothing like an admin dashboard — same design system, completely different density and intent.
3. **Discipline over decoration.** Refinement lives in exact spacing, sharp contrast, and deliberate typographic hierarchy — not in gradients, glow effects, or ornament.
4. **Quiet authority.** Confidence is communicated through density and restraint, not visual loudness. The interface doesn't need to motivate; it needs to perform.
5. **Earned information.** Screens assume serious users. Surface what matters now; let depth be one tap away. Don't overwhelm at first glance, don't hide behind excessive progressive disclosure.

## Accessibility & Inclusion

WCAG AA minimum. Dark backgrounds with cream text — contrast must be verified on every new surface (#1a1a2e background with #FAFAF8 text). Mobile-first (Android + iOS primary; admin web is desktop-first). Respect `prefers-reduced-motion` for any animations added to the React Native or web surfaces.
