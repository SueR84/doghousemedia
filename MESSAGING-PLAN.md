# Doghouse Media website: messaging, tone and content plan

Astro rebuild of doghousemedia.ie. Decisions below are settled unless marked open.
Date: 11 September 2026

---

## 1. What the site is

A credibility instrument, not a cold lead engine. It is built for the person who has already heard your name, been referred to you, or found you through an agency, and is checking whether you are real and whether you can be trusted with a budget.

That decision drives everything else: fewer pages, deeper proof, one conversion path, and no SEO surface area for its own sake.

**Primary audience:** large Irish organisations. Corporates (Diageo/Guinness Storehouse, An Post, Kerry Group), medtech and pharma (Boston Scientific, Amgen, Coroflo), institutions and charities (NDA, UCD, basis.point, Irish Red Cross).

**Agencies:** not excluded. Much of the flagship video work arrives via Custodian and Real Nation. The site is written for the end client, because an agency producer reading a site aimed at a large end client still sees a studio that can handle their job. The reverse is not true.

**Not the audience:** sports clubs, sole traders, small local businesses. Still welcome as clients, never headlined.

---

## 2. Pillars

Two, in this order.

1. **Video Production** (lead pillar)
2. **Web Development**

AI sits as a labelled, self-contained block inside Web Development. It is not a third pillar and it is not on the homepage. It is written so it can be lifted out in a single afternoon if the AI work spins out to its own brand later.

**Accessibility audits** are a productised service under Web Development, with their own page. Recurring, repeatable, a legal driver behind it, and a credential nobody else in Ireland can match. This is the replacement for the SEO packages being killed, and a better one.

**Care and Hosting** is a support page, not a pillar. Out of the main nav.

### Killed
- **SEO Packages** page, including the public €350 to €600/month pricing. A priced SEO tier two clicks from Boston Scientific actively damages the positioning. You can still sell SEO without advertising it.
- **Digital Services** page. The tool list (CRM, Zapier, email marketing, GDPR auditing) becomes capability sentences inside Web Development where relevant, or disappears.
- The 21 thin project pages. Replaced by four real case studies plus a thumbnail grid.
- Old URLs and redirects: not a concern, nothing is ranking.

---

## 3. Register and voice rules

Plain, declarative, unhurried. Say what was made and who for, and let the work carry the rest. Formal here means precise, not longer, and not corporate.

**Reference sentences.** This is the target register:

> Video that makes complicated things clear. We've spent fifteen years making films in operating theatres, labs and manufacturing plants.

The one line worth keeping from the old site, because it is the actual voice:

> No-one can promise you a high ranking in a short period of time. If they do, run a mile.

### Rules
- No exclamation marks anywhere on the site.
- No rhetorical questions as headings.
- No em dashes. Commas and full stops.
- Irish/UK English throughout. The old site mixes "optimization" and "realise". Pick UK and hold it.
- No adjective stacking. If a sentence works without "beautiful", "cutting-edge", "seamless" or "bespoke", cut them.
- Concrete nouns over categories. "Operating theatres, labs and factory floors" beats "a range of sectors".
- Never name a tool where a benefit will do. Exceptions are WordPress, WooCommerce and Astro, named once each, as explained in section 6.
- Kill every instance of "Let's do this" and "Like what you see? We'd love to hear about your idea and help you get it off the ground." It currently appears on eight pages.

---

## 4. Sitemap

```
/                     Home
/work/                Work (4 case studies + thumbnail grid)
/work/<slug>/         Four case studies
/video-production/    Pillar 1
/web-development/     Pillar 2 (includes accessibility, specialities, AI block)
/accessibility-audits/  Productised service, sits under Web Development
/care-and-hosting/    Support offer, not in main nav
/about/               About
/blog/                Blog (3 posts at launch)
/contact/             Contact
/accessibility/       Accessibility statement
/privacy/             Privacy policy
```

**Main nav:** Work, Video Production, Web Development, Blog, About, Contact

**Footer:** the above plus Care and Hosting, Accessibility statement, Privacy, address, hello@ email.

Fix the `/contact` versus `/contact-us/` split that breaks every button on the current site. One URL, used everywhere.

*Open: whether the blog is labelled "Blog", "Writing" or "Notes" in the nav. "Blog" is plainest.*

---

## 5. Homepage, section by section

