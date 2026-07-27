# NEXSTEP Design System

## Overview

NEXSTEP uses a **premium monochrome sneaker-commerce design system** built exclusively from black and white. The interface combines a clean white canvas, strong black typography, high-contrast product photography, sharp borders, and a structured e-commerce flow. The visual direction should feel modern, athletic, editorial, product-first, and retail-ready.

The design is not a dense marketplace page. It should present a rich catalogue while remaining curated, spacious, and brand-led. Visual strength comes from **oversized Bebas Neue titles, readable Montserrat descriptions, consistent product grids, bold black-and-white contrast, and disciplined spacing**.

The primary identity is built around two base colours only:

- **White** (`{colors.white}` — `#FFFFFF`) for the page canvas, product cards, forms, image zones, content surfaces, and negative space.
- **Black** (`{colors.black}` — `#000000`) for titles, body text, navigation, borders, icons, buttons, badges, footer, and active states.

Opacity variants may be created from black or white using `rgba()` for hierarchy, disabled states, overlays, hairlines, and subtle surfaces. No hue other than black and white may be introduced into the interface.

The homepage follows this structure:

1. Clean white header with NEXSTEP logo, centred navigation, monochrome utility icons, and black `Shop Now` CTA.
2. Large hero section with a Bebas Neue headline on the left and one dominant sneaker image on the right.
3. Compact product rows for Weekly Flash Deals, New Arrivals, and Best Sellers.
4. Editorial image gallery with sneaker lifestyle and warehouse/product imagery.
5. Curated product category rows: Luxury Sneakers, Streetwear Essentials, Performance Classics, and Warehouse Ready.
6. Warehouse/logistics trust section with map, fulfilment imagery, and service benefits.
7. Testimonials and community video previews.
8. Why Choose Us benefit strip.
9. Newsletter CTA.
10. Black premium e-commerce footer.

**Key Characteristics:**

- **Strict monochrome retail:** only black, white, and their opacity variants.
- **Typography-led hierarchy:** Bebas Neue for titles; Montserrat for descriptions and interface copy.
- **Product-first composition:** sneaker images remain large, clear, and consistent.
- **Editorial hero:** strong campaign headline, one hero product, and minimal supporting copy.
- **Flat visual system:** use borders, inversion, and spacing instead of coloured accents or heavy shadows.
- **Consistent product grid:** cards align precisely with equal image ratios and clean pricing.
- **Commercial clarity:** every section supports browsing, trust, and conversion.

## Colors

### Core Palette

- **Pure White** (`{colors.white}` — `#FFFFFF`): Main page background, product cards, content surfaces, input backgrounds, and whitespace.
- **Pure Black** (`{colors.black}` — `#000000`): Titles, descriptions, logo, navigation, product names, prices, icons, buttons, badges, borders, and footer.
- **Black 72%** (`{colors.black-72}` — `rgba(0,0,0,0.72)`): Secondary body text, metadata, helper text, and footer supporting copy.
- **Black 48%** (`{colors.black-48}` — `rgba(0,0,0,0.48)`): Placeholders, old prices, disabled text, and unavailable variants.
- **Black 16%** (`{colors.black-16}` — `rgba(0,0,0,0.16)`): Standard card borders, dividers, input borders, and inactive controls.
- **Black 8%** (`{colors.black-08}` — `rgba(0,0,0,0.08)`): Subtle section bands, image-zone separation, skeleton loading, and hover surfaces.
- **White 72%** (`{colors.white-72}` — `rgba(255,255,255,0.72)`): Supporting text on black surfaces.
- **White 16%** (`{colors.white-16}` — `rgba(255,255,255,0.16)`): Dividers and borders on dark surfaces.

### Brand & Accent

The brand has no separate accent hue. Emphasis is created through black-and-white inversion.

- **Primary** (`{colors.primary}` — `#000000`): Main CTA, selected state, important badge, active control, and focus border.
- **Primary Hover** (`{colors.primary-hover}` — `rgba(0,0,0,0.84)`): Hover state for black controls.
- **Primary Active** (`{colors.primary-active}` — `rgba(0,0,0,0.72)`): Pressed state.
- **Primary Soft** (`{colors.primary-soft}` — `rgba(0,0,0,0.08)`): Selected chip background, subtle notification, or secondary surface.
- **On Primary** (`{colors.on-primary}` — `#FFFFFF`): Text and icons on black controls.

### Surface

