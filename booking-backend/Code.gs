/**
 * Discovery-call booking backend.
 *
 * Bound to a Google Sheet (Extensions → Apps Script). Deployed as a web app, it:
 *   GET  ?action=slots  → free slots for the next CONFIG.DAYS_AHEAD days, read from your calendar
 *   POST {booking JSON} → re-checks the slot, creates the Calendar event with a Meet link,
 *                          emails the invite to the client, and appends a row to the sheet
 *
 * Setup steps are in README.md, under "Booking form".
 */

const CONFIG = {
  CALENDAR_ID: 'primary',          // or a specific calendar's ID
  SHEET_NAME: 'Bookings',
  TIMEZONE: 'Asia/Kolkata',        // your working timezone
  WORK_DAYS: [1, 2, 3, 4, 5, 6],   // 0 = Sun … 6 = Sat
  START_HOUR: 10,                  // first slot starts at 10:00
  END_HOUR: 19,                    // last slot ends by 19:00
  SLOT_MINUTES: 30,
  BUFFER_MINUTES: 15,              // free gap kept around existing events
  DAYS_AHEAD: 14,
  MIN_NOTICE_HOURS: 12,
  MEETING_TITLE: 'Discovery call',
  OWNER_NAME: 'Abhishek Saini',
  NOTIFY_EMAIL: '',                // optional: also email a summary here on every booking
};

const HEADERS = [
  'Submitted at', 'Booking ID', 'Status', 'Call time (' + CONFIG.TIMEZONE + ')', 'Client timezone',
  'Name', 'Email', 'Phone / WhatsApp', 'Company', 'Website', 'Industry', 'Team size',
  'Interested in', 'Package', 'What to automate', 'Meet link', 'Calendar event', 'Page',
];

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'slots';
  if (action !== 'slots') return json_({ ok: false, error: 'unknown_action' });
  return json_({
    ok: true,
    timezone: CONFIG.TIMEZONE,
    slotMinutes: CONFIG.SLOT_MINUTES,
    days: getAvailability_(),
  });
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad_request', message: 'Could not read the form.' });
  }

  // Honeypot: bots fill hidden fields. Pretend success, do nothing.
  if (data.company_site) return json_({ ok: true });

  const problem = validate_(data);
  if (problem) return json_({ ok: false, error: 'invalid', message: problem });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const start = new Date(data.start);
    const end = new Date(start.getTime() + CONFIG.SLOT_MINUTES * 60e3);

    // The slot was free when the page loaded. Check again, under the lock, before booking.
    const stillFree = getAvailability_().some((d) => d.slots.indexOf(start.toISOString()) !== -1);
    if (!stillFree) {
      return json_({ ok: false, error: 'slot_taken', message: 'That time was just taken. Please pick another.' });
    }

    const id = 'BK-' + Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyMMdd') + '-' +
      Utilities.getUuid().slice(0, 4).toUpperCase();

    const event = Calendar.Events.insert(
      {
        summary: CONFIG.MEETING_TITLE + ': ' + data.name + ' (' + data.company + ')',
        description: describe_(data, id),
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
        attendees: [{ email: data.email, displayName: data.name }],
        conferenceData: {
          createRequest: { requestId: Utilities.getUuid(), conferenceSolutionKey: { type: 'hangoutsMeet' } },
        },
        reminders: { useDefault: true },
      },
      CONFIG.CALENDAR_ID,
      { conferenceDataVersion: 1, sendUpdates: 'all' }
    );

    const meetLink = event.hangoutLink || '';
    sheet_().appendRow([
      new Date(),
      id,
      'Booked',
      Utilities.formatDate(start, CONFIG.TIMEZONE, 'EEE d MMM yyyy, HH:mm'),
      data.timezone,
      data.name,
      data.email,
      data.phone,
      data.company,
      data.website,
      data.industry,
      data.teamSize,
      (data.interests || []).join(', '),
      data.package,
      data.message,
      meetLink,
      event.htmlLink || '',
      data.page,
    ].map(cell_));

    if (CONFIG.NOTIFY_EMAIL) {
      MailApp.sendEmail(CONFIG.NOTIFY_EMAIL, 'New discovery call: ' + data.name + ' (' + data.company + ')', describe_(data, id) +
        '\n\nWhen: ' + Utilities.formatDate(start, CONFIG.TIMEZONE, 'EEE d MMM yyyy, HH:mm') + ' ' + CONFIG.TIMEZONE +
        '\nMeet: ' + meetLink);
    }

    return json_({ ok: true, id: id, start: start.toISOString(), end: end.toISOString(), meetLink: meetLink });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server', message: 'Something went wrong while booking. Please try again.' });
  } finally {
    lock.releaseLock();
  }
}

