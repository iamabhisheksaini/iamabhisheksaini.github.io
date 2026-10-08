// ─────────────────────────────────────────────────────────────
// All site content lives here. Edit this file. You never need to
// touch index.html or main.js to update text, services or testimonials.
// ─────────────────────────────────────────────────────────────

window.SITE = {
  brand: {
    name: "Abhishek Saini", // swap for your agency name when you have one
    tagline: "AI Automation Agency",
    founder: "Abhishek Saini",
    founderRole: "Founder · AI Transformation for Traditional Businesses",
    location: "Gurugram, India · serving clients worldwide",
  },

  hero: {
    eyebrow: "AI Automation Agency · AAA model",
    titleA: "We build AI systems that",
    titleEm: "run your",
    // This word cycles on its own line. The first one shows if motion is reduced.
    rotate: ["business", "marketing", "sales", "support", "operations"],
    titleB: "while you grow it.",
    intro:
      "We're an AI automation agency. We audit how your business really works, automate the parts that leak time and revenue, " +
      "and keep improving them. AI agents, WhatsApp automation and workflow systems, built for outcomes rather than demos.",
  },

  // TODO: replace with your public profile URL (LinkedIn → View profile → copy URL)
  links: {
    linkedin: "https://www.linkedin.com/in/YOUR-HANDLE",
    linkedinServices: "https://www.linkedin.com/services/page/854b87347759456239",
    github: "https://github.com/iamabhisheksaini",
    email: "", // optional, e.g. "hello@youragency.com". Leave empty to hide.
    bookCall: "", // optional Calendly/Cal.com link. Falls back to LinkedIn.
  },

  // ── BOOKING FORM ────────────────────────────────────────────
  // Paste your Apps Script web app URL into `endpoint` (see README → Booking form).
  // Until then, the form runs in preview mode locally, and the live site falls back to LinkedIn.
  booking: {
    endpoint: "",
    minutes: 30,
    platform: "Google Meet",
    industries: [
      "Retail & e-commerce", "Real estate", "Healthcare & clinics", "Education & coaching",
      "Finance & insurance", "Hospitality & travel", "Professional services",
      "Manufacturing & distribution", "Marketing & agencies", "Other",
    ],
    teamSizes: ["Just me", "2–10", "11–50", "51–200", "200+"],
  },

  stats: [
    { value: "24/7", label: "AI agents answering and capturing leads, even off-hours" },
    { value: "~30%", label: "Fewer production bugs from the test systems we build" },
    { value: "7", label: "Customer intents understood from plain WhatsApp chat" },
    { value: "99", label: "Automated tests behind our flagship WhatsApp system" },
  ],

  // The AAA engagement model. Three phases, one letter each.
  model: [
    {
      letter: "A",
      name: "Audit",
      text: "We map how leads, requests and data move through your team today, and put a number on where time and revenue are lost.",
      deliverables: ["Process map", "Bottleneck report", "ROI-ranked automation plan"],
    },
    {
      letter: "A",
      name: "Automate",
      text: "We redesign the process, then build the AI agents, integrations and workflows that run it, connected to the tools you already use.",
      deliverables: ["AI agents in production", "CRM & tool integrations", "Team handover"],
    },
    {
      letter: "A",
      name: "Accelerate",
      text: "We measure, monitor and improve. Every system ships with metrics and alerts, so it keeps getting faster and stays reliable.",
      deliverables: ["Live metrics", "Error alerting", "Monthly optimisation"],
    },
  ],

  // What we automate. `icon`: megaphone, funnel, chat, gear, brain, chart, spark
  // `size: "feature"` makes a card full-width at the top. `tag` is the small label above the title.
  services: [
    {
      icon: "megaphone",
      size: "feature",
      tag: "All platforms · one system",
      title: "AI Marketing Engine",
      text: "One system that runs your social media across every platform. It creates on-brand posts, publishes on schedule every day, and checks each post against every platform's rules before it goes live, so your content and ads don't get disapproved.",
      bullets: [
        "One dashboard for all your platforms",
        "AI-written posts, captions and creatives in your brand voice",
        "Daily posting on autopilot, at the best time for each channel",
        "Policy check before publishing: flags or fixes anything likely to be rejected",
        "Handles disapprovals: finds why, corrects it, resubmits",
      ],
      platforms: ["Instagram", "Facebook", "LinkedIn", "X", "YouTube", "Google Business"],
    },
    {
      icon: "funnel",
      tag: "Never lose a lead",
      title: "Sales & Lead Automation",
      text: "One system that catches every enquiry, from ads, WhatsApp, your website or social DMs, then qualifies it, scores it and follows up automatically until it's ready for your sales team.",
      bullets: [
        "Every lead captured into your CRM, from every channel",
        "AI qualification and scoring, so hot leads come first",
        "Instant first reply, then timed follow-ups that never forget",
        "Proposals and quotes drafted automatically",
        "Meetings booked straight into your calendar",
      ],
      platforms: ["Meta Ads", "Google Ads", "WhatsApp", "Website forms", "Your CRM", "Calendar"],
    },
    {
      icon: "chat",
      tag: "24/7 · every channel",
      title: "Customer Support",
      text: "AI assistants that answer customers instantly, on every channel they use, with answers drawn from your own policies and products. Complex cases go to your team with the full context.",
      bullets: [
        "Instant replies, day and night, in the customer's language",
        "Answers grounded in your own policies, catalogue and FAQs",
        "Order status, bookings and common requests handled end to end",
        "Smart handoff to a human, with the full conversation attached",
        "Every conversation logged, so nothing falls through",
      ],
      platforms: ["WhatsApp", "Website chat", "Instagram DMs", "Facebook Messenger", "Email"],
    },
    {
      icon: "gear",
      tag: "Less busywork",
      title: "Operations & Back Office",
      text: "The repetitive work that eats your team's week, like invoices, data entry, reports, approvals and handoffs between tools, runs on its own, accurately, every time.",
      bullets: [
        "Invoices and documents read and entered automatically",
        "Data synced between your tools, with no copy-paste",
        "Approvals routed to the right person, with reminders",
        "Daily and weekly reports generated and sent for you",
        "Alerts the moment something needs attention",
      ],
      platforms: ["Gmail", "Google Sheets", "Google Drive", "Excel", "Slack", "Accounting tools"],
    },
    {
      icon: "brain",
      tag: "Answers in seconds",
      title: "Team Knowledge Assistant",
      text: "An AI assistant trained on your own documents, SOPs and policies. Your team asks a question in plain language and gets the right answer, with the source, in seconds.",
      bullets: [
        "Learns from your docs, SOPs, policies and price lists",
        "Answers with the source, so your team can trust it",
        "Stays up to date automatically when documents change",
        "New hires get up to speed in days, not weeks",
        "Available wherever your team works",
      ],
      platforms: ["Google Drive", "PDFs & docs", "Notion", "WhatsApp", "Slack"],
    },
    {
      icon: "chart",
      tag: "One live view",
      title: "Revenue Dashboards & Insights",
      text: "Every number that matters in one live view: leads, sales, marketing performance and the hours your automations save. You can see what's working and decide faster.",
      bullets: [
        "Leads, pipeline and revenue tracked in real time",
        "Marketing performance across every platform, side by side",
        "Time and cost saved by each automation, measured",
        "AI-written weekly summaries of what changed and why",
        "Alerts when a number moves the wrong way",
      ],
      platforms: ["Your CRM", "Meta Ads", "Google Ads", "Google Analytics", "Google Sheets"],
    },
    {
      icon: "spark",
      tag: "Built around you",
      title: "Custom AI Systems",
      text: "Have a process that doesn't fit a box? We design and build AI systems around how your business works, connect them to your tools, and keep them running as you grow.",
      bullets: [
        "Designed around your process, not a template",
        "Connected to the tools you already use",
        "Monitored with alerts, so issues are caught early",
        "Ongoing maintenance and improvements",
        "Built to scale as your business grows",
      ],
      platforms: ["Any API", "Your software", "Internal tools", "Databases"],
    },
  ],

  // Case studies: business story first. `impact` items show as big highlight numbers.
  work: [
    {
      featured: true,
      tag: "Flagship transformation",
      title: "From missed WhatsApp chats to an AI-driven sales desk",
      client: "Sales-led business · WhatsApp-first customers",
      before:
        "The sales team answered the same questions all day, by hand. Leads that came in on WhatsApp sat in chats and never reached the CRM, and follow-ups depended on someone remembering.",
      after:
        "We turned WhatsApp into the business's always-on sales desk. Customers get instant, accurate answers from the company's own documents. Every enquiry becomes a scored lead in the CRM, proposals are drafted automatically, and follow-up meetings are booked straight from the chat.",
      impact: [
        { value: "24/7", label: "Customers answered instantly, even after hours" },
        { value: "Every", label: "WhatsApp lead captured and scored in the CRM" },
        { value: "Zero", label: "Commands to learn: customers just chat" },
      ],
      link: "https://github.com/iamabhisheksaini/whatsapp-copilot",
      linkLabel: "See how it works",
    },
    {
      tag: "Lead generation",
      title: "Ad leads that land in the business automatically",
      client: "Fintech · UAE",
      before: "Leads from Meta and Google Ads were copied by hand between marketing tools and internal systems, so some arrived late and some were lost.",
      after: "Ad platforms now feed leads straight into the business's systems, and clients act on trading signals through one simple web workflow.",
      impact: [{ value: "Auto", label: "Lead flow from every ad campaign" }],
    },
    {
      tag: "Product reliability",
      title: "A SaaS product that ships faster and breaks less",
      client: "Project management SaaS · USA",
      before: "A growing product needed new features quickly, but every release risked breaking things for paying customers.",
      after: "Core features were rebuilt to scale, and automated end-to-end testing now checks every release before customers see it.",
      impact: [{ value: "~30%", label: "Fewer production bugs" }],
    },
    {
      tag: "AI adoption",
      title: "Sales support teams that actually use AI",
      client: "Enterprise IT services · India",
      before: "New AI tools had been rolled out, but teams kept hitting issues and falling back to manual work.",
      after: "Implementation issues get resolved fast, repetitive social posting is automated, and AI is now part of the team's daily workflow.",
      impact: [{ value: "Daily", label: "AI use in sales support workflows" }],
    },
  ],

  // Pricing. Tiers follow the AAA model. `featured: true` highlights a tier.
  pricing: [
    {
      phase: "Audit",
      name: "AI Audit",
      price: "$299",
      plus: true,
      note: "One-time",
      text: "A complete AI roadmap for your business, from what to build first to how it gets adopted, scaled and accelerated.",
      includes: [
        "Process and bottleneck audit",
        "ROI-ranked automation opportunities",
        "Build → adoption → scale → accelerate roadmap",
        "Clear quote for implementation",
      ],
      cta: "Book the audit",
    },
    {
      phase: "Automate",
      name: "AI Automation",
      price: "$999",
      plus: false,
      prefix: "Starts at",
      note: "Basic package",
      text: "Your first AI automation built, connected and live: an AI agent or workflow that takes real work off your team.",
      includes: [
        "One core AI automation, built end to end",
        "Connected to your existing tools",
        "Team handover and training",
        "Additional integrations quoted separately",
      ],
      cta: "Start automating",
      featured: true,
    },
    {
      phase: "Accelerate",
      name: "AI Revenue System",
      price: "$1,599",
      plus: false,
      note: "Complete package",
      text: "The full system that makes AI pay: automations, ongoing maintenance and revenue dashboards working together.",
      includes: [
        "Everything in AI Automation",
        "Automation maintenance and monitoring",
        "Revenue and performance dashboards",
        "Additional systems your growth needs",
      ],
      cta: "Scale with AI",
    },
  ],

  // Platforms we connect: shown in the scrolling strip under the hero.
  toolkit: [
    "Instagram", "Facebook", "LinkedIn", "WhatsApp", "YouTube", "X", "Google Business", "Gmail",
    "Google Sheets", "Google Drive", "Meta Ads", "Google Ads", "Salesforce", "Your CRM", "Your website",
  ],

  // ── TESTIMONIALS ────────────────────────────────────────────
  // Replace each placeholder with a real quote, then delete `placeholder: true`.
  // Placeholders only show when you preview locally. On the live site they are
  // hidden, and a "Worked with us?" call to action shows until you add real ones.
  // `photo` is optional: put an image in assets/ and write "assets/name.jpg".
  // `linkedin` is optional: the person's profile URL, shown as a verify link.
  testimonials: [
    {
      placeholder: true,
      quote: "What changed after working with us, in their words. One to three sentences reads best.",
      name: "Client name",
      title: "Founder",
      company: "Company",
      linkedin: "",
      photo: "",
    },
    {
      placeholder: true,
      quote: "A specific result works well here, e.g. 'We stopped losing WhatsApp leads within the first week.'",
      name: "Client name",
      title: "Head of Sales",
      company: "Company",
      linkedin: "",
      photo: "",
    },
    {
      placeholder: true,
      quote: "A partner or former manager on how we work: ownership, communication, reliability.",
      name: "Partner name",
      title: "Engineering Manager",
      company: "Company",
      linkedin: "",
      photo: "",
    },
  ],

  founder: {
    bio:
      "Abhishek Saini is the founder of the agency and leads every engagement personally. His mission is simple: take traditional businesses " +
      "and turn them into AI-driven ones. He doesn't sell chatbots. He redesigns how the business runs, then builds the AI systems that run it, " +
      "so the business captures more revenue with less manual work.",
    points: [
      "Founder-led: you work with Abhishek directly, from the first audit to scale",
      "Hands-on builder of AI agents and automation systems running in production",
      "Process first: every system starts from how your business really works",
      "Salesforce Certified AI Associate",
    ],
  },

  faq: [
    { q: "Do we need to change our tools?", a: "Usually not. We build on what you already use: WhatsApp, Google Workspace, your CRM, your ad accounts." },
    { q: "Is there a cost to talk first?", a: "No. The discovery call is free. The paid AI Audit is where we map your business in detail and build your roadmap." },
    { q: "How fast can we see results?", a: "The audit takes about a week. The first automation typically goes live within two to four weeks." },
    { q: "What if the AI gets something wrong?", a: "Every system we ship has validation, fallbacks and alerts. When the AI isn't confident, a human gets looped in." },
    { q: "Who owns the system?", a: "You do. You get the code, the workflows and documentation at handover." },
  ],
};
