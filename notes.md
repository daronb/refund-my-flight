# Work Log

A running log of changes shipped, so we can trace back if something breaks.

---

## 2026-05-12 (later) — Fix invisible red validation + verification

### Production verification (via a browser sub-agent)

Drove the live site at https://refundmyflight.co.za. Findings:

**✅ Works:**
- Departure airport freetext fallback ("Can't find your airport? Type it manually") shows correctly, switches input to plain text mode, helper text appears.
- Eligibility step correctly shows the "Let's Find Out Together" (uncertain / manual review) page when freetext airports are used — NOT a false "not eligible".
- End-to-end submission with freetext route went through: `Antananarivo, Madagascar → LHR` on a custom airline produced claim ref `RMF-2026-31780`. Freetext value persisted into the review summary.

**❌ BUG found & fixed in this commit:**
- Red field validation was **not visible**. Clicking "Check Eligibility →" with empty fields did nothing user-visible: button responded but no red borders appeared. The form silently failed to advance. Confirmed by browser agent in real DOM inspection.

**🤷 Minor flaky behaviour (left unfixed for now):**
- The "Type it manually" link on the airline search occasionally failed to switch to freetext mode on the first click. Browser agent flagged it as possibly a CDP-injection artefact rather than a real-user bug (their submit click also needed JS-eval fallback). Worth watching real session recordings before chasing it.

### Root cause of the red-border bug

`Input.tsx`'s base className uses `border-input` (a custom theme token). My error classes used `border-destructive` + `ring-destructive` (also theme tokens). `cn` uses `twMerge`, but `twMerge` only knows about Tailwind's built-in class groups — it doesn't recognise custom theme tokens as conflicting. Result: both `border-input` and `border-destructive` ended up in the className, and CSS source order picked the wrong winner.

### Fix

Switched all error-state classes from custom theme tokens to Tailwind built-in red:
- `border-destructive ring-1 ring-destructive` → `border-red-500 ring-2 ring-red-500`
- `text-destructive` → `text-red-600 font-medium`
- Radio-group error wrappers: `border border-destructive` → `border-2 border-red-500`

`border-red-500` is in `twMerge`'s known class groups, so it correctly displaces `border-input`. The ring also bumped from `ring-1` to `ring-2` for better visibility.

Files touched: `AirportSearch.tsx`, `AirlineSearch.tsx`, `StepFlightDetails.tsx`, `StepPersonalDetails.tsx`.

### Other items from this round

- **PageSpeed Insights run** — Could not fetch. Google's keyless PSI API quota is exhausted for our egress IP (consumer 583797351490, limit 0). To re-run we either need a free Google Cloud API key (no billing required, just enable PageSpeed Insights API at https://console.cloud.google.com/apis/credentials) or run it manually via https://pagespeed.web.dev/analysis?url=https://refundmyflight.co.za.
- **Happy-path browser test** — Could not run. The browser-automation tool wasn't installed on this machine; the agent fell back to static-bundle inspection. After this fix lands, worth running the happy path once manually (LHR → FRA, BA, 3+ hour delay should return ELIGIBLE).

---

## 2026-05-12 — Error tracking, form UX, /check load speed

### Commit `15975f9` — Unmask third-party script errors and add global error boundary

**Problem:** PostHog was showing 161 occurrences of `"Script error."` over 4 days with no useful detail. The browser was hiding real exception details from third-party scripts due to cross-origin restrictions.

**Changes:**
- `src/lib/metaPixel.ts` — Added `script.crossOrigin = "anonymous"` to the dynamically-appended Meta Pixel script tag.
- `src/app/layout.tsx` — Added `crossOrigin="anonymous"` to the gtag `<Script>` tag.
- `src/app/global-error.tsx` (new) — Next.js App Router global error boundary that calls `posthog.captureException(error)` and renders a fallback "Something went wrong / Try again" UI.
- `src/components/claim/StepAuthorise.tsx` — Replaced the bare `catch {}` on the claim submission with `catch (err) { posthog.captureException(err, ...) }` so the real exception reaches PostHog instead of just `{ error: "network_error" }`.

