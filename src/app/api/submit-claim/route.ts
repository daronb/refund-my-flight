import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkEligibility } from "@/lib/eligibility";
import { airlineNames, getAirlineFromFlightNumber } from "@/data/airlines";
import { getAirportByCode } from "@/data/airports";

const VALID_EVENT_TYPES = ["delayed", "cancelled", "denied", "unsure"];
const VALID_DELAY_DURATIONS = ["less-than-3", "3-or-more", "unsure", ""];

function isValidAirportCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code);
}

function sanitize(str: string): string {
  return str.replace(/[<>"'&]/g, "").trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function validatePayload(body: unknown) {
  if (!body || typeof body !== "object") return { valid: false as const, error: "Invalid request body" };
  const b = body as Record<string, unknown>;

  const fn = typeof b.flight_number === "string" ? b.flight_number.toUpperCase().trim() : "";
  if (fn && !/^[A-Z0-9]{2,10}$/.test(fn)) return { valid: false as const, error: "Invalid flight number" };

  const fd = typeof b.flight_date === "string" ? b.flight_date : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fd)) return { valid: false as const, error: "Invalid flight date" };
  const flightDate = new Date(fd);
  if (isNaN(flightDate.getTime())) return { valid: false as const, error: "Invalid flight date" };
  if (flightDate > new Date()) return { valid: false as const, error: "Flight date cannot be in the future" };
  const sixYearsAgo = new Date();
  sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);
  if (flightDate < sixYearsAgo) return { valid: false as const, error: "Flight date is too old" };

  const dep = typeof b.departure_airport === "string" ? b.departure_airport.toUpperCase().trim() : "";
  const arr = typeof b.arrival_airport === "string" ? b.arrival_airport.toUpperCase().trim() : "";
  if (!isValidAirportCode(dep)) return { valid: false as const, error: "Invalid departure airport code" };
  if (!isValidAirportCode(arr)) return { valid: false as const, error: "Invalid arrival airport code" };

  const et = typeof b.event_type === "string" ? b.event_type : "";
  if (!VALID_EVENT_TYPES.includes(et)) return { valid: false as const, error: "Invalid event type" };

  const dd = typeof b.delay_duration === "string" ? b.delay_duration : "";
  if (!VALID_DELAY_DURATIONS.includes(dd)) return { valid: false as const, error: "Invalid delay duration" };

  const name = typeof b.full_name === "string" ? sanitize(b.full_name) : "";
  if (name.length < 2 || name.length > 100) return { valid: false as const, error: "Name must be 2-100 characters" };

  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255)
    return { valid: false as const, error: "Invalid email" };

  const phone = typeof b.phone === "string" ? sanitize(b.phone) : "";
  if (phone.length < 7 || phone.length > 20) return { valid: false as const, error: "Invalid phone number" };

  const br = typeof b.booking_reference === "string" ? sanitize(b.booking_reference) : null;
  if (br && br.length > 20) return { valid: false as const, error: "Booking reference too long" };

  const pc = typeof b.passenger_count === "number" ? b.passenger_count : 1;
  if (!Number.isInteger(pc) || pc < 1 || pc > 20) return { valid: false as const, error: "Invalid passenger count" };

  return {
    valid: true as const,
    data: {
      flight_number: fn,
      flight_date: fd,
      departure_airport: dep,
      arrival_airport: arr,
      event_type: et,
      delay_duration: dd || null,
      full_name: name,
      email,
      phone,
      booking_reference: br || null,
      passenger_count: pc,
      utm_source: typeof b.utm_source === "string" ? b.utm_source.slice(0, 100) : null,
      utm_medium: typeof b.utm_medium === "string" ? b.utm_medium.slice(0, 100) : null,
      utm_campaign: typeof b.utm_campaign === "string" ? b.utm_campaign.slice(0, 100) : null,
    },
  };
}

