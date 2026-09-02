# CottonRose Website Improvement and Implementation Plan

## Document purpose and status

This is the single consolidated website audit, requirements analysis, improvement plan, and phased implementation plan. It does not change the website.

This master plan combines the previous audit and implementation documents. Where the source documents resolve an earlier assumption, the source priority below applies. The company name must be written as **CottonRose**.

## Sources and how they must be used

### Source priority

1. **The client/user's direct instruction** is authoritative: the company name is `CottonRose`.
2. **`CottonRose_Company Profile-2026.doc`** is the primary source for CottonRose company facts, sourcing capabilities, product categories, workflow, quality-coordination process, leadership, and contact information. Any factory-specific information in the profile is reference material only and must not be published on the website.
3. **`13TEXWORK-PROFILE 2025.pdf`** is a visual/content-structure reference only. It shows the type of “Product Offering” presentation requested by the client, including category names accompanied by multiple product photographs.
4. **The current website** is the implementation baseline. Existing content should be retained only where it agrees with the higher-priority sources and is suitable for public use.

### Content from the demo that must not be copied

The 13TEX document belongs to another company. Do not reuse or publish its:

- Company name, logo, slogan, contact details, addresses, or website.
- Bank information, registration numbers, turnover, employee figures, market ratios, or internal business data.
- Customer names, factory names, capacities, or sourcing-office details.
- Product photographs or exact written copy.
- Quality claims or timelines as if they belong to CottonRose.

Only the high-level presentation idea may be adapted: a clear **Product Offering** section with organized categories, genuine sample photography, and buyer-relevant capability details.

## Non-negotiable company positioning

CottonRose is a **garment buying house**, not a garment factory or manufacturer. The website must present the company as the professional bridge between international buyers and suitable apparel suppliers.

- Use language such as **we source**, **we coordinate**, **we manage**, **we monitor**, **we inspect**, and **we support shipment**.
- Do not use language such as **we manufacture**, **our factory**, **our production lines**, **our machinery**, or **our factory capacity**.
- Product Offering content describes the products CottonRose can source and manage for buyers; it does not describe CottonRose-owned production.
- Do not publish supplier/factory names, profiles, addresses, headcounts, machinery, production-line details, individual capacities, or factory photographs.
- Do not build a public factory directory or supplier-network showcase.
- When a qualified buyer needs production-facility information, share the relevant details privately during quotation, due diligence, or onboarding and subject to confidentiality requirements.

## Executive requirement summary

The website should become a formal B2B sourcing portfolio that answers five buyer questions quickly:

1. Who is CottonRose and how can a buyer contact the company?
2. What apparel products and materials can CottonRose source and manage for buyers?
3. What real product samples demonstrate those capabilities?
4. How does CottonRose manage sampling, costing, production, quality, compliance, and shipment?
5. What verified evidence supports its sourcing, quality-control, delivery-management, and supplier-due-diligence claims?

The visual direction should remain restrained and corporate. The current navy-and-gold foundation is appropriate, but the site needs more authentic product evidence, consistent facts, and clearer information architecture.

## Current website audit

### What is already working

- The navy-and-gold palette is suitable for a formal international B2B sourcing business.
- The existing layout has a usable responsive foundation, generous spacing, recognizable calls to action, and a strong starting structure for product categories.
- The site already contains the six-step sourcing workflow and leadership cards required for the requested interaction improvements.
- The overall design needs credibility, consistency, and content refinement more urgently than decorative redesign.

### Priority 0: credibility and launch blockers

- Brand naming currently varies between `CottonRose`, `Cottonrose`, and `Cotton Rose BD`; the approved public name is **CottonRose**.
- Placeholder or conflicting facts include `20XX`, `500+` merchandising professionals, postcode `1330` versus `1230`, inconsistent email/phone details, and unsupported metrics.
- The main inquiry form displays a success message without delivering the inquiry to a verified backend. Leadership forms post to `#`.
- Contact, WhatsApp, map, and social destinations require verification; empty `#` social links should be removed.
- The Home and Sustainability/Quality content show inconsistent compliance standards and may imply that supplier credentials belong to CottonRose.
- At least one product image is broken, several stock images do not match their labels, and multiple categories reuse unrelated imagery.
- Absolute claims such as “leading,” “fully compliant,” “zero defect,” “full traceability,” “No Strict MOQ,” or universal delivery promises require evidence, scope, and approval or should be rewritten.

