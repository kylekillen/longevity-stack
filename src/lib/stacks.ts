// ─── Stack Data Model ─────────────────────────────────────────────────────────
// Each Stack is a modular prescription protocol targeting a specific health goal.
// Prices marked null = pending final pharmacy quote. Displayed as "{{PRICE}}" in UI.

export type StackMed = {
  name: string;
  dose: string;
};

export type Stack = {
  id: string;
  name: string;
  tagline: string;
  color: string;           // hex — used for visual builder blocks
  accentText: string;      // tailwind text color class for readability on color
  medications: StackMed[];
  ourPrice: number | null; // null = price pending
  competitorPrice: number | null;
  forGender: "men" | "women" | "both";
  exclusiveWith?: string[];    // stack IDs that cannot be selected simultaneously
  suggestsStacks?: string[];   // stack IDs to cross-suggest when this is selected
  waitlist?: boolean;
  badge?: string;
  notes?: string;
  // ── Detail page content ────────────────────────────────────────────────────
  description: string;
  scienceBlurb: string;
  faqs: { q: string; a: string }[];
  heroStats: { label: string; value: string }[];
};

// ─── OPEN QUESTIONS (do not block on these) ───────────────────────────────────
// 1. Final per-stack pricing — using null placeholders for unconfirmed stacks
// 2. Women's Core Cardio & ED Prevention — tadalafil included with physician guidance note
// 3. Testosterone cream supplier confirmation — marked pending in notes
// 4. SGLT2 — waitlist only, not orderable
// 5. Enclomiphene + TRT add-on — noted in TRT stack, not a separate entry

