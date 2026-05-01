// EU/EEA registered carriers — eligible under EU 261/2004
export const euAirlineCodes = new Set([
  // Major EU/EEA carriers
  "KL", // KLM (Netherlands)
  "LH", // Lufthansa (Germany)
  "AF", // Air France (France)
  "IB", // Iberia (Spain)
  "AZ", // ITA Airways (Italy)
  "LX", // Swiss (Switzerland — via bilateral agreement)
  "OS", // Austrian Airlines (Austria)
  "SN", // Brussels Airlines (Belgium)
  "TP", // TAP Portugal (Portugal)
  "SK", // SAS (Scandinavia)
  "AY", // Finnair (Finland)
  "EI", // Aer Lingus (Ireland)
  "LO", // LOT Polish Airlines (Poland)
  "OK", // Czech Airlines (Czech Republic)
  "RO", // TAROM (Romania)
  "OU", // Croatia Airlines (Croatia)
  // EU budget carriers
  "FR", // Ryanair (Ireland)
  "U2", // easyJet (UK-registered but EU AOC subsidiaries)
  "W6", // Wizz Air (Hungary)
  "VY", // Vueling (Spain)
  "DY", // Norwegian (Norway — EEA)
  "D8", // Norwegian Air International
  "HV", // Transavia (Netherlands)
  "EW", // Eurowings (Germany)
  "4U", // Germanwings (Germany)
  "DE", // Condor (Germany)
  "X3", // TUI fly (Germany)
]);

// UK registered carriers — eligible under UK 261
export const ukAirlineCodes = new Set([
  "BA", // British Airways
  "VS", // Virgin Atlantic
  "BE", // Flybe
]);

export const airlineNames: Record<string, string> = {
  BA: "British Airways",
  KL: "KLM",
  LH: "Lufthansa",
  AF: "Air France",
  IB: "Iberia",
  AZ: "ITA Airways",
  LX: "Swiss",
  OS: "Austrian Airlines",
  SN: "Brussels Airlines",
  TP: "TAP Portugal",
  SK: "SAS",
  AY: "Finnair",
  EI: "Aer Lingus",
  FR: "Ryanair",
  U2: "easyJet",
  W6: "Wizz Air",
  VY: "Vueling",
  TK: "Turkish Airlines",
  VS: "Virgin Atlantic",
  SA: "South African Airways",
  ET: "Ethiopian Airlines",
  EK: "Emirates",
  QR: "Qatar Airways",
  DY: "Norwegian",
  DE: "Condor",
  EW: "Eurowings",
};

export function getAirlineFromFlightNumber(flightNumber: string): string | null {
  const match = flightNumber.toUpperCase().match(/^([A-Z0-9]{2})/);
  return match ? match[1] : null;
}
