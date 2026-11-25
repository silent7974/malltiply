// src/lib/data/deliveryQuotes.js
//
// REAL Bolt dispatch prices, one list per place. This is the only file you
// edit to change delivery fees. calculateDeliveryFee.js turns these quotes
// into the price the buyer pays.
//
// Quotes taken from: Jiwa 900106, 202 Estate, Brains & Hammers City, Life Camp
// Quoted on: 14 Nov 2026, between 6pm and 7pm (evening rush = the high end,
// so the card below is the safe version).
//
// How to update: open the Bolt app, check the price to a place, then change
// `fee` (or add another quote to that place). If a quote looks like a
// one-off, add  ignore: "why"  to it. It stays on file but is not used.
//
// Price the buyer pays = the HIGHEST quote for that place + 5%,
// rounded up to the next 100 naira.

export const DELIVERY_GROUPS = [
  "Close to Life Camp",
  "Jahi, Mabushi & Utako",
  "Wuse & Wuye",
  "Garki, Maitama & Asokoro",
  "Kubwa & Dakwa",
  "Apo, Lugbe & the South",
  "Karu, Nyanya & Zuba",
];

// district = the OLD district name, so buyers who saved an address before
// this list existed (for example just "Apo") still get a safe price.
export const DELIVERY_AREA_DATA = [
  // ---------- Close to Life Camp ----------
  { id: "life-camp", label: "Life Camp", group: "Close to Life Camp", district: "Life Camp",
    keywords: ["junction"],
    quotes: [{ place: "Life Camp junction", km: 6.3, fee: 2400 }] },
  { id: "karsana", label: "Karsana (Gwarinpa)", group: "Close to Life Camp", district: "Gwarinpa",
    keywords: ["aso garden"],
    quotes: [
      { place: "Karsana", km: 4.8, fee: 2400 },
      { place: "Aso Garden Estate, Karsana", km: 6.3, fee: 2400 },
    ] },
  { id: "gwarinpa-avenues", label: "Gwarinpa Avenues (1st to 3rd)", group: "Close to Life Camp", district: "Gwarinpa",
    keywords: ["first avenue", "second avenue", "third avenue", "h-medix", "1st", "2nd", "3rd"],
    quotes: [
      { place: "1st Avenue", km: 8.0, fee: 3100 },
      { place: "2nd Avenue", km: 8.3, fee: 3100 },
      { place: "3rd Avenue, H-Medix", km: 6.9, fee: 3000 },
      { place: "3rd Avenue, corner shop", km: 7.6, fee: 3100 },
    ] },
  { id: "jabi", label: "Jabi (Airport Junction)", group: "Close to Life Camp", district: "Jabi",
    keywords: ["airport junction"],
    quotes: [{ place: "Airport Junction, Jabi", km: 7.2, fee: 2500 }] },
  { id: "kado-estate", label: "Kado Estate", group: "Close to Life Camp", district: "Kado",
    keywords: [],
    quotes: [{ place: "Kado Estate", km: 7.5, fee: 2600 }] },
  { id: "kado-lakeview", label: "Kado Lakeview / Kifina", group: "Close to Life Camp", district: "Kado",
    keywords: ["lakeview homes", "kifina", "emerald hotel"],
    quotes: [
      { place: "Kado Lakeview Homes", km: 9.1, fee: 3000 },
      { place: "Kifina Emerald Hotel, Kado", km: 8.5, fee: 3000 },
    ] },
  { id: "idu", label: "Idu (Railway Station)", group: "Close to Life Camp", district: "Idu",
    keywords: ["train station", "railway"],
    quotes: [{ place: "Idu railway station", km: 3.7, fee: 3200 }] },

  // ---------- Jahi, Mabushi & Utako ----------
  { id: "utako", label: "Utako (Motor Park)", group: "Jahi, Mabushi & Utako", district: "Utako",
    keywords: ["motor park"],
    quotes: [{ place: "Utako motor park", km: 9.5, fee: 2900 }] },
  { id: "jahi-next", label: "Jahi (Next Cash & Carry)", group: "Jahi, Mabushi & Utako", district: "Jahi",
    keywords: ["next supermarket", "cash and carry"],
    quotes: [{ place: "Next Cash & Carry, Jahi", km: 9.9, fee: 3100 }] },
  { id: "jahi-junction", label: "Jahi Junction", group: "Jahi, Mabushi & Utako", district: "Jahi",
    keywords: [],
    quotes: [{ place: "Jahi junction", km: 12.5, fee: 4100 }] },
  { id: "mabushi", label: "Mabushi (Motor Park / Ultra Modern Market)", group: "Jahi, Mabushi & Utako", district: "Mabushi",
    keywords: ["bus terminal", "motor park", "ultra modern market"],
    quotes: [
      { place: "Mabushi motor park / bus terminal", km: 12.3, fee: 3200 },
      { place: "Mabushi Ultra Modern Market", km: 10.6, fee: 3200 },
    ] },

  // ---------- Wuse & Wuye ----------
  { id: "banex", label: "Banex (Wuse 2)", group: "Wuse & Wuye", district: "Wuse",
    keywords: [],
    quotes: [{ place: "Banex", km: 13.4, fee: 3200 }] },
  { id: "glo-wuse2", label: "Glo (Wuse 2)", group: "Wuse & Wuye", district: "Wuse",
    keywords: ["glo office"],
    quotes: [{ place: "Glo, Wuse 2", km: 13.6, fee: 3700 }] },
  { id: "wuse-zone4", label: "Wuse Zone 4 (Abacha)", group: "Wuse & Wuye", district: "Wuse",
    keywords: ["abacha", "zone 4", "state"],
    quotes: [{ place: "Abacha State, Zone 4", km: 14.9, fee: 3900 }] },
  { id: "wuse-market", label: "Wuse Market", group: "Wuse & Wuye", district: "Wuse",
    keywords: [],
    quotes: [{ place: "Wuse market", km: 13.0, fee: 4100 }] },
  { id: "arab-junction", label: "Arab Junction", group: "Wuse & Wuye", district: "Wuse",
    keywords: [],
    quotes: [{ place: "Arab junction", km: 11.0, fee: 3200 }] },
  { id: "wuye", label: "Wuye (Ultra Modern Market)", group: "Wuse & Wuye", district: "Wuse",
    keywords: ["ivy apartments", "zavati", "ultra modern market"],
    quotes: [
      { place: "Wuye Ultra Modern Market", km: 11.0, fee: 3200 },
      { place: "Ivy Apartments by Zavati", km: 10.0, fee: 4300,
        ignore: "Looks like a 7pm one-off (same distance as the market but +1,100). Re-check at midday. If it is real, the Wuye price must go up." },
    ] },

  // ---------- Garki, Maitama & Asokoro ----------
  { id: "garki-areas", label: "Garki Areas 1, 2, 8 & 10", group: "Garki, Maitama & Asokoro", district: "Garki",
    keywords: ["area 1", "area 2", "area 8", "area 10"],
    quotes: [
      { place: "Garki Area 1", km: 14.5, fee: 4300 },
      { place: "Garki Area 2", km: 15.1, fee: 4300 },
      { place: "Garki Area 8", km: 16.2, fee: 4300 },
      { place: "Garki Area 10", km: 15.9, fee: 4300 },
    ] },
  { id: "garki-area11", label: "Garki Area 11", group: "Garki, Maitama & Asokoro", district: "Garki",
    keywords: ["area 11"],
    quotes: [{ place: "Garki Area 11", km: 17.4, fee: 4800 }] },
  { id: "garki-market", label: "Garki International Market", group: "Garki, Maitama & Asokoro", district: "Garki",
    keywords: ["garki market", "international market"],
    quotes: [{ place: "Garki International Market", km: 17.0, fee: 5400 }] },
  { id: "maitama-hospital", label: "Maitama (General Hospital)", group: "Garki, Maitama & Asokoro", district: "Maitama",
    keywords: [],
    quotes: [{ place: "Maitama General Hospital", km: 14.7, fee: 4300 }] },
  { id: "maitama-hilton", label: "Maitama (Transcorp Hilton)", group: "Garki, Maitama & Asokoro", district: "Maitama",
    keywords: ["transcorp", "aguiyi ironsi"],
    quotes: [
      { place: "Hilton, outside foyer", km: 16.2, fee: 6300 },
      { place: "Hilton, Aguiyi Ironsi St entrance", km: 16.2, fee: 5900 },
    ] },
  { id: "asokoro", label: "Asokoro", group: "Garki, Maitama & Asokoro", district: "Asokoro",
    keywords: [],
    quotes: [{ place: "Asokoro", km: 20.0, fee: 5400 }] },

  // ---------- Kubwa & Dakwa ----------
  { id: "kubwa-hospital", label: "Kubwa (General Hospital)", group: "Kubwa & Dakwa", district: "Kubwa",
    keywords: ["kubwa town"],
    quotes: [{ place: "Kubwa General Hospital", km: 8.8, fee: 3000 }] },
  { id: "kubwa-nysc", label: "Kubwa (NYSC Camp)", group: "Kubwa & Dakwa", district: "Kubwa",
    keywords: ["nysc"],
    quotes: [{ place: "Kubwa NYSC camp", km: 8.4, fee: 5200 }] },
  { id: "kubwa-train", label: "Kubwa (Train Station)", group: "Kubwa & Dakwa", district: "Kubwa",
    keywords: ["railway"],
    quotes: [{ place: "Kubwa train station", km: 9.8, fee: 5600 }] },
  { id: "dakwa", label: "Dakwa", group: "Kubwa & Dakwa", district: "Dakwa",
    keywords: ["primary health center", "phc"],
    quotes: [{ place: "Dakwa primary health center", km: 9.4, fee: 4800 }] },

  // ---------- Apo, Lugbe & the South ----------
  { id: "apo-bridge", label: "Apo Bridge", group: "Apo, Lugbe & the South", district: "Apo",
    keywords: [],
    quotes: [{ place: "Apo bridge", km: 16.1, fee: 5400 }] },
  { id: "apo-legislative", label: "Apo Legislative Quarters", group: "Apo, Lugbe & the South", district: "Apo",
    keywords: ["legislative"],
    quotes: [{ place: "Apo Legislative Quarters", km: 17.2, fee: 5900 }] },
  { id: "apo-wumba", label: "Apo (Wumba Junction / CBN Choos Estate)", group: "Apo, Lugbe & the South", district: "Apo",
    keywords: ["wumba", "cbn choos", "choos estate"],
    quotes: [{ place: "Wumba Junction, CBN Choos Estate", km: 19.5, fee: 6000 }] },
  { id: "apo-resettlement", label: "Apo Resettlement (Fish Market)", group: "Apo, Lugbe & the South", district: "Apo",
    keywords: ["fish market", "resettlement"],
    quotes: [{ place: "Apo Resettlement, fish market", km: 20.6, fee: 6600 }] },
  { id: "lugbe-river-park", label: "Lugbe (River Park Estate)", group: "Apo, Lugbe & the South", district: "Lugbe",
    keywords: ["river park", "airport road"],
    quotes: [{ place: "River Park Estate, Lugbe", km: 11.3, fee: 6600 }] },
  { id: "lokogoma", label: "Lokogoma", group: "Apo, Lugbe & the South", district: "Lokogoma",
    keywords: [],
    quotes: [{ place: "Lokogoma", km: 17.9, fee: 5400 }] },
  { id: "lokogoma-suncity", label: "Lokogoma (Sun City Estate)", group: "Apo, Lugbe & the South", district: "Lokogoma",
    keywords: ["sun city"],
    quotes: [{ place: "Sun City Estate, Lokogoma", km: 13.0, fee: 4300 }] },
  { id: "galadimawa", label: "Galadimawa", group: "Apo, Lugbe & the South", district: "Galadimawa",
    keywords: [],
    quotes: [{ place: "Galadimawa", km: 13.0, fee: 4300 }] },
  { id: "durumi-phc", label: "Durumi (Primary Health Center)", group: "Apo, Lugbe & the South", district: "Durumi",
    keywords: ["phc"],
    quotes: [{ place: "Durumi primary health center", km: 7.1, fee: 4300 }] },
  { id: "durumi-church", label: "Durumi (Living Faith Church)", group: "Apo, Lugbe & the South", district: "Durumi",
    keywords: ["winners", "living faith"],
    quotes: [{ place: "Durumi, Living Faith Church", km: 15.3, fee: 5400 }] },

  // ---------- Karu, Nyanya & Zuba ----------
  { id: "karu", label: "Karu", group: "Karu, Nyanya & Zuba", district: "Karu",
    keywords: [],
    quotes: [{ place: "Karu", km: 25.4, fee: 6500 }] },
  { id: "nyanya", label: "Nyanya (Bus Station)", group: "Karu, Nyanya & Zuba", district: "Nyanya",
    keywords: ["bus station", "motor park"],
    quotes: [{ place: "Nyanya bus station", km: 25.3, fee: 6600 }] },
  { id: "zuba", label: "Zuba", group: "Karu, Nyanya & Zuba", district: "Zuba",
    keywords: [],
    quotes: [{ place: "Zuba (quoted earlier, time not noted. Likely lower than the 6pm price, re-check)", km: null, fee: 4900 }] },
]