const STACKS: Stack[] = [

  // ─── CORE CARDIO (both genders) ────────────────────────────────────────────
  {
    id: "core-cardio",
    name: "Core Cardio & ED Prevention",
    tagline: "The baseline cardiovascular protocol nearly every adult over 40 should consider.",
    color: "#3b82f6",
    accentText: "#93c5fd",
    forGender: "both",
    ourPrice: null, // {{PRICE}}
    competitorPrice: 129,
    badge: "Foundational",
    suggestsStacks: ["longevity-base"],
    medications: [
      { name: "Rosuvastatin", dose: "5mg daily" },
      { name: "Tadalafil", dose: "5mg daily" },
    ],
    notes: "Tadalafil is prescribed here as a cardiovascular agent — reducing arterial stiffness and improving endothelial function. It also works for ED in men. Both uses are real; the CV evidence is what puts it in a longevity protocol.",
    description:
      "Most people know tadalafil for erectile dysfunction. The under-discussed story is its cardiovascular profile: daily low-dose tadalafil reduces arterial stiffness, improves endothelial function, and lowers pulmonary arterial pressure. That's why longevity physicians prescribe it even to patients without ED — and why it belongs in a cardioprotective stack. Rosuvastatin pairs with it as the most potent statin per milligram, with 44% cardiovascular event reduction in the JUPITER trial. Together they form the baseline cardiovascular protocol most longevity physicians prescribe.",
    scienceBlurb:
      "The JUPITER trial demonstrated rosuvastatin reduced major cardiovascular events by 44% in patients with elevated CRP. Multiple studies show daily tadalafil reduces arterial stiffness and improves endothelial function independent of its sexual effects — the same PDE5 mechanism that dilates penile vasculature also benefits systemic vasculature. High-dose tadalafil (Adcirca) is FDA-approved for pulmonary arterial hypertension. Combination statin + PDE5 inhibitor protocols are standard at leading longevity clinics.",
    heroStats: [
      { label: "Competitor price", value: "$129/mo" },
      { label: "Rx review", value: "24–48 hrs" },
      { label: "Evidence", value: "Tier 1" },
      { label: "Medications", value: "2" },
    ],
    faqs: [
      {
        q: "Do I need labs before starting rosuvastatin?",
        a: "Not required to begin. We recommend a lipid panel and liver enzymes within the first 90 days. Your physician will guide you.",
      },
      {
        q: "Is tadalafil appropriate for women?",
        a: "Yes. Off-label daily tadalafil in women is prescribed for cardiovascular and pulmonary indications. Your physician will review appropriateness based on your history.",
      },
      {
        q: "Can I take this if I'm already on a statin?",
        a: "Note your current statin during intake. Your physician will coordinate to avoid duplication.",
      },
    ],
  },

  // ─── HAIR (men) ────────────────────────────────────────────────────────────
  {
    id: "hair-men",
    name: "Hair",
    tagline: "Stop hair loss. Grow what you have.",
    color: "#22c55e",
    accentText: "#bbf7d0",
    forGender: "men",
    ourPrice: null, // {{PRICE}}
    competitorPrice: 89,
    exclusiveWith: ["hair-pro-men"],
    suggestsStacks: ["skin"],
    medications: [
      { name: "Finasteride", dose: "1mg daily" },
      { name: "Oral Minoxidil", dose: "2.5mg daily" },
    ],
    description:
      "The standard-of-care dual approach to male pattern hair loss. Finasteride blocks DHT production (the androgen that drives follicle miniaturization) while oral minoxidil at low doses promotes blood flow to follicles and extends the growth phase. Oral minoxidil has better adherence than topical and superior systemic distribution.",
    scienceBlurb:
      "Finasteride reduces scalp DHT by approximately 70%. A landmark 5-year trial showed it halted hair loss in 90% of men and grew new hair in 65%. Oral minoxidil at 2.5–5mg produces superior regrowth vs topical in head-to-head trials, with a favorable side effect profile at low doses.",
    heroStats: [
      { label: "DHT reduction", value: "~70%" },
      { label: "Halts loss", value: "~90% of men" },
      { label: "Competitor price", value: "$89/mo" },
      { label: "Medications", value: "2" },
    ],
    faqs: [
      {
        q: "How long until I see results?",
        a: "Finasteride halts progression within 3–6 months. Visible regrowth takes 6–12 months. You'll need to continue to maintain results.",
      },
      {
        q: "What about sexual side effects?",
        a: "The incidence of sexual side effects with finasteride is about 3–5% in clinical trials. Most resolve on stopping. Your physician will discuss your risk profile.",
      },
      {
        q: "Can I upgrade to Hair Pro later?",
        a: "Yes. If you don't see adequate response after 6–12 months, your physician can switch you to dutasteride.",
      },
    ],
  },

  // ─── HAIR PRO (men) ────────────────────────────────────────────────────────
  {
    id: "hair-pro-men",
    name: "Hair Pro",
    tagline: "Maximum DHT suppression for non-responders.",
    color: "#15803d",
    accentText: "#86efac",
    forGender: "men",
    ourPrice: null, // {{PRICE}}
    competitorPrice: 149,
    exclusiveWith: ["hair-men"],
    suggestsStacks: ["skin"],
    badge: "Stronger",
    medications: [
      { name: "Dutasteride", dose: "0.5mg daily" },
      { name: "Oral Minoxidil", dose: "2.5mg daily" },
    ],
    description:
      "Dutasteride inhibits both type I and type II 5-alpha reductase (finasteride only inhibits type II), producing approximately 90% DHT suppression vs 70% with finasteride. Clinical trials show superior hair preservation outcomes. This is the protocol for men who want maximum pharmaceutical intervention or who haven't responded adequately to finasteride.",
    scienceBlurb:
      "A direct head-to-head RCT showed dutasteride outperformed finasteride on hair count at 24 weeks. DHT reduction of ~90% vs ~70% translates to meaningfully better follicle preservation. Dutasteride is FDA-approved for BPH and widely prescribed off-label for androgenic alopecia.",
    heroStats: [
      { label: "DHT reduction", value: "~90%" },
      { label: "vs finasteride", value: "~70%" },
      { label: "Competitor price", value: "$149/mo" },
      { label: "Medications", value: "2" },
    ],
    faqs: [
      {
        q: "Who should choose Hair Pro over Hair?",
        a: "Men who haven't responded adequately to finasteride after 12 months, or those who want maximum DHT suppression from the start.",
      },
      {
        q: "Can I switch from finasteride to dutasteride?",
        a: "Yes. Your physician can transition you directly. No washout period required.",
      },
      {
        q: "Is dutasteride off-label?",
        a: "For hair loss, yes. It's FDA-approved for BPH. Off-label prescribing is standard medical practice — your physician will review appropriateness.",
      },
    ],
  },

  // ─── HAIR (women) ──────────────────────────────────────────────────────────
  {
    id: "hair-women",
    name: "Hair",
    tagline: "Address female pattern hair loss with proven pharmaceutical tools.",
    color: "#22c55e",
    accentText: "#bbf7d0",
    forGender: "women",
    ourPrice: null, // {{PRICE}}
    competitorPrice: 99,
    suggestsStacks: ["skin"],
    medications: [
      { name: "Spironolactone", dose: "50–100mg daily" },
      { name: "Oral Minoxidil", dose: "1.25–2.5mg daily" },
    ],
    description:
      "Female pattern hair loss (androgenetic alopecia) is driven by androgen sensitivity at the follicle level. Spironolactone blocks androgen receptors, reducing the hair-thinning signal. Oral minoxidil at low doses is highly effective for women and has become the preferred delivery method over topical for adherence and efficacy.",
    scienceBlurb:
      "Spironolactone at 100–200mg shows significant improvement in female pattern hair loss in clinical studies, particularly in women with evidence of androgen excess. Oral minoxidil 1–2.5mg outperforms topical minoxidil in several head-to-head comparisons with a low side effect profile at these doses.",
    heroStats: [
      { label: "Competitor price", value: "$99/mo" },
      { label: "Evidence", value: "Strong" },
      { label: "Rx review", value: "24–48 hrs" },
      { label: "Medications", value: "2" },
    ],
    faqs: [
      {
        q: "Is spironolactone safe for long-term use?",
        a: "Yes. Spironolactone has decades of safety data. Your physician will periodically check potassium levels. Not recommended during pregnancy.",
      },
      {
        q: "How does this differ from the men's hair protocol?",
        a: "Men use finasteride or dutasteride (which block DHT production). Women generally avoid these due to hormonal effects. Spironolactone blocks androgen receptors instead.",
      },
      {
        q: "How long until I see results?",
        a: "Shedding typically slows within 3–6 months. Visible regrowth takes 6–12 months of consistent use.",
      },
    ],
  },

  // ─── SKIN (both) ───────────────────────────────────────────────────────────
  {
    id: "skin",
    name: "Skin",
    tagline: "FDA-approved for acne. Used by longevity physicians for the strongest anti-aging evidence in topical skincare.",
    color: "#fb923c",
    accentText: "#fed7aa",
    forGender: "both",
    ourPrice: null, // {{PRICE}}
    competitorPrice: 79,
    medications: [
      { name: "Tretinoin", dose: "0.025% cream" },
    ],
    description:
      "Tretinoin was FDA-approved for acne. That's the regulatory history. What put it in every longevity physician's protocol is the anti-aging evidence: tretinoin is the only topical ingredient with randomized controlled trial data showing reversal of photoaging — not prevention, actual reversal at the histological level. Unlike OTC retinols that must be converted to retinoic acid by skin enzymes (an inefficient, variable process), tretinoin is retinoic acid and works directly. Over 30 years of literature, confirmed by biopsy.",
    scienceBlurb:
      "Tretinoin increases collagen synthesis, accelerates skin cell turnover, and reverses photoaging at the histological level. A landmark 48-week randomized trial published in NEJM showed visible reversal of fine lines, improved skin texture, and increased dermal collagen in tretinoin-treated vs placebo skin.",
    heroStats: [
      { label: "Evidence", value: "30+ years" },
      { label: "Competitor price", value: "$79/mo" },
      { label: "Delivery", value: "Topical cream" },
      { label: "Application", value: "Nightly" },
    ],
    faqs: [
      {
        q: "How do I use tretinoin without irritation?",
        a: "Start with a pea-sized amount every 2–3 nights on dry skin. Increase frequency as tolerated. Moisturizer over tretinoin reduces irritation. Your physician will guide the titration.",
      },
      {
        q: "When do I see results?",
        a: "Initial purging (if any) resolves in 4–6 weeks. Texture improvement is typically noticeable at 8–12 weeks. Maximum anti-aging effects at 6–12 months.",
      },
      {
        q: "Can I use this with other actives (vitamin C, AHAs)?",
        a: "Generally yes, but separate your actives from tretinoin (different times of day). Your physician will advise based on your skin routine.",
      },
    ],
  },

  // ─── INFLAMMATION (both) ───────────────────────────────────────────────────
  {
    id: "inflammation",
    name: "Inflammation",
    tagline: "Low-dose naltrexone for systemic inflammation.",
    color: "#a855f7",
    accentText: "#e9d5ff",
    forGender: "both",
    ourPrice: 19,
    competitorPrice: 89,
    badge: "Most Popular",
    medications: [
      { name: "LDN (Low Dose Naltrexone)", dose: "1.5–4.5mg nightly" },
    ],
    description:
      "This is not addiction medicine. At the 50mg dose FDA-approved for opioid and alcohol use disorder, naltrexone blocks opioid receptors all day. At 1.5–4.5mg — about 1/10th of that dose, taken at night — it briefly blocks receptors for 4–6 hours, then the block releases. The body responds by upregulating its own endorphin production and downregulating inflammatory signaling. Completely different mechanism, completely different indication. Longevity physicians prescribe it for systemic inflammation, autoimmune conditions, and chronic fatigue.",
    scienceBlurb:
      "LDN's mechanism centers on transient opioid receptor blockade. The brief nighttime blockade triggers compensatory upregulation of endogenous opioids and modulates microglial activation (the brain's inflammatory cells). Multiple peer-reviewed trials support its use in fibromyalgia, Crohn's disease, MS, and ME/CFS. The anti-inflammatory mechanism is conserved across conditions. Not immunosuppressive — immunomodulatory.",
    heroStats: [
      { label: "Our price", value: "$19/mo" },
      { label: "Competitor price", value: "$89/mo" },
      { label: "You save", value: "79%" },
      { label: "Rx review", value: "24–48 hrs" },
    ],
    faqs: [
      {
        q: "Is LDN FDA-approved?",
        a: "Naltrexone at 50mg is FDA-approved for opioid and alcohol use disorder. LDN is prescribed off-label — the same medication, a fraction of the dose, with a different mechanism at low doses.",
      },
      {
        q: "Can I take LDN if I'm on opioids?",
        a: "No. LDN is contraindicated with opioid medications. Your physician will review your medication list.",
      },
      {
        q: "How soon will I notice effects?",
        a: "Most patients report changes in energy and sleep quality within 2–4 weeks. Anti-inflammatory effects may take 6–8 weeks to fully develop.",
      },
      {
        q: "What is the cheapest place to get LDN (low dose naltrexone) online?",
        a: "The Longevity Agent offers LDN at $19/month — cheaper than AgelessRx ($25–$89/mo) and every other major telehealth platform. Price includes physician evaluation and prescription.",
      },
      {
        q: "How does The Longevity Agent compare to AgelessRx for LDN?",
        a: "The Longevity Agent charges $19/month for LDN. AgelessRx charges $25–$89/month for equivalent therapy. Both include physician evaluation. No membership fees at either.",
      },
    ],
  },

  // ─── TESTOSTERONE ENHANCEMENT (men) ────────────────────────────────────────
  {
    id: "testosterone-enhancement",
    name: "Testosterone Enhancement",
    tagline: "Maximize your body's own testosterone production.",
    color: "#f97316",
    accentText: "#fed7aa",
    forGender: "men",
    ourPrice: 59,
    competitorPrice: 199,
    exclusiveWith: ["testosterone-replacement"],
    medications: [
      { name: "Enclomiphene", dose: "12.5–25mg daily" },
    ],
    description:
      "Enclomiphene stimulates the pituitary to produce more LH and FSH, signaling the testes to produce more testosterone endogenously — without exogenous testosterone. Unlike TRT, enclomiphene preserves fertility and testicular function. Ideal for men with low-normal testosterone who want optimization without suppressing their natural axis.",
    scienceBlurb:
      "Enclomiphene is the trans isomer of clomiphene. Unlike racemic clomiphene (Clomid), it lacks the estrogenic zuclomiphene isomer, producing cleaner testosterone stimulation. Phase 3 trials demonstrated statistically significant testosterone increases with maintained spermatogenesis — the key advantage over TRT.",
    heroStats: [
      { label: "Our price", value: "$59/mo" },
      { label: "Competitor price", value: "$199/mo" },
      { label: "Fertility", value: "Preserved" },
      { label: "Injections", value: "None" },
    ],
    faqs: [
      {
        q: "How is this different from TRT?",
        a: "TRT replaces testosterone from outside the body — effective but suppresses natural production and fertility. Enclomiphene stimulates your own system. LH and FSH stay elevated. Testes continue working.",
      },
      {
        q: "Do I need bloodwork first?",
        a: "We recommend a baseline testosterone panel. Your physician will guide you on what to order.",
      },
      {
        q: "Can I switch to TRT later?",
        a: "Yes. Some patients use enclomiphene as a first step and move to TRT if response is insufficient or fertility is no longer a concern.",
      },
      {
        q: "What is the cheapest place to get enclomiphene prescribed online?",
        a: "The Longevity Agent offers enclomiphene at $59/month. Maximus charges $199/month, Marek Health $150+/month, Hone Health approximately $171 for the first year. Price includes physician evaluation.",
      },
      {
        q: "How does The Longevity Agent compare to Maximus for enclomiphene?",
        a: "The Longevity Agent: $59/month for enclomiphene (12.5–25mg daily). Maximus: $199/month for equivalent. That's a 70% saving with the same prescription.",
      },
    ],
  },

  // ─── TESTOSTERONE REPLACEMENT (men) ────────────────────────────────────────
  {
    id: "testosterone-replacement",
    name: "Testosterone Replacement",
    tagline: "Restore testosterone levels with steady daily absorption.",
    color: "#ef4444",
    accentText: "#fecaca",
    forGender: "men",
    ourPrice: 79,
    competitorPrice: 299,
    exclusiveWith: ["testosterone-enhancement"],
    medications: [
      { name: "Testosterone cream", dose: "Physician-determined dose, daily" },
    ],
    notes: "Enclomiphene can be added as an adjunct to TRT to maintain testicular function — ask your physician during intake.",
    description:
      "Testosterone replacement via compounded cream provides steady-state testosterone delivery without the peaks and troughs of weekly injections. Daily application maintains more consistent serum levels. For men with clinically low testosterone (hypogonadism) or significant age-related decline.",
    scienceBlurb:
      "Transdermal testosterone avoids hepatic first-pass metabolism and produces more stable serum concentrations than weekly injectable protocols. The 2023 TRAVERSE trial showed no increased cardiovascular events in TRT users vs placebo — resolving a long-standing safety concern. TRT benefits include improved body composition, bone density, libido, mood, and energy.",
    heroStats: [
      { label: "Our price", value: "$79/mo" },
      { label: "Competitor price", value: "$299/mo" },
      { label: "You save", value: "74%" },
      { label: "Delivery", value: "Daily cream" },
    ],
    faqs: [
      {
        q: "Do I need bloodwork before starting?",
        a: "Yes. TRT requires a baseline testosterone panel (total T, free T, LH, FSH, estradiol, hematocrit, PSA). We'll guide you on getting labs.",
      },
      {
        q: "Will TRT affect my fertility?",
        a: "Exogenous testosterone suppresses sperm production in most men. If fertility is a concern, discuss enclomiphene or HCG co-administration with your physician.",
      },
      {
        q: "Why cream instead of injections?",
        a: "Daily cream produces more stable testosterone levels vs once-weekly injections. Fewer peaks and troughs, simpler protocol for many men.",
      },
      {
        q: "What is the cheapest TRT (testosterone replacement) online?",
        a: "The Longevity Agent offers TRT (testosterone cream, daily) at $79/month. TRT Nation charges $99+/month, Hone Health $129+/month, Defy Medical $149+/month, Marek Health $200+/month.",
      },
      {
        q: "How does The Longevity Agent compare to Hone Health for TRT?",
        a: "The Longevity Agent: $79/month for testosterone cream. Hone Health: $129+/month. Both include physician oversight. The Longevity Agent saves approximately 39%.",
      },
    ],
  },

  // ─── WOMEN'S HRT ───────────────────────────────────────────────────────────
  {
    id: "womens-hrt",
    name: "Hormone Replacement",
    tagline: "Bioidentical HRT. Perimenopause, menopause, and longevity.",
    color: "#e879f9",
    accentText: "#f5d0fe",
    forGender: "women",
    ourPrice: 79,
    competitorPrice: 299,
    badge: "Evidence-backed",
    medications: [
      { name: "Estradiol", dose: "Transdermal — patch or gel" },
      { name: "Micronized progesterone", dose: "Oral, nightly" },
      { name: "Testosterone cream", dose: "Low dose, if indicated" },
    ],
    description:
      "Bioidentical hormone replacement therapy for women experiencing perimenopause or menopause. We prescribe transdermal estradiol (patch or gel), micronized progesterone, and low-dose testosterone where indicated. The 2002 WHI study that scared a generation off HRT used synthetic progestins and conjugated equine estrogens — not the body-identical hormones we prescribe.",
    scienceBlurb:
      "Modern guidelines from the Menopause Society, British Menopause Society, and NICE support bioidentical HRT as safe and effective for most women under 60 or within 10 years of menopause onset. Transdermal estradiol avoids first-pass hepatic metabolism, reducing thrombotic risk vs oral estrogen. Micronized progesterone has a better breast safety profile than synthetic progestins.",
    heroStats: [
      { label: "Our price", value: "$79/mo" },
      { label: "Competitor price", value: "$299/mo" },
      { label: "You save", value: "74%" },
      { label: "Medications", value: "2–3" },
    ],
    faqs: [
      {
        q: "Is bioidentical HRT safer than synthetic HRT?",
        a: "The evidence supports bioidentical hormones — transdermal estradiol and micronized progesterone — as having a better safety profile than the synthetic versions studied in the 2002 WHI trial.",
      },
      {
        q: "Do I need to be in menopause to start?",
        a: "No. Many women start during perimenopause to manage symptoms. Evidence is strongest for starting within 10 years of menopause onset.",
      },
      {
        q: "What about cancer risk?",
        a: "Current evidence shows no increased risk with estrogen-only HRT, and minimal increase with combined therapy in the first 5 years. Your physician reviews your personal and family history.",
      },
      {
        q: "What is the cheapest bioidentical HRT online?",
        a: "The Longevity Agent offers Women's HRT (transdermal estradiol, micronized progesterone, testosterone cream if indicated) at $79/month. Winona charges $89, Alloy $99, Evernow $99, Midi $179+. Price includes physician evaluation.",
      },
      {
        q: "How does The Longevity Agent compare to Winona for HRT?",
        a: "The Longevity Agent: $79/month for bioidentical HRT. Winona: $89/month. Both prescribe bioidentical hormones with physician oversight. The Longevity Agent is the lowest-price option in this category.",
      },
    ],
  },

  // ─── LONGEVITY BASE (both) ─────────────────────────────────────────────────
  {
    id: "longevity-base",
    name: "Longevity Base",
    tagline: "The three drugs with the strongest evidence for slowing aging.",
    color: "#eab308",
    accentText: "#fef08a",
    forGender: "both",
    ourPrice: 59,
    competitorPrice: 249,
    badge: "Gold Standard",
    medications: [
      { name: "Rapamycin", dose: "2–6mg weekly" },
      { name: "Metformin", dose: "500–1000mg daily" },
      { name: "Acarbose", dose: "25–50mg with meals" },
    ],
    description:
      "The protocol most longevity physicians use themselves. Rapamycin inhibits mTORC1 — the only drug to consistently extend lifespan in multiple mammalian species. Metformin activates AMPK, mimicking caloric restriction. Acarbose reduces post-meal glucose spikes and has extended lifespan in ITP mouse studies. Together they cover three distinct aging pathways.",
    scienceBlurb:
      "Rapamycin extended median lifespan in ITP mice by 9–14%, even when started in old age. Metformin is being studied in the landmark TAME trial as a geroprotective agent. Acarbose showed significant lifespan extension in male ITP mice — one of the few drugs to show benefit in the NIA's rigorous testing program. Together they hit mTOR, AMPK, and glucose signaling.",
    heroStats: [
      { label: "Our price", value: "$59/mo" },
      { label: "Competitor price", value: "$249/mo" },
      { label: "You save", value: "76%" },
      { label: "Pathways", value: "3" },
    ],
    faqs: [
      {
        q: "Is rapamycin safe at longevity doses?",
        a: "At 2–6mg once weekly, rapamycin's immunosuppressive effects are minimal. Thousands of patients have used this protocol over 5–10 years without alarming safety signals.",
      },
      {
        q: "Does metformin blunt exercise adaptation?",
        a: "Some data suggests modest reduction in mitochondrial adaptation to resistance training. Your physician can advise on timing relative to workouts.",
      },
      {
        q: "What is acarbose doing in this stack?",
        a: "Acarbose slows carbohydrate digestion, blunting post-meal glucose spikes. It's one of the few drugs to show lifespan extension in NIA ITP mouse studies — particularly in males.",
      },
      {
        q: "What is the cheapest place to get rapamycin prescribed online?",
        a: "The Longevity Agent offers the Longevity Base stack (rapamycin + metformin + acarbose) for $59/month — vs AgelessRx at ~$145/mo and Healthspan at ~$100/mo. Price includes physician evaluation and prescription.",
      },
      {
        q: "How does The Longevity Agent compare to AgelessRx for rapamycin?",
        a: "The Longevity Agent: $59/month for rapamycin + metformin + acarbose. AgelessRx: approximately $145/month for an equivalent protocol. Both are physician-prescribed. The Longevity Agent saves you ~59%.",
      },
    ],
  },

  // ─── LONGEVITY GLP-1 (both) ────────────────────────────────────────────────
  {
    id: "longevity-glp1",
    name: "Longevity GLP-1",
    tagline: "GLP-1 isn't just for weight loss. The SELECT trial proved it.",
    color: "#14b8a6",
    accentText: "#99f6e4",
    forGender: "both",
    ourPrice: 129,
    competitorPrice: 699,
    medications: [
      { name: "Compounded semaglutide", dose: "Weekly injection, titrated" },
      { name: "Ondansetron", dose: "As needed for nausea" },
    ],
    description:
      "The SELECT trial enrolled 17,600 non-diabetic adults with obesity and cardiovascular disease, randomized them to semaglutide or placebo, and measured hard cardiovascular outcomes. Result: 20% reduction in cardiovascular death, non-fatal MI, and non-fatal stroke. That's comparable to the best statin or antihypertensive outcomes data. Crucially, the benefit was independent of the degree of weight loss — suggesting direct cardiovascular and anti-inflammatory effects beyond body composition change. Yes, GLP-1s also produce 15–22% body weight reduction and that matters for longevity. But the CV evidence is why they belong in this protocol regardless of how much weight you need to lose.",
    scienceBlurb:
      "Semaglutide reduces appetite via hypothalamic GLP-1 receptor signaling, slows gastric emptying, and improves insulin sensitivity. GLP-1 receptors are expressed throughout the body — heart, kidneys, liver, and brain — and their activation appears to have pleiotropic effects beyond weight. The SELECT trial (NEJM 2023) showed 20% MACE reduction in non-diabetic participants. Ongoing trials are investigating GLP-1 agonists for Alzheimer's, Parkinson's, NASH, and CKD.",
    heroStats: [
      { label: "Our price", value: "$129/mo" },
      { label: "Competitor price", value: "$699/mo" },
      { label: "You save", value: "82%" },
      { label: "CV risk reduction", value: "~20%" },
    ],
    faqs: [
      {
        q: "Is compounded semaglutide the same as Ozempic/Wegovy?",
        a: "The active ingredient is identical. Compounded versions are produced in FDA-registered pharmacies during documented shortage. Same mechanism, dramatically different price.",
      },
      {
        q: "Why is ondansetron included?",
        a: "Nausea is the most common GLP-1 side effect during titration. Ondansetron is a well-tolerated anti-nausea medication. Your physician includes it as a buffer for the first 4–8 weeks.",
      },
      {
        q: "Is this appropriate if I don't have much weight to lose?",
        a: "Yes. GLP-1s have cardiovascular, metabolic, and potentially neuroprotective benefits independent of weight. Your physician will discuss whether the risk/benefit profile fits your goals.",
      },
      {
        q: "What is the cheapest place to get compounded semaglutide online?",
        a: "The Longevity Agent offers compounded semaglutide at $129/month (weekly injection + ondansetron included). Ro Body charges $145, Hims $199, Mochi $233, Henry Meds $297, Sequence $299. Price includes physician evaluation.",
      },
      {
        q: "How does The Longevity Agent compare to Ro Body for semaglutide?",
        a: "The Longevity Agent: $129/month for compounded semaglutide + ondansetron. Ro Body: $145/month for equivalent. The Longevity Agent saves ~11% vs Ro Body and up to 57% vs Henry Meds.",
      },
    ],
  },

  // ─── LONGEVITY SGLT2 (both — WAITLIST) ─────────────────────────────────────
  {
    id: "longevity-sglt2",
    name: "Longevity SGLT2",
    tagline: "The geroscience drug class Barzilai ranks #1.",
    color: "#ec4899",
    accentText: "#fbcfe8",
    forGender: "both",
    ourPrice: null,
    competitorPrice: null,
    waitlist: true,
    badge: "Waitlist",
    medications: [
      { name: "Dapagliflozin", dose: "10mg daily" },
      { name: "Acarbose", dose: "25–50mg with meals" },
      { name: "Magnesium", dose: "Prescription-grade" },
    ],
    description:
      "SGLT2 inhibitors were developed for type 2 diabetes but have shown stunning cardiovascular and renal outcomes in trials independent of glucose control. Nir Barzilai, director of the Institute for Aging Research, has called SGLT2 inhibitors the most promising geroprotective drug class. This stack adds acarbose (glucose spike reduction) and pharmaceutical-grade magnesium for metabolic completeness.",
    scienceBlurb:
      "The DAPA-HF and EMPEROR-Reduced trials showed dapagliflozin reduced hospitalization for heart failure and cardiovascular death in patients with and without diabetes. Emerging geroscience data suggests SGLT2 inhibition may extend healthspan via mechanisms beyond glucose — including reduced inflammation and mitochondrial optimization.",
    heroStats: [
      { label: "Status", value: "Waitlist" },
      { label: "Class", value: "SGLT2 inhibitor" },
      { label: "Evidence", value: "Tier 1" },
      { label: "Medications", value: "3" },
    ],
    faqs: [
      {
        q: "Why is this on a waitlist?",
        a: "We're finalizing pharmacy sourcing and clinical protocol. We expect to launch this stack in the coming months. Join the waitlist to be notified at launch.",
      },
      {
        q: "Why does Barzilai rank SGLT2s so highly?",
        a: "SGLT2 inhibitors have shown robust real-world cardiovascular and renal benefits in multiple large trials — benefits that appear independent of their glucose-lowering mechanism, suggesting a broader geroprotective effect.",
      },
      {
        q: "Can I take this with Longevity Base?",
        a: "Yes. SGLT2 and rapamycin/metformin operate via distinct mechanisms. Combination use is being studied and is common in longevity-focused practices.",
      },
    ],
  },
];

// ─── Accessors ─────────────────────────────────────────────────────────────────

export function getAllStacks(): Stack[] {
  return STACKS;
}

export function getStack(id: string): Stack | undefined {
  return STACKS.find((s) => s.id === id);
}

export function getStacksByGender(gender: "men" | "women"): Stack[] {
  return STACKS.filter((s) => s.forGender === gender || s.forGender === "both");
}

export function getMensStacks(): Stack[] {
  return getStacksByGender("men");
}

export function getWomensStacks(): Stack[] {
  return getStacksByGender("women");
}

export function stackSavingsPercent(stack: Stack): number | null {
  if (!stack.ourPrice || !stack.competitorPrice) return null;
  return Math.round(((stack.competitorPrice - stack.ourPrice) / stack.competitorPrice) * 100);
}

export function formatStackPrice(price: number | null): string {
  if (price === null) return "{{PRICE}}";
  return `$${price}`;
}