### Priority 1: information architecture and content consistency

- Rename the main `Categories` navigation item to `Products` and provide clear access to all offerings and diversified lines.
- Consolidate overlapping core and diversified categories into one buyer-friendly taxonomy instead of creating duplicate routes and content.
- Standardize product names, plurals, punctuation, and capitalization; remove page-number artifacts such as `8/12`, `9/12`, and `10/12`.
- The Services page and the six-step sourcing process currently present competing workflows. Services should describe buyer deliverables while the sourcing process remains the single operational sequence.
- Use one accurate response-time statement everywhere rather than several different promises.
- The Contact page's desktop columns are visually unbalanced; use a compact contact panel beside the form and a clear full-width map area where appropriate.
- Header, footer, product navigation, calls to action, contact data, and metadata should all be generated from shared approved data.

### Priority 1: visual and interaction consistency

- Preserve navy and gold as the restrained corporate foundation; use rose only if it is an approved brand color with sufficient contrast.
- Replace the text-only wordmark with the approved logo lockup when supplied and add a favicon/app icon.
- Define one typography system, icon family, spacing scale, corner-radius scale, shadow treatment, and photography direction.
- Current cards mix small and large corner radii and different shadow styles; standardize each component family.
- Replace letter-only social/contact symbols with one consistent accessible icon set while retaining understandable labels.
- Shorten the Home hero copy, improve text contrast over photography, and keep the primary value proposition and inquiry action above the fold.
- After sourcing descriptions become visible, rebalance card heights and whitespace around the longer content.
- Leadership cards need unique headshots or a deliberate initials treatment; the same generic portrait must not represent several people.
- Product filtering should not renumber cards unexpectedly when results change.

### Priority 2: accessibility and inclusive UX

- Add a visible “Skip to main content” link.
- Provide consistent `:focus-visible` treatment for navigation, buttons, cards, forms, filters, galleries, and modal controls.
- Mark breadcrumbs as a labelled navigation region with list semantics and maintain a logical heading hierarchy.
- Lock background scrolling and manage focus while the mobile menu or a modal is open.
- Give the mobile-navigation control state-aware accessible names such as “Open menu” and “Close menu.”
- Ensure leadership modals and product lightboxes trap focus, close with `Escape`, and return focus to the opening control.
- Announce gallery changes, validation errors, submission status, and other dynamic feedback to assistive technology.
- Render truthful metric values in the initial HTML instead of exposing zero values until JavaScript animation begins.
- Test text contrast, 200% zoom, keyboard-only operation, reduced motion, screen-reader semantics, and common mobile widths.

### Priority 2: performance, reliability, security, and SEO

- Resolve the reported high-severity `sharp`/libvips dependency advisory and rerun the production audit and build.
- Add automated broken-link, broken-image, and missing-local-asset checks.
- Self-host approved imagery, use responsive image sizes, compress assets, and reserve loading priority for true above-the-fold images.
- Add useful custom not-found and error states that preserve navigation and inquiry options.
- Add a sitemap, robots configuration, canonical URLs, favicon, Open Graph image, and page-specific social metadata.
- Add verified Organization structured data using the approved company name, address, contact details, website, and social profiles.
- Add privacy and legal pages appropriate to the real inquiry-data workflow. Cookie consent is needed only if the chosen analytics or marketing tools require it.
- Track privacy-conscious conversions such as confirmed inquiry delivery and product, WhatsApp, phone, or email interest.

## Resolved identity requirements

- Use **CottonRose** everywhere: logo, header, footer, metadata, headings, body copy, structured data, social previews, and accessibility labels.
- Do not alternate between `CottonRose`, `Cotton Rose`, `Cotton Rose BD`, or `Cottonrose` in public copy.
- The source tagline may be professionally edited as:
  - **Apparel Sourcing, Quality Assurance and Supply Chain Management | Bangladesh**