**Expected effect:**
- New errors in PostHog will show the actual JS exception message, file, and line instead of `"Script error."`.
- Existing 161 occurrences remain opaque (they were captured before the fix).
- Most unmasked errors will likely be Meta Pixel / gtag bugs (Facebook/Google's, not ours) — those can be filtered out later. Real bugs in our code that ran inside third-party callbacks will now be visible.

**No user-facing change:** the third-party scripts still load and behave identically. `crossorigin="anonymous"` just tells the browser to expose error details, since Google/Facebook serve these scripts with `Access-Control-Allow-Origin: *` already.

---

### Commit `b00b5dd` — Improve claim form UX, tracking, and /check load speed

#### 1. Red validation on submit

**Files:** `src/components/claim/StepFlightDetails.tsx`, `src/components/claim/StepPersonalDetails.tsx`

Replaced the "submit button disabled until all fields filled" pattern (which left users confused about *why* the button was disabled) with:
- Submit button always enabled.
- On click, if fields are missing: mark them with red borders/rings, show a "Please complete the highlighted fields" message, scroll to the first error.
- Fire `flight_details_submit_blocked` / `personal_details_submit_blocked` PostHog events with the list of missing field names — gives funnel-level insight into where users actually get stuck.

#### 2. Track empty airport/airline searches

**Files:** `src/components/claim/AirportSearch.tsx`, `src/components/claim/AirlineSearch.tsx`

When a user types 3+ characters and the dropdown shows 0 results, we wait 800ms (debounce) and fire a PostHog event with the query:
- `airport_search_no_results` `{ field: "departure" | "arrival", query }`
- `airline_search_no_results` `{ query }`

This tells us which airports/airlines are missing from the dataset.

#### 3. "Can't find your airport/airline?" freetext fallback

**Files:** `AirportSearch.tsx`, `AirlineSearch.tsx`, `ClaimWizard.tsx`, `eligibility.ts`, `submit-claim/route.ts`, `StepAuthorise.tsx`, `StepFlightDetails.tsx`

When a search returns no matches, a "Can't find your airport? Type it manually" link appears. Clicking it switches the input to free-text mode.

Flow:
- `ClaimData` gained `departureAirportCustom`, `arrivalAirportCustom`, `airlineCustom` booleans.
- `checkEligibility()` was extended to return `uncertain: true` early when any custom flag is set, so freetext users see "we'll review manually" instead of a false "not covered".
- `StepAuthorise` sends `departure_airport_custom` / `arrival_airport_custom` / `airline_custom` flags to the API.
- `/api/submit-claim` accepts these flags. When `*_custom` is true: skip the IATA regex check, allow 2-100 chars of free text. The IATA column gets the placeholder `"ZZZ"` (works around the assumed VARCHAR(3) constraint); the typed text is preserved in `raw_payload` JSON.

**⚠️ DB schema caveat (worth a follow-up migration):**
- The airport/airline columns store `"ZZZ"` as a placeholder for freetext submissions.
- The actual typed value lives in `raw_payload` as JSON.
- Long-term, we should add dedicated `departure_airport_custom_text`, `arrival_airport_custom_text`, `airline_custom_text` columns to make these queryable.
- For now, to find freetext claims: `WHERE departure_airport = 'ZZZ' OR arrival_airport = 'ZZZ'` then read `raw_payload`.

#### 4. PostHog session recording — unmask non-PII inputs

**Files:** `AirportSearch.tsx`, `AirlineSearch.tsx`, `StepFlightDetails.tsx`, `StepPersonalDetails.tsx`

PostHog masks all `<input>` text by default, which meant session recordings couldn't show what users typed. We selectively unmasked non-PII fields with the `ph-no-mask` class:
- ✅ Unmasked: Airport search inputs, airline search input, flight number.
- ❌ Kept masked (with explicit `ph-mask`): Full name, email, phone, booking reference.

This is intentional for POPIA compliance — PII stays out of recordings.

**Verification needed after deploy:** check a fresh session recording and confirm the masking behaves as expected.

#### 5. Faster /check page load

**Files:** `src/app/check/ClaimWizard.tsx`, `src/app/page.tsx`, `src/components/landing/PrefetchCheck.tsx` (new)

Two changes:
1. `ClaimWizard` lazy-loads steps 1-3 with `next/dynamic({ ssr: false })`. Initial /check page only ships the Step 0 (flight details) JS bundle. Steps 2-4 load when the user advances.
2. New `PrefetchCheck` component mounted on the homepage calls `router.prefetch("/check")` on mount as a belt-and-braces to the default Link prefetch. This helps on slow connections where Next.js's viewport-based prefetch fires too late.

#### 6. *Not done* — direct ad traffic to /check

We discussed sending paid traffic straight to `/check?source=ad_xxx` instead of the homepage. **Not implemented** — this is an A/B test decision, not a code change. Wait for a week of data from the new events, then compare conversion of `/` → `/check` users vs hypothetical `/check`-direct users.

---

### New PostHog events to watch

- `flight_details_submit_blocked` `{ missing_fields[], missing_count }`
- `personal_details_submit_blocked` `{ missing_fields[], missing_count }`
- `airport_search_no_results` `{ field, query }`
- `airline_search_no_results` `{ query }`
- `airport_freetext_opened` `{ field, query }`
- `airport_freetext_cancelled` `{ field }`
- `airline_freetext_opened` `{ query }`
- `airline_freetext_cancelled`
- `flight_details_completed` — gained `departure_custom`, `arrival_custom`, `airline_custom` flags

---

### Verification status

- ✅ TypeScript: `npx tsc --noEmit` passes
- ✅ ESLint: passes on all changed files
- ✅ Production build: `npm run build` succeeds, all routes generate
- ⏳ Browser testing: not done — needs a manual check after deploy:
  - Try to advance past Step 0 with missing fields → red borders, scroll to first error
  - Type a fake airport like "Kuala Lumpur" → see "no results" then "Type it manually" link
  - Use freetext → eligibility shows "uncertain / manual review" path
  - Watch a PostHog session recording → confirm airport/airline/flight-number inputs are visible, name/email/phone are masked
  - Open /check from the homepage on a throttled connection → should feel fast

---

### Rollback notes

Each change is a discrete commit on `main`:
- `b00b5dd` — form UX, tracking, /check speed
- `15975f9` — error tracking improvements
- `3279eb5` — earlier PostHog analytics commit (not part of this work)

To revert any single concern, `git revert <sha>`. The freetext + API changes are tangled enough that they should be reverted together if any one of them is broken.
