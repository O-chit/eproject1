---
name: CraftRoots
colors:
  surface: '#fdf8f6'
  surface-dim: '#ddd9d7'
  surface-bright: '#fdf8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f0'
  surface-container: '#f2edeb'
  surface-container-high: '#ece7e5'
  surface-container-highest: '#e6e2df'
  on-surface: '#1c1b1a'
  on-surface-variant: '#54433a'
  inverse-surface: '#31302f'
  inverse-on-surface: '#f4f0ee'
  outline: '#867368'
  outline-variant: '#d9c2b5'
  surface-tint: '#914c18'
  primary: '#8e4a16'
  on-primary: '#ffffff'
  primary-container: '#ac612c'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb689'
  secondary: '#605e5a'
  on-secondary: '#ffffff'
  secondary-container: '#e6e2dc'
  on-secondary-container: '#666460'
  tertiary: '#006670'
  on-tertiary: '#ffffff'
  tertiary-container: '#00818d'
  on-tertiary-container: '#f6feff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc7'
  primary-fixed-dim: '#ffb689'
  on-primary-fixed: '#311300'
  on-primary-fixed-variant: '#733500'
  secondary-fixed: '#e6e2dc'
  secondary-fixed-dim: '#cac6c1'
  on-secondary-fixed: '#1c1b18'
  on-secondary-fixed-variant: '#484743'
  tertiary-fixed: '#90f1ff'
  tertiary-fixed-dim: '#6ed5e3'
  on-tertiary-fixed: '#001f23'
  on-tertiary-fixed-variant: '#004f57'
  background: '#fdf8f6'
  on-background: '#1c1b1a'
  surface-variant: '#e6e2df'
  canvas-linen: '#F9F8F6'
  surface-crisp: '#FFFFFF'
  surface-subtle: '#F4F2EE'
  border-neutral: '#E6E2DA'
  text-primary: '#1C1B1A'
  text-secondary: '#5A5854'
  accent-terracotta: '#B86B35'
typography:
  display-hero:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '300'
    lineHeight: 56px
    letterSpacing: 0.3em
  display-hero-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '300'
    lineHeight: 36px
    letterSpacing: 0.2em
  headline-statement:
    fontFamily: Montserrat
    fontSize: 22px
    fontWeight: '300'
    lineHeight: 32px
    letterSpacing: 0.25em
  headline-title:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0.02em
  title-card:
    fontFamily: Playfair Display
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: 0.01em
  body-default:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-spec:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.02em
  spec-code:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.06em
  label-signature:
    fontFamily: Playfair Display
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.04em
  label-action:
    fontFamily: Montserrat
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.15em
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

# Human-Crafted Sharp Linework Design System - CraftRoots

## Foundations
- **Color Palette**:
  - Background Canvas: Linen White `#F9F8F6`
  - Secondary Surface / Containers: Pure Crisp Linen `#FFFFFF` or `#F4F2EE`
  - Text Primary: Ink Black `#1C1B1A`
  - Text Secondary: Muted Slate / Charcoal `#5A5854`
  - Brand Accent: Terracotta Warm Rust `#B86B35`
  - Neutral Borders & Lines: `#E6E2DA`
  - Active / Highlight: Terracotta `#B86B35`
- **Border Radii**: 
  - Containers & Cards: `0px` to `2px` (strictly sharp and geometric, no bubbly 20px+ radii)
  - Inputs & Badges: `50px` (clean minimal pill shape where explicitly required)
- **Delimiters**: Vertical pipe separator `|` with opacity `0.35` and `16px` lateral margins (`.choice-item:not(:last-child)::after { content: "|"; margin: 0 16px; opacity: 0.35; font-weight: 300; }`).
- **Elevation**: Flat default with crisp 1px borders (`#E6E2DA`); On hover, crisp vertical lift `translateY(-6px)` to `translateY(-8px)` and grounded shadow `box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08)`.

## Typography
- **Monogram / Brand Touch**: Script / Cursive (`Great Vibes`, `Playfair Display`, or serif italic), refined artisan signature feel.
- **Statement Headlines**: Clean Geometric Sans-serif (`Montserrat` or `Inter`), Uppercase, Weight 200 - 300, Letter-spacing: `4px` - `8px`.
- **Card Titles & Values**: High-contrast Serif or Sans, Medium/Semi-bold, 18px - 24px.
- **Technical Specifications**: Muted Charcoal, 12px - 14px, Line-height 1.6, concrete metrics, Ref/SKU codes, real materials (đất sét cao lanh, đồng thau, tre tự nhiên, men tro củi nung 1300°C).

## Component Disciplines
- **Anti-AI Content**: Strict realistic Vietnamese cultural craft data, verified village origins, genuine master craftsman profiles, exact physical dimensions and materials, no filler or generic marketing hype.
- **Choice Boundaries**: Explicit separation using `|` pipe dividers for menus, tabs, and action icons.
- **Sharp Cards**: Crisp rectangular containers, geometric aspect ratios, object-fit cover imagery.