- **Canvas** (`{colors.canvas}` — `#FFFFFF`): Default page background.
- **Surface** (`{colors.surface}` — `#FFFFFF`): Product cards, modals, inputs, checkout panels, and cart drawer.
- **Surface Soft** (`{colors.surface-soft}` — `rgba(0,0,0,0.04)`): Product image area and subtle section separation.
- **Surface Strong** (`{colors.surface-strong}` — `rgba(0,0,0,0.08)`): Skeletons, selected rows, and stronger monochrome bands.
- **Surface Inverse** (`{colors.surface-inverse}` — `#000000`): Footer, dark campaign panel, tooltip, and inverse CTA.

### Hairlines & Borders

- **Hairline** (`{colors.hairline}` — `rgba(0,0,0,0.16)`): Standard product card, input, and section border.
- **Hairline Strong** (`{colors.hairline-strong}` — `rgba(0,0,0,0.32)`): Hovered card, dropdown, and focused container border.
- **Border Ink** (`{colors.border-ink}` — `#000000`): Selected variants, outline buttons, focus states, and strong dividers.
- **Border Inverse** (`{colors.border-inverse}` — `rgba(255,255,255,0.24)`): Dividers and inputs on black surfaces.

### Text

- **Ink** (`{colors.ink}` — `#000000`): Titles, navigation, product names, prices, labels, and primary body text.
- **Body** (`{colors.body}` — `rgba(0,0,0,0.78)`): Long descriptions and supporting paragraphs.
- **Muted** (`{colors.muted}` — `rgba(0,0,0,0.56)`): Metadata, categories, old prices, helper text, and secondary links.
- **Muted Soft** (`{colors.muted-soft}` — `rgba(0,0,0,0.40)`): Placeholder text and disabled content.
- **On Dark** (`{colors.on-dark}` — `#FFFFFF`): Titles and controls on black surfaces.
- **On Dark Muted** (`{colors.on-dark-muted}` — `rgba(255,255,255,0.68)`): Secondary footer and dark-panel copy.

### Product and System Status

All statuses remain monochrome. Meaning must be communicated through text, icon shape, border style, and pattern—not hue.

- **Sale**: black badge with white text.
- **Limited**: white badge with black dashed border.
- **New**: white badge with black solid border.
- **Best Seller**: black badge with white text.
- **In Stock**: black text with filled-circle icon.
- **Low Stock**: black text with outlined warning icon.
- **Out of Stock**: 48% black text with line-through treatment.
- **Success**: black confirmation icon plus explicit success label.
- **Warning**: black warning icon plus explicit warning label.
- **Error**: black error icon, strong border, and explicit error message.

### Color Usage Ratio

Recommended page ratio:

- **White and transparent white surfaces:** 72–82%
- **Black text, borders, buttons, and footer:** 18–28%

Never introduce a third colour. Contrast and hierarchy must come from scale, font, weight, opacity, border treatment, and inversion.

## Typography

### Font Family

The typography combines a bold condensed display face with a clean geometric sans-serif:

- **Bebas Neue** for hero headlines, page titles, section titles, promotional numbers, and major campaign labels.
- **Montserrat** for descriptions, navigation, buttons, product information, forms, pricing, labels, captions, and all long-form content.

Recommended CSS stacks:

```css
/* Display and title text */
font-family: "Bebas Neue", "Arial Narrow", Impact, sans-serif;

/* Description and interface text */
font-family: "Montserrat", Arial, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
```

Guidelines:

- Bebas Neue is reserved for headings and high-impact display text.
- Montserrat is mandatory for paragraphs and descriptive content.
- Avoid long paragraphs in Bebas Neue because the condensed uppercase construction reduces readability.
- Titles may use uppercase naturally because Bebas Neue is designed for display.
- Navigation and product names should use Montserrat unless they function as a major section title.
- Do not introduce additional decorative or body fonts.

### Hierarchy

| Token | Font | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---:|---:|---:|---:|---|
| `{typography.hero-xl}` | Bebas Neue | 88px | 400 | 0.88 | 0.5px | Homepage hero headline |
| `{typography.hero-lg}` | Bebas Neue | 68px | 400 | 0.9 | 0.5px | Large campaign title |
| `{typography.display-xl}` | Bebas Neue | 48px | 400 | 0.95 | 0.4px | Page and editorial title |
| `{typography.display-lg}` | Bebas Neue | 40px | 400 | 1.0 | 0.3px | Section title and PDP title |
| `{typography.display-md}` | Bebas Neue | 32px | 400 | 1.0 | 0.3px | Product-section heading |
| `{typography.title-lg}` | Bebas Neue | 26px | 400 | 1.05 | 0.2px | Card-group and footer title |
| `{typography.title-md}` | Montserrat | 16px | 700 | 1.3 | 0 | Product-card title |
| `{typography.title-sm}` | Montserrat | 14px | 700 | 1.3 | 0 | Footer heading and small group title |
| `{typography.nav}` | Montserrat | 14px | 600 | 1.2 | 0.1px | Header navigation |
| `{typography.body-lg}` | Montserrat | 18px | 400 | 1.65 | 0 | Hero description and introductory copy |
| `{typography.body-md}` | Montserrat | 16px | 400 | 1.6 | 0 | Default descriptions |
| `{typography.body-sm}` | Montserrat | 14px | 400 | 1.5 | 0 | Product metadata and helper text |
| `{typography.caption}` | Montserrat | 12px | 500 | 1.4 | 0.1px | Category and badge text |
| `{typography.caption-bold}` | Montserrat | 11px | 700 | 1.3 | 0.3px | Sale badge and compact labels |
| `{typography.price}` | Montserrat | 16px | 700 | 1.25 | 0 | Product-card price |
| `{typography.price-lg}` | Montserrat | 22px | 700 | 1.25 | 0 | Product-detail price |
| `{typography.button-md}` | Montserrat | 14px | 700 | 1.2 | 0.2px | Main CTA |
| `{typography.button-sm}` | Montserrat | 12px | 700 | 1.2 | 0.2px | Small button or badge |

