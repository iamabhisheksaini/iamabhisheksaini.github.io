// Renders content.js into the page. Edit content.js, not this file.
(function () {
  const S = window.SITE;
  const $ = (sel) => document.querySelector(sel);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const get = (path) => path.split(".").reduce((o, k) => o?.[k], S);
  const isPlaceholderUrl = (u) => !u || u.includes("YOUR-HANDLE");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Placeholder testimonials appear only while previewing locally.
  const isLocal = ["localhost", "127.0.0.1", ""].includes(location.hostname) || location.protocol === "file:";

  document.querySelectorAll("[data-bind]").forEach((el) => (el.textContent = get(el.dataset.bind)));
  $("#year").textContent = new Date().getFullYear();

  const L = S.links;
  const linkedin = isPlaceholderUrl(L.linkedin) ? L.linkedinServices : L.linkedin;
  const book = L.bookCall || linkedin;

  const ICONS = {
    chat: '<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>',
    funnel: '<path d="M3 4h18l-7 8v6l-4 2v-8z"/>',
    brain: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
    flow: '<rect x="3" y="4" width="6" height="5" rx="1"/><rect x="15" y="15" width="6" height="5" rx="1"/><path d="M6 9v4a2 2 0 0 0 2 2h7"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2c2.9.4 5 2.8 5 5.8"/>',
    code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    megaphone: '<path d="M3 10v4a1 1 0 0 0 1 1h3l6 4V5L7 9H4a1 1 0 0 0-1 1z"/><path d="M17 8a5 5 0 0 1 0 8M19.5 5.5a8.5 8.5 0 0 1 0 13"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  };
  const icon = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[k] || ICONS.flow}</svg>`;

  // Marquee (list doubled for a seamless loop)
  const m = S.toolkit.map((t) => `<span>${esc(t)}</span>`).join("");
  $("#marquee").innerHTML = m + m;
  const words = ["Audit", "Automate", "Accelerate", "AI agents", "Marketing", "Sales", "Support", "Operations", "Dashboards"]
    .map((t) => `<span>${esc(t)}</span>`).join("");
  $("#marquee2").innerHTML = words + words;
  const cta = ["Book a free discovery call", "Audit → Automate → Accelerate", "Founder-led", "AI Audit from $299"]
    .map((t) => `<span>${esc(t)}</span>`).join("");
  $("#marquee3").innerHTML = cta + cta + cta;

  $("#stats").innerHTML = S.stats
    .map((s) => `<div class="stat"><div class="stat-v" data-count="${esc(s.value)}">${esc(s.value)}</div><div class="stat-l">${esc(s.label)}</div></div>`)
    .join("");

  $("#model-list").innerHTML = S.model
    .map(
      (p, i) => `
      <article class="phase reveal" style="--d:${i * 120}ms">
        <div class="phase-top"><span class="phase-letter">${esc(p.letter)}</span><span class="phase-n">0${i + 1}</span></div>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.text)}</p>
        <ul class="ticks">${p.deliverables.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
      </article>`
    )
    .join("");

  $("#services-list").innerHTML = S.services
    .map(
      (s, i) => `
      <article class="svc reveal ${s.size || ""}" style="--d:${(i % 2) * 90}ms">
        <div class="svc-intro">
          <div class="svc-top"><span class="svc-ic">${icon(s.icon)}</span>${s.tag ? `<span class="tag">${esc(s.tag)}</span>` : ""}</div>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </div>
        <div class="svc-detail">
          ${s.bullets ? `<ul class="ticks">${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
          ${s.platforms ? `<p class="label">Works with</p><ul class="platforms">${s.platforms.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        </div>
      </article>`
    )
    .join("");

  const impact = (arr) =>
    `<div class="impact">${(arr || []).map((m) => `<div><span class="impact-v">${esc(m.value)}</span><span class="impact-l">${esc(m.label)}</span></div>`).join("")}</div>`;
  const featured = (w) => `
    <article class="case featured reveal">
      <div class="case-head">
        <span class="tag">${esc(w.tag || "Featured")}</span>
        <p class="ctx">${esc(w.client || "")}</p>
        <h3>${esc(w.title)}</h3>
      </div>
      <div class="ba">
        <div class="ba-col before"><p class="label">Before</p><p>${esc(w.before)}</p></div>
        <span class="ba-arrow" aria-hidden="true">→</span>
        <div class="ba-col after"><p class="label">After</p><p>${esc(w.after)}</p></div>
      </div>
      ${impact(w.impact)}
      ${w.link ? `<a class="text-link" href="${esc(w.link)}" target="_blank" rel="noopener">${esc(w.linkLabel || "Learn more")} →</a>` : ""}
    </article>`;
  const card = (w, i) => `
    <article class="case reveal" style="--d:${i * 90}ms">
      ${impact(w.impact)}
      <span class="tag">${esc(w.tag || "")}</span>
      <h3>${esc(w.title)}</h3>
      <p class="ctx">${esc(w.client || "")}</p>
      <p class="label">Before</p><p>${esc(w.before)}</p>
      <p class="label">After</p><p>${esc(w.after)}</p>
    </article>`;
  $("#work-list").innerHTML =
    S.work.filter((w) => w.featured).map(featured).join("") +
    `<div class="case-grid">${S.work.filter((w) => !w.featured).map(card).join("")}</div>`;

  $("#pricing-list").innerHTML = S.pricing
    .map(
      (p, i) => `
      <article class="price reveal ${p.featured ? "hot" : ""}" style="--d:${i * 110}ms">
        ${p.featured ? '<span class="price-badge">Most popular</span>' : ""}
        <p class="price-phase"><span>A</span>${esc(p.phase)}</p>
        <h3>${esc(p.name)}</h3>
        <p class="price-v">${p.prefix ? `<small>${esc(p.prefix)}</small>` : ""}${esc(p.price)}${p.plus ? "<sup>+</sup>" : ""}</p>
        <p class="price-note">${esc(p.note)}</p>
        <p class="price-text">${esc(p.text)}</p>
        <ul class="ticks">${p.includes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <a class="btn ${p.featured ? "btn-glow" : "btn-ghost"} js-book" href="#contact" data-package="${esc(p.name)}">${esc(p.cta)}</a>
      </article>`
    )
    .join("");

  const real = S.testimonials.filter((t) => !t.placeholder);
  const shown = isLocal ? S.testimonials : real;
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  let tHtml = shown
    .map(
      (t, i) => `
      <figure class="t reveal ${t.placeholder ? "t-placeholder" : ""}" style="--d:${i * 90}ms">
        ${t.placeholder ? '<span class="tag tag-warn">Placeholder · only visible locally</span>' : '<span class="q" aria-hidden="true">“</span>'}
        <blockquote>${esc(t.quote)}</blockquote>
        <figcaption>
          ${t.photo ? `<img src="${esc(t.photo)}" alt="" class="avatar">` : `<span class="avatar">${esc(initials(t.name))}</span>`}
          <span class="who"><strong>${esc(t.name)}</strong><small>${esc([t.title, t.company].filter(Boolean).join(", "))}</small></span>
          ${t.linkedin ? `<a class="verify" href="${esc(t.linkedin)}" target="_blank" rel="noopener" aria-label="${esc(t.name)} on LinkedIn">in</a>` : ""}
        </figcaption>
      </figure>`
    )
    .join("");
  if (!real.length) {
    tHtml += `
      <div class="t t-cta reveal">
        <h3>Worked with us?</h3>
        <p class="muted">A short recommendation on LinkedIn means a lot, and every one gets featured here.</p>
        <a class="btn btn-sm" href="${esc(linkedin)}" target="_blank" rel="noopener">Recommend us on LinkedIn</a>
      </div>`;
  }
  $("#testimonials-list").innerHTML = tHtml;

  $("#creds").innerHTML = S.founder.points.map((c) => `<li>${esc(c)}</li>`).join("");
  $("#faq").innerHTML = S.faq
    .map((f, i) => `<details ${i === 0 ? "open" : ""}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
    .join("");

  const contact = [
    [book, "Book a free discovery call", "btn btn-dark js-book"],
    [L.linkedinServices, "LinkedIn services page", "btn btn-line"],
    [L.github, "GitHub", "btn btn-line"],
    L.email ? [`mailto:${L.email}`, L.email, "btn btn-line"] : null,
  ].filter(Boolean);
  $("#contact-links").innerHTML = contact
    .map(([href, label, cls]) => `<a class="${cls}" href="${esc(href)}" ${href.startsWith("mailto") ? "" : 'target="_blank" rel="noopener"'}>${esc(label)}</a>`)
    .join("");

  document.querySelectorAll(".js-book").forEach((a) => Object.assign(a, { href: book, target: "_blank", rel: "noopener" }));

  // Hero chat: plays a short lead-capture conversation, then shows the CRM toast.
  const script = [
    ["in", "Hi, we run 12 retail stores. Can your bot handle our order queries?"],
    ["out", "Yes. It answers from your own policies and catalogue, 24/7, and hands off to your team when needed. Want a quick demo?"],
    ["in", "Sure, next Wed 3pm works"],
    ["out", "Booked for Wed 3:00 pm ✓ Calendar invite sent. Talk soon!"],
  ];
  const chat = $("#chat");
  const bubble = ([dir, text]) => `<div class="msg ${dir}">${esc(text)}</div>`;
  if (reduceMotion) {
    chat.innerHTML = script.map(bubble).join("");
    $("#toast").classList.add("show");
  } else {
    let i = 0;
    const tick = () => {
      if (i < script.length) {
        chat.insertAdjacentHTML("beforeend", bubble(script[i++]));
        setTimeout(tick, 1300);
      } else {
        $("#toast").classList.add("show");
        setTimeout(() => {
          chat.innerHTML = "";
          $("#toast").classList.remove("show");
          i = 0;
          tick();
        }, 5000);
      }
    };
    setTimeout(tick, 500);
  }

  // Scroll reveal
  const els = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.12 }
    );
    els.forEach((e) => io.observe(e));
  }

  // ── Effects ─────────────────────────────────────────────────
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Rotating headline words
  const rot = $("#rotator");
  const list = S.hero.rotate || [];
  if (rot) rot.textContent = list[0] || "";
  if (rot && list.length > 1 && !reduceMotion) {
    let k = 0;
    setInterval(() => {
      k = (k + 1) % list.length;
      rot.classList.add("out");
      setTimeout(() => {
        rot.textContent = list[k];
        rot.classList.remove("out");
      }, 380);
    }, 2600);
  }

  // Count-up stats (numbers only; "24/7" style values stay as written)
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const raw = e.target.dataset.count;
      const m = raw.match(/^(\D*)(\d+)(\D*)$/);
      if (!m || reduceMotion) return;
      const [, pre, num, post] = m;
      const target = Number(num);
      const from = target > 1000 ? target - 30 : 0;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / 1400);
        const eased = 1 - Math.pow(1 - p, 3);
        e.target.textContent = pre + Math.round(from + (target - from) * eased) + post;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

  // Scroll progress bar
  const bar = $("#progress");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (finePointer && !reduceMotion) {
    // Page spotlight that follows the cursor
    const spot = $("#spot");
    addEventListener("pointermove", (e) => {
      spot.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
      spot.style.opacity = 1;
    }, { passive: true });

    // Card glow that tracks the cursor
    document.querySelectorAll(".svc, .case, .price, .phase, .t, .stat").forEach((card) => {
      card.classList.add("glow");
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });

    // Magnetic buttons
    document.querySelectorAll(".btn").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        b.style.transform = `translate(${x}px, ${y}px)`;
      });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });

    // Hero phone tilts toward the cursor
    const stage = document.querySelector(".stage");
    const hero = document.querySelector(".hero");
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.transform = `perspective(1200px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
    });
    hero.addEventListener("pointerleave", () => (stage.style.transform = ""));
  }
})();
