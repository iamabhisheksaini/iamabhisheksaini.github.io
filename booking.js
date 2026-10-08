// Discovery-call booking popup. Talks to the Apps Script in booking-backend/.
// Settings live in content.js → booking.
(function () {
  const S = window.SITE;
  const B = S.booking || {};
  const $ = (sel) => document.querySelector(sel);
  const dlg = $("#booking");
  if (!dlg) return;

  const endpoint = (B.endpoint || "").trim();
  const isLocal = ["localhost", "127.0.0.1", ""].includes(location.hostname) || location.protocol === "file:";
  // live: real bookings · preview: local fake slots, nothing saved · off: buttons keep the LinkedIn fallback
  const mode = endpoint ? "live" : isLocal ? "preview" : "off";
  if (mode === "off") return;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const fmtWeekday = new Intl.DateTimeFormat(undefined, { weekday: "short" });
  const fmtMonth = new Intl.DateTimeFormat(undefined, { month: "short" });
  const fmtTime = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
  const fmtLong = new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" });
  const localKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  let days = []; // [{ key, date, slots: [Date] }]
  let selectedDay = null;
  let selectedSlot = null;
  let loaded = false;

  // ── Static setup ────────────────────────────────────────────
  $("#bk-len").textContent = `${B.minutes || 30} minutes`;
  $("#bk-where").textContent = B.platform || "Google Meet";
  $("#bk-tz").textContent = `· times in ${tz.replace(/_/g, " ")}`;
  const fill = (sel, items) => items.forEach((v) => sel.insertAdjacentHTML("beforeend", `<option>${esc(v)}</option>`));
  fill($("#bk-industry"), B.industries || []);
  fill($("#bk-team"), B.teamSizes || []);
  (S.pricing || []).forEach((p) =>
    $("#bk-package").insertAdjacentHTML("beforeend", `<option value="${esc(p.name)}">${esc(p.name)} · ${esc(p.prefix ? "from " : "")}${esc(p.price)}${p.plus ? "+" : ""}</option>`)
  );
  $("#bk-interests").innerHTML = (S.services || [])
    .map((s) => `<label class="bk-chip"><input type="checkbox" name="interests" value="${esc(s.title)}"><span>${esc(s.title)}</span></label>`)
    .join("");
  if (mode === "preview") {
    const m = $("#bk-mode");
    m.hidden = false;
    m.textContent = "Preview mode: these times are samples and nothing is saved. Add your Apps Script URL in content.js to take real bookings.";
  }

  // ── Open / close ────────────────────────────────────────────
  function open(pkg) {
    if (pkg) $("#bk-package").value = pkg;
    go(selectedSlot ? 2 : 1);
    if (!dlg.open) dlg.showModal();
    document.documentElement.classList.add("bk-lock");
    if (!loaded) loadSlots();
  }
  function close() {
    dlg.close();
  }
  dlg.addEventListener("close", () => {
    document.documentElement.classList.remove("bk-lock");
    if (location.hash === "#book") history.replaceState(null, "", location.pathname + location.search);
  });
  $("#bk-close").addEventListener("click", close);
  dlg.addEventListener("click", (e) => e.target === dlg && close()); // click on backdrop

  document.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest(".js-book, a[href='#book']");
      if (!a) return;
      e.preventDefault();
      open(a.dataset.package);
    },
    true
  );
  if (location.hash === "#book") open();

  // ── Steps ───────────────────────────────────────────────────
  function go(n) {
    dlg.querySelectorAll(".bk-step").forEach((s) => (s.hidden = Number(s.dataset.step) !== n));
    $("#bk-steps").querySelectorAll("li").forEach((li) => {
      const s = Number(li.dataset.s);
      li.classList.toggle("on", s === n);
      li.classList.toggle("done", s < n);
    });
    dlg.querySelector(".bk-main").scrollTop = 0;
  }
  $("#bk-change").addEventListener("click", () => go(1));
  $("#bk-finish").addEventListener("click", close);

  // ── Slots ───────────────────────────────────────────────────
  async function loadSlots(message) {
    status(message || "Loading available times…");
    $("#bk-days").innerHTML = "";
    $("#bk-times").innerHTML = "";
    try {
      const iso = mode === "live" ? await fetchSlots() : sampleSlots();
      groupByLocalDay(iso.map((s) => new Date(s)));
      loaded = true;
      if (!days.length) return status("No free times in the next two weeks. Message us on LinkedIn and we'll find one.");
      status(message || "");
      renderDays();
      pickDay(days.find((d) => selectedDay && d.key === selectedDay.key) || days[0]);
    } catch (err) {
      console.error(err);
      status("Couldn't load available times. Please try again in a moment.");
    }
  }

  async function fetchSlots() {
    const res = await fetch(`${endpoint}?action=slots`);
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "slots_failed");
    return data.days.flatMap((d) => d.slots);
  }

  // Preview only: weekday slots 10:00–18:30 local time, with a few gaps.
  function sampleSlots() {
    const out = [];
    const now = new Date();
    for (let i = 1; out.length < 120 && i <= 14; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      if (d.getDay() === 0) continue;
      for (let h = 10; h < 19; h += 0.5) {
        if ((i * 7 + h * 2) % 5 === 0) continue;
        out.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(h), (h % 1) * 60).toISOString());
      }
    }
    return out;
  }

  function groupByLocalDay(dates) {
    const map = new Map();
    dates.sort((a, b) => a - b).forEach((d) => {
      const k = localKey(d);
      if (!map.has(k)) map.set(k, { key: k, date: d, slots: [] });
      map.get(k).slots.push(d);
    });
    days = [...map.values()];
  }

  function renderDays() {
    $("#bk-days").innerHTML = days
      .map((d) => {
        const wd = fmtWeekday.format(d.date);
        return `<button type="button" class="bk-day" role="option" data-k="${d.key}">
          <small>${esc(wd)}</small><strong>${d.date.getDate()}</strong><small>${esc(fmtMonth.format(d.date))}</small></button>`;
      })
      .join("");
    $("#bk-days").querySelectorAll(".bk-day").forEach((b) => b.addEventListener("click", () => pickDay(days.find((d) => d.key === b.dataset.k))));
  }

  function pickDay(day) {
    selectedDay = day;
    $("#bk-days").querySelectorAll(".bk-day").forEach((b) => {
      const on = b.dataset.k === day.key;
      b.classList.toggle("on", on);
      b.setAttribute("aria-selected", on);
      if (on) b.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    $("#bk-times").innerHTML = day.slots
      .map((t) => `<button type="button" class="bk-time" role="option" data-t="${t.toISOString()}">${esc(fmtTime.format(t))}</button>`)
      .join("");
    $("#bk-times").querySelectorAll(".bk-time").forEach((b) =>
      b.addEventListener("click", () => {
        selectedSlot = new Date(b.dataset.t);
        $("#bk-chosen").textContent = `${fmtLong.format(selectedSlot)} · ${B.minutes || 30} min`;
        go(2);
        $("#bk-form").elements.name.focus();
      })
    );
  }

  function status(msg) {
    $("#bk-status").textContent = msg;
  }

  // ── Submit ──────────────────────────────────────────────────
  $("#bk-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const err = $("#bk-error");
    err.textContent = "";

    const required = ["name", "email", "company", "message"];
    const missing = required.find((n) => !f.elements[n].value.trim());
    if (missing) {
      err.textContent = "Please fill in the fields marked *.";
      return f.elements[missing].focus();
    }
    if (!f.elements.email.checkValidity()) {
      err.textContent = "Please enter a valid email.";
      return f.elements.email.focus();
    }

    const payload = {
      start: selectedSlot.toISOString(),
      timezone: tz,
      name: f.elements.name.value.trim(),
      email: f.elements.email.value.trim(),
      phone: f.elements.phone.value.trim(),
      company: f.elements.company.value.trim(),
      website: f.elements.website.value.trim(),
      industry: f.elements.industry.value,
      teamSize: f.elements.teamSize.value,
      package: f.elements.package.value,
      interests: [...f.querySelectorAll("input[name=interests]:checked")].map((i) => i.value),
      message: f.elements.message.value.trim(),
      company_site: f.elements.company_site.value,
      page: location.href,
    };

    const btn = $("#bk-submit");
    btn.disabled = true;
    btn.textContent = "Booking…";
    try {
      let result;
      if (mode === "live") {
        // text/plain keeps this a "simple" request, so Apps Script needs no CORS preflight.
        const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
        result = await res.json();
      } else {
        await new Promise((r) => setTimeout(r, 700));
        result = { ok: true, start: payload.start, meetLink: "" };
        console.info("[booking preview] would send:", payload);
      }

      if (!result.ok) {
        if (result.error === "slot_taken") {
          selectedSlot = null;
          go(1);
          return loadSlots(result.message);
        }
        err.textContent = result.message || "Something went wrong. Please try again.";
        return;
      }

      $("#bk-when").textContent = fmtLong.format(new Date(result.start));
      $("#bk-done-note").textContent =
        mode === "live"
          ? `A calendar invite with the meeting link is on its way to ${payload.email}.`
          : "Preview mode: nothing was saved. Connect the Apps Script to take real bookings.";
      const meet = $("#bk-meet");
      meet.hidden = !result.meetLink;
      if (result.meetLink) meet.href = result.meetLink;
      go(3);
      f.reset();
      selectedSlot = null;
      loaded = false; // the booked slot is gone next time
    } catch (ex) {
      console.error(ex);
      err.textContent = "Couldn't reach the booking system. Check your connection and try again.";
    } finally {
      btn.disabled = false;
      btn.textContent = "Confirm booking";
    }
  });

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
})();