### Principles

- Hero and major section titles use Bebas Neue for a strong editorial identity.
- Descriptions always use Montserrat with comfortable line height.
- Keep Bebas Neue titles short, direct, and visually dominant.
- Product titles, prices, metadata, and controls use Montserrat.
- Do not imitate hierarchy by adding colour; use font family, scale, weight, opacity, and whitespace.
- Buttons should feel crisp, commercial, and readable.
- Avoid text-heavy cards and keep product information concise.

### Product Name Rules

Use compact sneaker naming:

```txt
{Model Name} {Colour / Style}
```

Examples:

- `Desert Runner Black`
- `Urban Speed White`
- `Core Low Black White`
- `Vintage Low White`
- `Aero Glide Black`
- `Heritage Mono`
- `Shadow Mid 03`
- `All Core Comfort Black`

Product cards should show:

1. Product image
2. Product name in Montserrat
3. Optional category/style label
4. Price
5. Optional old price
6. Optional monochrome badge: `New`, `Limited`, `Best Seller`, or `-25%`

## Layout

### Spacing System

- **Base unit:** 4px.
- **Tokens:** `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 12px · `{spacing.base}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.2xl}` 48px · `{spacing.section}` 72px · `{spacing.hero}` 96px.
- **Header height desktop:** 64px.
- **Header height mobile:** 56–64px.
- **Homepage horizontal padding desktop:** 80–96px.
- **Homepage horizontal padding tablet:** 32–48px.
- **Homepage horizontal padding mobile:** 16–20px.
- **Hero height desktop:** 420–520px.
- **Section vertical spacing:** 40–72px depending section density.
- **Product grid gap:** 16–24px.
- **Card padding:** 16px.
- **Card border:** 1px `rgba(0,0,0,0.16)`.
- **Footer padding:** 56–72px desktop, 32–40px mobile.

### Grid & Container

- **Max content width:** 1440px for landing page content.
- **Hero layout desktop:** 12-column split layout.
  - Left content: 5 columns.
  - Right product image: 7 columns.
- **Weekly Flash Deals:** 5-column product row on desktop.
- **New Arrivals:** 4-column grid, 2 rows on desktop.
- **Best Sellers:** 6-column horizontal row on desktop.
- **Editorial Gallery:** asymmetric media grid with text block + 4–5 lifestyle images.
- **Category Rows:** 4 category blocks, each with 3–4 mini products.
- **Warehouse Section:** left text + map, right warehouse image grid.
- **Testimonials/Community:** testimonial cards on left, video cards on right.

### Header Layout

Desktop header:

- Left: `NEXSTEP` logo in black.
- Center: navigation links.
- Right: search icon, wishlist icon, cart icon, black `Shop Now` button.
- Background: white.
- Border-bottom: 1px `rgba(0,0,0,0.16)`.
- Height: 64px.
- Logo: bold black wordmark.
- Nav text: title case, medium weight, black.
- Icons: simple monochrome line icons.

Navigation labels:

- `New Arrivals`
- `Best Sellers`
- `Sneakers`
- `Streetwear`
- `Reviews`
- `About`

Rules:

- Keep header minimal and flat.
- Do not use heavy shadows or glassmorphism.
- Do not use uppercase navigation.
- CTA button should be small, crisp, black, and aligned with icon height.

### Homepage Layout

The homepage should follow the new visual order:

1. `site-header`
2. `hero-section`
3. `weekly-flash-deals`
4. `new-arrivals`
5. `best-sellers`
6. `editorial-gallery`
7. `category-showcase`
8. `warehouse-trust`
9. `testimonials-community`
10. `why-choose-us`
11. `newsletter-strip`
12. `site-footer`

### Whitespace Philosophy

The page should feel **minimal but product-rich**:

- Keep product cards clean and aligned.
- Avoid large empty gaps that make the page feel unfinished.
- Use whitespace to separate sections rather than adding heavy backgrounds.
- Use borders, consistent spacing, and typographic hierarchy to create structure.
- Avoid excessive badges, floating labels, and decorative elements.

---

## Elevation

The design should be mostly flat. Borders and spacing define hierarchy more than shadows.

### Shadow Tokens

- **None** (`{shadow.none}`): Default for product cards, header, sections, footer.
- **Subtle** (`{shadow.subtle}`): `0 1px 2px rgba(17,17,17,0.06)` — sticky header, small hover state.
- **Dropdown** (`{shadow.dropdown}`): `0 8px 24px rgba(17,17,17,0.12)` — dropdowns, mega menu, account menu.
- **Modal** (`{shadow.modal}`): `0 24px 60px rgba(17,17,17,0.22)` — cart drawer, quick-add modal.

### Elevation Rules

- Product cards should use a thin border, not heavy shadow.
- Hover can slightly darken the border or reveal quick actions.
- Hero shoe can use a soft natural product shadow.
- Footer should be flat black.
- Avoid glassmorphism, large blurred shadows, and heavy rounded SaaS cards.

---

## Components

### Header

**`site-header`** — Minimal white navigation bar.

Specs:

- Background: `#FFFFFF`
- Text/icon: `#000000`
- Border-bottom: 1px `rgba(0,0,0,0.16)`
- Height: 64px desktop
- Logo: bold black wordmark, left aligned
- Navigation: centered, title case
- Utility icons: search, wishlist, cart
- CTA: black `Shop Now`