- Use `SCM` only after spelling out “Supply Chain Management” at least once on the page.

## Company-information requirements

The following information comes from the CottonRose company profile. It should be centralized in one site data/configuration file and confirmed by the client before public release.

| Information | Source value | Website requirement |
| --- | --- | --- |
| Company name | Cotton Rose BD in the profile; client explicitly confirmed CottonRose | Publish as **CottonRose** |
| Head office | House 45, Road 4, Sector 11, Uttara Model Town, Uttara, Dhaka-1230, Bangladesh | Replace the current `1330` value and use one format everywhere |
| General email | info@cottonrosebd.com | Use as the primary general inquiry email unless the client supplies another inbox |
| Website | www.cottonrosebd.com | Use in metadata and structured data after confirming the production domain |
| Land phone | +880 2 224471434 | Standardize visible and `tel:` formatting |
| Primary commercial WhatsApp | +880 1976694113 for the CEO/commercial contact | Use only after confirmation; the profile also contains a likely placeholder mobile number that must not be published |
| Experience | 12+ years | Define the start year or update the figure annually |
| Annual exports | 16M+ garments | Present as “garments exported annually” only after confirming the reporting period |
| Supplier-network size | 45+ audited partner mills in the profile | Keep internal; do not publish supplier/factory counts or profiles on the public site |
| On-time delivery | 99.5% | Define the measurement period and calculation before publishing |
| Team size | 28 employees | Replace the current unsupported `500+` merchandising-team claim; optionally show the function breakdown only if approved |
| Target markets | Europe, North America, Australia, and Asia | Publish only the markets currently served |

### Claims that require explicit approval or evidence

The company profile contains strong marketing statements that should not be treated as automatically verified merely because they appear in the document.

- “Fully compliant” and “100% social and environmental compliance.”
- “Zero-defect quality” or elimination of all quality claims and shipment delays.
- Average `8%-12%` FOB savings.
- `45-60 day` lead time.
- `99.5%` on-time delivery.
- `16M+` annual garment exports.
- Claims that sampling, laboratory testing, machinery, or production lines are owned or operated by CottonRose.
- Claims about on-site QA coverage or inspection frequency unless they accurately describe CottonRose's own service and are supported by current records.
- Every listed certificate, audit, quality test, processing method, and material source.

The public site should describe CottonRose's coordination role in qualified terms. Supplier-specific capabilities and evidence should be confirmed per inquiry and shared privately rather than exposed as public factory information.

## Required information architecture

### Primary navigation

Use this top-level structure:

1. Home
2. About
3. Products
4. Services
5. Quality & Compliance
6. Contact
7. Get a Quote

The **Products** menu should include:

- All Product Offerings
- Knitwear
- Woven Wear
- Sweaters
- Activewear
- Diversified Product Lines

The Products item must be active for both `/products` and `/diversified-products` routes. The footer should provide the same complete catalogue entry points.

### Page roles

- **Home:** concise value proposition, verified proof metrics, selected product offerings, sourcing workflow, quality/compliance summary, and quote CTA.
- **About:** company overview, mission, vision, approved company facts, Bangladesh sourcing advantage, and leadership modals.
- **Products:** the primary Product Offering experience described below.
- **Product detail:** buyer-focused product types, real sample gallery, materials, available processing options, sourcing notes, and inquiry CTA. Do not show factory or production-capacity data.
- **Services:** sourcing, sampling, production management, quality assurance, and logistics, aligned with the six-phase workflow.
- **Quality & Compliance:** CottonRose's quality-assurance workflow, supplier due-diligence approach, inspection checkpoints, and a private document-request CTA.
- **Contact:** verified contact information, exact map pin, functional inquiry form, WhatsApp, and approved social links.

## Primary feature: Product Offering experience

### Goal

Adapt the useful concept from the demo portfolio into a modern CottonRose-owned presentation. A buyer should be able to scan the range, see real examples, understand technical capability, and start an inquiry without reading a long company profile.

### Recommended `/products` page structure