**1. Hero.** The existing portfolio video, full width, showing both web and video work. Headline and one line of copy.

Draft:
> **Films and websites that make complicated things clear.**
> Doghouse Media is an independent video and web studio in Dublin. Fifteen years of work in operating theatres, labs, factory floors and boardrooms.

Alternative:
> **We make films and websites for organisations with something difficult to explain.**
> An independent video and web studio in Dublin, working since 2011.

**2. Video Production block.** Three "what we deliver" lines, link to the pillar page.

- Films that make a complicated product or service understandable to people without the background
- One shoot day that produces a campaign's worth of assets, not a single video
- Work that clears legal and compliance review without going back to the start

**3. Client logo strip.** Deliberately placed *below* the first service block, not directly under the hero. Logos under a hero is what every agency site in Ireland does and it reads as decoration. One block of substance in front of them makes them read as evidence.

Fix the `RN_Logo_RGB_Colour` alt text while you are at it.

**4. Web Development block.** Three lines, accessibility named explicitly, link to the pillar page.

- A site your own team can update, without ringing us for a paragraph change
- Accessibility, GDPR and performance handled before procurement asks
- Bookings, payments, donations and memberships that work properly, not bolted on

**5. Two featured case studies.** One video, one web. Guinness Storehouse and the National Disability Authority.

**6. One testimonial.** Susan Foley, Cappagh, until a corporate one lands.

**7. Who we are.** Short. Independent, Dublin, since 2011, female-owned and operated, two named owners. Links to About.

**8. Contact band.** Rewritten. Not "Let's do this".

---

## 6. Video Production page

1. **Position statement.** *Video that makes complicated things clear. We've spent fifteen years making films in operating theatres, labs and manufacturing plants.*
2. **Showreel**, then a grid of selected films.
3. **What we deliver.** The three lines from the homepage, expanded to a sentence each.
4. **Case studies.** Guinness Storehouse, Boston Scientific.
5. **How we work.** Four steps, no icons, no jargon: brief and concept, shoot, edit and review, delivery and formats. Placed *after* the case studies so the work convinces first. For a studio your size selling to Kerry Group or An Post, process is reassurance that you are not improvising.
6. **Testimonial.** Susan Foley, National Orthopaedic Hospital Cappagh.
7. **Contact.**

**Note:** the Boston Scientific "EMEA preferred supplier" line is **out**, pending confirmation you are permitted to state it publicly. Naming Boston Scientific as a client is fine, their logo is already on the current site and you hold a testimonial. The supplier designation is the part that stays off until cleared.

---

## 7. Web Development page

1. **Position statement.** *Websites built to be used, updated and handed over.*
2. **What we deliver.** Three lines, expanded.
3. **Specialities.** Three, equal weight:
   - **Learning platforms.** Course delivery, enrolments and certification that runs without you administering it by hand. Example: Shapes of Grief.
   - **E-commerce and bookings.** Payments, appointments and subscriptions that work reliably, including where clinical or regulatory rules apply. Examples: Merrion Medical Aesthetics, Beauty by Vaiva.
   - **Bilingual sites.** English and Irish delivered properly, with human translation review rather than automated output. Example: the National Disability Authority.

   Bilingual gets equal billing deliberately. Almost nobody in Ireland is claiming it credibly and it is a route into public sector work.

4. **Accessibility.** A named section, not a bullet.

   > We built the National Disability Authority's Someone Like Me Art Awards site, tested to WCAG 2.1 AA and delivered in English and Irish with human translation review. This website is built to WCAG 2.2 AA.

   Link to the accessibility statement, and to the accessibility audits page.

   Close the section with one line pointing at the service: *We also audit other people's sites. If you need to know where yours stands, we will tell you.*

5. **Platforms.** One sentence, not a logo row:

   > We build mainly in WordPress and WooCommerce, so your team can edit the site themselves. For smaller or faster-moving projects we build static sites in Astro, which means no database, very little to maintain and very little to attack.

   Do not name Beaver Builder, ACF, Cloudways or any theme. A framework name inside a benefit sentence is fine. A tool list is not.

6. **AI block.** Short, self-contained, detachable. Two examples only:
   - **Western Rheumatology.** Patients order repeat prescriptions without ringing the clinic, and the medications information on the site stays in sync automatically. Describe the outcome, stay vague on the plumbing. Do not publish a map of a clinic's internal workflow.
   - **Edithouse**, framed openly as our own business. A support assistant trained on the business's own material, answering the questions couples ask before they enquire.

   Leave the internal finance and reporting automation out.

