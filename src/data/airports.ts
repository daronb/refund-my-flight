export type Regulation = "EU261" | "UK261" | "None";
export type Relevance = "Very High" | "High" | "Medium" | "Low";
export type AirportType = "direct" | "connecting" | "sa";

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  countryIso: string;
  type: AirportType;
  regulation: Regulation;
  eligible: boolean;
  relevance: Relevance;
  latitude: number;
  longitude: number;
  saDestinations?: string;
  airlines?: string;
  hubConnections?: string;
}

const relevanceOrder: Record<Relevance, number> = {
  "Very High": 0,
  "High": 1,
  "Medium": 2,
  "Low": 3,
};

export const saAirports: Airport[] = [
  { code: "JNB", name: "OR Tambo International", city: "Johannesburg", country: "South Africa", countryIso: "ZA", type: "sa", regulation: "None", eligible: false, relevance: "Very High", latitude: -26.1392, longitude: 28.246 },
  { code: "CPT", name: "Cape Town International", city: "Cape Town", country: "South Africa", countryIso: "ZA", type: "sa", regulation: "None", eligible: false, relevance: "Very High", latitude: -33.9649, longitude: 18.6017 },
  { code: "DUR", name: "King Shaka International", city: "Durban", country: "South Africa", countryIso: "ZA", type: "sa", regulation: "None", eligible: false, relevance: "High", latitude: -29.6144, longitude: 31.1197 },
];