function runEligibilityCheck(data: { flight_number: string; flight_date: string; departure_airport: string; arrival_airport: string; event_type: string; delay_duration: string | null }) {
  const airlineCode = getAirlineFromFlightNumber(data.flight_number);
  const result = checkEligibility({
    flightNumber: data.flight_number,
    flightDate: data.flight_date ? new Date(data.flight_date) : undefined,
    departureAirport: data.departure_airport,
    arrivalAirport: data.arrival_airport,
    airline: airlineCode || "",
    eventType: data.event_type,
    delayDuration: data.delay_duration || "",
  });
  return {
    eligible: result.eligible && !result.uncertain,
    estimatedCompensation: result.estimatedCompensation?.zar ?? null,
    reasons: result.reasons,
    airlineCode,
  };
}

function formatAirport(code: string): string {
  const ap = getAirportByCode(code);
  if (!ap) return code;
  return `${code} — ${ap.city} (${ap.name})`;
}

function formatAirline(code: string | null): string {
  if (!code) return "Unknown (could not parse from flight number)";
  const name = airlineNames[code];
  return name ? `${name} (${code})` : `Unknown carrier (code: ${code})`;
}

function formatEvent(eventType: string, delayDuration: string | null): string {
  const eventLabels: Record<string, string> = {
    delayed: "Delayed",
    cancelled: "Cancelled",
    denied: "Denied boarding",
    unsure: "Unsure what happened",
  };
  const delayLabels: Record<string, string> = {
    "less-than-3": "less than 3 hours",
    "3-or-more": "3 hours or more",
    unsure: "duration unknown",
  };
  const base = eventLabels[eventType] ?? eventType;
  if (eventType === "delayed" && delayDuration && delayLabels[delayDuration]) {
    return `${base} — ${delayLabels[delayDuration]}`;
  }
  return base;
}

