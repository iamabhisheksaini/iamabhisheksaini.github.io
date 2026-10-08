# AI Automation Agency site

Static site with no build step. All text lives in `content.js`.

## Edit content

Open `content.js`:

- `links.linkedin`: replace `YOUR-HANDLE` with your public profile URL.
- `testimonials`: replace each placeholder quote, then delete its `placeholder: true` line.
  Placeholders only appear when previewing locally. On the live site they are hidden,
  and a "Recommend me on LinkedIn" card shows until you have at least one real quote.
- `services`, `work`, `model`, `faq`: copy an entry to add one. `brand.name` sets the agency name everywhere.
- `links.bookCall` / `links.email`: optional. Empty values are hidden.

Preview locally:

```bash
python3 -m http.server 4321 --directory ~/Desktop/abhishek-portfolio
```

Then open http://localhost:4321

## Deploy (free)

**Netlify Drop (fastest, no account setup):** go to https://app.netlify.com/drop and drag
this folder in. You get a URL right away and can rename the site in settings.

**Vercel:** `npx vercel` from this folder.

**GitHub Pages:** push to a repo named `iamabhisheksaini.github.io`. It goes live at
https://iamabhisheksaini.github.io

After deploying, replace both `SITE_URL` placeholders in `index.html` with your live URL
(for example `https://abhishek.netlify.app`) and redeploy. LinkedIn needs that absolute URL
to show the preview image.

## Make it visible on LinkedIn

1. **Profile → Contact info → Website:** add the URL, type "Portfolio".
2. **Profile → Add section → Featured → Add a link:** paste the URL. The card shows `assets/og-image.png`.
3. Check the preview at https://www.linkedin.com/post-inspector/ (it also refreshes LinkedIn's cache after edits).
4. Ask 3–5 past colleagues or clients for a LinkedIn recommendation. Copy each one into
   `testimonials`, adding their `linkedin` URL so visitors can verify it.

## Booking form (Calendar + Sheet)

Every "Book a call" button opens a booking popup. Visitors pick a free slot from your
Google Calendar and fill in their details. The script then creates the event with a
Google Meet link, emails them the invite, and adds a row to your Google Sheet.

The backend is a free Google Apps Script running under your own Google account
(`booking-backend/`). There's no server and no subscription.

**One-time setup (about 10 minutes):**

1. Create a new Google Sheet, e.g. "Discovery Call Bookings".
2. In the Sheet: **Extensions → Apps Script**.
3. Replace the contents of `Code.gs` with `booking-backend/Code.gs`.
4. **Project Settings (gear icon) → tick "Show appsscript.json"**, then replace that
   file with `booking-backend/appsscript.json`. This turns on the Calendar service the
   script uses to create Meet links.
5. At the top of `Code.gs`, check `CONFIG`: your timezone, working days and hours,
   slot length, and optionally `NOTIFY_EMAIL`.
6. Select the `setup` function and click **Run**. Approve the permissions (Calendar,
   Sheets, Mail). This also creates the "Bookings" tab with its headers.
7. **Deploy → New deployment → Web app**: Execute as **Me**, Who has access **Anyone**.
   Copy the Web app URL (ends in `/exec`).
8. Paste it into `content.js` → `booking.endpoint`, then redeploy the site.

**Behaviour:**

- Only free times are shown. Existing events (plus a 15-minute buffer), Sundays, times
  outside working hours, and anything within the next 12 hours are hidden.
- Visitors see times in their own timezone. The sheet records your timezone and theirs.
- If two people pick the same slot, the second person is asked to choose another time.
- Without an endpoint: the form runs in preview mode when you test locally (sample
  slots, nothing saved). On the live site, the buttons fall back to your LinkedIn link.
- When you change `Code.gs`, use **Deploy → Manage deployments → Edit → New version**.
  The URL stays the same.

**Sheet columns:** Submitted at, Booking ID, Status, Call time, Client timezone, Name,
Email, Phone / WhatsApp, Company, Website, Industry, Team size, Interested in, Package,
What to automate, Meet link, Calendar event, Page.
