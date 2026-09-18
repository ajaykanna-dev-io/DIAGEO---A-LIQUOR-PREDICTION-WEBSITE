# DIAGEO — Spirit Discovery (Frontend Prototype)

An ultra-premium, frontend-only prototype that guides a visitor through an
eight-question taste discovery journey and reveals the spirit that matches
them — built as a luxury digital concierge rather than a quiz.

This is **frontend only**: there is no backend, API, database, auth, or
payment logic. All spirit data lives in `src/data`, and the taste-matching
"engine" is a small deterministic scoring function that runs entirely in
the browser (`src/hooks/useTasteMatch.ts`).

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/       Reusable UI building blocks
    Navbar.tsx
    Footer.tsx
    Layout.tsx
    PrimaryButton.tsx
    SectionLabel.tsx
    ProgressIndicator.tsx
    QuestionCard.tsx
    AnalysisScreen.tsx
    BottleReveal.tsx
    BottleGlyph.tsx        (generated SVG "photography" placeholder)
    MatchScore.tsx
    TasteProfileBars.tsx
    TasteDNA.tsx            (animated radar chart)
    SpiritCard.tsx
    AlternativeSpiritCard.tsx
    CollectionGrid.tsx
    CustomCursor.tsx
    GrainOverlay.tsx
  pages/
    Home.tsx
    Discovery.tsx           (intro → 8 questions → analysis → result → why →
                              taste DNA → alternatives, one continuous flow)
    Collection.tsx
    SpiritDetail.tsx
    About.tsx
    Misc.tsx                (Privacy, Terms, 404)
  data/
    questions.ts            Quiz content + per-option taste weights
    spirits.ts               Mock spirit catalog + matching helpers
  hooks/
    useTasteMatch.ts         Scores answers into a Taste DNA profile and
                              finds the closest catalog match
  types/
    index.ts
  App.tsx
  main.tsx
  index.css
```

## Design system

- **Palette:** obsidian (`#0B0B0A`), char (`#141311`), surface (`#181714`),
  champagne gold (`#C6A15B` / `#D8BD7A`), ivory (`#F3EFE6`), stone (`#A9A39A`).
- **Type:** Cormorant Garamond for display/editorial moments, Manrope for UI,
  labels, and body copy.
- **Motion:** slow, purposeful transitions (500ms–1.4s) via Framer Motion —
  question transitions, the analysis ring, the bottle reveal, the animated
  match score, and the Taste DNA radar chart are the five signature moments.
- **No gradients as backgrounds.** Depth comes from borders, shadows,
  typography, and spacing, per the brief's "luxury through restraint"
  direction. The only gradients in the codebase live inside the generated
  bottle illustration, standing in for photographic lighting.
- **Accessibility:** semantic landmarks, visible focus states, alt text on
  illustrations, and `prefers-reduced-motion` handling (custom cursor and
  scroll/reveal animations shortened or disabled).

## Mock data & imagery

No photography assets are bundled. Bottles are rendered as a single
reusable SVG component (`BottleGlyph`) tinted per spirit, standing in for
the cinematic product photography described in the brief. Swap it for real
imagery by replacing `BottleGlyph` usages with `<img>` / `<picture>` tags —
the surrounding layout, motion, and shadows are already built for that.

Spirit and question data are fully mocked in `src/data`; extend either file
to add more spirits or change the quiz.
