// ─── Competitor Pricing Data ───────────────────────────────────────────────────
// Monthly prices for equivalent protocols at competitor platforms.
// null = not offered / not available at that platform.
// Last verified: April 2026.

export type CompetitorRow = {
  vendor: string;
  price: number | null;
  note?: string; // e.g. "+ lab fees", "finasteride only"
};

export type StackCompetitorData = {
  stackId: string;
  ourPrice: number | null;
  competitors: CompetitorRow[];
};

// Hero callouts for home page — vs the LOWEST competitor price for each stack.
// All prices verified from publicly listed rates, April 2026.
export const HERO_COMPARISONS = [
  {
    label: "Longevity GLP-1",
    ours: 129,
    theirs: 145,
    competitor: "Ro Body",
    savings: 11,
  },
  {
    label: "Testosterone Replacement",
    ours: 79,
    theirs: 99,
    competitor: "TRT Nation",
    savings: 20,
  },
  {
    label: "Longevity Base",
    ours: 59,
    theirs: 100,
    competitor: "Healthspan",
    savings: 41,
  },
  {
    label: "Inflammation (LDN)",
    ours: 19,
    theirs: 25,
    competitor: "AgelessRx",
    savings: 24,
  },
];

export const COMPETITOR_PRICING: StackCompetitorData[] = [
  // ─── CORE CARDIO ──────────────────────────────────────────────────────────
  {
    stackId: "core-cardio",
    ourPrice: null, // pending
    competitors: [
      { vendor: "Hims", price: 40, note: "Tadalafil only — no statin" },
      { vendor: "Roman", price: 40, note: "Tadalafil only — no statin" },
      { vendor: "Bluechew", price: 30, note: "Tadalafil only — no statin" },
      { vendor: "Hone Health", price: 129, note: "Separate statin/tadalafil Rx + membership" },
    ],
  },

  // ─── HAIR (MEN) ───────────────────────────────────────────────────────────
  {
    stackId: "hair-men",
    ourPrice: null, // pending
    competitors: [
      { vendor: "Hims", price: 55, note: "Finasteride $25 + oral minoxidil $30" },
      { vendor: "Keeps", price: 48, note: "Finasteride $23 + oral minoxidil est." },
      { vendor: "Roman", price: 69, note: "Finasteride $44 + topical minoxidil $25" },
      { vendor: "Happy Head", price: 60, note: "Combo program est." },
    ],
  },

  // ─── HAIR PRO (MEN) ───────────────────────────────────────────────────────
  {
    stackId: "hair-pro-men",
    ourPrice: null, // pending
    competitors: [
      { vendor: "Hims", price: 120, note: "Dutasteride $90 + oral minoxidil $30" },
      { vendor: "Keeps", price: 85, note: "Dutasteride $60 + oral minoxidil est." },
      { vendor: "Strut", price: 90, note: "Dutasteride + oral minoxidil est." },
    ],
  },

  // ─── HAIR (WOMEN) ─────────────────────────────────────────────────────────
  {
    stackId: "hair-women",
    ourPrice: null, // pending
    competitors: [
      { vendor: "Nurx", price: 60, note: "Spironolactone $30 + minoxidil est." },
      { vendor: "Wisp", price: 55, note: "Spironolactone $25 + minoxidil est." },
      { vendor: "Pandia", price: 65, note: "Spironolactone $35 + minoxidil est." },
      { vendor: "Strut", price: 55, note: "Spironolactone + oral minoxidil $25" },
    ],
  },

  // ─── SKIN ─────────────────────────────────────────────────────────────────
  {
    stackId: "skin",
    ourPrice: null, // pending
    competitors: [
      { vendor: "Apostrophe", price: 30 },
      { vendor: "Curology", price: 25 },
      { vendor: "Musely", price: 35 },
      { vendor: "Dermatica", price: 20 },
    ],
  },

  // ─── INFLAMMATION (LDN) ───────────────────────────────────────────────────
  {
    stackId: "inflammation",
    ourPrice: 19,
    competitors: [
      { vendor: "AgelessRx", price: 25 },
      { vendor: "Defy Medical", price: 75 },
      { vendor: "LifeExtension MD", price: 79 },
    ],
  },

  // ─── TESTOSTERONE ENHANCEMENT ─────────────────────────────────────────────
  {
    stackId: "testosterone-enhancement",
    ourPrice: 59,
    competitors: [
      { vendor: "Maximus Tribe", price: 199 },
      { vendor: "Marek Health", price: 150, note: "Starting price" },
      { vendor: "Hone Health", price: 171, note: "Ongoing after yr1 labs ($42/mo)" },
      { vendor: "Defy Medical", price: 149, note: "Starting price" },
    ],
  },

  // ─── TESTOSTERONE REPLACEMENT ─────────────────────────────────────────────
  {
    stackId: "testosterone-replacement",
    ourPrice: 79,
    competitors: [
      { vendor: "Hone Health", price: 129, note: "+ $129 labs + membership yr1" },
      { vendor: "TRT Nation", price: 99, note: "+ lab fees" },
      { vendor: "Defy Medical", price: 149, note: "Starting price" },
      { vendor: "Marek Health", price: 200, note: "Starting price" },
    ],
  },

  // ─── WOMEN'S HRT ──────────────────────────────────────────────────────────
  {
    stackId: "womens-hrt",
    ourPrice: 79,
    competitors: [
      { vendor: "Winona", price: 89 },
      { vendor: "Alloy", price: 99 },
      { vendor: "Evernow", price: 99 },
      { vendor: "Midi", price: 179, note: "+ insurance billing" },
    ],
  },

  // ─── LONGEVITY BASE ───────────────────────────────────────────────────────
  {
    stackId: "longevity-base",
    ourPrice: 59,
    competitors: [
      { vendor: "AgelessRx", price: 145, note: "Rapamycin $65 + metformin $25 + acarbose $55" },
      { vendor: "Healthspan", price: 100, note: "Rapamycin $70 + metformin $30 (no acarbose)" },
      { vendor: "Optispan", price: 154, note: "Rapamycin $99 + est. metformin/acarbose" },
    ],
  },

  // ─── LONGEVITY GLP-1 ──────────────────────────────────────────────────────
  {
    stackId: "longevity-glp1",
    ourPrice: 129,
    competitors: [
      { vendor: "Ro Body", price: 145 },
      { vendor: "Eden", price: 196 },
      { vendor: "Hims", price: 199 },
      { vendor: "Mochi", price: 233 },
      { vendor: "Henry Meds", price: 297 },
      { vendor: "Sequence", price: 299 },
    ],
  },
];

export function getStackCompetitorData(stackId: string): StackCompetitorData | undefined {
  return COMPETITOR_PRICING.find((c) => c.stackId === stackId);
}
