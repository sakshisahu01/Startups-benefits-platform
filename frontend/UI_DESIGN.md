# UI, Animation, and Visual Quality Expectations

This document describes required visual and motion-quality standards for the frontend. Follow these guidelines when implementing or adjusting UI, animations, and interactions.

## Goals
- Create delightful, consistent, and performant motion across the app.
- Ensure interactions feel responsive and intentional on hover/tap/focus.
- Use skeletons and loading states to eliminate jank during data fetching.
- Keep layout changes smooth and visually stable during transitions.

## Required Items

1) Page transitions
- Use page-level transition animations for route changes (enter/exit). Use `framer-motion` `AnimatePresence` or a shared `PageTransition` wrapper.
- Typical parameters: duration 280–420ms, easing `cubic-bezier(.2,.8,.2,1)` or `easeOut`, subtle translate on Y (8–16px) and fade.

2) Micro-interactions (hover states, button feedback)
- All interactive elements must have hover/focus/active states (buttons, cards, links).
- Use small scale/shadow changes and color tints for hover (scale 1.01–1.03, shadow increase, background tint).
- Provide visible focus rings for keyboard navigation (2px outline, brand color). Respect `prefers-reduced-motion`.

3) Loading states / skeleton screens
- For lists, cards, and blocks that load asynchronously, display skeletons instead of content flashing in.
- Skeletons should match the layout of the final content (same height and spacing) and use an animated shimmer or subtle pulse.
- Keep loading durations reasonable (min 250ms visible) to avoid flicker when requests are very fast.

4) Smooth layout transitions
- When content reflows (list sort/filter, reveal/hide elements), use `framer-motion`'s `layout` prop or `AnimateSharedLayout` to animate position/size changes.
- Avoid abrupt jumps by animating height/width where possible; prefer `layout` for cards and lists.

## Implementation Guidance
- Primary library: `framer-motion` (already used in the project). Prefer `motion.div`, `layout`, `AnimatePresence` and `layoutId` for shared element transitions.
- Respect `prefers-reduced-motion`: check `window.matchMedia('(prefers-reduced-motion: reduce)')` and reduce/disable non-essential motion.
- Use Tailwind utility classes for consistent spacing, rounded corners, and elevation.
- Keep motion inexpensive: avoid animating expensive properties (use transform & opacity). Limit concurrent animations.

## Small code snippets

Page transition wrapper (example):

```tsx
// PageTransition.tsx
import { AnimatePresence, motion } from 'framer-motion';
export default function PageTransition({ children }){
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.36, ease: [0.2,0.8,0.2,1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

Button hover micro-interaction (Tailwind + framer-motion):

```tsx
<motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="rounded-lg bg-brand-600 px-4 py-2 text-white shadow-sm">
  Save
</motion.button>
```

Skeleton example:

```tsx
<div className="h-6 w-32 rounded bg-slate-100 animate-pulse" />
```

Layout transition for lists:

```tsx
<motion.ul layout>
  {items.map(item => (
    <motion.li layout key={item.id}>{/* card */}</motion.li>
  ))}
</motion.ul>
```

## Accessibility & Performance
- All motion must preserve accessibility. Provide `prefers-reduced-motion` fallbacks and visible focus indicators.
- Test on low-end devices; prefer transform/opacity animations and avoid animating layout frequently at high cost.

## Acceptance Criteria (developer checklist)
- [ ] Page transitions present and feel smooth on route changes.
- [ ] Interactive controls show hover/focus/active states and keyboard focus ring.
- [ ] Lists/cards show skeletons while loading; no content pop-in.
- [ ] Layout changes animate smoothly with `layout` where appropriate.
- [ ] `prefers-reduced-motion` respected.

## Where to apply in this repo
- `app/layout.tsx` / `PageTransition` wrapper for global page transitions.
- `components/*` buttons, `DealCard`, `TiltCard` (micro-interactions).
- `app/dashboard/page.tsx` and deals list (skeletons and layout animations).

---

If you want, I can now apply these patterns to the dashboard (add entrance transition variants, button hovers, improved skeletons, and `layout` props on lists/cards). Reply with which items to prioritize for implementation.
