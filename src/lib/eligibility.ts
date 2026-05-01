import { euAirportCodes, ukAirportCodes, noCompensationCodes } from "@/data/airports";
import { euAirlineCodes, ukAirlineCodes, airlineNames } from "@/data/airlines";
import { subYears, isAfter } from "date-fns";

export interface EligibilityInput {
  flightNumber: string;
  flightDate: Date | undefined;
  departureAirport: string;
  arrivalAirport: string;
  airline: string;
  eventType: string;
  delayDuration: string;
}

export interface EligibilityResult {
  eligible: boolean;
  uncertain: boolean;
  reasons: string[];
  estimatedCompensation: { zar: number } | null;
}

export function checkEligibility(input: EligibilityInput): EligibilityResult {
  const reasons: string[] = [];
  let eligible = true;
  let uncertain = false;

  const airlineCode = input.airline || null;
  const isEuCarrier = airlineCode ? euAirlineCodes.has(airlineCode) : false;
  const isUkCarrier = airlineCode ? ukAirlineCodes.has(airlineCode) : false;

  // Turkey — no regulation applies
  if (noCompensationCodes.has(input.departureAirport) || noCompensationCodes.has(input.arrivalAirport)) {
    eligible = false;
    reasons.push("Flights to/from Turkey are not covered by EU 261 or UK 261 regulations.");
    return { eligible, uncertain, reasons, estimatedCompensation: null };
  }

  // Determine route characteristics
  const depIsEu = euAirportCodes.has(input.departureAirport);
  const depIsUk = ukAirportCodes.has(input.departureAirport);
  const arrIsEu = euAirportCodes.has(input.arrivalAirport);
  const arrIsUk = ukAirportCodes.has(input.arrivalAirport);

  // EU 261/2004 coverage:
  //   1. Departing FROM an EU airport (any airline) → covered
  //   2. Arriving AT an EU airport ON an EU-registered carrier → covered
  // UK 261 coverage:
  //   1. Departing FROM a UK airport (any airline) → covered
  //   2. Arriving AT a UK airport ON a UK-registered carrier → covered

  const coveredByEu261 = depIsEu || (arrIsEu && isEuCarrier);
  const coveredByUk261 = depIsUk || (arrIsUk && isUkCarrier);

  if (!coveredByEu261 && !coveredByUk261) {
    eligible = false;
    if (!depIsEu && !depIsUk && (arrIsEu || arrIsUk)) {
      // Arriving in EU/UK but airline isn't the right type
      const airlineName = airlineCode ? airlineNames[airlineCode] || airlineCode : "Your airline";
      
      if (isUkCarrier && arrIsEu && !arrIsUk) {
        reasons.push(
          `${airlineName} is a UK-registered carrier and is only covered under UK 261 for flights to/from the UK. ` +
          `Since your flight arrives in the EU (not the UK), it's not covered. An EU-registered airline (e.g. Lufthansa, KLM) on this route would be covered.`
        );
      } else if (isEuCarrier && arrIsUk && !arrIsEu) {
        reasons.push(
          `${airlineName} is an EU-registered carrier and is only covered under EU 261 for flights to/from the EU. ` +
          `Since your flight arrives in the UK (not the EU), it's not covered. A UK-registered airline (e.g. British Airways, Virgin Atlantic) on this route would be covered.`
        );
      } else {
        reasons.push(
          `${airlineName} is not an EU or UK-registered airline. Only EU-registered carriers (e.g. Lufthansa, KLM) are covered for arrivals into the EU, ` +
          `and only UK-registered carriers (e.g. British Airways) are covered for arrivals into the UK.`
        );
      }
    } else {
      reasons.push("EU 261 requires departure from an EU/UK airport, or arrival at one on an EU/UK-registered carrier.");
    }
  }

  // Check date within claim window (3 years EU, 6 years UK)
  if (input.flightDate) {
    const isUkRoute = depIsUk || arrIsUk;
    const yearsBack = isUkRoute ? 6 : 3;
    const cutoff = subYears(new Date(), yearsBack);
    if (!isAfter(input.flightDate, cutoff)) {
      eligible = false;
      reasons.push(`Your flight is outside the ${yearsBack}-year claim window.`);
    }
  } else {
    eligible = false;
    reasons.push("Please provide a flight date.");
  }

  // Check event type + delay
  if (input.eventType === "unsure") {
    uncertain = true;
  } else if (input.eventType === "delayed") {
    if (input.delayDuration === "less-than-3") {
      eligible = false;
      reasons.push("Delays under 3 hours generally don't qualify for compensation.");
    } else if (input.delayDuration === "unsure") {
      uncertain = true;
    }
  }

  // Estimate compensation based on route type (amounts in ZAR)
  let estimatedCompensation: { zar: number } | null = null;
  if (eligible) {
    const saCodes = new Set(["JNB", "CPT", "DUR"]);
    const isSaDeparture = saCodes.has(input.departureAirport);
    const isSaArrival = saCodes.has(input.arrivalAirport);
    const isSaToEurope = isSaDeparture && !isSaArrival;
    const isEuropeToSa = !isSaDeparture && isSaArrival;

    if (isSaToEurope || isEuropeToSa) {
      // SA ↔ Europe: always over 3,500 km → €600 ≈ R11,000
      estimatedCompensation = { zar: 11000 };
    } else {
      // Intra-Europe: mid-tier estimate → €400 ≈ R8,000
      estimatedCompensation = { zar: 8000 };
    }
  }

  return { eligible, uncertain, reasons, estimatedCompensation };
}
