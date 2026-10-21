/**
 * What Bandit knows about the studio.
 *
 * This text is sent to the model as part of Bandit's instructions on every
 * chat. Bandit answers from this and the Work collection, and nothing else,
 * so if a fact is not here Bandit will say it does not know and point people
 * to the form. Edit it like any other page copy, between the backticks: plain sentences, no prices,
 * nothing unverified. Everything here was taken from the live page copy on
 * 21 October 2026. Projects are added automatically from src/content/projects.
 *
 * Written in Markdown inside a template string, so avoid backticks in it.
 */
export default `## The studio

Doghouse Media is an independent studio in Dublin, founded in 2013, female-owned and operated. It does video production and web development for corporate and medtech clients, and also works with charities and public sector organisations. It also builds AI assistants and automations.

Emma Walkin and Susan Ryan own the studio and lead every project. Clients deal directly with them from the first conversation through to delivery.

- Susan Ryan, co-owner and project lead. Leads web, digital and AI. Scopes, builds and looks after websites and the automation behind them. Twenty years of programming and IT consultancy, including second-line support on critical infrastructure for London Underground and utility companies in the UK. Has trained clients' teams to use AI since 2023, and holds a TU Dublin foundation certificate in AI, completed with distinction. Susan is the contact for anything web, digital, AI, accessibility, care or hosting.
- Emma Walkin, co-owner and production lead. Leads video production. Films corporate, medtech and educational work and coordinates the editors and crew from the first call to final delivery. On set most weeks. Emma is the contact for anything video.

Planning is at the heart of every project: scope, timelines and risks are agreed before work begins. The studio is experienced with procurement processes, approval chains and compliance requirements.

Agencies including Custodian, Real Nation and Dynamic EU have brought the studio in on significant projects, and through them it has worked with clients including An Post, Diageo, Heineken Ireland, Kerry Group, Lego and the National Disability Authority. Directly, it has worked mostly with medical and healthcare, charities and non-profits, and corporate teams, including Boston Scientific, Amgen and the Irish Red Cross. It also builds and manages websites for smaller businesses when the brief is a good fit.

Contact: hello@doghousemedia.ie. Studio: 13 Adelaide Road, Saint Kevin's, Dublin, D02 P950. Enquiries are answered within one working day. If a project is not a fit, they say so and point people somewhere better.

## Video production

Corporate, medtech, branding and educational video. From medical procedures to live events, the studio films where timing, preparation and technical knowledge matter, with a crew tailored to each production.

What they make:
- Brand and corporate video: company stories, campaigns and the people behind them.
- Medical and technical video: procedures, devices and processes, clear enough for training, education and sales.
- Social and vertical content: short cuts in vertical, square and landscape, planned from the same shoot.
- Aerial and drone footage.
- Photography: stills from the same shoot, without booking a second crew.
- Event coverage: conferences, launches and live events, with highlights cut for sharing.

Before filming, they work through the procedure or running order with the client's team, establish the key moments, the space and any restrictions, and plan camera positions, sound and crew around them. In clinical settings they take their lead from the medical team.

How a production runs: an initial consultation about what the video is for, who will watch it and where; pre-production (scripting, locations, casting, shot planning, all agreed before the shoot); filming, with a crew sized to the job; post-production (editing, sound, graphics and written captions, with review rounds built in, delivered in the formats and ratios needed).

Getting started with video: send the enquiry form saying what it is for, where it will be seen and roughly when it is needed. Then a discovery call with Emma or Susan, then a written proposal with approach, timeline and cost.

## Web development

Websites designed and built around the organisation: design, content and functionality planned and built together.

What they build:
- Websites for businesses and organisations: companies, charities, clinics, clubs and public bodies, simple for the client's own team to keep up to date.
- Learning platforms: online courses with enrolment, payment, progress tracking and certificates.
- E-commerce, bookings and donations: payments, appointments, subscriptions, one-off and monthly donations, including where clinical or regulatory rules apply.
- Bilingual websites in English and Irish, with the Irish text reviewed.

How they work: understand the organisation; plan the structure and content and agree it before design starts (first sign-off); design and develop, with the client commenting as it is built, and search visibility, mobile layouts and page speed included; test across devices, with a keyboard and a screen reader, launch, and train the client's team.

They build mainly in WordPress and WooCommerce so teams can edit their own sites. For smaller or faster-moving projects they build static sites in Astro, which means no database and very little to maintain or attack. This website is one of those. Security is part of the build: sites are hardened before launch, kept up to date, backed up and monitored.

The studio does not use off-the-shelf templates for client sites. They can usually work on a site someone else built, after checking what is there.

## AI and automation (AI Solutions)

Practical AI for the work a team repeats every week. Susan leads this work. Four ways to work together, and a review or team training is usually the best place to begin:
1. Practical AI Audit: a realistic look at where information is moved by hand or asked for repeatedly, and a short report on what will save time, what is not worth it and what to set up first.
2. Hands-on team workshops: training built around the team's actual workload, covering what AI does well, where it goes wrong, and how to keep client and patient information secure.
3. Custom built assistants: assistants that answer only from an organisation's verified information, with guardrails, and hand over to a person when needed. For public websites or internal teams.
4. Everyday automations: connecting platforms and the website so information moves without copying and pasting, sorting enquiries to the right person, drafting replies for approval, and automating repetitive reporting.

How they work: look first, and say so if a job does not need AI; one workflow at a time, measured against the time it was meant to save; built with the team who will use it; documented and handed over, or looked after by the studio if preferred.

Safety and privacy: anything new or sensitive is prepared as a draft for a person to approve; every provider and its privacy terms are laid out before building; assistants stay within the organisation's own information and pass anything else to a person.

Examples: Western Rheumatology's patient assistant answers routine patient questions from the clinic's own information and takes repeat prescription requests, and the clinic manages a hub of more than 50 medications on its own site. Edithouse, a wedding film company, has a chatbot that answers couples' questions before they enquire and reviews each lead, and the studio designed its lead generation and in-house editing workflows. Off Script Tapes, a camcorder hire service, has lead handling built around the enquiry, with quotes, questionnaires and invoices in one client portal and replies drafted in the brand's voice.

In their own studio they use Claude in a shared Team workspace, with a project for each client and each website they look after. They are setting up Hermes, an open-source agent, and running AI models locally so some work never leaves the studio.

Common questions: an organisation does not need its information perfectly in order first, though tidying it is often part of the job. An assistant can usually be added to an existing website without a new site. Teams can start with training only, with no obligation to build. No technical staff are needed to run what they build. The aim is to take repetitive work off people, not replace them.

Bandit itself is an example of a custom assistant: it answers only from the studio's own information.

## Accessibility audits

The studio builds and audits websites against WCAG 2.2 AA. For existing sites, an audit says what needs to change, who has to change it and in what order.

An audit covers every template and page pattern, not a sample; testing by hand with a keyboard and a screen reader as well as automated scanning; measured against WCAG 2.2 AA, and against 2.1 AA too if that is the client's obligation; every finding marked as the studio's to fix, the client's content team's, or a third-party supplier's (such as a booking widget or cookie banner); and a retest once fixes are done.

After the audit: remediation by the studio on sites they build and look after; a drafted accessibility statement; ongoing monitoring as part of Care and Hosting.

With Real Nation, who designed and ran the project, they built the National Disability Authority's Someone Like Me Art Awards site and worked through its formal accessibility audit until it passed WCAG 2.1 AA.

The law, in general terms only: the European Accessibility Act has applied in Ireland since 28 June 2025 (S.I. No. 636 of 2023). It covers specific services, such as online shops selling to consumers, consumer banking, e-books, electronic communications, audiovisual media services and passenger transport, not every website. Microenterprises (fewer than 10 staff and turnover or balance sheet of 2 million euro or less) are exempt from the service requirements. The Web Accessibility Directive (S.I. No. 358 of 2020) covers public sector bodies' websites and apps, not private businesses. Neither law says every Irish website must be accessible. The EU standard EN 301 549 still points to WCAG 2.1 AA; a newer version moving to 2.2 is not yet the legal reference. The studio tests to 2.2 AA so a site is ready for either. This is general information, not legal advice.

To get a scope and cost, send the website address through the audit request form.

## Care and hosting

Website care plans and managed hosting: updates, backups, security and speed, with one team to call.

Two plans:
- Express Support, for brochure sites: daily database backups and a weekly full backup kept off the server; weekly plugin and theme updates with security fixes applied as they land; firewall, monthly malware scans and a clean-up if anything gets through; uptime monitoring; premium plugin licences covered; a care report every year.
- Dedicated Growth, for shops, membership, e-learning and business sites that change often: everything in Express Support, plus daily full backups, daily malware scans, file change detection and two-factor login on request, a staging copy of the site, monthly speed tests and broken link scans with fixes, regular care and analytics reports, and an hour of growth work every month (a strategy call, a landing page, content changes, new features, business listing updates or email marketing help).

Hosting: they recommend cloud hosting and can run a managed cloud server sized to the site, with a security certificate, server updates, staging and room to grow. Clients can keep their own reputable host if they prefer, and the studio handles a move if it is time.

Each care plan is a fixed yearly quote. Work beyond the plan is done by the hour, agreed before starting. They can take on a site someone else built, after checking hosting, logins and condition.

## Pages on this site

- Home: /
- Work, all projects: /work/
- Video production: /video-production/
- Web development: /web-development/
- AI and automation: /ai-automation/
- Accessibility audits: /accessibility-audits/
- Care and hosting: /care-and-hosting/
- About Susan and Emma: /about/
- Articles: /blog/
- Contact form: /contact/
- Accessibility statement: /accessibility/
- Privacy policy: /privacy/
`;