Behavior:

- Sticky optional.
- On scroll, keep white background.
- No blur/glass effect.
- Dropdown menus should be clean white panels with black-opacity border.

### Hero Section

**`hero-section`** — Large editorial product campaign.

Content:

- Label: `NEW DROP SEASON`
- Headline: `Step Into The Next Drop`
- Subheadline: `Premium sneakers, limited releases, and streetwear essentials curated for everyday rotation.`
- Primary CTA: `Shop New Arrivals`
- Secondary CTA: `View Best Sellers`
- Trust points: `100% Authentic`, `Fast Worldwide Shipping`, `Easy Returns`
- Hero image: one large sneaker product on the right

Specs:

- Background: `#FFFFFF`
- Optional subtle grid lines or faint oversized letterform in `rgba(0,0,0,0.04)`
- Main headline: black, very bold, large
- Primary CTA: black background, white text
- Secondary CTA: white background, black text, black border
- Accent usage: small black label, CTA, tiny graphic marks only
- Carousel controls: small circular icon buttons, white with a black-opacity border, active black icon

Rules:

- Keep the hero spacious.
- Product image must be the main visual focus.
- Avoid excessive stickers, tags, graphics, or noisy backgrounds.
- The hero should feel athletic, premium, and editorial.

### Section Header

**`section-header`**

Specs:

- Title: black, 20–24px, 700.
- Optional link on right: `View All`, black text, small arrow.
- Section title alignment: left.
- Margin-bottom: 16–24px.

Rules:

- Keep titles short.
- Do not add decorative dividers unless needed.
- Use one consistent section header pattern across the page.

### Product Card

**`product-card`** — Clean bordered sneaker card.

Specs:

- Background: `#FFFFFF`
- Border: 1px `rgba(0,0,0,0.16)`
- Radius: 4–6px
- Padding: 16px
- Shadow: none
- Image area: white or a subtle black-opacity surface
- Product image: centered, object-contain
- Wishlist icon: top-right, black at full or reduced opacity line icon
- Product title: black, 14–16px, 600–700
- Price: black, 14–16px, 700
- Old price: black at reduced opacity with strikethrough

Rules:

- Keep card information minimal.
- Do not show too many labels per card.
- Use consistent image scale and product alignment.
- Product card hover can slightly darken border and reveal quick add.

### Product Badge

**`product-badge`**

Types:

- Sale percentage: black background, white text, e.g. `-25%`.
- New: white background, black text, and a solid black border, e.g. `New`.
- Limited: white background, black text, and a dashed black border, e.g. `Limited`.
- Best Seller: black background, white text, e.g. `Best Seller`.

Specs:

- Font size: 11–12px.
- Font weight: 700.
- Radius: 3–4px.
- Padding: 4px 8px.

Rules:

- Maximum one primary badge per product card.
- Do not overuse black badges across every product.

### Weekly Flash Deals

**`weekly-flash-deals`**

Layout:

- 5 product cards on desktop.
- Each card includes sale badge, wishlist icon, product image, name, price, old price.
- Section link: `View All Deals`.

Rules:

- Keep this section compact.
- Avoid making sale cards visually louder than the hero.
- black should mainly appear in discount badges.

### New Arrivals

**`new-arrivals`**

Layout:

- 4-column grid.
- 8 products maximum on homepage.
- Section link: `View All New Arrivals`.

Rules:

- Product cards should be clean, consistent, and spacious.
- Use `New` or `Limited` labels sparingly.
- Prioritize clear product names and prices.

### Best Sellers

**`best-sellers`**

Layout:

- Horizontal row or carousel-like 6-card layout.
- Small carousel arrows on the right.
- Badges may include `Best Seller`, `Top Pick`, or `Fast Shipping`.

Rules:

- Cards can be slightly more compact than New Arrivals.
- Do not create a heavy carousel UI; keep it flat and simple.

### Editorial Gallery

**`editorial-gallery`** — Lifestyle and product culture section.

Content:

- Headline: `Built For Collectors, Styled For Everyday`
- Copy: short paragraph about sneaker culture, street fits, and everyday rotation.
- CTA: `Explore The Collection`
- Images: shoeboxes, on-feet sneakers, streetwear outfit, warehouse aisle, product unboxing.

Layout:

- Left text block.
- Right asymmetric image grid.
- Images should align tightly with clean gutters.

Rules:

- This section should feel editorial and premium.
- Avoid cluttered collage effects.
- Use real-looking lifestyle and warehouse photography.

### Category Showcase

**`category-showcase`**

Categories:

- `Luxury Sneakers`
- `Streetwear Essentials`
- `Performance Classics`
- `Warehouse Ready`

Layout:

- 4 category columns on desktop.
- Each category has title, `View All` link, and 3–4 mini product previews.

Rules:

- Keep mini products simple.
- Do not make category cards too tall or too decorative.
- Use product thumbnails with clear names and prices.

### Warehouse Trust Section

**`warehouse-trust`**

Content:

- Headline: `Fast Fulfillment From Trusted Warehouses`
- Supporting text: short copy about global facilities and fast dispatch.
- Benefit icons: `Verified Authentic`, `Worldwide Shipping`, `Easy Returns`, `Easy Returns / Easy Service`
- Map illustration with black route lines.
- Warehouse image grid on the right.

Specs:

- Background: white or `rgba(0,0,0,0.04)` with thin border.
- Icons: monochrome black line icons.
- black: only for map route accents and small markers.

Rules:

- Keep the logistics section clean and credible.
- Avoid overly complex map graphics.
- Use warehouse imagery to support trust.

### Testimonials

**`testimonial-card`**

Content:

- Star rating in black.
- Short review text.
- Avatar image.
- Name.
- Verified Buyer label.

Specs:

- Background: white.
- Border: 1px `rgba(0,0,0,0.16)`.
- Radius: 6px.
- Padding: 20–24px.
- Stars: black.
- Review text: black.
- Metadata: black at reduced opacity.

Rules:

- Keep reviews short and believable.
- Do not make review cards visually busy.

### Community Video Cards

**`community-video-card`**

Content:

- Thumbnail image.
- Center play button.
- Title, e.g. `Summer Pickups`, `Top 5 Sneakers`, `Streetwear Fit`, `Warehouse Tour`.
- Subtitle, e.g. `Unboxing & Review`, `This Week`, `Lookbook`, `Behind The Scenes`.

Specs:

- Thumbnail aspect ratio: 16:9.
- Play button: white circle with black icon, subtle shadow.
- Title: black.
- Subtitle: black at reduced opacity.

Rules:

- Video cards should feel like real community content.
- Do not overuse heavy overlays.

### Why Choose Us

**`why-choose-us`**

Items:

- `Authentic Style Selection`
- `Fast Shipping`
- `Secure Checkout`
- `Responsive Support`

Specs:

- Use monochrome line icons.
- Thin top/bottom borders.
- Compact horizontal layout on desktop.
- Stack on mobile.

Rules:

- This section should be simple and trustworthy.
- Do not use large decorative cards.

### Newsletter Strip

**`newsletter-strip`**

Content:

- Headline: `Get Early Access To New Drops`
- Supporting text about restocks, exclusive offers, and limited releases.
- Email input.
- black `Subscribe` button.
- Optional package/box illustration on the right.

Specs:

- Background: white or a subtle black-opacity surface.
- Input border: `rgba(0,0,0,0.16)`.
- Button: black.
- Illustration: subtle, product-related, not dominant.

Rules:

- Keep the form simple.
- Do not use aggressive pop-up styling.

### Footer

**`site-footer`** — Premium black e-commerce footer.

Specs:

