---
name: Editorial Brutalism
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  display-2xl:
    fontFamily: Newsreader
    fontSize: 120px
    fontWeight: '700'
    lineHeight: 100px
    letterSpacing: -0.05em
  display-xl:
    fontFamily: Newsreader
    fontSize: 80px
    fontWeight: '600'
    lineHeight: 72px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  utility-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.05em
spacing:
  unit: 4px
  gutter: 0px
  margin-edge: 40px
  section-gap: 160px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system is built on the intersection of high-fashion editorial aesthetics and structural brutalism. It targets a discerning, style-conscious audience that values visual impact over traditional interface conventions. The emotional response is one of authority, sophistication, and raw elegance.

The design style leans heavily into **Brutalism** and **High-Contrast Minimalism**. It rejects decorative flourishes in favor of structural integrity, using heavy borders and stark transitions to define the space. The interface acts as a rigid frame for high-quality, atmospheric product photography, allowing the imagery to provide the emotional texture while the UI provides the architectural strength.

## Colors

The palette is strictly monochromatic to enforce a high-fashion, "black tie" atmosphere. 

- **Primary:** Absolute Black (#000000) is used for all structural elements, heavy borders, and primary typography.
- **Secondary:** Stark White (#FFFFFF) serves as the primary canvas, creating expansive whitespace that feels intentional and luxurious.
- **Tertiary:** A light grey (#E5E5E5) is reserved strictly for secondary dividers or hover states where absolute black would be too aggressive.
- **Neutral:** A mid-tone grey (#767676) is used only for low-priority utility text or placeholder states to maintain the hierarchy of the primary black type.

Color should never be used for functional feedback (like green for success); instead, use thickness of lines, inverted blocks, or scale to indicate state changes.

## Typography

Typography is the primary vehicle for the brand’s voice. This design system utilizes a high-contrast pairing of a sophisticated serif and a utilitarian sans-serif.

- **Headings:** Use **Newsreader**. These should be oversized and "tightly tracked" (negative letter spacing) to create a dense, ink-heavy feel reminiscent of luxury print magazines. Large display sizes should often bleed off the edge of containers or overlap imagery.
- **Body & Utility:** Use **Inter**. This provides a neutral, functional counterpoint to the expressive headlines. It should be typeset with generous leading (line height) to ensure readability against the stark layout.
- **Labels:** Use uppercase Inter with wide tracking for navigation and small labels to create a sense of architectural rhythm.

## Layout & Spacing

The layout philosophy rejects standard symmetry in favor of an **Asymmetrical Editorial Grid**. 

- **Grid Model:** A 12-column fixed grid with 0px gutters. Elements are separated by heavy 2px or 4px black borders rather than empty space, creating a "cells" effect.
- **Asymmetry:** Product images should vary in size—for example, one image may span 7 columns while the next spans 5, or an image might be offset by a single empty column to create visual tension.
- **Whitespace:** Use extreme vertical padding (`section-gap`) between content blocks to force the user to focus on one "editorial moment" at a time.
- **Margins:** Maintain a wide, consistent outer margin of 40px to frame the entire experience like a page in a book.

## Elevation & Depth

This design system ignores traditional depth metaphors like shadows or blurs. It is resolutely flat, using **Bold Borders** and **Tonal Inversion** to establish hierarchy.

- **No Shadows:** Do not use box-shadows or ambient occlusions. Layers are separated by solid 1px or 2px black lines.
- **Stacking:** Depth is conveyed through "The Stack." Modals or drawers do not float; they slide in as solid white blocks with a heavy black leading edge, completely obscuring the content beneath.
- **Inversion:** To highlight an active element or a primary call-to-action, invert the color scheme (e.g., white text on a black background).

## Shapes

The shape language is strictly **Sharp**. 

There are no rounded corners in this design system. Every button, input field, image container, and modal must have a 0px border-radius. This reinforces the brutalist, architectural influence and ensures the UI feels like a structured grid. Use 2px strokes for standard containers and 4px strokes for primary "hero" elements or buttons.

## Components

### Buttons
Primary buttons are solid black rectangles with white, uppercase Inter text. There is no hover transition other than a slight "shrink" effect or a complete color inversion (black to white with a black border). Secondary buttons use a 2px black outline with no fill.

### Input Fields
Inputs are defined by a single 2px bottom border rather than a full box, or a fully enclosed box with 1px borders. Labels should be small, uppercase, and placed directly above the field.

### Product Cards
Cards are minimalist frames. The image is the hero, often taking up 100% of the card width. Text (name, price) is placed in a small utility font at the bottom, often separated by a thin 1px horizontal line.

### Chips & Tags
Chips are rectangular with 1px borders. They should look like "labels" found on garment tags. Use Inter for the text in all-caps.

### Navigation
The navigation should be oversized and sparse. Use the Serif font for main category links and the Sans-Serif for utility links (search, cart, account). Navigation items should be separated by vertical 1px lines to maintain the grid feeling.

### Imagery
All product photography must be high-contrast with minimal backgrounds. Use large-scale "Hero" images that break the grid or bleed to the edges of the viewport to create an immersive, high-fashion feel.