1. **Product Offering hero**
   - Heading: `Product Offering`
   - Short buyer-focused statement.
   - CTA to submit a tech pack or request a quotation.

2. **Capability overview**
   - Four verified core categories.
   - Construction filters such as Knit, Woven, Flat Knit, Activewear, Denim, and Outerwear.
   - Optional audience filters such as Men, Women, Kids, and Workwear only when data is complete.

3. **Core category capability cards**
   - Real product photograph.
   - Category name and one-sentence description.
   - Product offering list.
   - Fabric/material construction.
   - Key sourcing, processing, or finishing options when relevant, clearly marked as subject to order and supplier confirmation.
   - “Explore category” and “Request a quote” actions.

4. **Diversified Product Lines gallery**
   - Organized, image-led grid inspired by the demo's presentation pattern.
   - Multiple genuine CottonRose sample images per category, not one generic stock image.
   - Clean category names with imported page-number fragments removed.
   - Filters that do not renumber cards unexpectedly.

5. **Technical capability strip**
   - Approved printing, embroidery, washing, finishing, testing, and development capabilities.
   - Present these as sourcing options that CottonRose can coordinate, subject to material, quantity, supplier, testing, and compliance requirements.

6. **Product inquiry CTA**
   - Invite the buyer to send a tech pack, reference image, target quantity, material requirement, target price, destination market, and required delivery date.

### Product Offering history timeline

Add a formal chronological timeline before the detailed product catalogue. It should show CottonRose's founding year and the year each new product group joined the sourcing portfolio. The supplied CottonRose profile states `12+ years` of experience and confirms the current product range, but it does not provide a founding year, product-addition years, or an approved category sequence. These facts must not be inferred.

Implementation status:

- The responsive timeline component and proposed category grouping are implemented for client review.
- Every date is deliberately labelled `Year to confirm` and `Pending verification`.
- Replace the pending labels only after the client supplies the founding year and each approved product-expansion milestone.
- Timeline wording must continue to describe CottonRose as the buyer-supplier coordination bridge, not as a manufacturer.

### Core product data from the CottonRose profile

#### Knitwear

- Product offerings: Basic and fashion T-shirts, polo shirts, hoodies, sweatshirts, joggers, tank tops, and sleepwear.
- Fabric construction: Single jersey, pique, fleece, French terry, interlock, rib 1x1/2x2, and viscose blends.

#### Woven Wear

- Product offerings: Casual shirts, formal shirts, chino pants, cargo shorts, rigid/stretch denim jeans, and jackets.
- Fabric construction: Cotton twill, poplin, canvas, and corduroy.

#### Sweaters

- Product offerings: Crew-neck pullovers, cardigans, turtlenecks, cable knits, and fine-gauge sweaters from 3GG to 14GG.
- Material construction: Cotton, acrylic, cotton/acrylic, wool blends, viscose/nylon, and cashmere-touch yarns.

#### Activewear

- Product offerings: Performance tees, gym leggings, sports bras, seamless apparel, tracksuits, and teamwear.
- Fabric construction: Polyester-spandex, nylon-spandex, moisture-wicking mesh, and antibacterial knits.

### Processing and finishing capabilities to verify

- Automatic rotary screen printing.
- Digital sublimation.
- 3D embroidery.
- Garment wash and tie-dye.
- Acid wash and laser destruction.
- Ozone washing or other water-saving finishing methods.

Only display options CottonRose can currently source and coordinate. Confirm availability privately for each order; do not identify the supplier or publish supplier-specific facilities, equipment, or capacity.

### Diversified product naming cleanup

The source contains page-number artifacts such as `8/12`, `9/12`, and `10/12`. These must be removed. Use buyer-friendly names:

- Swimwear & Board Shorts
- T-Shirts
- Sportswear & Activewear
- Men's Woven Bottoms
- Kids' Woven Bottoms
- Fleece Jackets
- Outerwear
- Kids' Denim
- Men's & Women's Shirts
- Denim Pants
- Sweaters
- Polo Shirts
- Dress Shirts
- Workwear & Outerwear

