export type Product = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  ourPrice: number;
  competitorPrice: number;
  lowestCompetitor: string; // named competitor for the competitorPrice
  billing: string; // "month" | "month (3-month supply)" etc.
  forGender: "men" | "women" | "both";
  heroStats: { label: string; value: string }[];
  whatYouGet: string[];
  howItWorks: string;
  scienceBlurb: string;
  faqs: { q: string; a: string }[];
  relatedSlugs: string[];
};

const PRODUCTS: Product[] = [
  {
    slug: "ldn",
    name: "Low Dose Naltrexone (LDN)",
    category: "Immune / Inflammation",
    tagline: "Immune modulation and inflammation control. Most popular starter protocol.",
    description:
      "Low dose naltrexone (1.5–4.5mg nightly) is one of the most cost-effective interventions in longevity medicine. At sub-therapeutic doses, LDN transiently blocks opioid receptors, triggering a rebound increase in endorphin production and down-regulating inflammatory cytokines. Used by longevity physicians for autoimmune conditions, chronic fatigue, and general immune optimization.",
    ourPrice: 19,
    competitorPrice: 25,
    lowestCompetitor: "AgelessRx",
    billing: "month",
    forGender: "both",
    heroStats: [
      { label: "Our price", value: "$19/mo" },
      { label: "AgelessRx", value: "$25/mo" },
      { label: "You save", value: "24%" },
      { label: "Rx review", value: "24–48 hrs" },
    ],
    whatYouGet: [
      "Physician evaluation and prescription",
      "LDN 1.5–4.5mg capsules (30-day supply)",
      "Dispensed by licensed U.S. compounding pharmacy",
      "Secure messaging with your physician",
      "Annual renewal included",
    ],
    howItWorks:
      "Taken nightly before bed. Standard starting dose is 1.5mg, titrating up to 4.5mg over 4–6 weeks. Most patients notice changes in sleep quality and energy within 2–4 weeks.",
    scienceBlurb:
      "LDN's mechanism centers on transient opioid receptor blockade. This brief blockade triggers a compensatory upregulation of endogenous opioids (endorphins/enkephalins) and modulates microglial activation — the brain's primary inflammatory cells. Multiple peer-reviewed studies support its use in fibromyalgia, Crohn's disease, MS, and chronic pain.",
    faqs: [
      {
        q: "Is LDN FDA-approved?",
        a: "Naltrexone at 50mg is FDA-approved for opioid and alcohol use disorder. LDN (low dose) is prescribed off-label, which is standard practice — the same medication, a fraction of the dose.",
      },
      {
        q: "Will LDN interact with other medications?",
        a: "LDN has interactions with opioid medications (they should not be combined). Your physician will review your medication list during intake.",
      },
      {
        q: "How soon will I notice effects?",
        a: "Most patients report changes in sleep and energy within 2–4 weeks. Anti-inflammatory effects may take 6–8 weeks to fully develop.",
      },
    ],
    relatedSlugs: ["mens-essentials", "longevity-stack"],
  },
  {
    slug: "mens-essentials",
    name: "Men's Essentials",
    category: "Cardiovascular + Metabolic",
    tagline: "The four-drug longevity stack most men's health doctors prescribe. One price.",
    description:
      "A bundled protocol of the four medications most commonly prescribed by longevity physicians for cardiovascular protection, metabolic health, and quality of life: a statin (atorvastatin), low-dose aspirin, a PDE5 inhibitor (tadalafil), and finasteride. Individually these run $149+ at other clinics. We bundle them for $25/month.",
    ourPrice: 25,
    competitorPrice: 65,
    lowestCompetitor: "Hims (finasteride + tadalafil)",
    billing: "month",
    forGender: "men",
    heroStats: [
      { label: "Our price", value: "$25/mo" },
      { label: "Hims", value: "$65/mo" },
      { label: "You save", value: "62%" },
      { label: "Medications", value: "4" },
    ],
    whatYouGet: [
      "Atorvastatin 20mg (cholesterol/CV protection)",
      "Low-dose aspirin 81mg (cardiovascular)",
      "Tadalafil 5mg daily (ED + cardiovascular)",
      "Finasteride 1mg (hair preservation)",
      "Physician evaluation and annual renewal",
    ],
    howItWorks:
      "All four medications are taken daily. Your physician reviews your intake questionnaire, approves the protocol, and can adjust individual components based on your history.",
    scienceBlurb:
      "Statins reduce LDL and cardiovascular events in high-risk individuals. Low-dose aspirin provides antiplatelet protection. Daily tadalafil is as effective as on-demand dosing for ED and has emerging data on cardiovascular benefits. Finasteride is the gold standard for male pattern hair loss prevention.",
    faqs: [
      {
        q: "Do I need labs to start?",
        a: "Not required to start. We recommend a basic lipid panel and liver enzymes within the first 90 days on statins. Your physician will advise.",
      },
      {
        q: "Can I customize the bundle?",
        a: "Yes. During intake you can indicate which components you want. Your physician may adjust based on your medical history.",
      },
      {
        q: "What if I'm already taking one of these?",
        a: "Note it in your intake form. We'll coordinate to avoid duplication and ensure safe dosing.",
      },
    ],
    relatedSlugs: ["trt", "enclomiphene", "dutasteride"],
  },
  {
    slug: "womens-essentials",
    name: "Women's Essentials",
    category: "Cardiovascular + Metabolic",
    tagline: "The core protocol for women's longevity. Cardiovascular, metabolic, and bone health.",
    description:
      "A bundled protocol for women optimized for cardiovascular protection, metabolic health, and bone density: atorvastatin, low-dose aspirin, and vitamin D3/K2 at therapeutic doses. Designed for women in their 30s–50s who want the same science-backed preventive approach their male counterparts use, priced fairly.",
    ourPrice: 29,
    competitorPrice: 55,
    lowestCompetitor: "Nurx",
    billing: "month",
    forGender: "women",
    heroStats: [
      { label: "Our price", value: "$29/mo" },
      { label: "Nurx", value: "$55/mo" },
      { label: "You save", value: "47%" },
      { label: "Medications", value: "3" },
    ],
    whatYouGet: [
      "Atorvastatin 20mg (cardiovascular protection)",
      "Low-dose aspirin 81mg (cardiovascular)",
      "Prescription-strength vitamin D3/K2",
      "Physician evaluation and annual renewal",
      "Secure messaging with your physician",
    ],
    howItWorks:
      "Daily medications taken in the morning. Your physician reviews your intake, approves or adjusts the protocol, and checks in annually.",
    scienceBlurb:
      "Women have lower baseline cardiovascular risk pre-menopause, but risk equalizes post-menopause. Early preventive intervention with statins and low-dose aspirin has strong evidence for long-term benefit. Vitamin D3/K2 supports bone density and immune function.",
    faqs: [
      {
        q: "Is this different from HRT?",
        a: "Yes. Women's Essentials is a cardiovascular and metabolic prevention protocol. Women's HRT addresses hormone decline specifically. They can be combined.",
      },
      {
        q: "Should I take this if I'm premenopausal?",
        a: "Your physician will evaluate your individual risk profile. Statins are typically started based on cardiovascular risk score, not age alone.",
      },
    ],
    relatedSlugs: ["womens-hrt", "ldn", "glp1"],
  },
  {
    slug: "dutasteride",
    name: "Dutasteride",
    category: "Hair Preservation",
    tagline: "More effective than finasteride for hair preservation. Same mechanism, stronger effect.",
    description:
      "Dutasteride inhibits both type I and type II 5-alpha reductase (finasteride only inhibits type II), resulting in a ~90% reduction in scalp DHT vs ~70% with finasteride. Clinical trials show superior hair preservation outcomes. For men who want the most effective pharmaceutical approach to hair loss.",
    ourPrice: 35,
    competitorPrice: 85,
    lowestCompetitor: "Keeps",
    billing: "month",
    forGender: "men",
    heroStats: [
      { label: "Our price", value: "$35/mo" },
      { label: "Keeps", value: "$85/mo" },
      { label: "DHT reduction", value: "~90%" },
      { label: "vs finasteride", value: "~70%" },
    ],
    whatYouGet: [
      "Dutasteride 0.5mg capsules (30-day supply)",
      "Physician evaluation and prescription",
      "Dispensed from licensed U.S. pharmacy",
      "Annual renewal",
    ],
    howItWorks:
      "One capsule daily. Effects on hair loss typically observed at 3–6 months. Full benefit at 12 months. Long half-life means missed doses have minimal impact.",
    scienceBlurb:
      "Dutasteride's dual inhibition of 5-alpha reductase types I and II produces more complete DHT suppression than finasteride. A 2010 head-to-head trial showed statistically superior hair count outcomes at 24 weeks. It is FDA-approved for BPH and prescribed off-label for androgenic alopecia.",
    faqs: [
      {
        q: "How does dutasteride compare to finasteride?",
        a: "Dutasteride is more potent — it blocks both isoforms of 5-alpha reductase vs finasteride's one. It produces greater DHT reduction and, in head-to-head trials, better hair preservation.",
      },
      {
        q: "What are the side effects?",
        a: "The same class-effect profile as finasteride: reduced libido, ejaculation changes, and breast tenderness in a small minority of users. Your physician will discuss your risk profile during intake.",
      },
      {
        q: "Can I combine this with minoxidil?",
        a: "Yes. Dutasteride and minoxidil work via different mechanisms and are commonly combined for maximum effect.",
      },
    ],
    relatedSlugs: ["mens-essentials", "trt"],
  },
  {
    slug: "enclomiphene",
    name: "Enclomiphene",
    category: "Testosterone Optimization",
    tagline: "Raise testosterone naturally. Preserves fertility. No injections.",
    description:
      "Enclomiphene is a selective estrogen receptor modulator (SERM) that stimulates the pituitary to produce more LH and FSH, which signal the testes to produce more testosterone — endogenously, without exogenous testosterone. Unlike TRT, enclomiphene preserves fertility and testicular function. Ideal for men with low-normal testosterone who want optimization without suppressing their natural axis.",
    ourPrice: 59,
    competitorPrice: 149,
    lowestCompetitor: "Defy Medical",
    billing: "month",
    forGender: "men",
    heroStats: [
      { label: "Our price", value: "$59/mo" },
      { label: "Defy Medical", value: "$149/mo" },
      { label: "Fertility", value: "Preserved" },
      { label: "Injections", value: "None" },
    ],
    whatYouGet: [
      "Enclomiphene 12.5–25mg capsules (30-day supply)",
      "Physician evaluation and baseline testosterone review",
      "Follow-up bloodwork interpretation",
      "Annual renewal",
    ],
    howItWorks:
      "Taken daily or every other day depending on your physician's protocol. Most patients see testosterone increases within 4–6 weeks. Bloodwork at 8 weeks confirms response.",
    scienceBlurb:
      "Enclomiphene is the trans isomer of clomiphene. Unlike racemic clomiphene (Clomid), it lacks the estrogenic zuclomiphene isomer, producing cleaner testosterone stimulation with fewer visual side effects. Phase 3 trials demonstrated statistically significant T increases and maintained spermatogenesis.",
    faqs: [
      {
        q: "How is this different from TRT?",
        a: "TRT replaces testosterone from outside the body — effective but it suppresses your natural production and fertility. Enclomiphene stimulates your own system to produce more testosterone, preserving fertility and testicular size.",
      },
      {
        q: "Do I need bloodwork first?",
        a: "We recommend a baseline testosterone panel before starting. Your physician will guide you through what to order and how to interpret results.",
      },
      {
        q: "Can I switch to TRT later?",
        a: "Yes. Some patients use enclomiphene as a first step and move to TRT if response is insufficient or if fertility is no longer a concern.",
      },
    ],
    relatedSlugs: ["trt", "mens-essentials"],
  },
  {
    slug: "longevity-stack",
    name: "Longevity Stack",
    category: "Rapamycin + Metformin",
    tagline: "The two most evidence-backed longevity drugs. One protocol.",
    description:
      "The protocol most longevity physicians use themselves: weekly rapamycin (mTOR inhibitor, the most consistently life-extending drug in animal models) combined with daily metformin (AMPK activator, CV and metabolic benefits). This is the Bryan Johnson / Peter Attia protocol — available without the $30,000/year clinic fee.",
    ourPrice: 59,
    competitorPrice: 100,
    lowestCompetitor: "Healthspan",
    billing: "month",
    forGender: "both",
    heroStats: [
      { label: "Our price", value: "$59/mo" },
      { label: "Healthspan", value: "$100/mo" },
      { label: "You save", value: "41%" },
      { label: "Drugs", value: "2" },
    ],
    whatYouGet: [
      "Rapamycin 2–6mg weekly (physician-determined dose)",
      "Metformin 500–1000mg daily (extended release available)",
      "Physician evaluation and prescription",
      "Annual protocol review",
    ],
    howItWorks:
      "Rapamycin is taken once weekly. Metformin is taken with dinner daily. Your physician determines starting doses based on your age, weight, and health history.",
    scienceBlurb:
      "Rapamycin is the only drug to consistently extend lifespan in multiple mammalian species. It inhibits mTORC1, a master regulator of cellular growth and autophagy. Metformin activates AMPK, mimicking some effects of caloric restriction. The TAME trial is actively studying metformin as a geroprotective agent in humans.",
    faqs: [
      {
        q: "Is rapamycin safe at low doses?",
        a: "At doses used for longevity (2–6mg weekly), rapamycin's immunosuppressive effects are minimal. Longevity physicians have used this protocol in thousands of patients. Your physician will review contraindications.",
      },
      {
        q: "Does metformin blunt exercise adaptation?",
        a: "Some data suggests metformin may modestly reduce mitochondrial adaptation to resistance training. Your physician can advise on timing relative to workouts, or prescribe on non-training days.",
      },
      {
        q: "Who is this NOT for?",
        a: "Rapamycin is contraindicated in active infection, pregnancy, and certain immunocompromised states. Metformin is contraindicated in significant kidney disease. Your physician reviews all of this during intake.",
      },
    ],
    relatedSlugs: ["ldn", "mens-essentials", "womens-essentials"],
  },
  {
    slug: "trt",
    name: "Testosterone Replacement Therapy (TRT)",
    category: "Hormone Replacement",
    tagline: "Full TRT protocol. Injectable or topical. Managed by a real physician.",
    description:
      "Testosterone replacement therapy for men with clinically low testosterone (hypogonadism) or age-related decline. We prescribe testosterone cypionate (injectable) or testosterone gel/cream, with ongoing physician monitoring. No \"testosterone clinic\" markup — straightforward prescription at a fair price.",
    ourPrice: 79,
    competitorPrice: 99,
    lowestCompetitor: "TRT Nation",
    billing: "month",
    forGender: "men",
    heroStats: [
      { label: "Our price", value: "$79/mo" },
      { label: "TRT Nation", value: "$99/mo" },
      { label: "You save", value: "20%" },
      { label: "Delivery", value: "Injectable or topical" },
    ],
    whatYouGet: [
      "Testosterone cypionate 100–200mg/week (injectable) or testosterone cream/gel",
      "Physician evaluation and baseline bloodwork review",
      "Anastrozole (aromatase inhibitor) if indicated",
      "HCG protocol available to preserve testicular function",
      "Quarterly bloodwork interpretation",
      "Annual renewal",
    ],
    howItWorks:
      "Most patients start with 100mg/week testosterone cypionate (self-injected subcutaneously or intramuscularly). Your physician sets your protocol and adjusts at 8-week bloodwork follow-up.",
    scienceBlurb:
      "Testosterone replacement restores serum testosterone to physiological ranges. Benefits include improved body composition, bone density, libido, mood, and energy. Long-term cardiovascular safety data from the TRAVERSE trial (2023) showed no increased cardiovascular events in TRT users vs placebo.",
    faqs: [
      {
        q: "Do I need bloodwork before starting?",
        a: "Yes — TRT requires a baseline testosterone panel (total T, free T, LH, FSH, estradiol, hematocrit, PSA). We'll guide you through getting labs near you.",
      },
      {
        q: "Will TRT affect my fertility?",
        a: "Exogenous testosterone suppresses sperm production in most men. If fertility preservation is a concern, ask about enclomiphene or HCG co-administration.",
      },
      {
        q: "How often do I need to inject?",
        a: "Most protocols are 1–2x per week. Subcutaneous injections with an insulin syringe are nearly painless and take under 2 minutes.",
      },
    ],
    relatedSlugs: ["enclomiphene", "mens-essentials", "dutasteride"],
  },
  {
    slug: "womens-hrt",
    name: "Women's HRT",
    category: "Hormone Replacement",
    tagline: "Bioidentical hormone therapy. Perimenopause, menopause, and beyond.",
    description:
      "Bioidentical hormone replacement therapy for women experiencing perimenopause or menopause. We prescribe estradiol (patch, gel, or oral), progesterone (micronized), and testosterone where indicated. The WHI study that scared a generation off HRT used synthetic progestins — bioidentical hormones have a substantially different safety profile.",
    ourPrice: 79,
    competitorPrice: 89,
    lowestCompetitor: "Winona",
    billing: "month",
    forGender: "women",
    heroStats: [
      { label: "Our price", value: "$79/mo" },
      { label: "Winona", value: "$89/mo" },
      { label: "You save", value: "11%" },
      { label: "Form", value: "Patch, gel, or oral" },
    ],
    whatYouGet: [
      "Estradiol (patch, gel, or oral — physician's recommendation)",
      "Micronized progesterone (for women with a uterus)",
      "Testosterone cream at physiological doses (if indicated)",
      "Physician evaluation and hormone panel review",
      "Semi-annual follow-up included",
    ],
    howItWorks:
      "Your physician reviews your symptom profile and hormone panel, then recommends an appropriate regimen. Most patients start with transdermal estradiol and oral progesterone. Adjustments are made based on symptom response at 6–8 weeks.",
    scienceBlurb:
      "Modern HRT guidelines from the Menopause Society and British Menopause Society support bioidentical hormone therapy as safe and effective for most women under 60 or within 10 years of menopause onset. Transdermal estradiol avoids first-pass hepatic metabolism, reducing clotting risk compared to oral estrogen.",
    faqs: [
      {
        q: "Is bioidentical HRT safer than synthetic HRT?",
        a: "The evidence increasingly supports bioidentical (body-identical) hormones — particularly transdermal estradiol and micronized progesterone — as having a better safety profile than the synthetic versions studied in the 2002 WHI trial.",
      },
      {
        q: "Do I need to be in menopause to start?",
        a: "No. Many women start HRT during perimenopause to manage symptoms. Your physician will evaluate your hormone levels and symptom profile.",
      },
      {
        q: "Will HRT affect my cancer risk?",
        a: "Current evidence shows no increased breast cancer risk with estrogen-only HRT, and minimal increase with combined estradiol/progesterone in the first 5 years. Your physician will review your personal and family history.",
      },
    ],
    relatedSlugs: ["womens-essentials", "ldn", "glp1"],
  },
  {
    slug: "glp1",
    name: "GLP-1 (Semaglutide / Tirzepatide)",
    category: "Weight Management",
    tagline: "FDA-approved weight loss medication. We charge what it actually costs.",
    description:
      "GLP-1 receptor agonists (semaglutide, tirzepatide) are the most effective weight loss medications ever studied, producing 15–22% body weight reduction in clinical trials. We prescribe compounded semaglutide and tirzepatide at a fraction of what weight loss clinics charge. Same active ingredient, same mechanism, dramatically lower cost.",
    ourPrice: 129,
    competitorPrice: 145,
    lowestCompetitor: "Ro Body",
    billing: "month",
    forGender: "both",
    heroStats: [
      { label: "Our price", value: "$129/mo" },
      { label: "Ro Body", value: "$145/mo" },
      { label: "You save", value: "11%" },
      { label: "Weight loss", value: "15–22%" },
    ],
    whatYouGet: [
      "Compounded semaglutide or tirzepatide (weekly injection)",
      "Physician evaluation and prescription",
      "Titration protocol (starting dose to maintenance)",
      "Anti-nausea medication for first 4 weeks (if needed)",
      "Ongoing physician access",
      "Annual renewal",
    ],
    howItWorks:
      "Weekly subcutaneous injection, self-administered with an insulin syringe. Start at a low dose to minimize GI side effects, titrate up over 8–12 weeks to your target dose.",
    scienceBlurb:
      "GLP-1 agonists work by slowing gastric emptying, reducing appetite signals in the hypothalamus, and improving insulin sensitivity. The SURMOUNT-1 trial showed tirzepatide producing up to 22.5% body weight reduction at 72 weeks. Cardiovascular outcome data from the SUSTAIN and SELECT trials shows reduced MACE in high-risk patients.",
    faqs: [
      {
        q: "What's the difference between semaglutide and tirzepatide?",
        a: "Semaglutide targets GLP-1 receptors only. Tirzepatide is a dual GLP-1/GIP agonist. Head-to-head trials show tirzepatide produces greater average weight loss. Your physician will recommend based on your goals and tolerance.",
      },
      {
        q: "Is compounded semaglutide the same as brand-name semaglutide?",
        a: "Compounded semaglutide contains the same active ingredient and is produced by licensed 503A compounding pharmacies under state pharmacy board oversight. Compounded medications are not FDA-approved drug products. Your provider will discuss whether compounded semaglutide is appropriate for you.",
      },
      {
        q: "What are the side effects?",
        a: "Nausea, constipation, and reduced appetite are most common, especially during titration. These improve significantly after 4–6 weeks. Rare but serious side effects include pancreatitis — your physician will screen for risk.",
      },
      {
        q: "Will I gain the weight back if I stop?",
        a: "Weight typically returns over 1–2 years after stopping. GLP-1s work best as a long-term tool, not a short-term fix. Your physician will discuss maintenance strategies.",
      },
    ],
    relatedSlugs: ["longevity-stack", "womens-essentials", "mens-essentials"],
  },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByGender(gender: "men" | "women"): Product[] {
  return PRODUCTS.filter(
    (p) => p.forGender === gender || p.forGender === "both"
  );
}

export function savingsPercent(ourPrice: number, competitorPrice: number): number {
  return Math.round(((competitorPrice - ourPrice) / competitorPrice) * 100);
}