function generateClaimRef(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `RMF-${year}-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = validatePayload(body);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { data } = result;
    const eligibility = runEligibilityCheck(data);
    const claimRef = generateClaimRef();

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const estimatedAmount = eligibility.estimatedCompensation
      ? `R${eligibility.estimatedCompensation.toLocaleString()}`
      : "To be determined";
    const submittedAt = new Date().toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" });
    const airlineLabel = formatAirline(eligibility.airlineCode);
    const departureLabel = formatAirport(data.departure_airport);
    const arrivalLabel = formatAirport(data.arrival_airport);
    const eventLabel = formatEvent(data.event_type, data.delay_duration);
    const reasonsHtml = eligibility.reasons.length
      ? `<ul style="margin:4px 0;padding-left:18px;">${eligibility.reasons.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}</ul>`
      : "—";
    const utm = [data.utm_source, data.utm_medium, data.utm_campaign].filter(Boolean).join(" / ") || "Direct";
    const row = (label: string, value: string) =>
      `<tr><td style="padding:6px 16px 6px 0;color:#666;vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:6px 0;">${value}</td></tr>`;

    await Promise.all([
      resend.emails.send({
        from: "Refund My Flight <notifications@refundmyflight.co.za>",
        to: ["daron@refundmyflight.co.za", "daronbiddle21@gmail.com"],
        replyTo: data.email,
        subject: `New Claim ${claimRef} — ${escapeHtml(data.full_name)} — ${escapeHtml(data.flight_number)} ${escapeHtml(data.flight_date)}`,
        html: `
          <div style="font-family:sans-serif;max-width:680px;color:#1B2A4A;">
            <h2 style="margin:0 0 4px;">New Claim Submitted</h2>
            <p style="margin:0 0 20px;color:#666;font-size:13px;">${submittedAt} (SAST)</p>

            <h3 style="margin:20px 0 6px;font-size:14px;color:#4A90D9;text-transform:uppercase;letter-spacing:0.5px;">Claim</h3>
            <table style="border-collapse:collapse;font-size:14px;">
              ${row("Reference", `<strong>${claimRef}</strong>`)}
              ${row("Eligibility", eligibility.eligible ? "<strong style=\"color:#1a8a4a;\">Eligible</strong>" : "Not eligible / uncertain")}
              ${row("Est. compensation", `<strong>${estimatedAmount}</strong> (per passenger)`)}
              ${row("Passengers", String(data.passenger_count))}
              ${row("Reasons", reasonsHtml)}
            </table>

            <h3 style="margin:24px 0 6px;font-size:14px;color:#4A90D9;text-transform:uppercase;letter-spacing:0.5px;">Customer</h3>
            <table style="border-collapse:collapse;font-size:14px;">
              ${row("Name", escapeHtml(data.full_name))}
              ${row("Email", `<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>`)}
              ${row("Phone", `<a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a>`)}
            </table>

            <h3 style="margin:24px 0 6px;font-size:14px;color:#4A90D9;text-transform:uppercase;letter-spacing:0.5px;">Flight</h3>
            <table style="border-collapse:collapse;font-size:14px;">
              ${row("Airline", escapeHtml(airlineLabel))}
              ${row("Flight number", `<strong>${escapeHtml(data.flight_number)}</strong>`)}
              ${row("Flight date", escapeHtml(data.flight_date))}
              ${row("Departure", escapeHtml(departureLabel))}
              ${row("Arrival", escapeHtml(arrivalLabel))}
              ${row("Event", `<strong>${escapeHtml(eventLabel)}</strong>`)}
              ${row("Booking ref", data.booking_reference ? `<strong>${escapeHtml(data.booking_reference)}</strong>` : "<em style=\"color:#c00;\">Not provided — request from customer before contacting airline</em>")}
            </table>

            <h3 style="margin:24px 0 6px;font-size:14px;color:#4A90D9;text-transform:uppercase;letter-spacing:0.5px;">Attribution</h3>
            <table style="border-collapse:collapse;font-size:14px;">
              ${row("Source", escapeHtml(utm))}
            </table>
          </div>
        `,
      }),
      resend.emails.send({
        from: "Refund My Flight <notifications@refundmyflight.co.za>",
        to: [data.email],
        subject: `Claim Received — ${claimRef}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1B2A4A;">
            <h1 style="color:#1B2A4A;font-size:24px;">Thanks, ${escapeHtml(data.full_name)}!</h1>
            <p style="font-size:16px;line-height:1.6;">We've received your flight compensation claim and our team is on it.</p>
            <div style="background:#F5F7FA;border-radius:8px;padding:20px;margin:24px 0;">
              <p style="margin:0 0 4px;color:#666;font-size:13px;">Your claim reference</p>
              <p style="margin:0;font-size:22px;font-weight:bold;color:#1B2A4A;">${claimRef}</p>
            </div>
            <table style="border-collapse:collapse;width:100%;font-size:14px;">
              <tr><td style="padding:8px 0;color:#666;border-bottom:1px solid #eee;">Flight</td><td style="padding:8px 0;text-align:right;border-bottom:1px solid #eee;font-weight:500;">${escapeHtml(data.flight_number)} — ${escapeHtml(data.flight_date)}</td></tr>
              <tr><td style="padding:8px 0;color:#666;border-bottom:1px solid #eee;">Route</td><td style="padding:8px 0;text-align:right;border-bottom:1px solid #eee;font-weight:500;">${escapeHtml(data.departure_airport)} → ${escapeHtml(data.arrival_airport)}</td></tr>
              <tr><td style="padding:8px 0;color:#666;border-bottom:1px solid #eee;">Estimated compensation</td><td style="padding:8px 0;text-align:right;border-bottom:1px solid #eee;font-weight:bold;color:#4A90D9;">${estimatedAmount}</td></tr>
            </table>
            <h2 style="font-size:18px;margin:28px 0 12px;color:#1B2A4A;">What happens next?</h2>
            <ol style="font-size:14px;line-height:1.8;padding-left:20px;color:#333;">
              <li>We review your claim details (1–2 business days)</li>
              <li>We contact the airline on your behalf</li>
              <li>Once resolved, you receive your compensation</li>
            </ol>
            <p style="font-size:14px;line-height:1.6;color:#333;">No win, no fee — you only pay 25% + VAT if we succeed.</p>
            <p style="font-size:14px;color:#666;margin-top:28px;">Questions? Reply to this email or contact us at <a href="mailto:daron@refundmyflight.co.za" style="color:#4A90D9;">daron@refundmyflight.co.za</a></p>
            <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />
            <p style="font-size:12px;color:#999;">Refund My Flight · EU 261/2004 Compensation Specialists</p>
          </div>
        `,
      }),
    ]);

    return NextResponse.json({ claim_reference: claimRef });
  } catch (err) {
    console.error("Submit claim error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
