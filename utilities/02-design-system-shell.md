# 02 Design System Shell

## Mission
Build the Zara-inspired editorial design system with tokenized colors, typography, reusable layout primitives, and global UI components matching the DecantSnibro visual identity.

## Success Criteria
- Design tokens defined: --ds-black, --ds-ivory, --ds-nude, --ds-greige, --ds-taupe, --ds-charcoal.
- Typography system uses Cormorant Garamond (serif display) and Inter (sans body) with extreme size contrast.
- Public layout (transparent nav, centered logo) and Admin layout (black nav, sidebar links) implemented.
- Reusable UI primitives: Button (primary/secondary/ghost), Input (bottom-border style), StatusPill, Card.

## Prerequisites
- `01-foundation-platform` merged.

## Logistics
- Source Branch: `develop`
- Target Branch: `develop`
- Feature Branch: `feature/design-system-shell`

## Atomic Steps
1. Define CSS custom properties for the DecantSnibro palette in globals.css.
2. Import Google Fonts: Cormorant Garamond (serif) and Inter (sans-serif).
3. Create base layout primitives: PublicLayout with transparent/ivory nav, AdminLayout with black top nav.
4. Build Button component with primary (solid black), secondary (nude fill), and ghost (border only) variants.
5. Build Input component with bottom-border-only style and small-caps label.
6. Build StatusPill component: AVAILABLE (black fill), IN TRANSIT (nude outline), OUT OF STOCK (greige strikethrough).
7. Build Card component with no border-radius, subtle shadow, charcoal variant for dark sections.
8. Add responsive mobile menu for admin navigation.
9. Ensure all components use design tokens — no hard-coded colors in feature modules.

## Key Files / Areas
- `src/app/globals.css`
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/StatusPill.tsx`
- `src/components/ui/Card.tsx`
- `src/components/layout/PublicLayout.tsx`
- `src/components/layout/AdminLayout.tsx`

## Verification
- Visual:
  - Public and Admin shells render correctly on desktop and mobile.
  - Typography hierarchy shows extreme contrast between headings and body.
- Accessibility:
  - Focus visibility on all interactive elements.
  - Sufficient contrast ratios for text on all background colors.
- Regression:
  - All component styles derive from CSS custom property tokens.

## Definition of Done
- [ ] Design tokens implemented in globals.css.
- [ ] PublicLayout and AdminLayout render correctly with responsive nav.
- [ ] All UI primitives (Button, Input, StatusPill, Card) built and documented.
- [ ] No direct hard-coded brand colors in any component.

## Commit Flow
- `feat(ui): add design tokens and font imports for editorial aesthetic`
- `feat(layout): implement public and admin shell layouts`
- `feat(ui): build button input status-pill and card primitives`

## Merge Rule Reminder
Merge using regular merge commit only (`--no-ff`). Squash merge is not allowed.