- Background: `#000000`
- Primary text: `#FFFFFF`
- Secondary text: `rgba(0,0,0,0.40)`
- Divider: rgba(255,255,255,0.14)
- Link hover: `#000000`
- Payment badges: clean and small
- Social icons: white or black at reduced opacity, hover inverted

Footer columns:

- Brand block: `NEXSTEP`, description, social icons.
- `Shop`: New Arrivals, Best Sellers, Sneakers, Streetwear, Sale.
- `Support`: Help Center, Shipping & Returns, Size Guide, Track Your Order, FAQ.
- `Company`: Reviews, About Us, Blog, Careers, Contact Us.
- Payment: accepted cards and pay-later options.

Rules:

- Keep footer compact and structured.
- Do not add large colorful footer graphics.
- Use white or black at reduced opacity text hierarchy clearly.

---

## Buttons

### Primary Button

**`button-primary`**

- Background: `#000000`
- Hover: `rgba(0,0,0,0.84)`
- Active: `rgba(0,0,0,0.72)`
- Text: `#FFFFFF`
- Height: 44–48px
- Padding: 0 20–24px
- Radius: 4px
- Font: 14px, 700
- Use for: `Shop Now`, `Shop New Arrivals`, `Subscribe`, `Checkout`, `Add to Cart`.

### Secondary Button

**`button-secondary`**

- Background: `#FFFFFF`
- Border: 1px solid `#000000`
- Text: `#000000`
- Hover background: `#000000`
- Hover text: `#FFFFFF`
- Height: 44–48px
- Radius: 4px
- Use for: `View Best Sellers`, `Continue Shopping`, `Clear Filters`.

### Ghost Link Button

**`button-link`**

- Background: transparent
- Text: `#000000`
- Hover text: `#000000`
- Icon: small arrow
- Use for: `View All`, `View All Deals`, `View All New Arrivals`.

### Icon Button

**`icon-button`**

- Icon color: `#000000`
- Hover color: `#000000`
- Active color: `#000000`
- Size: 40px
- Background: transparent or white
- Border: none or 1px `rgba(0,0,0,0.16)` for carousel controls
- Used for search, wishlist, cart, carousel arrows, video play.

---

## Forms

### Text Input

**`text-input`**

- Background: `#FFFFFF`
- Border: 1px `rgba(0,0,0,0.16)`
- Text: `#000000`
- Placeholder: `rgba(0,0,0,0.40)`
- Height: 44–48px
- Radius: 4px
- Padding: 0 14–16px
- Focus border: 1.5–2px `#000000`
- Error border: `#000000`

### Select Input

**`select-input`**

- Same style as text input.
- Chevron icon black.
- Focus border black.

### Checkbox

**`checkbox`**

- Border: `#000000`
- Checked background: `#000000` or `#000000`
- Check icon: white
- Use for filters, agreement, newsletter consent.

---

## Product Detail Page Guidelines

Product detail pages should extend the same visual system:

- Large product gallery on the left.
- Purchase panel on the right.
- Product title in bold black.
- Price in black; sale/limited highlight in black.
- Variant selector with clean bordered chips.
- Primary `Add to Cart` button in black.
- Secondary `Buy Now` or `Wishlist` action in black/outline.
- Product description in clean rich text.
- Related products in the same card system as homepage.

### Product Gallery

- Main image ratio: 1:1 or 4:5.
- Background: white or `rgba(0,0,0,0.04)`.
- Product must be centered.
- Thumbnails use black-opacity borders.
- Selected thumbnail uses black or black border.

### Product Purchase Panel

- Background: white.
- No heavy card shadow.
- Use spacing and divider lines.
- Variant chips should be simple and rectangular with small radius.
- Shipping/trust notes use small monochrome icons.

### Rich Description

Because product descriptions may come from rich text content, style them consistently:

- Text: `rgba(0,0,0,0.78)`
- Max width: 760–880px
- Body: 16px / 1.6
- H2: 24px / 700
- H3: 18px / 700
- Paragraph margin: 12–16px
- Links: black
- Tables: 1px `rgba(0,0,0,0.16)` border
- Table header: `rgba(0,0,0,0.04)`

Recommended sections:

- Product Overview
- Materials & Fit
- Size Guide
- Shipping & Returns
- Care Instructions

---

## Catalog / Collection Page Guidelines

Collection pages should be cleaner than the old catalog-style design:

- White header.
- Simple page title.
- Optional category tabs or filter drawer.
- Product grid with 4 columns on desktop.
- Sort control on the right.
- Filter sidebar only when necessary; otherwise use top filter chips.
- Product cards use the same homepage card style.
- Footer remains black.

Rules:

