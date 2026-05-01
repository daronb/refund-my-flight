function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("rmf_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("rmf_session_id", id);
  }
  return id;
}

export function getUtmParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || sessionStorage.getItem("rmf_utm_source") || null,
    utm_medium: params.get("utm_medium") || sessionStorage.getItem("rmf_utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || sessionStorage.getItem("rmf_utm_campaign") || null,
    utm_term: params.get("utm_term") || sessionStorage.getItem("rmf_utm_term") || null,
    utm_content: params.get("utm_content") || sessionStorage.getItem("rmf_utm_content") || null,
  };
}

export function captureUtmParams() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  keys.forEach((key) => {
    const val = params.get(key);
    if (val) sessionStorage.setItem(`rmf_${key}`, val);
  });
}

export function trackFunnelEvent(
  eventName: string,
  _stepNumber?: number,
  _metadata?: Record<string, unknown>
) {
  // Log locally in dev; in production this could post to an API route
  if (process.env.NODE_ENV === "development") {
    console.log("[funnel]", eventName, { session: getSessionId(), ...getUtmParams() });
  }
}

export const FUNNEL_EVENTS = {
  PAGE_LANDING: "page_landing",
  PAGE_CHECK: "page_check",
  STEP_FLIGHT_DETAILS_START: "step_flight_details_start",
  STEP_FLIGHT_DETAILS_COMPLETE: "step_flight_details_complete",
  STEP_ELIGIBILITY_VIEW: "step_eligibility_view",
  STEP_ELIGIBILITY_CONTINUE: "step_eligibility_continue",
  STEP_PERSONAL_DETAILS_START: "step_personal_details_start",
  STEP_PERSONAL_DETAILS_COMPLETE: "step_personal_details_complete",
  STEP_AUTHORISE_VIEW: "step_authorise_view",
  STEP_CLAIM_SUBMITTED: "step_claim_submitted",
  CTA_HERO_CLICK: "cta_hero_click",
  CTA_FINAL_CLICK: "cta_final_click",
  CTA_STICKY_CLICK: "cta_sticky_click",
} as const;
