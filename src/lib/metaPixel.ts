const PIXEL_IDS = ["1297253575623756"];

type FbqFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: unknown;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

function newEventId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function initMetaPixel() {
  if (typeof window === "undefined") return;
  if (window.fbq) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const n: any = (window.fbq = function (...args: unknown[]) {
    n.callMethod ? n.callMethod(...args) : n.queue.push(args);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  PIXEL_IDS.forEach((id) => window.fbq!("init", id));
  window.fbq!("track", "PageView", {}, { eventID: newEventId() });
}

export function trackLead() {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", {}, { eventID: newEventId() });
  }
}

export function trackCompleteRegistration() {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "CompleteRegistration", {}, { eventID: newEventId() });
  }
}