- Avoid dense sidebar-heavy layout unless the collection is large.
- Keep filters minimal: category, size, color, price, availability.
- Use `View All`, sort, and pagination/load more with simple link/button styling.

---

## Responsive Behavior

| Name | Width | Key Changes |
|---|---:|---|
| Mobile | < 640px | Header collapses to logo + menu + cart. Hero stacks vertically. Product grids become 2 columns. Gallery becomes stacked. Footer columns become accordion. |
| Tablet | 640–1024px | Header nav may collapse. Hero remains split or stacked depending space. Product grids become 3 columns. Category showcase becomes 2 columns. |
| Desktop | 1024–1440px | Full header, split hero, 4-column New Arrivals, 5-card flash row, full footer. |
| Wide | > 1440px | Content caps around 1440px. Maintain generous whitespace and do not stretch cards too wide. |

### Touch Targets

- Main CTA: minimum 44–48px height.
- Icon buttons: minimum 40×40px.
- Mobile menu rows: minimum 44px height.
- Product card link area: entire card or image/title should be clickable.
- Filter chips: minimum 36–40px height.

### Mobile Rules

- Hero image should appear below headline or after CTA.
- Product cards must remain readable in 2-column grid.
- Hide secondary decorative hero elements on mobile.
- Use horizontal scroll only for compact product rows when necessary.
- Footer columns can collapse into accordions.

---

## Montserrataction States

### Hover

- Nav links invert to white on black or underline subtly.
- Product card border darkens from `rgba(0,0,0,0.16)` to `rgba(0,0,0,0.32)`.
- Product image may scale to `1.02`.
- Wishlist icon turns black.
- Primary button uses darker black.
- Footer links invert to white on black.

### Active

- Active nav link can use black text with subtle underline, or black text sparingly.
- Selected filter chip uses black border or black at 8% opacity background.
- Selected variant uses black border.
- Active carousel dot/control uses black.

### Focus

- Buttons and links need visible focus ring.
- Inputs use black focus border.
- Drawer/modal focus must be trapped.
- Keyboard navigation must be clear.

### Disabled

- Disabled button background: `rgba(0,0,0,0.16)`.
- Disabled text: `rgba(0,0,0,0.40)`.
- Disabled variant: muted with line-through or unavailable label.

### Loading

- Skeleton background: `rgba(0,0,0,0.04)`.
- Skeleton highlight: `rgba(0,0,0,0.02)`.
- Product grid should preserve layout while loading.
- CTA loading state keeps button dimensions stable.

### Empty States

Examples:

- Empty cart: `Your cart is empty` + black `Shop New Arrivals`.
- No products: `No sneakers found` + outline `Clear Filters`.
- Failed checkout: use black icon and explicit error text, with a black retry CTA.

---

## Imagery

### Product Photography

- Use clean cutout sneaker images.
- Background should be white or very white with a black-opacity border.
- Product must be centered and sharp.
- Maintain consistent scale across product cards.
- Use object-contain for product cards.
- Use natural soft shadow under shoes when appropriate.
- Avoid busy lifestyle backgrounds inside product cards.

### Hero Imagery

- Use one large high-quality sneaker image.
- The shoe should feel premium, sharp, and energetic.
- Hero background remains minimal: white, faint black-opacity grid, subtle oversized letterform, or minimal black graphic strokes.
- Avoid multiple competing shoe images in the hero.

### Lifestyle Imagery

- Use editorial sneaker culture photography.
- Recommended subjects: on-feet shots, streetwear outfits, shoebox stacks, warehouse shelves, unboxing, product packing.
- Keep image crops clean and intentional.
- Avoid collage clutter and random stock-photo feel.

### Image Ratios

| Use | Ratio |
|---|---|
| Product card | 4:3 or 1:1 image area |
| Product detail main image | 1:1 or 4:5 |
| Hero image area | 16:9 or free editorial crop |
| Editorial gallery image | 4:3, 3:4, or 1:1 depending grid |
| Community video thumbnail | 16:9 |
| Warehouse image | 16:9 / 2:1 |
| Footer/payment icons | Native badge ratio |

---

## Page-Level Guidelines

### Homepage

Required sections:

- Header
- Hero campaign
- Weekly Flash Deals
- New Arrivals
- Best Sellers
- Editorial Gallery
- Category Showcase
- Warehouse Trust Section
- Testimonials + Community Videos
- Why Choose Us
- Newsletter
- Footer

Color usage:

- White background.
- Black navigation and text.
- black-opacity borders and muted labels.
- black only for CTA, sale, and small highlights.
- Footer black.

### Collection Page

Required elements:

- Header
- Collection title
- Optional short description
- Filter chips/sidebar
- Sort control
- Product grid
- Pagination or Load More
- Footer

### Product Detail Page