export const euAirports: Airport[] = [
  // UK — Direct
  { code: "LHR", name: "Heathrow", city: "London", country: "United Kingdom", countryIso: "GB", type: "direct", regulation: "UK261", eligible: true, relevance: "Very High", latitude: 51.47, longitude: -0.4543, saDestinations: "JNB, CPT", airlines: "British Airways, Virgin Atlantic" },
  { code: "LGW", name: "Gatwick", city: "London", country: "United Kingdom", countryIso: "GB", type: "direct", regulation: "UK261", eligible: true, relevance: "High", latitude: 51.1537, longitude: -0.1821, saDestinations: "CPT", airlines: "Norse UK" },

  // Germany — Direct
  { code: "FRA", name: "Frankfurt", city: "Frankfurt", country: "Germany", countryIso: "DE", type: "direct", regulation: "EU261", eligible: true, relevance: "Very High", latitude: 50.0379, longitude: 8.5622, saDestinations: "JNB, CPT", airlines: "Lufthansa, Condor" },
  { code: "MUC", name: "Munich", city: "Munich", country: "Germany", countryIso: "DE", type: "direct", regulation: "EU261", eligible: true, relevance: "High", latitude: 48.3538, longitude: 11.7861, saDestinations: "JNB, CPT", airlines: "Lufthansa" },

  // Netherlands — Direct
  { code: "AMS", name: "Schiphol", city: "Amsterdam", country: "Netherlands", countryIso: "NL", type: "direct", regulation: "EU261", eligible: true, relevance: "Very High", latitude: 52.3086, longitude: 4.7639, saDestinations: "JNB, CPT", airlines: "KLM" },

  // France — Direct
  { code: "CDG", name: "Charles de Gaulle", city: "Paris", country: "France", countryIso: "FR", type: "direct", regulation: "EU261", eligible: true, relevance: "Very High", latitude: 49.0097, longitude: 2.5479, saDestinations: "JNB, CPT", airlines: "Air France" },

  // Switzerland — Direct
  { code: "ZRH", name: "Zürich", city: "Zürich", country: "Switzerland", countryIso: "CH", type: "direct", regulation: "EU261", eligible: true, relevance: "High", latitude: 47.4647, longitude: 8.5492, saDestinations: "JNB, CPT", airlines: "Swiss, Edelweiss Air" },

  // Spain — Direct
  { code: "MAD", name: "Madrid-Barajas", city: "Madrid", country: "Spain", countryIso: "ES", type: "direct", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 40.4983, longitude: -3.5676, saDestinations: "JNB", airlines: "Air Europa" },

  // Turkey — Direct (NO compensation)
  { code: "IST", name: "Istanbul", city: "Istanbul", country: "Turkey", countryIso: "TR", type: "direct", regulation: "None", eligible: false, relevance: "High", latitude: 41.2753, longitude: 28.7519, saDestinations: "JNB, CPT", airlines: "Turkish Airlines" },

  // UK — Connecting
  { code: "MAN", name: "Manchester", city: "Manchester", country: "United Kingdom", countryIso: "GB", type: "connecting", regulation: "UK261", eligible: true, relevance: "Very High", latitude: 53.3537, longitude: -2.275, hubConnections: "LHR, AMS, CDG, FRA, IST", airlines: "BA, KLM, Air France, Lufthansa, Turkish" },
  { code: "EDI", name: "Edinburgh", city: "Edinburgh", country: "United Kingdom", countryIso: "GB", type: "connecting", regulation: "UK261", eligible: true, relevance: "High", latitude: 55.95, longitude: -3.3725, hubConnections: "LHR, AMS, CDG, FRA, IST", airlines: "BA, KLM, Air France, Lufthansa, Turkish" },
  { code: "BHX", name: "Birmingham", city: "Birmingham", country: "United Kingdom", countryIso: "GB", type: "connecting", regulation: "UK261", eligible: true, relevance: "High", latitude: 52.4539, longitude: -1.748, hubConnections: "LHR, AMS, CDG, FRA, IST", airlines: "BA, KLM, Air France, Lufthansa, Turkish" },
  { code: "GLA", name: "Glasgow", city: "Glasgow", country: "United Kingdom", countryIso: "GB", type: "connecting", regulation: "UK261", eligible: true, relevance: "Medium", latitude: 55.8719, longitude: -4.4331, hubConnections: "LHR, AMS, CDG, IST", airlines: "BA, KLM, Air France, Turkish" },
  { code: "BRS", name: "Bristol", city: "Bristol", country: "United Kingdom", countryIso: "GB", type: "connecting", regulation: "UK261", eligible: true, relevance: "Medium", latitude: 51.3827, longitude: -2.7191, hubConnections: "LHR, AMS, CDG", airlines: "KLM, Air France" },
  { code: "NCL", name: "Newcastle", city: "Newcastle", country: "United Kingdom", countryIso: "GB", type: "connecting", regulation: "UK261", eligible: true, relevance: "Medium", latitude: 55.0375, longitude: -1.6917, hubConnections: "LHR, AMS, CDG", airlines: "BA, KLM" },
  { code: "LBA", name: "Leeds Bradford", city: "Leeds", country: "United Kingdom", countryIso: "GB", type: "connecting", regulation: "UK261", eligible: true, relevance: "Low", latitude: 53.8659, longitude: -1.6606, hubConnections: "LHR, AMS", airlines: "BA, KLM" },
  { code: "BFS", name: "Belfast International", city: "Belfast", country: "United Kingdom", countryIso: "GB", type: "connecting", regulation: "UK261", eligible: true, relevance: "Medium", latitude: 54.6575, longitude: -6.2158, hubConnections: "LHR, AMS", airlines: "BA, KLM" },
  { code: "LPL", name: "Liverpool John Lennon", city: "Liverpool", country: "United Kingdom", countryIso: "GB", type: "connecting", regulation: "UK261", eligible: true, relevance: "Low", latitude: 53.3336, longitude: -2.8497, hubConnections: "AMS, CDG", airlines: "KLM" },
  { code: "STN", name: "London Stansted", city: "London", country: "United Kingdom", countryIso: "GB", type: "connecting", regulation: "UK261", eligible: true, relevance: "Medium", latitude: 51.885, longitude: 0.235, hubConnections: "LHR, AMS, CDG", airlines: "Ryanair, easyJet" },
  { code: "LTN", name: "London Luton", city: "London", country: "United Kingdom", countryIso: "GB", type: "connecting", regulation: "UK261", eligible: true, relevance: "Medium", latitude: 51.8747, longitude: -0.3683, hubConnections: "LHR, AMS, CDG", airlines: "easyJet, Wizz Air" },
  { code: "ABZ", name: "Aberdeen", city: "Aberdeen", country: "United Kingdom", countryIso: "GB", type: "connecting", regulation: "UK261", eligible: true, relevance: "Low", latitude: 57.2019, longitude: -2.1978, hubConnections: "LHR, AMS", airlines: "BA, KLM" },

  // Germany — Connecting
  { code: "BER", name: "Berlin Brandenburg", city: "Berlin", country: "Germany", countryIso: "DE", type: "connecting", regulation: "EU261", eligible: true, relevance: "High", latitude: 52.3667, longitude: 13.5033, hubConnections: "FRA, MUC, AMS, CDG", airlines: "Lufthansa, KLM, Air France, easyJet" },
  { code: "DUS", name: "Düsseldorf", city: "Düsseldorf", country: "Germany", countryIso: "DE", type: "connecting", regulation: "EU261", eligible: true, relevance: "High", latitude: 51.2895, longitude: 6.7668, hubConnections: "FRA, AMS, CDG", airlines: "Lufthansa, KLM, Air France" },
  { code: "HAM", name: "Hamburg", city: "Hamburg", country: "Germany", countryIso: "DE", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 53.6304, longitude: 9.9882, hubConnections: "FRA, MUC, AMS, CDG", airlines: "Lufthansa, KLM, Air France" },
  { code: "STR", name: "Stuttgart", city: "Stuttgart", country: "Germany", countryIso: "DE", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 48.6899, longitude: 9.222, hubConnections: "FRA, MUC, AMS, CDG", airlines: "Lufthansa, KLM, Air France" },
  { code: "CGN", name: "Cologne Bonn", city: "Cologne", country: "Germany", countryIso: "DE", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 50.8659, longitude: 7.1427, hubConnections: "FRA, AMS, CDG", airlines: "Lufthansa, KLM" },
  { code: "HAJ", name: "Hannover", city: "Hannover", country: "Germany", countryIso: "DE", type: "connecting", regulation: "EU261", eligible: true, relevance: "Low", latitude: 52.4611, longitude: 9.685, hubConnections: "FRA, MUC, AMS", airlines: "Lufthansa, KLM" },

  // France — Connecting
  { code: "ORY", name: "Paris Orly", city: "Paris", country: "France", countryIso: "FR", type: "connecting", regulation: "EU261", eligible: true, relevance: "High", latitude: 48.7233, longitude: 2.3794, hubConnections: "CDG, AMS", airlines: "Air France, Transavia" },
  { code: "NCE", name: "Nice Côte d'Azur", city: "Nice", country: "France", countryIso: "FR", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 43.6584, longitude: 7.2159, hubConnections: "CDG, AMS, FRA", airlines: "Air France, KLM, Lufthansa" },
  { code: "LYS", name: "Lyon-Saint Exupéry", city: "Lyon", country: "France", countryIso: "FR", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 45.7256, longitude: 5.0811, hubConnections: "CDG, AMS, FRA", airlines: "Air France, KLM, Lufthansa" },
  { code: "MRS", name: "Marseille Provence", city: "Marseille", country: "France", countryIso: "FR", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 43.4393, longitude: 5.2214, hubConnections: "CDG, AMS", airlines: "Air France, KLM" },
  { code: "TLS", name: "Toulouse-Blagnac", city: "Toulouse", country: "France", countryIso: "FR", type: "connecting", regulation: "EU261", eligible: true, relevance: "Low", latitude: 43.6291, longitude: 1.3638, hubConnections: "CDG, AMS", airlines: "Air France, KLM" },
  { code: "BOD", name: "Bordeaux-Mérignac", city: "Bordeaux", country: "France", countryIso: "FR", type: "connecting", regulation: "EU261", eligible: true, relevance: "Low", latitude: 44.8283, longitude: -0.7156, hubConnections: "CDG, AMS", airlines: "Air France, KLM" },

  // Italy — Connecting
  { code: "FCO", name: "Fiumicino", city: "Rome", country: "Italy", countryIso: "IT", type: "connecting", regulation: "EU261", eligible: true, relevance: "Very High", latitude: 41.8003, longitude: 12.2389, hubConnections: "LHR, AMS, CDG, FRA, ZRH", airlines: "BA, KLM, Air France, Lufthansa, Swiss" },
  { code: "MXP", name: "Milan Malpensa", city: "Milan", country: "Italy", countryIso: "IT", type: "connecting", regulation: "EU261", eligible: true, relevance: "High", latitude: 45.6306, longitude: 8.7231, hubConnections: "LHR, AMS, CDG, FRA, ZRH", airlines: "BA, KLM, Air France, Lufthansa, Swiss" },
  { code: "VCE", name: "Marco Polo", city: "Venice", country: "Italy", countryIso: "IT", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 45.5053, longitude: 12.3519, hubConnections: "LHR, AMS, CDG, FRA", airlines: "BA, KLM, Air France, Lufthansa" },
  { code: "NAP", name: "Naples International", city: "Naples", country: "Italy", countryIso: "IT", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 40.886, longitude: 14.2908, hubConnections: "LHR, AMS, FRA", airlines: "BA, KLM, Lufthansa" },
  { code: "BLQ", name: "Bologna Marconi", city: "Bologna", country: "Italy", countryIso: "IT", type: "connecting", regulation: "EU261", eligible: true, relevance: "Low", latitude: 44.5354, longitude: 11.2887, hubConnections: "LHR, AMS, CDG, FRA", airlines: "BA, KLM, Air France, Lufthansa" },

  // Spain — Connecting
  { code: "BCN", name: "Barcelona-El Prat", city: "Barcelona", country: "Spain", countryIso: "ES", type: "connecting", regulation: "EU261", eligible: true, relevance: "Very High", latitude: 41.2971, longitude: 2.0785, hubConnections: "LHR, AMS, CDG, FRA, MAD", airlines: "BA, KLM, Air France, Lufthansa" },
  { code: "PMI", name: "Palma de Mallorca", city: "Palma de Mallorca", country: "Spain", countryIso: "ES", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 39.5517, longitude: 2.7388, hubConnections: "LHR, AMS, FRA, MAD", airlines: "BA, KLM, Lufthansa" },
  { code: "AGP", name: "Málaga-Costa del Sol", city: "Málaga", country: "Spain", countryIso: "ES", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 36.6749, longitude: -4.4991, hubConnections: "LHR, AMS, MAD", airlines: "BA, KLM" },
  { code: "ALC", name: "Alicante-Elche", city: "Alicante", country: "Spain", countryIso: "ES", type: "connecting", regulation: "EU261", eligible: true, relevance: "Low", latitude: 38.2822, longitude: -0.5582, hubConnections: "LHR, AMS, MAD", airlines: "BA, KLM" },

  // Scandinavia — Connecting
  { code: "CPH", name: "Copenhagen", city: "Copenhagen", country: "Denmark", countryIso: "DK", type: "connecting", regulation: "EU261", eligible: true, relevance: "High", latitude: 55.6181, longitude: 12.6561, hubConnections: "LHR, AMS, FRA", airlines: "BA, KLM, Lufthansa, SAS" },
  { code: "ARN", name: "Stockholm Arlanda", city: "Stockholm", country: "Sweden", countryIso: "SE", type: "connecting", regulation: "EU261", eligible: true, relevance: "High", latitude: 59.6519, longitude: 17.9186, hubConnections: "LHR, AMS, FRA, CDG", airlines: "BA, KLM, Lufthansa, SAS" },
  { code: "OSL", name: "Oslo Gardermoen", city: "Oslo", country: "Norway", countryIso: "NO", type: "connecting", regulation: "EU261", eligible: true, relevance: "High", latitude: 60.1939, longitude: 11.1004, hubConnections: "LHR, AMS, FRA, CDG", airlines: "BA, KLM, Lufthansa, SAS" },
  { code: "HEL", name: "Helsinki-Vantaa", city: "Helsinki", country: "Finland", countryIso: "FI", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 60.3172, longitude: 24.9633, hubConnections: "LHR, AMS, FRA", airlines: "BA, KLM, Lufthansa, Finnair" },

  // Other EU — Connecting
  { code: "DUB", name: "Dublin", city: "Dublin", country: "Ireland", countryIso: "IE", type: "connecting", regulation: "EU261", eligible: true, relevance: "High", latitude: 53.4213, longitude: -6.2701, hubConnections: "LHR, AMS, CDG, FRA", airlines: "BA, KLM, Air France, Lufthansa" },
  { code: "BRU", name: "Brussels", city: "Brussels", country: "Belgium", countryIso: "BE", type: "connecting", regulation: "EU261", eligible: true, relevance: "High", latitude: 50.9014, longitude: 4.4844, hubConnections: "LHR, AMS, CDG, FRA", airlines: "BA, KLM, Brussels Airlines, Lufthansa" },
  { code: "VIE", name: "Vienna International", city: "Vienna", country: "Austria", countryIso: "AT", type: "connecting", regulation: "EU261", eligible: true, relevance: "High", latitude: 48.1103, longitude: 16.5697, hubConnections: "LHR, AMS, FRA, ZRH", airlines: "BA, KLM, Lufthansa, Austrian" },
  { code: "GVA", name: "Geneva", city: "Geneva", country: "Switzerland", countryIso: "CH", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 46.2381, longitude: 6.1089, hubConnections: "LHR, AMS, CDG, ZRH", airlines: "BA, KLM, Air France, Swiss" },
  { code: "LIS", name: "Lisbon Humberto Delgado", city: "Lisbon", country: "Portugal", countryIso: "PT", type: "connecting", regulation: "EU261", eligible: true, relevance: "High", latitude: 38.7813, longitude: -9.1359, hubConnections: "LHR, AMS, CDG, FRA", airlines: "BA, KLM, Air France, TAP" },
  { code: "OPO", name: "Porto", city: "Porto", country: "Portugal", countryIso: "PT", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 41.2481, longitude: -8.6814, hubConnections: "LHR, AMS, CDG, FRA", airlines: "BA, KLM, Air France, TAP" },
  { code: "ATH", name: "Athens International", city: "Athens", country: "Greece", countryIso: "GR", type: "connecting", regulation: "EU261", eligible: true, relevance: "High", latitude: 37.9364, longitude: 23.9445, hubConnections: "LHR, AMS, CDG, FRA", airlines: "BA, KLM, Lufthansa, Aegean" },
  { code: "WAW", name: "Warsaw Chopin", city: "Warsaw", country: "Poland", countryIso: "PL", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 52.1657, longitude: 20.9671, hubConnections: "LHR, AMS, FRA, MUC", airlines: "BA, KLM, Lufthansa, LOT" },
  { code: "KRK", name: "Kraków John Paul II", city: "Kraków", country: "Poland", countryIso: "PL", type: "connecting", regulation: "EU261", eligible: true, relevance: "Low", latitude: 50.0777, longitude: 19.7848, hubConnections: "LHR, AMS, FRA", airlines: "BA, KLM, Lufthansa" },
  { code: "PRG", name: "Václav Havel Prague", city: "Prague", country: "Czech Republic", countryIso: "CZ", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 50.1008, longitude: 14.26, hubConnections: "LHR, AMS, CDG, FRA", airlines: "BA, KLM, Air France, Lufthansa" },
  { code: "BUD", name: "Budapest Ferenc Liszt", city: "Budapest", country: "Hungary", countryIso: "HU", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 47.4298, longitude: 19.2611, hubConnections: "LHR, AMS, FRA", airlines: "BA, KLM, Lufthansa" },
  { code: "OTP", name: "Henri Coandă Bucharest", city: "Bucharest", country: "Romania", countryIso: "RO", type: "connecting", regulation: "EU261", eligible: true, relevance: "Medium", latitude: 44.5711, longitude: 26.085, hubConnections: "LHR, AMS, FRA, IST", airlines: "BA, KLM, Lufthansa, Turkish" },
  { code: "KEF", name: "Keflavík International", city: "Reykjavík", country: "Iceland", countryIso: "IS", type: "connecting", regulation: "EU261", eligible: true, relevance: "Low", latitude: 63.985, longitude: -22.6056, hubConnections: "LHR, AMS, CDG", airlines: "BA, KLM, Icelandair" },
] as Airport[];

// Sort alphabetically by city
euAirports.sort((a, b) => a.city.localeCompare(b.city));

export const allAirports = [...saAirports, ...euAirports];

// Sets for quick lookups
export const euAirportCodes = new Set(
  euAirports.filter(a => a.regulation === "EU261").map(a => a.code)
);
export const ukAirportCodes = new Set(
  euAirports.filter(a => a.regulation === "UK261").map(a => a.code)
);
export const noCompensationCodes = new Set(
  euAirports.filter(a => a.regulation === "None").map(a => a.code)
);

export function getAirportByCode(code: string): Airport | undefined {
  return allAirports.find(a => a.code === code);
}

export function formatAirport(airport: Airport): string {
  return `${airport.code} — ${airport.city} (${airport.name})`;
}