There is overlap between the diversified list and the four core categories. Before implementation, consolidate duplicates under one catalogue taxonomy while preserving all requested product examples. Recommended approach:

- Use the four core categories as capability groups.
- Treat the diversified names as filterable product types or collections within those groups.
- Avoid separate duplicate routes for Sweaters, Activewear, T-Shirts, Polo Shirts, and related categories unless the page content is genuinely different.

### Product photography requirements

- Do not reuse the 13TEX photographs.
- Collect at least 4-6 approved product/sample images per published category that CottonRose has permission to use.
- Use consistent lighting, background, crop, resolution, and color correction.
- Prefer front, back, detail, fabric/trim, and construction views over multiple near-identical lifestyle images.
- Store images locally in optimized WebP/AVIF formats with meaningful filenames and accurate alt text.
- Add a neutral fallback image so a failed asset never creates an empty navy card.
- Obtain permission before showing buyer labels, brand marks, or confidential designs.

## Required sourcing-process change

The six source descriptions are already present in the website and company profile. They should be visible directly on the cards without a click or popup.

1. Design & Sample Prototyping
2. Open Costing & Commercials
3. Raw Material Procurement & Testing
4. Pre-Production & Line Setup
5. Inline Quality Assurance
6. Final Inspection & Logistics

Implementation requirements:

- Remove the sourcing dialog, plus icon, and “View details” interaction.
- Display the short description under each step title.
- Use a 3-column desktop grid, 2-column tablet grid, and one-column mobile sequence.
- Define or expand CLO3D, PPM, PP sample, DuPro, FRI, AQL, GSP, FOB, and CIF where first used.
- Avoid guarantees such as “approval within 7 days” unless this is an approved service-level commitment.

## Required leadership change

Leadership details must open in modals on the About page instead of routing to standalone pages.

### Source leadership list

- S M Mujibur Rahman - CEO
- Md. Zahidul Islam - Managing Partner
- Md. Khairul Islam - Managing Partner
- Bappa Paul - Managing Partner

### Modal requirements

- Keep the route at `/about`.
- Show unique approved headshot, name, role, short biography, responsibility areas, and verified contact actions.
- Use consistently formatted names rather than mixed title case and uppercase.
- Do not show a direct-message form inside each modal; provide verified email/WhatsApp actions and a link to the central inquiry form.
- Support keyboard focus management, Escape, close button, backdrop dismissal, background scroll lock, and focus return.
- Redirect old profile routes to `/about#leadership` after the change.

### Content still required from the client

The company profile provides contact details but not suitable leadership biographies or unique photographs. Obtain:

- A 60-100 word approved biography per person.
- Role/responsibility areas.
- Professional headshots using the same crop and background treatment.
- Confirmation of which direct email and WhatsApp actions may be public.

## Quality and compliance requirements

### Quality process from the CottonRose profile

Subject to approval, the site may explain:

- AQL 1.5 Level II for specified high-end programs and AQL 2.5 for standard orders.
- Four-Point System inspection for bulk fabric before cutting.
- Testing for dimensional stability, GSM, seam slippage, fiber composition, colorfastness, and shrinkage.
- Metal-detector/needle checks for packed garments where applicable.
- Inline, daily traffic-light, DuPro, and final random inspection stages.

### Compliance presentation

- Rename “Our Certifications” to **Supplier Due Diligence & Compliance Coordination** unless CottonRose itself directly owns the displayed certificate.
- Explain how CottonRose reviews buyer-required social, environmental, product, and material documentation without publishing a supplier list.
- Do not display supplier certificates, factory badges, or audit logos as CottonRose credentials.
- Add a CTA through which a qualified buyer can privately request the applicable documents for a proposed order.
- State that supplier selection and document availability depend on the buyer program, product, destination market, and current validation.

## Contact and inquiry requirements