7. **Case studies.** National Disability Authority, basis.point.
8. **Link across to Care and Hosting.**
9. **Contact.**

---

## 7a. Accessibility audits page

A productised service page under Web Development. This is the commercial engine of the accessibility positioning and the reason the section on the pillar page exists.

**Position statement.** Plain and factual, no scaremongering.

> We audit websites against WCAG 2.2 AA and tell you exactly what needs to change, who has to change it, and in what order.

**Why us.** The strongest three sentences on the site:

> We built the National Disability Authority's Someone Like Me Art Awards site and worked through their formal accessibility audit, issue by issue, until it passed. That is the most rigorous accessibility review a website in Ireland is likely to face. We now run the same process for other organisations.

**What an audit is.** Concrete, not a package name.

- Automated scanning across the site, plus the manual testing automated tools cannot do: keyboard navigation, screen reader behaviour, focus order, forms and error handling, colour contrast, media and captions.
- Tested against WCAG 2.2 AA, reported against 2.1 AA separately where a client's obligation sits at that level.
- A report that **triages every finding three ways**: what we can fix, what your content team has to fix, and what sits with a third-party supplier and is outside anyone's control. That triage is the part clients actually value, and it is exactly the process you ran on the NDA build.
- A retest after remediation, so there is a before and after rather than a list.

**Optional follow-on work**, each named plainly: remediation by us, an accessibility statement drafted for publication, ongoing monitoring under Care and Hosting.

**Get the law right.** Two different obligations, and conflating them is the mistake most agency copy makes:

- The **European Accessibility Act** has applied since 28 June 2025. It covers specific products and services, including e-commerce, banking, transport and ebooks. Not every website in existence.
- The **Web Accessibility Directive** covers public sector bodies and their websites and apps.

Do not write "every website must now be accessible by law". It is not true, a procurement officer will know it is not true, and it undermines the one page where your authority is the entire point. Say who is covered, say it accurately, and let the accuracy do the selling. **Verify both before publishing.**

**Pricing.** No public price at launch, consistent with Care and Hosting and with killing the SEO tiers. Revisit after you have run two or three and know the real effort, then consider a "from" figure. Unlike SEO, an audit is a discrete deliverable, so a starting price qualifies leads rather than inviting comparison shopping.

---

## 8. Work page

Four case studies with their own pages, then a thumbnail grid.

- **Thumbnails:** twelve to fifteen, chosen on quality not completeness. A small sharp portfolio reads as selective. A large mixed one reads as whatever came in the door. Drop anything you would not put in front of Kerry Group.
- **Filters:** two only, Video and Web. Five filters on twelve items is friction for no gain.
- Each thumbnail: image or still, client name, one line.

---

## 9. Care and Hosting

Own page, out of the main nav, linked from Web Development and the footer.

**No public pricing.** The old SEO page's price tiers are exactly the comparison shopping you are cutting the page to escape.

Pitch it at the thing a large organisation actually worries about: who is responsible when it breaks in year three. Continuity, security, updates, backups, someone accountable. Not a tier table.

Covers: hosting, security hardening, CMS and plugin updates, uptime monitoring, backups, performance, accessibility checks, development and bug fixes, content updates.

---

## 10. About

Carries the female-owned positioning with real weight, rather than buried mid-sentence in a hero subhead as it is now.

- Both owners named with clear roles. Emma Walkin on video production, Susan Ryan on web, digital and AI. A large organisation wants to know who is accountable.
- **Founded 2011.** Fifteen years. The current site says "since 2013", which is wrong. Use 2011 everywhere, state it once.
- Photos of both of you. A two-person studio selling to companies with procurement departments needs faces on the page. An About page with no people is the clearest tell that a studio is smaller than it looks.
- Independent, female-owned and operated, Dublin.
- Twenty years in IT before the studio. That is a credibility asset for technical and regulated buyers, not a footnote.

---

## 11. Blog: three posts at launch

The blog exists because content serves the positioning, not for SEO volume. Each post must be something only you could write.

**1. Accessibility and the European Accessibility Act**
What the obligation actually means for an Irish organisation's website, written by the studio that built the National Disability Authority's site. Legal deadline driving real demand, and it is the top of the funnel for the accessibility audits page. This is the strongest thing you can publish because the credential cannot be copied.
*Audience: marketing, legal and procurement in large Irish organisations.*