/** Free slots grouped by day (in CONFIG.TIMEZONE), as ISO strings. */
function getAvailability_() {
  const tz = CONFIG.TIMEZONE;
  const slotMs = CONFIG.SLOT_MINUTES * 60e3;
  const bufMs = CONFIG.BUFFER_MINUTES * 60e3;
  const now = new Date();
  const earliest = now.getTime() + CONFIG.MIN_NOTICE_HOURS * 3600e3;
  const rangeEnd = new Date(now.getTime() + (CONFIG.DAYS_AHEAD + 1) * 864e5);

  const busy = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID)
    .getEvents(now, rangeEnd)
    .filter((ev) => !ev.isAllDayEvent())
    .map((ev) => [ev.getStartTime().getTime() - bufMs, ev.getEndTime().getTime() + bufMs]);

  const days = [];
  const seen = {};
  for (let i = 0; i <= CONFIG.DAYS_AHEAD; i++) {
    const probe = new Date(now.getTime() + i * 864e5);
    const ds = Utilities.formatDate(probe, tz, 'yyyy-MM-dd');
    if (seen[ds]) continue;
    seen[ds] = true;

    const dow = Number(Utilities.formatDate(probe, tz, 'u')) % 7; // u: 1 = Mon … 7 = Sun
    if (CONFIG.WORK_DAYS.indexOf(dow) === -1) continue;

    const offset = Utilities.formatDate(new Date(ds + 'T12:00:00Z'), tz, 'XXX'); // e.g. +05:30
    const slots = [];
    for (let m = CONFIG.START_HOUR * 60; m + CONFIG.SLOT_MINUTES <= CONFIG.END_HOUR * 60; m += CONFIG.SLOT_MINUTES) {
      const start = new Date(ds + 'T' + pad_(Math.floor(m / 60)) + ':' + pad_(m % 60) + ':00' + offset).getTime();
      const end = start + slotMs;
      if (start < earliest) continue;
      if (busy.some((b) => start < b[1] && end > b[0])) continue;
      slots.push(new Date(start).toISOString());
    }
    if (slots.length) days.push({ date: ds, slots: slots });
  }
  return days;
}

function validate_(d) {
  const str = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
  const opt = (v, max) => v == null || v === '' || (typeof v === 'string' && v.length <= max);
  if (!str(d.name, 100)) return 'Please enter your name.';
  if (!str(d.email, 200) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Please enter a valid email.';
  if (!str(d.company, 150)) return 'Please enter your company.';
  if (!str(d.message, 3000)) return 'Please tell us what you would like to automate.';
  if (!str(d.start, 40) || isNaN(new Date(d.start).getTime())) return 'Please pick a time.';
  if (![d.phone, d.website, d.industry, d.teamSize, d.package, d.timezone, d.page].every((v) => opt(v, 300))) return 'One of the fields is too long.';
  if (d.interests != null && (!Array.isArray(d.interests) || d.interests.length > 20)) return 'Invalid selection.';
  return '';
}

function describe_(d, id) {
  return [
    'Booking ' + id,
    '',
    'Name: ' + d.name,
    'Email: ' + d.email,
    'Phone / WhatsApp: ' + (d.phone || '-'),
    'Company: ' + d.company,
    'Website: ' + (d.website || '-'),
    'Industry: ' + (d.industry || '-'),
    'Team size: ' + (d.teamSize || '-'),
    'Interested in: ' + ((d.interests || []).join(', ') || '-'),
    'Package: ' + (d.package || '-'),
    'Client timezone: ' + (d.timezone || '-'),
    '',
    'What they want to automate:',
    d.message,
  ].join('\n');
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.insertSheet(CONFIG.SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

// Stops a value like "=HYPERLINK(...)" typed into the form from running as a formula.
function cell_(v) {
  if (v == null) return '';
  if (typeof v === 'string' && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function pad_(n) {
  return (n < 10 ? '0' : '') + n;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to grant permissions and create the sheet header. */
function setup() {
  sheet_();
  console.log(JSON.stringify(getAvailability_().slice(0, 2)));
}