- Use the profile's `Dhaka-1230` address after client confirmation.
- Use `info@cottonrosebd.com` as the general inbox unless another monitored address is approved.
- Remove placeholder and conflicting numbers.
- Verify leadership-specific WhatsApp links against the visible numbers.
- Use an exact map pin and a directions link.
- Remove empty `#` social links; add only real approved profiles.
- Connect the inquiry form to a real backend or CRM.
- Show success only after confirmed delivery.
- Include server-side validation, rate limiting, spam protection, error handling, and privacy wording.
- Expand Product Interest so it covers the complete catalogue.

## Public vs. confidential content rules

### Publish after verification

- Company overview, mission, vision, markets, services, approved metrics, product capabilities, workflow, quality methods, leadership, and public contact details.

### Keep private and share only during qualified buyer due diligence

- Supplier/factory names, profiles, addresses, contacts, photographs, headcounts, machinery, production lines, and capacities.
- Customer or buyer logos/names.
- Supplier certificate scans, audit reports, inspection reports, and facility documents.
- Employee department breakdown.
- Revenue, turnover, pricing-savings claims, and detailed supply-chain relationships.
- Product images containing buyer branding, labels, or unreleased designs.

### Do not publish on the public portfolio

- Bank account number, bank branch, or SWIFT details from either document.
- Tax, trade-license, registration, or banking-permission numbers from the demo.
- Any data belonging only to 13TEX.

## Recommended technical structure

Create reusable, reviewed data modules rather than repeating facts in pages:

```text
data/
  company.js          # identity, address, phones, email, approved metrics
  leadership.js       # modal content and contact actions
  sourcingProcess.js  # six inline workflow steps
  products.js         # sourcing groups, product types, fabrics, options, images
  compliance.js       # CottonRose QA and supplier-due-diligence wording
```

Additional implementation rules:

- Reuse one `ProductOfferingCard` and one category-detail template.
- Reuse one accessible `LeadershipModal` component.
- Keep approved public metrics numeric in data, with display formatting handled by components; do not add supplier/factory capacity fields.
- Store claim notes such as `asOf`, `scope`, and `source` with metrics so context is not lost.
- Add image validation and a build-time check for missing assets.
- Keep current responsive and reduced-motion support.

## Page-by-page implementation scope

### Home

- Correct the CottonRose name and tagline.
- Use verified metrics with units and context.
- Rename the product preview to `Product Offering` and show selected genuine samples.
- Keep the four primary product groups plus a route to the complete catalogue.
- Show sourcing descriptions directly on cards.
- Replace certification badges with CottonRose's supplier-due-diligence and compliance-coordination wording.
- Use one consistent response-time promise.

### About

- Rewrite the overview from the company profile in concise web copy.
- Use approved mission and vision after removing absolute claims.
- Replace placeholder year and unsupported team-size text.
- Show the verified `28 employees` only if the client wants headcount public.
- Replace unrelated stock images with approved CottonRose office, team, product/sample, or sourcing-workflow images. Do not use supplier-factory photographs.
- Implement leadership modals and unique photos.

### Products

- Make `Product Offering` the primary heading and experience.
- Implement the unified taxonomy and filters.
- Add source-based product, fabric, and sourcing-option details without factory or capacity information.
- Build genuine sample galleries.
- Add finishing/processing capability content after verification.
- Remove broken and unrelated remote imagery.

### Services

- Align the service list with the six-phase process so the site does not show competing workflows.
- Explain buyer deliverables at each stage: sample, costing sheet, production plan, inspection report, and shipment documentation.

### Quality & Compliance

- Separate CottonRose quality-control services from supplier documentation, which remains private and order-specific.
- Add scope notes and a document-request CTA.
- Remove universal certification claims.

### Contact

- Correct the address, phone, email, and map.
- Make the form operational.
- Rebalance the desktop layout and move the map to a dedicated full-width area if needed.

### Global components and metadata

- Apply `CottonRose` consistently.
- Replace the text wordmark with the approved logo when supplied.
- Add favicon, Open Graph image, sitemap, robots configuration, canonical URLs, and Organization structured data.
- Ensure footer data comes from `data/company.js`.

## Implementation phases

### Phase 1 - Content approval and asset collection

