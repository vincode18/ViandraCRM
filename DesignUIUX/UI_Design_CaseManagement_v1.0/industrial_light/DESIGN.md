---
name: Industrial Light
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4d4632'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#7f7660'
  outline-variant: '#d1c6ab'
  surface-tint: '#725c00'
  primary: '#725c00'
  on-primary: '#ffffff'
  primary-container: '#f5c800'
  on-primary-container: '#695400'
  inverse-primary: '#eec200'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#cdcdcd'
  on-tertiary-container: '#555757'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe081'
  primary-fixed-dim: '#eec200'
  on-primary-fixed: '#231b00'
  on-primary-fixed-variant: '#564500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

## Brand & Style
This design system embodies high-performance engineering and technical precision. By transitioning to a light-mode foundation, the aesthetic shifts from a "stealth" feel to a "clinical laboratory" atmosphere—bright, highly legible, and efficient. 

The style combines **Minimalism** with subtle **Technical/Brutalistic** influences. It prioritizes clarity and information density, utilizing ample whitespace to separate complex data streams. The visual language evokes the feeling of a professional-grade workstation where speed and accuracy are paramount. The emotional response is one of controlled energy, reliability, and total visibility.

## Colors
The palette is anchored by a high-visibility primary yellow, used strategically to draw attention to critical actions and system status. The background is a clean white, providing maximum contrast for the dark charcoal text.

We utilize a 5-layer neutral hierarchy to define depth:
1.  **Base (#FFFFFF):** The main canvas for the application.
2.  **Surface Low (#F9F9F9):** Used for large container areas and sidebars.
3.  **Surface Medium (#F0F0F0):** Used for nested components and inactive headers.
4.  **Border (#E0E0E0):** The primary divider for structural definition.
5.  **Text Primary (#121212):** High-contrast black for readability.

Primary accents (#F5C800) should be paired with dark charcoal text for accessibility.

## Typography
The typography strategy employs a dual-font approach. **Hanken Grotesk** is used for the primary UI and editorial content, offering a clean, contemporary feel that remains legible even at high densities. **JetBrains Mono** is utilized for labels, technical data, and code snippets, reinforcing the engineering-first nature of the design system.

Headlines use a bold weight and slightly tight letter-spacing to command authority. Technical labels are always monospaced to ensure numerical alignment and a "low-level" system feel.

## Layout & Spacing
The design system follows a strict **8px grid** to maintain mathematical alignment. The layout model is a **12-column fluid grid** for desktop, collapsing to a single column for mobile. 

Margins are generous at 24px on desktop to allow the content to breathe against the light background, while gutters are kept at 16px to maintain a tight relationship between related components. Components should use `md` (16px) padding as a default, scaling down to `sm` (8px) for compact data views.

## Elevation & Depth
Depth in this light mode system is communicated through **Tonal Layering** and **Low-Contrast Outlines** rather than heavy shadows. 

Objects "closer" to the user are rendered on whiter surfaces with thin #E0E0E0 borders. Background elements sit on #F9F9F9 or #F0F0F0. To maintain the industrial aesthetic, shadows are used sparingly—only for transient elements like dropdowns or modals—and are defined as highly diffused, 10% opacity neutral-grey shadows. This ensures the UI feels grounded and physical without becoming "mushy."

## Shapes
This design system utilizes a **Soft (1)** roundedness profile. A base border-radius of 0.25rem (4px) is applied to buttons, inputs, and small containers. This slight rounding softens the industrial edges just enough to feel modern and accessible while retaining a sense of structural rigidity.

Large containers or "cards" may use `rounded-lg` (8px) to clearly define major content sections. Technical elements like status pips remain perfectly circular.

## Components

-   **Buttons:** Primary buttons are #F5C800 with #121212 text, creating a powerful focal point. Secondary buttons use a #121212 border and text. Ghost buttons use #575757 text for tertiary actions.
-   **Inputs:** Field backgrounds are #FFFFFF with a 1px #E0E0E0 border. On focus, the border shifts to #121212 or a primary yellow glow. Labels use JetBrains Mono for a technical feel.
-   **Cards:** Containers use #FFFFFF backgrounds with a #E0E0E0 border. No shadow is applied by default; depth is created by placing the white card on a #F9F9F9 background.
-   **Chips/Badges:** Small, monospaced tags used for status. Inactive tags use #F0F0F0; active or "warning" tags utilize the primary yellow.
-   **Lists:** Row items are separated by 1px #E0E0E0 horizontal dividers. Hover states should utilize a subtle #F9F9F9 background shift.
-   **Checkboxes/Radios:** Square-ish (4px radius) with #121212 strokes. When selected, they fill with #F5C800 and a dark checkmark.