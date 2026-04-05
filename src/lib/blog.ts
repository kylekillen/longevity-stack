export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  category: string;
  content: string;
};

const POSTS: BlogPost[] = [
  {
    slug: "why-rapamycin-is-the-most-interesting-longevity-drug",
    title: "Why Rapamycin Is the Most Interesting Drug in Longevity Medicine",
    date: "2026-03-28",
    excerpt:
      "Rapamycin is the only drug to consistently extend lifespan in multiple mammalian species. Here's what the science says and why longevity physicians are prescribing it now.",
    readTime: "8 min",
    category: "Science",
    content: `
Rapamycin was discovered in soil samples from Easter Island (Rapa Nui, hence the name) in the 1970s. It was developed as an immunosuppressant for organ transplant patients. Nobody expected it to be the most promising longevity drug we've found.

## The mTOR connection

Rapamycin works by inhibiting mTOR — the mechanistic target of rapamycin. mTOR is a master regulator of cellular growth, metabolism, and aging. When nutrients are abundant, mTOR drives cells to grow and divide. When resources are scarce, mTOR downregulates and cells shift into maintenance and repair mode.

This is why caloric restriction extends lifespan in nearly every organism studied. It's the signal that tells cells to stop growing and start maintaining. Rapamycin mimics that signal chemically.

## The animal data

In 2009, the National Institute on Aging's Interventions Testing Program published a landmark study in *Nature*: rapamycin extended median lifespan in mice by 9–14%, even when treatment began at the mouse equivalent of age 60.

Since then, rapamycin has extended lifespan in flies, worms, yeast, and multiple mouse strains. It's the most robustly lifespan-extending intervention we know of in model organisms.

## What doses are longevity physicians actually using?

Organ transplant patients take rapamycin daily at doses of 2–5mg, with immunosuppression as the goal. Longevity physicians are using much lower doses — typically 1–6mg once weekly — with the goal of mTOR inhibition without meaningful immunosuppression.

At these doses, rapamycin's immunosuppressive effects are minimal. The dosing strategy is sometimes called "intermittent rapamycin" — giving the immune system time to recover between doses while still achieving periodic mTOR inhibition.

## The human data

We don't have a 20-year randomized controlled trial. We may never have one. But:

- A 2014 study at Novartis showed that low-dose rapamycin improved immune function in elderly patients, including improved response to flu vaccination.
- Retrospective data from longevity physicians who have been prescribing rapamycin for 5–10 years shows no alarming safety signals at low intermittent doses.
- The mechanism is well-understood and conserved across species.

## Who is a good candidate?

Rapamycin is most commonly prescribed to people over 40 who are otherwise healthy and want to intervene early on aging biology. It's generally not prescribed to people who are immunocompromised, have active infections, are pregnant, or are on certain other medications.

Your physician will review your complete medical history before prescribing.

## The cost question

Rapamycin is off-patent and generically available. A monthly supply at longevity doses costs a few dollars to manufacture. Most telehealth longevity clinics charge $150–300/month. We charge $59/month as part of our Longevity Stack (rapamycin + metformin combined protocol).

The markup exists because clinics charge for their brand, their positioning, and their concierge service. The medication itself is cheap.
    `.trim(),
  },
  {
    slug: "ldn-the-19-drug-nobody-knows-about",
    title: "LDN: The $19 Drug Nobody Knows About",
    date: "2026-03-21",
    excerpt:
      "Low dose naltrexone is one of the most cost-effective interventions in longevity medicine. It costs $0.30 to compound. Here's why clinics charge 30x that — and why you shouldn't pay it.",
    readTime: "6 min",
    category: "Medications",
    content: `
Naltrexone at 50mg is FDA-approved for opioid and alcohol use disorder. At 1.5–4.5mg — a fraction of the approved dose — it does something completely different. That's low dose naltrexone, or LDN.

## How it works

At standard doses, naltrexone blocks opioid receptors for hours. At low doses, it blocks them briefly — for 4–6 hours — then the block releases. The body responds to this transient blockade by upregulating its own endorphin production and downregulating inflammatory signaling.

The result: higher baseline endorphin levels, reduced microglial activation (the brain's inflammatory cells), and modulation of the immune system toward a less inflammatory state.

## What the evidence shows

LDN has the most evidence in autoimmune and inflammatory conditions:

- **Fibromyalgia**: A Stanford pilot study showed significant reduction in pain scores with LDN vs placebo.
- **Crohn's disease**: Multiple trials showing benefit, including in pediatric patients.
- **Multiple sclerosis**: Early data suggesting reduced fatigue and improved quality of life.
- **Chronic fatigue**: Emerging evidence for LDN's role in ME/CFS.

For general longevity use, LDN is prescribed for its anti-inflammatory and immune-modulating properties, with the hypothesis that chronic low-grade inflammation is a driver of most age-related disease.

## The cost situation

LDN must be compounded — standard pharmacy naltrexone comes in 50mg tablets and can't be split accurately to low doses. Compounding pharmacies produce it in capsule form at precise doses.

The compounding cost is roughly $0.30–0.50 per capsule. A 30-day supply costs about $10–15 to make. Telehealth clinics charge $75–150/month.

We charge $19/month. That covers the physician evaluation, the prescription, and your monthly supply.

## Who it's for

LDN is probably the most broadly applicable drug in longevity medicine. It's safe, cheap, well-tolerated, and has decades of off-label use data. It's commonly prescribed for:

- People with autoimmune conditions or chronic inflammation
- Anyone with chronic fatigue or immune dysregulation
- People looking for a low-risk, low-cost first step into longevity medicine

The main drug interaction is with opioids — you can't take LDN if you're on opioid medications. Otherwise, the side effect profile is minimal.

## The nightly routine

LDN is taken at bedtime. Most physicians start at 1.5mg and titrate up to 4.5mg over 4–6 weeks. Some patients notice sleep changes during titration — vivid dreams are common. These typically resolve within a few weeks.

Most patients who stick with it report improved energy, better sleep quality, and reduced inflammation markers. The effects are subtle but cumulative.
    `.trim(),
  },
  {
    slug: "hrt-the-study-that-scared-a-generation",
    title: "HRT: The Study That Scared a Generation of Women Off a Beneficial Treatment",
    date: "2026-03-14",
    excerpt:
      "The 2002 WHI study caused millions of women to stop or avoid HRT. The study was misrepresented. Here's what the actual evidence says.",
    readTime: "10 min",
    category: "Women's Health",
    content: `
In 2002, the Women's Health Initiative published results showing that hormone replacement therapy increased the risk of breast cancer, blood clots, and cardiovascular events. The results made front pages worldwide. Doctors told their patients to stop HRT immediately. Prescription rates dropped 50% within a year.

The problem: the study's findings were misapplied to women who were nothing like the study participants. The resulting overcorrection may have caused more harm than it prevented.

## What the WHI actually studied

The WHI studied conjugated equine estrogen (from horse urine) plus medroxyprogesterone acetate — a synthetic progestin. These are not the same as bioidentical hormones. They're chemically different, metabolized differently, and have different receptor binding profiles.

The study population had an average age of 63 — 12 years post-menopause. Most modern guidelines recommend starting HRT within 10 years of menopause onset. Starting at 63, after a decade of hormonal deficiency, may have different risks than starting at 52.

## What the evidence actually shows

When you look at the data more carefully:

- **Bioidentical estradiol** (the form we prescribe) does not carry the same thrombotic risk as oral conjugated equine estrogen, particularly when delivered transdermally.
- **Micronized progesterone** (the form we prescribe) has a substantially better safety profile than synthetic progestins like medroxyprogesterone acetate.
- **The timing hypothesis**: Women who start HRT close to menopause onset have better cardiovascular outcomes than those who start late.
- **Estrogen-only HRT** (for women who've had a hysterectomy) showed no increased breast cancer risk in the WHI — only the combined arm did.

The current guidelines from the British Menopause Society, the Menopause Society, and NICE all support HRT as safe and beneficial for most women under 60 or within 10 years of menopause onset.

## What we prescribe

We prescribe bioidentical hormones:

- **Transdermal estradiol** (patch or gel) — bypasses first-pass liver metabolism, lower clotting risk than oral estrogen
- **Micronized progesterone** — body-identical, better breast safety profile than synthetic progestins
- **Low-dose testosterone** — for women where indicated (often improves libido, energy, and mood)

Your physician reviews your personal and family history before prescribing. Women with BRCA mutations, active hormone-sensitive cancer, or other specific risk factors may not be appropriate candidates.

## The case for starting early

The "healthy window" hypothesis suggests that estrogen's cardiovascular benefits are most pronounced when started close to menopause — when estrogen receptors are still primed to respond. Starting HRT after a decade of deficiency may not confer the same benefits.

This is part of why forward-thinking physicians are now recommending HRT conversations at perimenopause, not post-menopause. The earlier intervention may have better outcomes.

## The cost

Women's HRT at most menopause clinics runs $200–350/month, plus consultation fees. We charge $79/month — physician review, prescription, and your monthly supply included.
    `.trim(),
  },
  {
    slug: "enclomiphene-vs-trt",
    title: "Enclomiphene vs TRT: How to Choose",
    date: "2026-03-07",
    excerpt:
      "Both raise testosterone. One works with your body. One replaces it entirely. Here's the practical guide to choosing.",
    readTime: "7 min",
    category: "Men's Health",
    content: `
If you have low testosterone, you have two main pharmaceutical options: testosterone replacement therapy (TRT), which provides testosterone from outside the body, or enclomiphene, which stimulates your body to produce more on its own.

Both are effective. They're right for different people at different life stages.

## How TRT works

TRT delivers exogenous testosterone — usually testosterone cypionate via weekly injection, or a daily cream or gel. Your serum testosterone rises quickly and predictably.

The tradeoff: your hypothalamic-pituitary axis detects the elevated testosterone and shuts down its own production signal. LH and FSH drop. The testes stop being stimulated. Testicular size decreases. Sperm production drops significantly — often to near-zero with standard TRT doses.

TRT is highly effective. Most men feel better within 4–6 weeks. But it's a commitment: once you start, your natural production may take months to recover if you stop.

## How enclomiphene works

Enclomiphene is a selective estrogen receptor modulator (SERM). It blocks estrogen receptors in the hypothalamus, which tricks the brain into thinking estrogen (and by extension, testosterone) is low. The brain responds by increasing GnRH pulses, which stimulates the pituitary to produce more LH and FSH, which signals the testes to produce more testosterone.

The key difference: enclomiphene raises testosterone by stimulating the natural axis. LH and FSH stay elevated. The testes continue working. Sperm production is maintained.

## When TRT makes more sense

- You have primary hypogonadism (testes can't produce testosterone regardless of stimulation)
- Fertility is not a current concern and you want maximum simplicity
- You've tried enclomiphene and didn't respond adequately
- Your testosterone is very low and you want predictable results quickly

## When enclomiphene makes more sense

- You want to preserve fertility
- You're in your 30s or early 40s and prefer to work with your body
- You have secondary hypogonadism (pituitary/hypothalamic issue, not testicular)
- You want to try a less suppressive approach first

## Can you switch?

Yes. Some men use enclomiphene for a few years (especially during family planning) and transition to TRT later. Others try TRT, don't like the suppression or injection protocol, and switch to enclomiphene.

Your physician will recommend based on your labs, age, goals, and fertility concerns.

## The cost

Enclomiphene at most clinics: $150–250/month. Our price: $59/month.
TRT at most clinics: $200–350/month. Our price: $79/month.

Both include physician evaluation, prescription, and monthly medication supply.
    `.trim(),
  },
];

export function getAllPosts(): BlogPost[] {
  return POSTS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export { formatDate };
