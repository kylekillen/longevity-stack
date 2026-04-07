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
    slug: "rosuvastatin-the-statin-worth-taking",
    title: "Rosuvastatin: Why This Statin Is Worth Taking at Any Age",
    date: "2026-04-04",
    excerpt:
      "Statins are among the most studied drugs in history. Rosuvastatin has the best LDL reduction per mg and the strongest cardiovascular evidence. Here's what the data actually shows.",
    readTime: "7 min",
    category: "Medications",
    content: `
Statins are the most prescribed drug class in the United States, and the most misunderstood. Rosuvastatin (Crestor) is the most potent statin per milligram, with the best LDL reduction and the most favorable side effect profile.

## What rosuvastatin does

Rosuvastatin inhibits HMG-CoA reductase, the enzyme that controls cholesterol synthesis in the liver. This reduces LDL ("bad") cholesterol, reduces triglycerides, and raises HDL. At 10mg daily — a standard moderate dose — it reduces LDL by 45–55%.

But the case for statins isn't just about cholesterol numbers. Statins also have pleiotropic effects: anti-inflammatory, antioxidant, and endothelial-stabilizing properties that contribute to cardiovascular benefit beyond LDL reduction.

## The evidence base

Statins have been studied in over 200,000 patients in randomized controlled trials. Rosuvastatin specifically was the subject of the JUPITER trial — a landmark study showing a 44% reduction in cardiovascular events in people with normal LDL but elevated inflammation markers.

The evidence for primary prevention (people without existing heart disease) is as strong as any drug in medicine. Most longevity physicians start discussing statins with patients in their 40s.

## The muscle myth

The most common concern: statin-induced muscle pain (myopathy). This does occur, but clinical trial rates are much lower than the rates reported in the general population — suggesting a significant nocebo effect (side effects that occur because you expect them).

Severe statin-induced muscle damage (rhabdomyolysis) is rare at standard doses. If you experience muscle pain on a statin, your physician can adjust dose, switch to a different statin, or check CoQ10 levels.

## Why rosuvastatin specifically

Rosuvastatin is water-soluble (unlike lipophilic statins like atorvastatin), which limits muscle penetration and may explain its lower myopathy rate. It's also not metabolized via CYP3A4, reducing drug interactions. It's generic, inexpensive, and well-studied.

## Who should consider it

Most adults over 40 with any cardiovascular risk factor. Longevity physicians often use the ASCVD risk calculator alongside inflammatory markers (hsCRP) to determine appropriateness. Your physician reviews your history and current medications before prescribing.
    `.trim(),
  },
  {
    slug: "tadalafil-not-just-for-ed",
    title: "Tadalafil: Not Just for ED — The Cardiovascular and Longevity Case",
    date: "2026-04-01",
    excerpt:
      "Tadalafil is one of the most overlooked drugs in cardiovascular and longevity medicine. Its mechanism goes well beyond what it was FDA-approved for.",
    readTime: "6 min",
    category: "Medications",
    content: `
Tadalafil (Cialis) is FDA-approved for erectile dysfunction and benign prostatic hyperplasia. But its mechanism — PDE5 inhibition — has effects throughout the vascular system that make it one of the most interesting drugs in preventive medicine.

## How tadalafil works

PDE5 (phosphodiesterase type 5) degrades cyclic GMP (cGMP) in smooth muscle cells. Inhibiting PDE5 allows cGMP to accumulate, which causes smooth muscle relaxation and vasodilation. In the penis, this enables erections. In the cardiovascular system, this reduces arterial stiffness, lowers blood pressure, and improves endothelial function.

Tadalafil also reduces pulmonary arterial pressure — so effectively that high-dose tadalafil (Adcirca) is FDA-approved for pulmonary arterial hypertension.

## The cardiovascular evidence

Multiple studies show that PDE5 inhibitors improve endothelial function, reduce inflammation, and have protective effects in cardiovascular disease. Regular low-dose tadalafil (5mg daily) has been shown to:

- Reduce arterial stiffness
- Improve exercise tolerance in men with cardiovascular disease
- Lower inflammatory markers
- Improve microvascular function

Observational data suggests men who regularly use PDE5 inhibitors have lower rates of cardiovascular mortality — though causation is difficult to establish in these populations.

## Daily low-dose vs. as-needed

For longevity applications, low-dose daily tadalafil (2.5–5mg) is preferred over as-needed higher doses. The continuous low-level PDE5 inhibition provides persistent vascular benefits. The as-needed approach produces cardiovascular effects only around the time of dosing.

## Women and tadalafil

PDE5 expression in women is similar to men. Tadalafil improves genital blood flow and sexual function in women. For cardiovascular and longevity applications, the mechanism is sex-nonspecific. We include tadalafil as an optional component of the Core Cardio stack with physician guidance.

## Who's a candidate

Most adults over 40 without contraindications (particularly avoiding concurrent nitrate use, which can cause dangerous hypotension). Your physician reviews your medications and history before prescribing.
    `.trim(),
  },
  {
    slug: "finasteride-vs-dutasteride-for-hair-loss",
    title: "Finasteride vs Dutasteride for Male Hair Loss: The Evidence",
    date: "2026-03-31",
    excerpt:
      "Both block DHT. Dutasteride is more potent. Here's what the clinical data shows and how to think about choosing between them.",
    readTime: "6 min",
    category: "Men's Health",
    content: `
Male pattern hair loss (androgenetic alopecia) is driven primarily by dihydrotestosterone (DHT) — a potent androgen derived from testosterone via the enzyme 5-alpha reductase. Blocking DHT production is the most effective pharmacological approach to slowing and reversing this type of hair loss.

## How both drugs work

Finasteride inhibits type 2 5-alpha reductase, reducing serum DHT by approximately 70%. Dutasteride inhibits both type 1 and type 2 5-alpha reductase, reducing serum DHT by approximately 90%.

More DHT reduction = more effective hair preservation and regrowth. The clinical evidence bears this out.

## The clinical data

Finasteride at 1mg daily is FDA-approved for male pattern hair loss. In clinical trials, it halted hair loss progression in ~85% of men and produced visible regrowth in ~65% at 2 years.

Dutasteride at 0.5mg daily is approved for BPH (benign prostatic hyperplasia) and is used off-label for hair loss. Head-to-head studies consistently show dutasteride outperforms finasteride for hair regrowth, with some trials showing 20–30% more hair count increase.

## Side effects

Both drugs carry the same class of side effects (sexual side effects — reduced libido, erectile dysfunction, ejaculatory changes) due to DHT reduction. The reported rates in clinical trials are low (1–5%) and reversible upon discontinuation in most cases.

The "post-finasteride syndrome" — persistent side effects after stopping — is controversial and not well-established in the literature, though a subset of men do report ongoing effects.

Dutasteride's longer half-life (5 weeks vs. ~6 hours for finasteride) means it persists longer if you stop — relevant if you experience side effects and want to discontinue.

## Oral minoxidil as an add-on

Both finasteride and dutasteride work best when combined with minoxidil, which acts via a different mechanism (stimulating hair follicle growth factors). Oral minoxidil at low doses (0.625–2.5mg daily) is more effective than topical and is now the preferred formulation for most longevity physicians.

## Who is Hair Pro (dutasteride) for?

Men who want maximum hair preservation, are comfortable with slightly stronger DHT suppression, and may not be planning fertility in the near term (DHT plays a role in male fertility — finasteride and dutasteride both suppress it, with dutasteride having a greater and longer-lasting effect).
    `.trim(),
  },
  {
    slug: "oral-minoxidil-for-hair-loss",
    title: "Oral Minoxidil: Why the Pill Version Outperforms the Foam",
    date: "2026-03-28",
    excerpt:
      "Low-dose oral minoxidil is now the preferred formulation for hair loss. It's more effective, easier to use, and doesn't require you to remember to apply anything to your scalp.",
    readTime: "5 min",
    category: "Medications",
    content: `
Topical minoxidil (Rogaine) has been used for hair loss since the 1980s. It works. But most people don't apply it consistently, and some don't respond to the topical form well.

Low-dose oral minoxidil — typically 0.625–2.5mg for women, 2.5–5mg for men — is now supported by growing evidence as a more effective and more convenient alternative.

## How minoxidil works

Minoxidil is a potassium channel opener and vasodilator. Its original indication was oral use for severe hypertension — hair growth was observed as a side effect. The mechanism for hair growth isn't fully understood but involves increased blood flow to hair follicles, prolonged anagen (growth) phase, and upregulation of growth factors including VEGF and HGF.

## Why oral beats topical

Several head-to-head studies now show oral minoxidil produces greater hair count increases than topical minoxidil. A 2022 study in JAMA Dermatology showed similar or superior efficacy with better tolerability and adherence.

Topical minoxidil must be applied correctly to the scalp, left to dry, and can cause scalp irritation or contact dermatitis. Oral minoxidil circumvents all of this — one pill daily.

## Side effects to know

The main concern with oral minoxidil is systemic vasodilation. At the low doses used for hair loss (much lower than doses for hypertension), cardiovascular effects are minimal in healthy adults. The most common side effect is unwanted facial or body hair growth (hypertrichosis) — more common in women and typically manageable.

Fluid retention can occur in some patients. People with cardiac conditions or taking other antihypertensives should be evaluated carefully before starting.

## Combined with 5-alpha reductase inhibitors

For men with androgenetic alopecia, oral minoxidil is most effective when combined with finasteride or dutasteride. They address different mechanisms: 5-alpha reductase inhibitors block the hormonal driver of loss, while minoxidil stimulates growth. Both our Hair and Hair Pro stacks include low-dose oral minoxidil as the second agent.
    `.trim(),
  },
  {
    slug: "tretinoin-the-gold-standard",
    title: "Tretinoin: The Only Topical That Actually Reverses Skin Aging",
    date: "2026-03-25",
    excerpt:
      "Tretinoin is the only topical skincare ingredient with robust clinical evidence for reversing photoaging. Everything else is trying to be this.",
    readTime: "6 min",
    category: "Medications",
    content: `
The skincare industry generates $200 billion a year selling products that approximate, hint at, or claim inspiration from what tretinoin actually does with clinical evidence.

Tretinoin (all-trans retinoic acid) is a retinoid — a derivative of vitamin A — that directly binds to nuclear retinoic acid receptors and alters gene expression. It is the only topical ingredient with randomized controlled trial evidence for reversing photoaging.

## What the evidence shows

The landmark studies date to the late 1980s and 1990s. Jonathan Weiss, John Voorhees, and others at the University of Michigan published RCT evidence showing tretinoin:

- Stimulates collagen synthesis in the dermis
- Increases epidermal thickness
- Reduces fine wrinkles, mottled hyperpigmentation, and roughness
- Reverses sun damage at the molecular level

This isn't marketing. These were histologically confirmed — biopsies showing actual structural changes in skin.

## How it compares to over-the-counter retinoids

Over-the-counter retinol, retinaldehyde, and retinyl esters must be converted to retinoic acid by enzymes in the skin to have effect. This conversion is inefficient, variable, and incomplete. A 0.05% tretinoin cream delivers retinoic acid directly — no conversion needed. The equivalent effect would require a much higher concentration of retinol, if it's achievable at all.

## Starting tretinoin correctly

Tretinoin causes purging and irritation when started — peeling, redness, dryness. This is normal and represents cellular turnover. Starting with lower concentrations (0.025%) and building up, applying only 2–3 nights per week initially, and using a good moisturizer minimize this.

Most people see meaningful improvements in skin texture and tone within 3–6 months of consistent use. The effects are cumulative and continue to improve with years of use.

## Prescription requirement

Tretinoin is prescription-only in the US. This is not because it's particularly dangerous — it's largely a legacy of the original approval process. Your physician can evaluate and prescribe. We include tretinoin as our Skin stack at a cost that reflects the actual manufacturing cost of the medication, not a dermatologist markup.
    `.trim(),
  },
  {
    slug: "metformin-longevity-drug",
    title: "Metformin as a Longevity Drug: What TAME Is Trying to Prove",
    date: "2026-03-22",
    excerpt:
      "Metformin is the most-prescribed diabetes drug in the world. Longevity researchers think it may have anti-aging effects beyond glucose control. Here's the evidence and the ongoing trial.",
    readTime: "8 min",
    category: "Science",
    content: `
Metformin has been used for type 2 diabetes since the 1950s. It's safe, cheap, off-patent, and in the last decade has become the subject of serious longevity research.

The hypothesis: metformin's effects on AMPK activation, mTOR suppression, and mitochondrial function may have anti-aging effects independent of glucose control.

## The observational data

Multiple large observational studies have found that diabetic patients on metformin have lower rates of cancer, cardiovascular disease, and all-cause mortality compared to diabetics on other medications — and in some analyses, compared to non-diabetic controls not on metformin.

A 2014 study by Bannister et al. found metformin-treated diabetics had lower mortality than matched non-diabetic controls. This is remarkable because diabetics should have worse outcomes — suggesting metformin was providing a mortality benefit that exceeded the diabetes penalty.

These are observational studies with confounders, but the consistency across datasets is notable.

## The mechanism

Metformin's primary mechanism is inhibiting complex I of the mitochondrial electron transport chain, reducing hepatic glucose production. But it also:

- Activates AMPK (the cellular energy sensor and mTOR inhibitor)
- Suppresses mTORC1 (the longevity pathway also targeted by rapamycin)
- Reduces circulating IGF-1
- Has anti-inflammatory properties

The AMPK/mTOR pathway overlap with rapamycin's mechanism is why metformin and rapamycin are often co-prescribed in longevity protocols — they hit overlapping but complementary targets.

## The TAME trial

TAME (Targeting Aging with Metformin) is a $75 million randomized controlled trial currently underway, funded by the American Federation for Aging Research. It's the first clinical trial designed to test a drug against aging itself — with all-cause mortality and age-related disease incidence as endpoints.

If TAME shows benefit, metformin would be the first drug with RCT evidence for aging as a primary endpoint. Results are expected in the late 2020s.

## Current practice

While TAME is ongoing, many longevity physicians are prescribing metformin to non-diabetic patients based on the observational evidence and favorable safety profile. The typical longevity dose is 500–1000mg once or twice daily — lower than the 2000–2500mg doses used for diabetes.

The main side effect is GI upset (nausea, diarrhea), which is common and usually resolves. Extended-release formulations reduce this. Metformin depletes B12 over time — your physician will monitor this.
    `.trim(),
  },
  {
    slug: "acarbose-the-overlooked-longevity-drug",
    title: "Acarbose: The Overlooked Longevity Drug in the ITP Data",
    date: "2026-03-19",
    excerpt:
      "Acarbose extended lifespan by 22% in male mice in NIA Interventions Testing Program data. It's barely known outside research circles. Here's what it is and why longevity physicians are paying attention.",
    readTime: "6 min",
    category: "Science",
    content: `
The NIA Interventions Testing Program (ITP) is the gold standard for testing potential longevity interventions in mice. Rigorous, replicated across multiple sites. The ITP has tested dozens of compounds. Only a handful have shown significant lifespan extension.

Acarbose is one of them.

## What acarbose does

Acarbose is an alpha-glucosidase inhibitor — it blocks the enzymes in the small intestine that break down complex carbohydrates into glucose. The result: slower glucose absorption, flatter post-meal glucose spikes, and lower peak insulin levels.

It's FDA-approved for type 2 diabetes but rarely prescribed in the US because it requires multiple daily doses (with each meal) and causes significant GI side effects when combined with typical high-carb Western diets (gas, bloating from fermentation of unabsorbed carbohydrates in the colon).

## The ITP data

In ITP testing, acarbose extended median lifespan by 22% in male mice and 5% in female mice. The sex difference may relate to different baseline glucose metabolism between male and female mice.

Importantly, acarbose was most effective when started late — even when initiated in mice equivalent to 65-year-old humans. This "late life" efficacy is relatively unusual and suggests the mechanism isn't just about preventing early damage.

## The mechanism hypothesis

The lifespan benefit may relate to:

1. **Glucose spike reduction**: Postprandial glucose spikes are pro-inflammatory and pro-glycation. Reducing peak levels chronically may reduce cumulative damage.
2. **Caloric restriction mimicry**: By reducing net carbohydrate absorption, acarbose produces a mild caloric restriction effect without dietary change.
3. **Gut microbiome effects**: The unabsorbed carbohydrates feed colonic bacteria, potentially producing beneficial fermentation products.

## Combined with rapamycin and metformin

The ITP combination study of acarbose + rapamycin showed additive lifespan extension. This is the scientific basis for our Longevity Base stack — all three drugs together address different but complementary mechanisms of aging.

## The GI side effects

The caveat: acarbose causes significant gas and bloating on high-carbohydrate diets. Patients who eat moderate-to-low carbohydrate diets tolerate it much better. Your physician will discuss whether your dietary pattern makes acarbose a reasonable fit.
    `.trim(),
  },
  {
    slug: "semaglutide-for-longevity",
    title: "Semaglutide Beyond Weight Loss: The Cardiovascular and Longevity Data",
    date: "2026-03-16",
    excerpt:
      "Semaglutide is known for dramatic weight loss. The SELECT trial showed it reduces cardiovascular events in people without diabetes. The longevity implications are significant.",
    readTime: "7 min",
    category: "Medications",
    content: `
Semaglutide (Wegovy, Ozempic) has dominated health media for its weight loss effects. But the cardiovascular and longevity case extends beyond the scale.

## How GLP-1 agonists work

GLP-1 (glucagon-like peptide-1) is a hormone released from the gut after eating. It stimulates insulin secretion, suppresses glucagon, slows gastric emptying, and signals satiety to the brain. GLP-1 agonists like semaglutide activate GLP-1 receptors throughout the body.

The weight loss mechanism is primarily central — reducing appetite via hypothalamic GLP-1 receptors. But GLP-1 receptors are also found in the heart, kidneys, liver, and brain.

## The SELECT trial

The SELECT trial, published in the New England Journal of Medicine in 2023, was a landmark. 17,600 adults with overweight/obesity and established cardiovascular disease (but without diabetes) were randomized to semaglutide vs placebo.

Results: semaglutide reduced the primary composite outcome (cardiovascular death, non-fatal MI, non-fatal stroke) by 20%. This was statistically significant and clinically meaningful — comparable to the best statin or antihypertensive trials.

This is the first large RCT showing a cardiovascular benefit for a weight loss drug in non-diabetic patients. And the benefit was independent of the degree of weight loss — suggesting direct cardiovascular effects beyond body weight reduction.

## Emerging data on inflammation and neurodegeneration

Ongoing trials are examining semaglutide for non-alcoholic steatohepatitis (NASH), Alzheimer's disease, and Parkinson's disease. GLP-1 receptors in the brain may mediate anti-inflammatory and neuroprotective effects.

Early Parkinson's data is particularly intriguing — a small trial showed slowed disease progression with a GLP-1 agonist.

## The practical reality

Semaglutide injections are weekly. Side effects are primarily GI — nausea, which is why we include ondansetron (an anti-nausea medication) in our Longevity GLP-1 stack. The nausea is worst in the first 4–8 weeks and typically improves with dose titration.

The SELECT trial used 2.4mg weekly (the weight management dose). Many longevity physicians use lower doses for patients whose primary goal isn't weight loss.
    `.trim(),
  },
  {
    slug: "spironolactone-womens-hair-loss",
    title: "Spironolactone for Women's Hair Loss: How It Works and Who It's For",
    date: "2026-03-13",
    excerpt:
      "Spironolactone is the primary pharmacological treatment for androgenetic alopecia in women. Here's the mechanism, the evidence, and how it pairs with oral minoxidil.",
    readTime: "6 min",
    category: "Women's Health",
    content: `
Female pattern hair loss (androgenetic alopecia in women) is driven by androgens — primarily testosterone and dihydrotestosterone — acting on androgen-sensitive follicles. Unlike in men, where DHT is the primary driver and 5-alpha reductase inhibitors (finasteride, dutasteride) are the treatment, women's hair loss is better treated with androgen receptor blockers.

Spironolactone is the most commonly prescribed drug for this in women.

## How spironolactone works

Spironolactone is a mineralocorticoid receptor antagonist (primarily used for blood pressure and heart failure) that also acts as an androgen receptor antagonist and inhibits androgen synthesis. By blocking androgen receptors in hair follicles, it reduces the DHT-driven miniaturization of follicles that causes pattern hair loss.

It's been used off-label for hair loss in women for decades with good efficacy data.

## The evidence

Studies show spironolactone stabilizes hair loss in the majority of women and produces visible regrowth in many. Doses of 50–200mg daily are used, with most patients seeing effects at 100mg.

It works best when androgen levels are elevated — women with polycystic ovary syndrome (PCOS) or high androgen activity typically respond best. But many women with normal androgen levels also respond.

## Why not finasteride or dutasteride for women?

5-alpha reductase inhibitors are not recommended for premenopausal women due to risk of harm to a male fetus during pregnancy. Postmenopausal women without childbearing potential may be candidates, but spironolactone is generally preferred for premenopausal women with hair loss.

## Combined with oral minoxidil

Like in men, combining spironolactone with oral minoxidil produces better results than either alone. They work via complementary mechanisms — spironolactone addresses the hormonal driver, minoxidil stimulates follicle growth directly. Our Women's Hair stack includes both.

## Side effects

The main concern with spironolactone is hyperkalemia (elevated potassium) — this is a theoretical risk that rarely manifests in healthy young women on typical diets. Other effects include menstrual irregularity (manageable) and, at high doses, breast tenderness. Starting low and titrating reduces side effects.
    `.trim(),
  },
  {
    slug: "sglt2-inhibitors-longevity",
    title: "SGLT2 Inhibitors: The Cardiorenal Drug With Serious Longevity Potential",
    date: "2026-03-10",
    excerpt:
      "SGLT2 inhibitors were developed for diabetes. Their cardiorenal protection data is among the most impressive of any drug class in the last decade — and researchers think the longevity implications go further.",
    readTime: "7 min",
    category: "Science",
    content: `
SGLT2 inhibitors (empagliflozin, dapagliflozin, canagliflozin) were approved for type 2 diabetes management. Their cardiovascular and kidney protection data — accumulated in large outcome trials — has made them one of the most exciting drug classes in medicine.

## How they work

SGLT2 (sodium-glucose cotransporter 2) is a protein in the kidney that reabsorbs glucose from urine back into the bloodstream. SGLT2 inhibitors block this reabsorption, causing excess glucose to be excreted in urine. The result: lower blood glucose, modestly lower blood pressure, and mild caloric deficit (from glucose excretion).

But the mechanisms relevant to longevity extend well beyond glucose lowering.

## The cardiorenal outcome trials

The EMPA-REG OUTCOME trial (empagliflozin, 2015) was a watershed moment. In diabetic patients with cardiovascular disease, empagliflozin reduced:
- Cardiovascular mortality by 38%
- Heart failure hospitalization by 35%
- Progression of kidney disease by 39%

These were drug trial results unlike almost anything seen since statins. Subsequent trials (DAPA-HF, EMPEROR-Reduced) extended the cardiovascular benefit to heart failure patients without diabetes.

The kidney protection data is similarly impressive — multiple trials showing significant reduction in progression to end-stage renal disease.

## The longevity mechanisms

Beyond the trial data, SGLT2 inhibitors appear to:

- Mimic caloric restriction signaling (AMPK activation, mTOR suppression)
- Induce mild ketosis (ketone bodies as a "superfuel" for the heart and brain)
- Reduce visceral fat
- Lower uric acid
- Reduce inflammation markers

These mechanisms overlap with known longevity pathways, leading researchers like Peter Attia and others to view SGLT2 inhibitors as potentially valuable longevity interventions even in non-diabetic patients.

## The evidence gap for non-diabetics

The current evidence base is largely in diabetic or cardiovascular-risk populations. Trials in non-diabetic healthy individuals are limited. This is why our SGLT2 stack is currently in development (waitlist) — we're waiting for the evidence base and clinical protocols to mature before offering it routinely.

The trajectory of the evidence strongly suggests benefit. We expect to offer this stack in 2026.
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