- Confirm the public company name, tagline, address, phone, WhatsApp, email, and domain.
- Approve or reject every public metric and marketing claim.
- Confirm the product taxonomy and whether overlapping diversified categories should be merged.
- Collect product images, leadership headshots/bios, logo assets, social links, exact map pin, and certification evidence.
- Confirm that supplier/factory information and capacity figures remain outside the public website; separately decide whether customers and CottonRose headcount may be public.

**Exit condition:** A signed-off content sheet exists and no placeholder data is needed.

### Phase 2 - Data normalization and global corrections

- Create centralized company, leadership, product, process, and compliance data.
- Correct CottonRose naming, Dhaka-1230 address, emails, phone formats, and metadata.
- Remove placeholders, conflicting claims, dead links, and confidential content.

**Exit condition:** The same approved fact renders identically everywhere.

### Phase 3 - Requested interaction changes

- Convert sourcing steps to always-visible descriptions.
- Build the accessible leadership modal.
- Add redirects for old profile routes.

**Exit condition:** No sourcing click is required and no leadership click causes navigation.

### Phase 4 - Product Offering build

- Implement unified product taxonomy and filters.
- Build category cards and detail pages from shared data.
- Add genuine sample galleries and image fallbacks.
- Add product, fabric, and verified sourcing/finishing-option information without factory or production-capacity details.

**Exit condition:** A buyer can understand the offering and reach the appropriate inquiry action from every category.

### Phase 5 - Trust, compliance, and inquiry flow

- Rebuild Quality & Compliance content with approved scope.
- Connect and test the inquiry backend.
- Add precise contact/map/social information and privacy wording.

**Exit condition:** Trust claims are supportable and inquiry delivery is verifiable.

### Phase 6 - Visual system, accessibility, performance, and SEO

- Apply the approved logo, typography, icons, radii, spacing, and photography rules.
- Complete keyboard, modal, menu, form, contrast, zoom, and reduced-motion testing.
- Self-host and optimize images.
- Resolve dependency vulnerabilities and add automated image/link checks.
- Add technical SEO and structured data.

**Exit condition:** Production build, security audit, accessibility checks, broken-link/image scan, and responsive visual review pass.

## Client inputs required before implementation is complete

- Approved CottonRose logo files, favicon, and brand guidelines.
- Confirmed founding year or calculation method for `12+ years`.
- Confirmation and definitions for any proposed public CottonRose performance metrics such as `16M+` and `99.5%`; keep the `45+` supplier-network figure private.
- Confirmation of the official address, land phone, primary mobile/WhatsApp, email, and domain.
- Approved mission, vision, markets, and public headcount.
- Approval for processing options, CottonRose quality procedures, and supplier-due-diligence statements. Factory capacities are out of public scope.
- Final product taxonomy and at least 4-6 approved images for every published category.
- Leadership headshots, biographies, responsibilities, and public contact preferences.
- Real social-profile URLs and exact map pin.
- Form-delivery destination or CRM/service choice.
- Permission decisions for customers and branded samples; supplier/factory identities, facility information, certificates, and reports remain private.

## Acceptance criteria

- `CottonRose` is the only public brand spelling.
- No 13TEX data, images, customers, factories, bank information, or copy appears on the site.
- No `20XX`, `500+`, `1330`, dead `#` link, placeholder phone, or unsupported success message remains.
- Company facts are centralized and consistent across pages and metadata.
- The Products experience prominently uses the heading `Product Offering` and contains real CottonRose sample imagery.
- Every published product has an accurate name, description, product list, material/fabric data, and an inquiry path for order-specific sourcing confirmation.
- Sourcing descriptions are visible without interaction.
- Leadership profiles open in accessible modals without route changes.
- Contact forms send through a real backend and report truthful success/failure states.
- CottonRose is never presented as a factory or manufacturer, and no supplier/factory profile, capacity, address, equipment, production-line information, or factory photograph appears publicly.
- Quality and compliance language describes CottonRose's coordination process without presenting supplier certificates as CottonRose credentials.
- Confidential data is excluded unless specific publication permission is recorded.
- Desktop, tablet, mobile, keyboard, screen-reader semantics, reduced motion, images, links, metadata, production build, and dependency audit all pass final QA.