**2. Should you let AI build your website?**
Not a think piece. A first-person account of building real client work with AI tooling, what it did well and where it fell over, with specifics. Almost everyone writing about this has not done it on a paid project.
*Audience: buyers who have been told they can get a site for nothing.*

**3. When AI video is good enough, and when it is not**
Aimed directly at the corporate comms manager who has been asked why they should pay for a crew. You are one of very few people who can answer that with both a camera and an AI stack behind you.
*Audience: comms and marketing managers defending a production budget.*

The generic SEO article is dropped. It is the most written-about subject on the Irish web and it contradicts the decision to kill the SEO page.

---

## 12. Case study briefs

Four at launch. Each one gets: the problem, what you made, and a result or a quote. Two hundred and fifty to four hundred words, plus film or images. No process narration.

**Guinness Storehouse** (video, flagship corporate). Shot and edited by Doghouse, footage is yours, no clearance needed.

**Boston Scientific** (video, medtech). Testimonial in hand. Name the client, leave the supplier designation out until confirmed.

**National Disability Authority, Someone Like Me Art Awards** (web, accessibility). WCAG 2.1 AA, bilingual English and Irish via WPML with human translation review, built for eventual transfer to Government Networks. This is the accessibility proof, write it properly.

**basis.point** (web, charity/funds). Testimonial from Edel.

**Western Rheumatology** is the strongest candidate for a fifth once the others are live. Sign-off is in place. Website, medications knowledge base sync, chat assistant and repeat prescription ordering. For launch it appears in the AI block and as a thumbnail.

---

## 13. Accessibility requirements for the build

The moment the NDA claim goes on the site, your own site is the first thing anyone tests. Build to **WCAG 2.2 AA**, one level above what you are claiming for the NDA work, and publish an accessibility statement.

1. **Hero video.** If it autoplays it must be muted, have no essential audio, and carry a visible pause control. Text over moving footage needs a solid or heavily dimmed backing, not a light overlay.
2. **Captions** on every embedded film. Not auto-generated.
3. **Brand red is a cream-background colour only.** #BD1C30 on #FAF7F0 is roughly 5.8:1 and passes. #BD1C30 on #0F1417 is roughly 3:1 and fails for normal text. On the dark ink background, red is for large text and non-text accents only.
4. **The hound animation** must respect `prefers-reduced-motion`.
5. Keyboard navigation, visible focus states, skip link, correct heading order, real alt text on every client logo.

---

## 14. Open items and critical path

Copy can be drafted without any of these. The site cannot launch without them.

| # | Item | Status |
|---|---|---|
| 1 | Boston Scientific "EMEA preferred supplier" line | **Dropped.** Revisit only if written permission is obtained |
| 2 | Western Rheumatology naming and detail | **Signed off** |
| 3 | Guinness Storehouse footage and naming | **Clear.** Shot and edited in-house, footage is yours |
| 4 | Third testimonial, plus one from a corporate client | **In progress.** Placeholders used in draft, must be clearly marked and never published live |
| 5 | Photos of Sue and Emma | **Being assembled** |
| 6 | Founding year | **Resolved: 2011** |
| 7 | Contact form fields | Form built. Recommend three fields only: name, organisation, what you are working on |
| 8 | Blog nav label | Open |
| 9 | Accessibility audit pricing, and whether a "from" figure appears | Open, no price at launch |
| 10 | EAA and Web Accessibility Directive scope wording, checked before publishing | Open |

**Contact page:** form as the primary route, `hello@doghousemedia.ie` visible, and the existing LeadConnector booking widget linked properly rather than orphaned as it is now. No phone number for the moment.

---

## 15. What changes most from the current site

For reference when reviewing drafts.

- Video moves from one neglected page last touched in March 2023 to the lead pillar.
- Four service pages become two, plus a support page.
- Twenty-one thin project pages become four real case studies and a curated grid.
- One testimonial becomes three, then more.
- Tool lists become outcomes.
- Chirpy SME voice becomes plain and declarative.
- Accessibility goes from nowhere on the site to a named plank with the best possible proof behind it.
- Public SEO pricing disappears, replaced by a productised accessibility audit service with a legal driver behind it.
- A mailto link becomes a working conversion path.