Required elements:

- Header
- Product gallery
- Product title and price
- Variant selector
- Size guide
- Add to cart
- Shipping/returns notes
- Rich product description
- Related products
- Footer

### Cart & Checkout

Cart and checkout must feel clean and trustworthy:

- White background.
- Black text.
- black primary action.
- Thin black-opacity borders.
- Clear item rows.
- Clear totals.
- Minimal distractions.
- Secure checkout indicators.

---

## Tailwind Token Recommendation

Recommended Tailwind colour extension:

```ts
colors: {
  white: "#FFFFFF",
  black: "#000000",

  canvas: "#FFFFFF",
  surface: "#FFFFFF",
  "surface-soft": "rgba(0,0,0,0.04)",
  "surface-strong": "rgba(0,0,0,0.08)",
  "surface-inverse": "#000000",

  ink: "#000000",
  body: "rgba(0,0,0,0.78)",
  muted: "rgba(0,0,0,0.56)",
  "muted-soft": "rgba(0,0,0,0.40)",
  "on-dark": "#FFFFFF",
  "on-dark-muted": "rgba(255,255,255,0.68)",

  primary: "#000000",
  "primary-hover": "rgba(0,0,0,0.84)",
  "primary-active": "rgba(0,0,0,0.72)",
  "primary-soft": "rgba(0,0,0,0.08)",
  "on-primary": "#FFFFFF",

  hairline: "rgba(0,0,0,0.16)",
  "hairline-strong": "rgba(0,0,0,0.32)",
  "border-ink": "#000000",
  "border-inverse": "rgba(255,255,255,0.24)"
}
```

Recommended radius extension:

```ts
borderRadius: {
  none: "0px",
  xs: "2px",
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  full: "9999px"
}
```

Recommended shadow extension:

```ts
boxShadow: {
  subtle: "0 1px 2px rgba(0,0,0,0.08)",
  dropdown: "0 8px 24px rgba(0,0,0,0.16)",
  modal: "0 24px 60px rgba(0,0,0,0.28)"
}
```

Recommended font-family extension:

```ts
fontFamily: {
  display: [
    "Bebas Neue",
    "Arial Narrow",
    "Impact",
    "sans-serif"
  ],
  sans: [
    "Montserrat",
    "Arial",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "sans-serif"
  ]
}
```

Recommended typography utility notes:

- Use `font-display` for hero, page, campaign, and section titles.
- Use `font-sans` for descriptions, product information, navigation, forms, and buttons.
- Use `text-black` for primary content and `text-black/60` for metadata.
- Use `bg-black text-white` for primary CTA and important badges.
- Use `border-black/15` for product cards and standard dividers.
- Use `bg-black` for the footer and inverse campaign panels.
- Never add a non-monochrome Tailwind colour class to the UI.

## Accessibility

- `#000000` on `#FFFFFF` is the default high-contrast pairing.
- `#FFFFFF` on `#000000` is used for primary CTA, badges, footer, and inverse panels.
- Secondary text must retain sufficient opacity and should normally stay at or above `rgba(0,0,0,0.56)` on white.
- Do not rely on opacity alone for status meaning; include explicit text and a recognisable icon.
- Error, warning, and success states must use labels and symbols because no semantic hue is available.
- All icons need accessible labels.
- Product cards need descriptive link labels.
- Review ratings should include accessible text.
- Video cards should have accessible play labels.
- Header and footer links must be keyboard accessible.
- Cart drawer and mobile menu must trap focus.
- Buttons require a visible black or white focus outline depending on the surface.
- Forms must show clear text-based error messages.
- Bebas Neue must not be used for long descriptions or form help text.

## Known Gaps

- The provided landing page image is a static visual reference, so hover states, dropdowns, drawers, and loading states need validation during frontend implementation.
- Product image consistency depends on clean asset preparation; mismatched crops will break the premium grid feel.
- Large black surfaces must be controlled carefully; keep the white canvas dominant so the design remains premium.
- Mobile layout should be manually QA-tested because product-rich pages can become cramped.
- The NEXSTEP logo in the mockup should be treated as direction only; final logo spacing and wordmark proportions should follow actual brand assets.

---

## Source Notes

Reference inputs:

- NEXSTEP landing-page direction supplied by the user.
- Final visual direction:
  - `#FFFFFF` as the main canvas and product-first background.
  - `#000000` as the only solid interface colour.
  - Black and white opacity variants for hierarchy, borders, overlays, disabled states, and subtle surfaces.
  - Bebas Neue for hero headings, page titles, campaign titles, and section headings.
  - Montserrat for descriptions, product information, navigation, buttons, forms, captions, and all body copy.
  - No chromatic accent or third solid colour in the interface.

