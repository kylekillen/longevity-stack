import { getDb } from './db';

export function seedDatabase() {
  const db = getDb();

  const vendorCount = db.prepare('SELECT COUNT(*) as count FROM vendors').get() as { count: number };
  if (vendorCount.count > 0) return;

  // ========== VENDORS (16 total) ==========
  const insertVendor = db.prepare(`
    INSERT INTO vendors (name, slug, url, affiliate_program, commission_rate, feed_type, ships_direct, trust_score, trust_notes, free_shipping_threshold, shipping_base)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const vendors = [
    ['iHerb', 'iherb', 'https://www.iherb.com', 'iHerb Affiliates', 0.10, 'api', 1, 8, 'Direct-ship retailer with rigorous quality control. Ships from climate-controlled warehouses. Extensive catalog with competitive pricing.', 20, 4.99],
    ['Thorne', 'thorne', 'https://www.thorne.com', 'Thorne Direct', 0.15, 'api', 1, 9, 'Physician-grade supplements. NSF Certified for Sport. Direct from manufacturer. Publishes extensive research and third-party testing.', 0, 0],
    ['Life Extension', 'life-extension', 'https://www.lifeextension.com', 'Life Extension Affiliates', 0.10, 'api', 1, 9, 'Premium longevity-focused brand. Heavy investment in research. Ships direct. Extensive third-party testing program.', 25, 5.50],
    ['Nootropics Depot', 'nootropics-depot', 'https://nootropicsdepot.com', 'ND Affiliates', 0.10, 'manual', 1, 9, 'Industry-leading third-party testing. Publishes COAs for every batch. Enthusiast favorite for nootropics and longevity compounds.', 50, 4.99],
    ['Pure Encapsulations', 'pure-encapsulations', 'https://www.pureencapsulations.com', 'ShareASale', 0.08, 'csv', 1, 9, 'Hypoallergenic supplements. Free from common allergens, artificial additives, and unnecessary excipients. Physician-recommended.', 0, 0],
    ['Amazon', 'amazon', 'https://www.amazon.com', 'Amazon Associates', 0.01, 'api', 0, 2, 'Commingled inventory risk. University of Mississippi study found 57% of supplements tested from Amazon failed quality testing. Third-party sellers may sell counterfeit products.', 35, 0],
    ['NOW Foods', 'now-foods', 'https://www.nowfoods.com', 'NOW Affiliates', 0.08, 'csv', 1, 7, 'One of the largest supplement manufacturers. GMP certified facilities. Huge catalog with budget-friendly pricing. Family-owned since 1968.', 50, 5.99],
    ['Jarrow Formulas', 'jarrow', 'https://www.jarrow.com', 'Jarrow Affiliates', 0.08, 'csv', 1, 8, 'Science-focused formulations. Strong emphasis on clinically studied forms of nutrients. Good manufacturing practices and testing.', 0, 0],
    ['Swanson Vitamins', 'swanson', 'https://www.swansonvitamins.com', 'Swanson Affiliates', 0.08, 'csv', 1, 7, 'Value-oriented retailer with extensive catalog. Good quality controls and competitive pricing. Ships from own warehouses.', 25, 4.99],
    ['Vital Proteins', 'vital-proteins', 'https://www.vitalproteins.com', 'Vital Proteins Affiliates', 0.10, 'csv', 1, 7, 'Collagen specialist. NSF Contents Certified. Sourced from grass-fed, pasture-raised bovine. Strong brand recognition.', 25, 0],
    ['Nordic Naturals', 'nordic-naturals', 'https://www.nordicnaturals.com', 'Nordic Naturals Affiliates', 0.10, 'csv', 1, 8, 'Omega-3 specialist. Friend of the Sea certified. Third-party tested for purity. Award-winning fish oil products.', 0, 0],
    ['Momentous', 'momentous', 'https://www.livemomentous.com', 'Momentous Affiliates', 0.12, 'csv', 1, 8, 'Huberman Lab partner brand. NSF Certified for Sport. Third-party tested. Premium pricing but high quality standards.', 0, 0],
    ['Garden of Life', 'garden-of-life', 'https://www.gardenoflife.com', 'GoL Affiliates', 0.08, 'csv', 1, 7, 'Organic and whole-food based supplements. USDA Organic certified. Non-GMO Project Verified. B Corporation.', 25, 5.99],
    ['Bulk Supplements', 'bulk-supplements', 'https://www.bulksupplements.com', 'Bulk Affiliates', 0.08, 'csv', 1, 6, 'No-frills powder supplements. Lab tested for purity. Minimal packaging, maximum value. Limited transparency on sourcing.', 25, 0],
    ['Nutricost', 'nutricost', 'https://www.nutricost.com', 'Nutricost Affiliates', 0.08, 'csv', 1, 6, 'Budget brand with clean formulations. Third-party tested. GMP certified. Good value for common supplements.', 0, 5.99],
    ['Nature\'s Way', 'natures-way', 'https://www.naturesway.com', 'NW Affiliates', 0.08, 'csv', 1, 7, 'Established mass-market brand since 1969. TRU-ID certified for botanical identity. Broad retail distribution.', 25, 5.99],
  ];

  const insertVendors = db.transaction(() => {
    for (const v of vendors) { insertVendor.run(...v); }
  });
  insertVendors();

  // ========== PRODUCTS ==========
  const insertProduct = db.prepare(`
    INSERT INTO products (name, slug, ingredient, ingredient_slug, brand, dose_mg, dose_unit, form, servings_per_container, category, subcategory, description, mechanism, typical_dose, scientific_name, research, interactions, synergies, pathways)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertPrice = db.prepare(`
    INSERT INTO prices (product_id, vendor_id, price, url, affiliate_url, in_stock)
    VALUES (?, ?, ?, ?, ?, 1)
  `);

  const getVendorId = (slug: string) => {
    const v = db.prepare('SELECT id FROM vendors WHERE slug = ?').get(slug) as { id: number } | undefined;
    return v?.id;
  };

  const vid: Record<string, number> = {};
  for (const v of vendors) {
    vid[v[1] as string] = getVendorId(v[1] as string)!;
  }

  const ingredientData = [
    // 1. Quercetin
    {
      ingredient: 'Quercetin', ingredient_slug: 'quercetin', scientific_name: '3,3\',4\',5,7-Pentahydroxyflavone',
      mechanism: 'Induces apoptosis in senescent cells by inhibiting pro-survival pathways (PI3K/AKT, BCL-2 family). Also inhibits COX-2, NF-kB, and MAPK inflammatory pathways.',
      typical_dose: '500-1000 mg/day', subcategory: 'senolytic',
      pathways: ['senolytic', 'anti-inflammatory', 'antioxidant'],
      research: [{ authors: 'Zhu Y, Tchkonia T, et al.', year: 2015, journal: 'Aging Cell', finding: 'Dasatinib + quercetin selectively kills senescent cells.' }],
      interactions: [{ substance: 'Warfarin/anticoagulants', severity: 'moderate', mechanism: 'May increase bleeding risk' }, { substance: 'CYP3A4 substrates', severity: 'moderate', mechanism: 'Inhibits CYP3A4, may increase levels of statins' }],
      synergies: [{ ingredient: 'Fisetin', mechanism: 'Combined senolytic effect' }, { ingredient: 'Vitamin C', mechanism: 'Vitamin C regenerates quercetin' }],
      products: [
        { name: 'NOW Quercetin 500mg', slug: 'quercetin-now-500mg', brand: 'NOW Foods', dose_mg: 500, form: 'capsule', servings: 120, prices: [{ vendor: 'iherb', price: 18.99, url: 'https://www.iherb.com/pr/now-quercetin-500mg' }, { vendor: 'amazon', price: 16.49, url: 'https://www.amazon.com/dp/B001F1G8FC' }, { vendor: 'now-foods', price: 19.99, url: 'https://www.nowfoods.com/products/supplements/quercetin-500mg' }] },
        { name: 'Thorne Quercetin Phytosome 250mg', slug: 'quercetin-thorne-250mg', brand: 'Thorne', dose_mg: 250, form: 'capsule', servings: 60, prices: [{ vendor: 'thorne', price: 32.00, url: 'https://www.thorne.com/products/dp/quercetin-phytosome' }] },
        { name: 'Life Extension Bio-Quercetin 500mg', slug: 'quercetin-le-500mg', brand: 'Life Extension', dose_mg: 500, form: 'capsule', servings: 30, prices: [{ vendor: 'life-extension', price: 14.25, url: 'https://www.lifeextension.com/vitamins-supplements/item02302/bio-quercetin' }] },
        { name: 'Nootropics Depot Quercetin 500mg', slug: 'quercetin-nd-500mg', brand: 'Nootropics Depot', dose_mg: 500, form: 'capsule', servings: 120, prices: [{ vendor: 'nootropics-depot', price: 17.99, url: 'https://nootropicsdepot.com/quercetin-capsules/' }] },
      ],
    },
    // 2. Fisetin
    {
      ingredient: 'Fisetin', ingredient_slug: 'fisetin', scientific_name: '3,3\',4\',7-Tetrahydroxyflavone',
      mechanism: 'Potent senolytic that eliminates senescent cells by targeting PI3K/AKT/mTOR pathway and BCL-2 family anti-apoptotic proteins.',
      typical_dose: '100-500 mg/day', subcategory: 'senolytic',
      pathways: ['senolytic', 'autophagy', 'anti-inflammatory'],
      research: [{ authors: 'Yousefzadeh MJ, Zhu Y, et al.', year: 2018, journal: 'EBioMedicine', finding: 'Fisetin was the most potent senolytic among 10 flavonoids tested.' }],
      interactions: [{ substance: 'Anticoagulants', severity: 'moderate', mechanism: 'May enhance anticoagulant effects' }],
      synergies: [{ ingredient: 'Quercetin', mechanism: 'Synergistic senolytic effect' }],
      products: [
        { name: 'Life Extension Fisetin 100mg', slug: 'fisetin-le-100mg', brand: 'Life Extension', dose_mg: 100, form: 'capsule', servings: 60, prices: [{ vendor: 'life-extension', price: 16.50, url: 'https://www.lifeextension.com/vitamins-supplements/item02414/bio-fisetin' }] },
        { name: 'Nootropics Depot Fisetin 100mg', slug: 'fisetin-nd-100mg', brand: 'Nootropics Depot', dose_mg: 100, form: 'capsule', servings: 60, prices: [{ vendor: 'nootropics-depot', price: 19.99, url: 'https://nootropicsdepot.com/fisetin-capsules/' }] },
        { name: 'Doctor\'s Best Fisetin 100mg', slug: 'fisetin-db-100mg', brand: 'Doctor\'s Best', dose_mg: 100, form: 'capsule', servings: 30, prices: [{ vendor: 'iherb', price: 14.99, url: 'https://www.iherb.com/pr/doctors-best-fisetin-100mg' }, { vendor: 'amazon', price: 12.99, url: 'https://www.amazon.com/dp/B07L2GWTJN' }] },
      ],
    },
    // 3. Apigenin
    {
      ingredient: 'Apigenin', ingredient_slug: 'apigenin', scientific_name: '4\',5,7-Trihydroxyflavone',
      mechanism: 'Inhibits CD38, the primary NAD+-consuming enzyme, preserving intracellular NAD+ levels. Also activates SIRT3.',
      typical_dose: '50-500 mg/day', subcategory: 'nad-precursor',
      pathways: ['NAD+', 'mitochondrial', 'anti-inflammatory'],
      research: [{ authors: 'Escande C, et al.', year: 2013, journal: 'Diabetes', finding: 'Apigenin inhibits CD38, nearly doubling liver NAD+ levels in mice.' }],
      interactions: [{ substance: 'Sedatives', severity: 'mild', mechanism: 'May cause additive sedation' }],
      synergies: [{ ingredient: 'Nicotinamide Riboside', mechanism: 'NR provides NAD+ precursor while apigenin prevents degradation' }],
      products: [
        { name: 'Nootropics Depot Apigenin 50mg', slug: 'apigenin-nd-50mg', brand: 'Nootropics Depot', dose_mg: 50, form: 'capsule', servings: 120, prices: [{ vendor: 'nootropics-depot', price: 14.99, url: 'https://nootropicsdepot.com/apigenin-capsules/' }] },
        { name: 'Swanson Apigenin 50mg', slug: 'apigenin-swanson-50mg', brand: 'Swanson', dose_mg: 50, form: 'capsule', servings: 90, prices: [{ vendor: 'swanson', price: 8.99, url: 'https://www.swansonvitamins.com/swanson-apigenin-50mg' }, { vendor: 'amazon', price: 9.49, url: 'https://www.amazon.com/dp/B09M4XRWBJ' }] },
        { name: 'Momentous Apigenin 50mg', slug: 'apigenin-momentous-50mg', brand: 'Momentous', dose_mg: 50, form: 'capsule', servings: 60, prices: [{ vendor: 'momentous', price: 29.95, url: 'https://www.livemomentous.com/products/apigenin' }] },
      ],
    },
    // 4. Nicotinamide Riboside (NR)
    {
      ingredient: 'Nicotinamide Riboside', ingredient_slug: 'nicotinamide-riboside', scientific_name: 'Nicotinamide riboside chloride',
      mechanism: 'NAD+ precursor converted via NR kinase pathway. Elevates NAD+, activating sirtuins (SIRT1, SIRT3) and PARPs for DNA repair.',
      typical_dose: '300-1000 mg/day', subcategory: 'nad-precursor',
      pathways: ['NAD+', 'mitochondrial', 'epigenetic', 'DNA repair'],
      research: [{ authors: 'Martens CR, et al.', year: 2018, journal: 'Nature Communications', finding: 'NR 1000 mg/day effectively elevated NAD+ in healthy adults aged 55-79.' }],
      interactions: [{ substance: 'Methyl donors', severity: 'info', mechanism: 'Consumes methyl groups — pair with TMG' }],
      synergies: [{ ingredient: 'TMG', mechanism: 'TMG provides methyl groups consumed during NR metabolism' }, { ingredient: 'Apigenin', mechanism: 'Apigenin inhibits CD38 NAD+ degradation' }],
      products: [
        { name: 'Thorne NiaCel 300mg', slug: 'nr-thorne-300mg', brand: 'Thorne', dose_mg: 300, form: 'capsule', servings: 60, prices: [{ vendor: 'thorne', price: 46.00, url: 'https://www.thorne.com/products/dp/niacel-300' }] },
        { name: 'Life Extension NAD+ Cell Regenerator 300mg', slug: 'nr-le-300mg', brand: 'Life Extension', dose_mg: 300, form: 'capsule', servings: 30, prices: [{ vendor: 'life-extension', price: 34.50, url: 'https://www.lifeextension.com/vitamins-supplements/item02348/nad-cell-regenerator' }] },
        { name: 'TRU NIAGEN 300mg', slug: 'nr-truniagen-300mg', brand: 'TRU NIAGEN', dose_mg: 300, form: 'capsule', servings: 30, prices: [{ vendor: 'amazon', price: 40.00, url: 'https://www.amazon.com/dp/B07HQHFMRZ' }] },
      ],
    },
    // 5. Vitamin D3
    {
      ingredient: 'Vitamin D3', ingredient_slug: 'vitamin-d3', scientific_name: 'Cholecalciferol',
      mechanism: 'Converted to calcitriol which binds VDR to regulate 200+ genes. Modulates immune function, reduces inflammation, protects telomere length.',
      typical_dose: '2000-5000 IU/day', subcategory: 'vitamin',
      pathways: ['epigenetic', 'anti-inflammatory', 'immune regulation', 'telomere preservation'],
      research: [{ authors: 'Manson JE, et al. (VITAL Trial)', year: 2019, journal: 'NEJM', finding: '2000 IU/day reduced advanced cancer by 17% and autoimmune disease by 22%.' }],
      interactions: [{ substance: 'Thiazide diuretics', severity: 'moderate', mechanism: 'May cause hypercalcemia' }],
      synergies: [{ ingredient: 'Vitamin K2', mechanism: 'MUST be paired — K2 directs calcium to bones' }, { ingredient: 'Magnesium', mechanism: 'Required for D3 activation' }],
      products: [
        { name: 'Thorne Vitamin D-5000', slug: 'd3-thorne-5000iu', brand: 'Thorne', dose_mg: 5000, dose_unit: 'IU', form: 'capsule', servings: 60, prices: [{ vendor: 'thorne', price: 14.00, url: 'https://www.thorne.com/products/dp/vitamin-d-5000' }] },
        { name: 'NOW Vitamin D3 5000 IU', slug: 'd3-now-5000iu', brand: 'NOW Foods', dose_mg: 5000, dose_unit: 'IU', form: 'softgel', servings: 240, prices: [{ vendor: 'iherb', price: 11.99, url: 'https://www.iherb.com/pr/now-vitamin-d3-5000iu' }, { vendor: 'now-foods', price: 12.99, url: 'https://www.nowfoods.com/products/supplements/vitamin-d3-5000iu' }, { vendor: 'amazon', price: 10.49, url: 'https://www.amazon.com/dp/B003BVIA4A' }] },
        { name: 'Pure Encapsulations Vitamin D3 5000 IU', slug: 'd3-pe-5000iu', brand: 'Pure Encapsulations', dose_mg: 5000, dose_unit: 'IU', form: 'capsule', servings: 60, prices: [{ vendor: 'pure-encapsulations', price: 18.20, url: 'https://www.pureencapsulations.com/vitamin-d3-5000-iu.html' }] },
        { name: 'Nutricost Vitamin D3 5000 IU', slug: 'd3-nutricost-5000iu', brand: 'Nutricost', dose_mg: 5000, dose_unit: 'IU', form: 'softgel', servings: 240, prices: [{ vendor: 'nutricost', price: 10.99, url: 'https://www.nutricost.com/products/vitamin-d3-5000iu' }] },
      ],
    },
    // 6. Vitamin K2 (MK-7)
    {
      ingredient: 'Vitamin K2 (MK-7)', ingredient_slug: 'vitamin-k2', scientific_name: 'Menaquinone-7',
      mechanism: 'Activates Matrix Gla Protein and osteocalcin, directing calcium away from arteries into bones.',
      typical_dose: '100-200 mcg/day', subcategory: 'vitamin',
      pathways: ['cardiovascular', 'bone health', 'anti-calcification'],
      research: [{ authors: 'Knapen MHJ, et al.', year: 2015, journal: 'Thrombosis and Haemostasis', finding: '360 mcg/day MK-7 improved arterial stiffness in postmenopausal women.' }],
      interactions: [{ substance: 'Warfarin', severity: 'high', mechanism: 'Vitamin K directly antagonizes warfarin — DO NOT combine' }],
      synergies: [{ ingredient: 'Vitamin D3', mechanism: 'Essential partner for calcium direction' }],
      products: [
        { name: 'Thorne Vitamin K2 (MK-7) 100mcg', slug: 'k2-thorne-100mcg', brand: 'Thorne', dose_mg: 0.1, dose_unit: 'mcg', form: 'capsule', servings: 30, prices: [{ vendor: 'thorne', price: 15.00, url: 'https://www.thorne.com/products/dp/vitamin-k2-liquid' }] },
        { name: 'NOW Vitamin K2 MK-7 100mcg', slug: 'k2-now-100mcg', brand: 'NOW Foods', dose_mg: 0.1, dose_unit: 'mcg', form: 'capsule', servings: 120, prices: [{ vendor: 'iherb', price: 14.99, url: 'https://www.iherb.com/pr/now-mk-7-vitamin-k-2-100mcg' }, { vendor: 'amazon', price: 12.49, url: 'https://www.amazon.com/dp/B00DQAR4GA' }] },
        { name: 'Life Extension Super K 200mcg', slug: 'k2-le-200mcg', brand: 'Life Extension', dose_mg: 0.2, dose_unit: 'mcg', form: 'softgel', servings: 90, prices: [{ vendor: 'life-extension', price: 18.00, url: 'https://www.lifeextension.com/vitamins-supplements/item02334/super-k' }] },
        { name: 'Jarrow MK-7 90mcg', slug: 'k2-jarrow-90mcg', brand: 'Jarrow Formulas', dose_mg: 0.09, dose_unit: 'mcg', form: 'softgel', servings: 120, prices: [{ vendor: 'jarrow', price: 16.95, url: 'https://www.jarrow.com/products/mk-7-90mcg' }, { vendor: 'iherb', price: 15.49, url: 'https://www.iherb.com/pr/jarrow-mk7-90mcg' }] },
      ],
    },
    // 7. Magnesium Glycinate
    {
      ingredient: 'Magnesium Glycinate', ingredient_slug: 'magnesium-glycinate', scientific_name: 'Magnesium bis(2-aminoacetate)',
      mechanism: 'Highly bioavailable magnesium chelated to glycine. Cofactor for 300+ enzymatic reactions.',
      typical_dose: '200-400 mg elemental magnesium/day', subcategory: 'mineral',
      pathways: ['sleep/recovery', 'anti-inflammatory', 'DNA repair', 'metabolic'],
      research: [{ authors: 'Abbasi B, et al.', year: 2012, journal: 'J Research Medical Sciences', finding: '500 mg magnesium improved sleep time and efficiency in elderly.' }],
      interactions: [{ substance: 'Antibiotics', severity: 'moderate', mechanism: 'Reduces absorption of tetracyclines — separate by 2+ hours' }],
      synergies: [{ ingredient: 'Vitamin D3', mechanism: 'Required for vitamin D metabolism' }],
      products: [
        { name: 'NOW Magnesium Glycinate 200mg', slug: 'magnesium-now-200mg', brand: 'NOW Foods', dose_mg: 200, form: 'tablet', servings: 120, prices: [{ vendor: 'iherb', price: 16.99, url: 'https://www.iherb.com/pr/now-magnesium-glycinate' }, { vendor: 'amazon', price: 15.49, url: 'https://www.amazon.com/dp/B08X1CGGQ7' }, { vendor: 'now-foods', price: 17.99, url: 'https://www.nowfoods.com/products/supplements/magnesium-glycinate' }] },
        { name: 'Thorne Magnesium Bisglycinate 200mg', slug: 'magnesium-thorne-200mg', brand: 'Thorne', dose_mg: 200, form: 'capsule', servings: 60, prices: [{ vendor: 'thorne', price: 28.00, url: 'https://www.thorne.com/products/dp/magnesium-bisglycinate' }] },
        { name: 'Pure Encapsulations Magnesium Glycinate 120mg', slug: 'magnesium-pe-120mg', brand: 'Pure Encapsulations', dose_mg: 120, form: 'capsule', servings: 90, prices: [{ vendor: 'pure-encapsulations', price: 25.60, url: 'https://www.pureencapsulations.com/magnesium-glycinate.html' }] },
        { name: 'Nutricost Magnesium Glycinate 200mg', slug: 'magnesium-nutricost-200mg', brand: 'Nutricost', dose_mg: 200, form: 'capsule', servings: 120, prices: [{ vendor: 'nutricost', price: 13.95, url: 'https://www.nutricost.com/products/magnesium-glycinate' }] },
      ],
    },
    // 8. Omega-3 (EPA/DHA)
    {
      ingredient: 'Omega-3 (EPA/DHA)', ingredient_slug: 'omega-3', scientific_name: 'Eicosapentaenoic acid / Docosahexaenoic acid',
      mechanism: 'EPA and DHA incorporate into cell membranes, modulating inflammation via specialized pro-resolving mediators. DHA is critical for brain structure.',
      typical_dose: '2000-4000 mg combined EPA/DHA per day', subcategory: 'essential-fatty-acid',
      pathways: ['anti-inflammatory', 'cardiovascular', 'neurological', 'telomere preservation'],
      research: [{ authors: 'Farzaneh-Far R, et al.', year: 2010, journal: 'JAMA', finding: 'Higher omega-3 levels associated with slower telomere attrition.' }],
      interactions: [{ substance: 'Anticoagulants', severity: 'moderate', mechanism: 'High-dose omega-3 may increase bleeding risk' }],
      synergies: [{ ingredient: 'Astaxanthin', mechanism: 'Prevents omega-3 oxidation' }, { ingredient: 'Vitamin D3', mechanism: 'Fat-soluble D3 better absorbed with omega-3' }],
      products: [
        { name: 'Nordic Naturals Ultimate Omega 1280mg', slug: 'omega3-nordic-1280mg', brand: 'Nordic Naturals', dose_mg: 1280, form: 'softgel', servings: 60, prices: [{ vendor: 'nordic-naturals', price: 37.46, url: 'https://www.nordicnaturals.com/products/ultimate-omega' }, { vendor: 'iherb', price: 37.99, url: 'https://www.iherb.com/pr/nordic-naturals-ultimate-omega' }, { vendor: 'amazon', price: 35.49, url: 'https://www.amazon.com/dp/B002CQU564' }] },
        { name: 'Thorne Omega-3 w/ CoQ10', slug: 'omega3-thorne-coq10', brand: 'Thorne', dose_mg: 1400, form: 'gelcap', servings: 90, prices: [{ vendor: 'thorne', price: 56.00, url: 'https://www.thorne.com/products/dp/omega-3-with-coq10' }] },
        { name: 'Life Extension Super Omega-3 EPA/DHA', slug: 'omega3-le-super', brand: 'Life Extension', dose_mg: 2000, form: 'softgel', servings: 120, prices: [{ vendor: 'life-extension', price: 24.75, url: 'https://www.lifeextension.com/vitamins-supplements/item01982/super-omega-3' }] },
        { name: 'Momentous Omega-3', slug: 'omega3-momentous', brand: 'Momentous', dose_mg: 1600, form: 'softgel', servings: 60, prices: [{ vendor: 'momentous', price: 34.95, url: 'https://www.livemomentous.com/products/omega-3' }] },
      ],
    },
    // 9. Creatine Monohydrate
    {
      ingredient: 'Creatine Monohydrate', ingredient_slug: 'creatine', scientific_name: 'N-(aminoiminomethyl)-N-methylglycine',
      mechanism: 'Increases phosphocreatine stores for rapid ATP regeneration. Supports muscle strength, cognitive function, and neuroprotection. One of the most studied supplements.',
      typical_dose: '3-5 g/day', subcategory: 'performance',
      pathways: ['energy', 'cognitive', 'neuroprotective', 'muscle'],
      research: [{ authors: 'Avgerinos KI, et al.', year: 2018, journal: 'Experimental Gerontology', finding: 'Creatine supplementation improved short-term memory and reasoning in healthy individuals.' }],
      interactions: [],
      synergies: [{ ingredient: 'Vitamin D3', mechanism: 'Both support muscle function in aging adults' }],
      products: [
        { name: 'Momentous Creatine Monohydrate 5g (Creapure)', slug: 'creatine-momentous-5g', brand: 'Momentous', dose_mg: 5000, form: 'powder', servings: 60, prices: [{ vendor: 'momentous', price: 29.95, url: 'https://www.livemomentous.com/products/creatine' }] },
        { name: 'NOW Creatine Monohydrate 5g', slug: 'creatine-now-5g', brand: 'NOW Foods', dose_mg: 5000, form: 'powder', servings: 200, prices: [{ vendor: 'iherb', price: 19.99, url: 'https://www.iherb.com/pr/now-creatine-monohydrate-powder' }, { vendor: 'now-foods', price: 21.99, url: 'https://www.nowfoods.com/products/supplements/creatine-monohydrate-powder' }] },
        { name: 'Nutricost Creatine Monohydrate 5g', slug: 'creatine-nutricost-5g', brand: 'Nutricost', dose_mg: 5000, form: 'powder', servings: 200, prices: [{ vendor: 'nutricost', price: 14.95, url: 'https://www.nutricost.com/products/creatine-monohydrate' }, { vendor: 'amazon', price: 13.95, url: 'https://www.amazon.com/dp/B01NAMQYQ7' }] },
        { name: 'Bulk Supplements Creatine Monohydrate', slug: 'creatine-bulk-5g', brand: 'Bulk Supplements', dose_mg: 5000, form: 'powder', servings: 200, prices: [{ vendor: 'bulk-supplements', price: 15.96, url: 'https://www.bulksupplements.com/products/creatine-monohydrate' }] },
        { name: 'Thorne Creatine (Creapure)', slug: 'creatine-thorne-5g', brand: 'Thorne', dose_mg: 5000, form: 'powder', servings: 90, prices: [{ vendor: 'thorne', price: 32.00, url: 'https://www.thorne.com/products/dp/creatine' }] },
      ],
    },
    // 10. Ashwagandha
    {
      ingredient: 'Ashwagandha', ingredient_slug: 'ashwagandha', scientific_name: 'Withania somnifera',
      mechanism: 'Adaptogen that modulates cortisol, reduces stress-related biomarkers, and may support telomere length via telomerase activation. KSM-66 and Sensoril are clinically studied extracts.',
      typical_dose: '300-600 mg/day (standardized extract)', subcategory: 'adaptogen',
      pathways: ['stress/cortisol', 'cognitive', 'anti-inflammatory', 'hormonal'],
      research: [{ authors: 'Chandrasekhar K, et al.', year: 2012, journal: 'Indian J Psych Med', finding: '300 mg KSM-66 twice daily reduced cortisol by 28% and stress scores significantly.' }],
      interactions: [{ substance: 'Thyroid medications', severity: 'moderate', mechanism: 'May increase thyroid hormone levels' }, { substance: 'Immunosuppressants', severity: 'moderate', mechanism: 'May stimulate immune system' }],
      synergies: [{ ingredient: 'Magnesium', mechanism: 'Both support stress reduction and sleep quality' }],
      products: [
        { name: 'Nootropics Depot KSM-66 300mg', slug: 'ashwagandha-nd-ksm66', brand: 'Nootropics Depot', dose_mg: 300, form: 'capsule', servings: 90, prices: [{ vendor: 'nootropics-depot', price: 14.99, url: 'https://nootropicsdepot.com/ksm-66-ashwagandha-capsules/' }] },
        { name: 'Jarrow KSM-66 Ashwagandha 300mg', slug: 'ashwagandha-jarrow-ksm66', brand: 'Jarrow Formulas', dose_mg: 300, form: 'capsule', servings: 120, prices: [{ vendor: 'jarrow', price: 19.95, url: 'https://www.jarrow.com/products/ksm-66-ashwagandha' }, { vendor: 'iherb', price: 17.99, url: 'https://www.iherb.com/pr/jarrow-ksm66-ashwagandha' }] },
        { name: 'Momentous Ashwagandha (Sensoril)', slug: 'ashwagandha-momentous-sensoril', brand: 'Momentous', dose_mg: 225, form: 'capsule', servings: 60, prices: [{ vendor: 'momentous', price: 29.95, url: 'https://www.livemomentous.com/products/ashwagandha' }] },
        { name: 'NOW Ashwagandha 450mg', slug: 'ashwagandha-now-450mg', brand: 'NOW Foods', dose_mg: 450, form: 'capsule', servings: 90, prices: [{ vendor: 'iherb', price: 14.99, url: 'https://www.iherb.com/pr/now-ashwagandha-450mg' }, { vendor: 'now-foods', price: 15.99, url: 'https://www.nowfoods.com/products/supplements/ashwagandha-450mg' }] },
      ],
    },
    // 11. NAC
    {
      ingredient: 'NAC (N-Acetylcysteine)', ingredient_slug: 'nac', scientific_name: 'N-Acetyl-L-Cysteine',
      mechanism: 'Precursor to glutathione, the body\'s master antioxidant. Supports liver detoxification, reduces oxidative stress, and has mucolytic properties.',
      typical_dose: '600-1800 mg/day', subcategory: 'antioxidant',
      pathways: ['antioxidant', 'liver health', 'respiratory', 'detoxification'],
      research: [{ authors: 'De Flora S, et al.', year: 1997, journal: 'Pharmacological Research', finding: 'NAC modulates influenza infection and may reduce symptoms and duration.' }],
      interactions: [{ substance: 'Nitroglycerin', severity: 'moderate', mechanism: 'May enhance vasodilatory effects' }, { substance: 'Activated charcoal', severity: 'mild', mechanism: 'Charcoal may reduce NAC absorption' }],
      synergies: [{ ingredient: 'Vitamin C', mechanism: 'Both support glutathione recycling' }],
      products: [
        { name: 'NOW NAC 600mg', slug: 'nac-now-600mg', brand: 'NOW Foods', dose_mg: 600, form: 'capsule', servings: 250, prices: [{ vendor: 'iherb', price: 16.99, url: 'https://www.iherb.com/pr/now-nac-600mg' }, { vendor: 'now-foods', price: 17.99, url: 'https://www.nowfoods.com/products/supplements/nac-600mg' }, { vendor: 'amazon', price: 15.99, url: 'https://www.amazon.com/dp/B0013OVVK0' }] },
        { name: 'Life Extension NAC 600mg', slug: 'nac-le-600mg', brand: 'Life Extension', dose_mg: 600, form: 'capsule', servings: 60, prices: [{ vendor: 'life-extension', price: 10.50, url: 'https://www.lifeextension.com/vitamins-supplements/item01534/n-acetyl-l-cysteine' }] },
        { name: 'Jarrow NAC Sustain 600mg', slug: 'nac-jarrow-600mg', brand: 'Jarrow Formulas', dose_mg: 600, form: 'tablet', servings: 100, prices: [{ vendor: 'jarrow', price: 16.95, url: 'https://www.jarrow.com/products/nac-sustain-600mg' }, { vendor: 'iherb', price: 15.49, url: 'https://www.iherb.com/pr/jarrow-nac-sustain' }] },
        { name: 'Nutricost NAC 600mg', slug: 'nac-nutricost-600mg', brand: 'Nutricost', dose_mg: 600, form: 'capsule', servings: 180, prices: [{ vendor: 'nutricost', price: 12.95, url: 'https://www.nutricost.com/products/nac-600mg' }] },
      ],
    },
    // 12. Collagen Peptides
    {
      ingredient: 'Collagen Peptides', ingredient_slug: 'collagen', scientific_name: 'Hydrolyzed collagen (Types I & III)',
      mechanism: 'Hydrolyzed collagen provides bioactive peptides that stimulate fibroblast collagen synthesis, supporting skin elasticity, joint health, and gut lining integrity.',
      typical_dose: '10-20 g/day', subcategory: 'skin-joint',
      pathways: ['skin/joint health', 'gut health', 'bone health'],
      research: [{ authors: 'Bolke L, et al.', year: 2019, journal: 'Nutrients', finding: 'Oral collagen peptides improved skin elasticity, hydration, and dermal collagen density.' }],
      interactions: [],
      synergies: [{ ingredient: 'Vitamin C', mechanism: 'Vitamin C is essential cofactor for collagen synthesis' }],
      products: [
        { name: 'Vital Proteins Collagen Peptides 20g', slug: 'collagen-vp-20g', brand: 'Vital Proteins', dose_mg: 20000, form: 'powder', servings: 28, prices: [{ vendor: 'vital-proteins', price: 27.00, url: 'https://www.vitalproteins.com/products/collagen-peptides' }, { vendor: 'amazon', price: 25.49, url: 'https://www.amazon.com/dp/B00K6JUG4K' }] },
        { name: 'Garden of Life Grass Fed Collagen 20g', slug: 'collagen-gol-20g', brand: 'Garden of Life', dose_mg: 20000, form: 'powder', servings: 28, prices: [{ vendor: 'garden-of-life', price: 29.99, url: 'https://www.gardenoflife.com/products/collagen' }] },
        { name: 'Momentous Collagen Peptides', slug: 'collagen-momentous-15g', brand: 'Momentous', dose_mg: 15000, form: 'powder', servings: 30, prices: [{ vendor: 'momentous', price: 39.95, url: 'https://www.livemomentous.com/products/collagen-peptides' }] },
        { name: 'Bulk Supplements Collagen Peptides', slug: 'collagen-bulk-10g', brand: 'Bulk Supplements', dose_mg: 10000, form: 'powder', servings: 100, prices: [{ vendor: 'bulk-supplements', price: 19.96, url: 'https://www.bulksupplements.com/products/hydrolyzed-collagen-powder' }] },
      ],
    },
    // 13. L-Theanine
    {
      ingredient: 'L-Theanine', ingredient_slug: 'l-theanine', scientific_name: 'L-gamma-glutamylethylamide',
      mechanism: 'Amino acid from tea that crosses the blood-brain barrier. Increases alpha brain waves promoting calm focus. Modulates GABA, serotonin, and dopamine.',
      typical_dose: '100-400 mg/day', subcategory: 'nootropic',
      pathways: ['cognitive', 'stress/cortisol', 'sleep/recovery'],
      research: [{ authors: 'Nobre AC, et al.', year: 2008, journal: 'Asia Pacific J Clin Nutr', finding: 'L-theanine increased alpha brain wave activity within 40 minutes of ingestion.' }],
      interactions: [],
      synergies: [{ ingredient: 'Caffeine', mechanism: 'Theanine smooths caffeine jitters while preserving alertness' }],
      products: [
        { name: 'Nootropics Depot L-Theanine (Suntheanine) 200mg', slug: 'theanine-nd-200mg', brand: 'Nootropics Depot', dose_mg: 200, form: 'capsule', servings: 120, prices: [{ vendor: 'nootropics-depot', price: 14.99, url: 'https://nootropicsdepot.com/l-theanine-capsules/' }] },
        { name: 'NOW L-Theanine 200mg', slug: 'theanine-now-200mg', brand: 'NOW Foods', dose_mg: 200, form: 'capsule', servings: 120, prices: [{ vendor: 'iherb', price: 16.99, url: 'https://www.iherb.com/pr/now-l-theanine-200mg' }, { vendor: 'now-foods', price: 17.99, url: 'https://www.nowfoods.com/products/supplements/l-theanine-200mg' }] },
        { name: 'Momentous L-Theanine 200mg', slug: 'theanine-momentous-200mg', brand: 'Momentous', dose_mg: 200, form: 'capsule', servings: 60, prices: [{ vendor: 'momentous', price: 24.95, url: 'https://www.livemomentous.com/products/l-theanine' }] },
      ],
    },
    // 14. Glycine
    {
      ingredient: 'Glycine', ingredient_slug: 'glycine', scientific_name: 'Aminoacetic acid',
      mechanism: 'Simplest amino acid with multiple longevity roles: supports collagen synthesis, acts as inhibitory neurotransmitter (sleep), precursor to glutathione, and may mimic methionine restriction.',
      typical_dose: '3-5 g/day', subcategory: 'amino-acid',
      pathways: ['sleep/recovery', 'antioxidant', 'anti-inflammatory', 'collagen'],
      research: [{ authors: 'Brind J, et al.', year: 2011, journal: 'Aging Cell', finding: 'Glycine supplementation extended lifespan in rats, potentially mimicking methionine restriction.' }],
      interactions: [],
      synergies: [{ ingredient: 'NAC', mechanism: 'Glycine + NAC = GlyNAC, shown to restore glutathione in aging' }, { ingredient: 'Magnesium', mechanism: 'Both support sleep quality' }],
      products: [
        { name: 'NOW Glycine 1000mg', slug: 'glycine-now-1000mg', brand: 'NOW Foods', dose_mg: 1000, form: 'capsule', servings: 100, prices: [{ vendor: 'iherb', price: 8.99, url: 'https://www.iherb.com/pr/now-glycine-1000mg' }, { vendor: 'now-foods', price: 9.99, url: 'https://www.nowfoods.com/products/supplements/glycine-1000mg' }] },
        { name: 'Bulk Supplements Glycine Powder', slug: 'glycine-bulk-3g', brand: 'Bulk Supplements', dose_mg: 3000, form: 'powder', servings: 333, prices: [{ vendor: 'bulk-supplements', price: 14.96, url: 'https://www.bulksupplements.com/products/glycine' }] },
        { name: 'Thorne Glycine', slug: 'glycine-thorne-500mg', brand: 'Thorne', dose_mg: 500, form: 'capsule', servings: 250, prices: [{ vendor: 'thorne', price: 18.00, url: 'https://www.thorne.com/products/dp/glycine' }] },
      ],
    },
    // 15. CoQ10 / Ubiquinol
    {
      ingredient: 'CoQ10 / Ubiquinol', ingredient_slug: 'coq10', scientific_name: 'Coenzyme Q10 (Ubiquinone/Ubiquinol)',
      mechanism: 'Essential electron carrier in mitochondrial ATP production. Ubiquinol (reduced form) is a potent lipid-soluble antioxidant. Levels decline ~50% by age 80.',
      typical_dose: '100-300 mg/day (ubiquinol preferred for absorption)', subcategory: 'mitochondrial',
      pathways: ['mitochondrial', 'cardiovascular', 'antioxidant', 'energy'],
      research: [{ authors: 'Mortensen SA, et al. (Q-SYMBIO)', year: 2014, journal: 'JACC Heart Failure', finding: 'CoQ10 300 mg/day reduced major cardiovascular events by 43% in heart failure patients.' }],
      interactions: [{ substance: 'Statins', severity: 'info', mechanism: 'Statins deplete CoQ10 — supplementation recommended' }, { substance: 'Warfarin', severity: 'mild', mechanism: 'May reduce warfarin efficacy' }],
      synergies: [{ ingredient: 'Omega-3', mechanism: 'Both support cardiovascular health' }],
      products: [
        { name: 'Life Extension Super Ubiquinol CoQ10 100mg', slug: 'coq10-le-100mg', brand: 'Life Extension', dose_mg: 100, form: 'softgel', servings: 60, prices: [{ vendor: 'life-extension', price: 33.00, url: 'https://www.lifeextension.com/vitamins-supplements/item01426/super-ubiquinol-coq10' }] },
        { name: 'Jarrow QH-absorb Ubiquinol 100mg', slug: 'coq10-jarrow-100mg', brand: 'Jarrow Formulas', dose_mg: 100, form: 'softgel', servings: 120, prices: [{ vendor: 'jarrow', price: 33.95, url: 'https://www.jarrow.com/products/qh-absorb-100mg' }, { vendor: 'iherb', price: 31.49, url: 'https://www.iherb.com/pr/jarrow-qh-absorb-100mg' }] },
        { name: 'NOW Ubiquinol 100mg', slug: 'coq10-now-100mg', brand: 'NOW Foods', dose_mg: 100, form: 'softgel', servings: 60, prices: [{ vendor: 'iherb', price: 24.99, url: 'https://www.iherb.com/pr/now-ubiquinol-100mg' }, { vendor: 'now-foods', price: 26.99, url: 'https://www.nowfoods.com/products/supplements/ubiquinol-100mg' }] },
        { name: 'Thorne CoQ10 100mg', slug: 'coq10-thorne-100mg', brand: 'Thorne', dose_mg: 100, form: 'gelcap', servings: 60, prices: [{ vendor: 'thorne', price: 36.00, url: 'https://www.thorne.com/products/dp/coq10' }] },
      ],
    },
    // 16. Lion's Mane
    {
      ingredient: 'Lion\'s Mane', ingredient_slug: 'lions-mane', scientific_name: 'Hericium erinaceus',
      mechanism: 'Medicinal mushroom containing hericenones and erinacines that stimulate Nerve Growth Factor (NGF) synthesis. Supports neuroplasticity, memory, and cognitive function.',
      typical_dose: '500-3000 mg/day (fruiting body extract)', subcategory: 'nootropic',
      pathways: ['cognitive', 'neuroprotective', 'immune'],
      research: [{ authors: 'Mori K, et al.', year: 2009, journal: 'Phytotherapy Research', finding: 'Lion\'s Mane improved cognitive function in elderly with mild cognitive impairment over 16 weeks.' }],
      interactions: [],
      synergies: [{ ingredient: 'Alpha-GPC', mechanism: 'Both support cholinergic cognitive function' }],
      products: [
        { name: 'Nootropics Depot Lion\'s Mane 8:1 Extract 500mg', slug: 'lionsmane-nd-500mg', brand: 'Nootropics Depot', dose_mg: 500, form: 'capsule', servings: 60, prices: [{ vendor: 'nootropics-depot', price: 19.99, url: 'https://nootropicsdepot.com/lions-mane-mushroom-capsules/' }] },
        { name: 'NOW Lion\'s Mane 500mg', slug: 'lionsmane-now-500mg', brand: 'NOW Foods', dose_mg: 500, form: 'capsule', servings: 60, prices: [{ vendor: 'iherb', price: 16.99, url: 'https://www.iherb.com/pr/now-lions-mane-500mg' }, { vendor: 'now-foods', price: 17.99, url: 'https://www.nowfoods.com/products/supplements/lions-mane' }] },
        { name: 'Bulk Supplements Lion\'s Mane Extract', slug: 'lionsmane-bulk-500mg', brand: 'Bulk Supplements', dose_mg: 500, form: 'powder', servings: 500, prices: [{ vendor: 'bulk-supplements', price: 24.96, url: 'https://www.bulksupplements.com/products/lions-mane-extract' }] },
      ],
    },
    // 17. Rhodiola Rosea
    {
      ingredient: 'Rhodiola Rosea', ingredient_slug: 'rhodiola', scientific_name: 'Rhodiola rosea',
      mechanism: 'Adaptogen that modulates stress response via HPA axis regulation. Contains rosavins and salidroside which support mental performance, reduce fatigue, and may have antidepressant effects.',
      typical_dose: '200-600 mg/day (3% rosavins extract)', subcategory: 'adaptogen',
      pathways: ['stress/cortisol', 'cognitive', 'energy', 'anti-fatigue'],
      research: [{ authors: 'Darbinyan V, et al.', year: 2000, journal: 'Phytomedicine', finding: 'Rhodiola improved mental performance and reduced mental fatigue during night duty in physicians.' }],
      interactions: [{ substance: 'SSRIs/MAOIs', severity: 'moderate', mechanism: 'May interact with serotonergic medications' }],
      synergies: [{ ingredient: 'Ashwagandha', mechanism: 'Complementary adaptogens — rhodiola for energy, ashwagandha for calm' }],
      products: [
        { name: 'Nootropics Depot Rhodiola Rosea 500mg (3% Rosavins)', slug: 'rhodiola-nd-500mg', brand: 'Nootropics Depot', dose_mg: 500, form: 'capsule', servings: 90, prices: [{ vendor: 'nootropics-depot', price: 17.99, url: 'https://nootropicsdepot.com/rhodiola-rosea-capsules/' }] },
        { name: 'NOW Rhodiola 500mg', slug: 'rhodiola-now-500mg', brand: 'NOW Foods', dose_mg: 500, form: 'capsule', servings: 60, prices: [{ vendor: 'iherb', price: 14.99, url: 'https://www.iherb.com/pr/now-rhodiola-500mg' }, { vendor: 'now-foods', price: 15.99, url: 'https://www.nowfoods.com/products/supplements/rhodiola-500mg' }] },
        { name: 'Jarrow Rhodiola Rosea 500mg', slug: 'rhodiola-jarrow-500mg', brand: 'Jarrow Formulas', dose_mg: 500, form: 'capsule', servings: 60, prices: [{ vendor: 'jarrow', price: 14.95, url: 'https://www.jarrow.com/products/rhodiola-rosea-500mg' }] },
      ],
    },
    // 18. Berberine
    {
      ingredient: 'Berberine', ingredient_slug: 'berberine', scientific_name: 'Berberine hydrochloride',
      mechanism: 'Activates AMPK (cellular energy sensor), mimicking some effects of caloric restriction. Improves insulin sensitivity, lowers blood glucose, and modulates gut microbiome.',
      typical_dose: '500-1500 mg/day (divided doses)', subcategory: 'metabolic',
      pathways: ['metabolic', 'gut health', 'anti-inflammatory', 'cardiovascular'],
      research: [{ authors: 'Yin J, et al.', year: 2008, journal: 'Metabolism', finding: 'Berberine lowered HbA1c comparably to metformin in type 2 diabetics.' }],
      interactions: [{ substance: 'Metformin', severity: 'moderate', mechanism: 'Additive blood sugar lowering — monitor glucose' }, { substance: 'CYP3A4 substrates', severity: 'moderate', mechanism: 'Inhibits CYP3A4 and CYP2D6' }],
      synergies: [{ ingredient: 'Alpha-Lipoic Acid', mechanism: 'Both support insulin sensitivity' }],
      products: [
        { name: 'Life Extension Berberine 500mg', slug: 'berberine-le-500mg', brand: 'Life Extension', dose_mg: 500, form: 'capsule', servings: 60, prices: [{ vendor: 'life-extension', price: 16.50, url: 'https://www.lifeextension.com/vitamins-supplements/item02513/berberine' }] },
        { name: 'NOW Berberine Glucose Support 400mg', slug: 'berberine-now-400mg', brand: 'NOW Foods', dose_mg: 400, form: 'capsule', servings: 90, prices: [{ vendor: 'iherb', price: 19.99, url: 'https://www.iherb.com/pr/now-berberine-glucose-support' }, { vendor: 'now-foods', price: 21.99, url: 'https://www.nowfoods.com/products/supplements/berberine' }] },
        { name: 'Thorne Berberine 1000mg', slug: 'berberine-thorne-1000mg', brand: 'Thorne', dose_mg: 1000, form: 'capsule', servings: 60, prices: [{ vendor: 'thorne', price: 36.00, url: 'https://www.thorne.com/products/dp/berberine-1000' }] },
        { name: 'Nutricost Berberine HCl 500mg', slug: 'berberine-nutricost-500mg', brand: 'Nutricost', dose_mg: 500, form: 'capsule', servings: 120, prices: [{ vendor: 'nutricost', price: 14.95, url: 'https://www.nutricost.com/products/berberine-hcl' }] },
      ],
    },
    // 19. Alpha-GPC
    {
      ingredient: 'Alpha-GPC', ingredient_slug: 'alpha-gpc', scientific_name: 'L-Alpha glycerylphosphorylcholine',
      mechanism: 'Highly bioavailable choline source that crosses blood-brain barrier. Precursor to acetylcholine, the neurotransmitter critical for memory, focus, and muscle contraction.',
      typical_dose: '300-600 mg/day', subcategory: 'nootropic',
      pathways: ['cognitive', 'cholinergic', 'neuroprotective'],
      research: [{ authors: 'Parker AG, et al.', year: 2015, journal: 'J Int Soc Sports Nutr', finding: 'Alpha-GPC enhanced cognitive function and power output in healthy adults.' }],
      interactions: [{ substance: 'Anticholinergics', severity: 'moderate', mechanism: 'May counteract anticholinergic medications' }],
      synergies: [{ ingredient: 'Lion\'s Mane', mechanism: 'NGF stimulation + acetylcholine precursor for synergistic cognitive support' }],
      products: [
        { name: 'Nootropics Depot Alpha-GPC 300mg', slug: 'alphagpc-nd-300mg', brand: 'Nootropics Depot', dose_mg: 300, form: 'capsule', servings: 60, prices: [{ vendor: 'nootropics-depot', price: 19.99, url: 'https://nootropicsdepot.com/alpha-gpc-capsules/' }] },
        { name: 'NOW Alpha-GPC 300mg', slug: 'alphagpc-now-300mg', brand: 'NOW Foods', dose_mg: 300, form: 'capsule', servings: 60, prices: [{ vendor: 'iherb', price: 24.99, url: 'https://www.iherb.com/pr/now-alpha-gpc-300mg' }, { vendor: 'now-foods', price: 26.99, url: 'https://www.nowfoods.com/products/supplements/alpha-gpc-300mg' }] },
        { name: 'Momentous Alpha-GPC', slug: 'alphagpc-momentous-300mg', brand: 'Momentous', dose_mg: 300, form: 'capsule', servings: 60, prices: [{ vendor: 'momentous', price: 34.95, url: 'https://www.livemomentous.com/products/alpha-gpc' }] },
      ],
    },
    // 20. Citicoline (CDP-Choline)
    {
      ingredient: 'Citicoline (CDP-Choline)', ingredient_slug: 'citicoline', scientific_name: 'Cytidine 5\'-diphosphocholine',
      mechanism: 'Provides both choline and cytidine (converted to uridine). Supports phosphatidylcholine synthesis for cell membranes and acetylcholine production for cognition.',
      typical_dose: '250-500 mg/day', subcategory: 'nootropic',
      pathways: ['cognitive', 'neuroprotective', 'cell membrane'],
      research: [{ authors: 'McGlade E, et al.', year: 2012, journal: 'Food and Nutrition Sciences', finding: 'Cognizin citicoline improved attention and psychomotor speed in healthy adult women.' }],
      interactions: [],
      synergies: [{ ingredient: 'Lion\'s Mane', mechanism: 'Complementary neuroprotective mechanisms' }],
      products: [
        { name: 'Nootropics Depot Cognizin Citicoline 250mg', slug: 'citicoline-nd-250mg', brand: 'Nootropics Depot', dose_mg: 250, form: 'capsule', servings: 60, prices: [{ vendor: 'nootropics-depot', price: 22.99, url: 'https://nootropicsdepot.com/cognizin-citicoline-capsules/' }] },
        { name: 'Jarrow Citicoline (CDP-Choline) 250mg', slug: 'citicoline-jarrow-250mg', brand: 'Jarrow Formulas', dose_mg: 250, form: 'capsule', servings: 120, prices: [{ vendor: 'jarrow', price: 22.95, url: 'https://www.jarrow.com/products/citicoline-250mg' }, { vendor: 'iherb', price: 20.99, url: 'https://www.iherb.com/pr/jarrow-citicoline-250mg' }] },
        { name: 'Life Extension Citicoline 250mg', slug: 'citicoline-le-250mg', brand: 'Life Extension', dose_mg: 250, form: 'capsule', servings: 60, prices: [{ vendor: 'life-extension', price: 20.25, url: 'https://www.lifeextension.com/vitamins-supplements/item01659/citicoline' }] },
      ],
    },
    // 21. Taurine
    {
      ingredient: 'Taurine', ingredient_slug: 'taurine', scientific_name: '2-Aminoethanesulfonic acid',
      mechanism: 'Conditionally essential amino acid that declines with age. Supports mitochondrial function, acts as osmolyte for cell volume regulation, and has anti-inflammatory and antioxidant properties.',
      typical_dose: '1-3 g/day', subcategory: 'amino-acid',
      pathways: ['anti-inflammatory', 'cardiovascular', 'mitochondrial', 'anti-aging'],
      research: [{ authors: 'Singh P, et al.', year: 2023, journal: 'Science', finding: 'Taurine deficiency is a driver of aging. Taurine supplementation extended lifespan by 10-12% in mice.' }],
      interactions: [],
      synergies: [{ ingredient: 'Magnesium', mechanism: 'Both support cardiovascular function and muscle relaxation' }],
      products: [
        { name: 'NOW Taurine 1000mg', slug: 'taurine-now-1000mg', brand: 'NOW Foods', dose_mg: 1000, form: 'capsule', servings: 250, prices: [{ vendor: 'iherb', price: 12.99, url: 'https://www.iherb.com/pr/now-taurine-1000mg' }, { vendor: 'now-foods', price: 13.99, url: 'https://www.nowfoods.com/products/supplements/taurine-1000mg' }] },
        { name: 'Life Extension Taurine 1000mg', slug: 'taurine-le-1000mg', brand: 'Life Extension', dose_mg: 1000, form: 'capsule', servings: 90, prices: [{ vendor: 'life-extension', price: 9.75, url: 'https://www.lifeextension.com/vitamins-supplements/item01827/taurine' }] },
        { name: 'Nutricost Taurine 1000mg', slug: 'taurine-nutricost-1000mg', brand: 'Nutricost', dose_mg: 1000, form: 'capsule', servings: 400, prices: [{ vendor: 'nutricost', price: 12.95, url: 'https://www.nutricost.com/products/taurine-1000mg' }] },
        { name: 'Bulk Supplements Taurine Powder', slug: 'taurine-bulk-1g', brand: 'Bulk Supplements', dose_mg: 1000, form: 'powder', servings: 500, prices: [{ vendor: 'bulk-supplements', price: 14.96, url: 'https://www.bulksupplements.com/products/taurine' }] },
      ],
    },
    // 22. Zinc
    {
      ingredient: 'Zinc', ingredient_slug: 'zinc', scientific_name: 'Zinc (various chelates)',
      mechanism: 'Essential mineral and cofactor for 300+ enzymes. Critical for immune function, DNA synthesis, wound healing, and thymic function. Zinc picolinate and bisglycinate offer best absorption.',
      typical_dose: '15-30 mg/day', subcategory: 'mineral',
      pathways: ['immune regulation', 'DNA repair', 'hormonal', 'antioxidant'],
      research: [{ authors: 'Prasad AS, et al.', year: 2007, journal: 'Am J Clin Nutr', finding: 'Zinc supplementation reduced oxidative stress and infection incidence in elderly.' }],
      interactions: [{ substance: 'Copper', severity: 'info', mechanism: 'Long-term zinc supplementation can deplete copper — consider adding 1-2 mg copper' }],
      synergies: [{ ingredient: 'Vitamin C', mechanism: 'Both support immune function synergistically' }],
      products: [
        { name: 'NOW Zinc Picolinate 50mg', slug: 'zinc-now-50mg', brand: 'NOW Foods', dose_mg: 50, form: 'capsule', servings: 120, prices: [{ vendor: 'iherb', price: 8.99, url: 'https://www.iherb.com/pr/now-zinc-picolinate-50mg' }, { vendor: 'now-foods', price: 9.99, url: 'https://www.nowfoods.com/products/supplements/zinc-picolinate-50mg' }] },
        { name: 'Thorne Zinc Picolinate 30mg', slug: 'zinc-thorne-30mg', brand: 'Thorne', dose_mg: 30, form: 'capsule', servings: 60, prices: [{ vendor: 'thorne', price: 14.00, url: 'https://www.thorne.com/products/dp/zinc-picolinate-30mg' }] },
        { name: 'Life Extension Zinc Caps 50mg', slug: 'zinc-le-50mg', brand: 'Life Extension', dose_mg: 50, form: 'capsule', servings: 90, prices: [{ vendor: 'life-extension', price: 6.75, url: 'https://www.lifeextension.com/vitamins-supplements/item01813/zinc-caps' }] },
      ],
    },
    // 23. Selenium
    {
      ingredient: 'Selenium', ingredient_slug: 'selenium', scientific_name: 'L-Selenomethionine',
      mechanism: 'Essential trace mineral incorporated into selenoproteins including glutathione peroxidase. Critical for thyroid function, antioxidant defense, and DNA repair.',
      typical_dose: '100-200 mcg/day', subcategory: 'mineral',
      pathways: ['antioxidant', 'thyroid', 'immune regulation', 'DNA repair'],
      research: [{ authors: 'Rayman MP, et al.', year: 2012, journal: 'Lancet', finding: 'Selenium supplementation supports thyroid function and may reduce cancer risk at optimal doses.' }],
      interactions: [{ substance: 'High-dose Vitamin C', severity: 'mild', mechanism: 'Very high dose Vitamin C may reduce selenium absorption — take separately' }],
      synergies: [{ ingredient: 'Vitamin E', mechanism: 'Both support antioxidant defense systems' }],
      products: [
        { name: 'NOW Selenium 200mcg', slug: 'selenium-now-200mcg', brand: 'NOW Foods', dose_mg: 0.2, dose_unit: 'mcg', form: 'capsule', servings: 180, prices: [{ vendor: 'iherb', price: 8.99, url: 'https://www.iherb.com/pr/now-selenium-200mcg' }] },
        { name: 'Life Extension Super Selenium Complex', slug: 'selenium-le-200mcg', brand: 'Life Extension', dose_mg: 0.2, dose_unit: 'mcg', form: 'capsule', servings: 100, prices: [{ vendor: 'life-extension', price: 10.50, url: 'https://www.lifeextension.com/vitamins-supplements/item01778/super-selenium-complex' }] },
        { name: 'Thorne Selenium 200mcg', slug: 'selenium-thorne-200mcg', brand: 'Thorne', dose_mg: 0.2, dose_unit: 'mcg', form: 'capsule', servings: 60, prices: [{ vendor: 'thorne', price: 12.00, url: 'https://www.thorne.com/products/dp/selenium' }] },
      ],
    },
    // 24. Boron
    {
      ingredient: 'Boron', ingredient_slug: 'boron', scientific_name: 'Boron (as boron glycinate)',
      mechanism: 'Trace mineral that supports bone metabolism, cognitive function, and hormonal balance. May increase free testosterone and support vitamin D metabolism.',
      typical_dose: '3-6 mg/day', subcategory: 'mineral',
      pathways: ['bone health', 'hormonal', 'cognitive'],
      research: [{ authors: 'Naghii MR, et al.', year: 2011, journal: 'J Trace Elements Med Biol', finding: 'Boron supplementation (10 mg/day for 7 days) increased free testosterone and reduced estradiol in men.' }],
      interactions: [],
      synergies: [{ ingredient: 'Vitamin D3', mechanism: 'Boron may enhance vitamin D metabolism' }],
      products: [
        { name: 'NOW Boron 3mg', slug: 'boron-now-3mg', brand: 'NOW Foods', dose_mg: 3, form: 'capsule', servings: 250, prices: [{ vendor: 'iherb', price: 6.99, url: 'https://www.iherb.com/pr/now-boron-3mg' }] },
        { name: 'Life Extension Boron 3mg', slug: 'boron-le-3mg', brand: 'Life Extension', dose_mg: 3, form: 'capsule', servings: 100, prices: [{ vendor: 'life-extension', price: 5.25, url: 'https://www.lifeextension.com/vitamins-supplements/item01661/boron' }] },
        { name: 'Nutricost Boron 3mg', slug: 'boron-nutricost-3mg', brand: 'Nutricost', dose_mg: 3, form: 'capsule', servings: 240, prices: [{ vendor: 'nutricost', price: 8.95, url: 'https://www.nutricost.com/products/boron-3mg' }] },
      ],
    },
    // 25. Vitamin C
    {
      ingredient: 'Vitamin C', ingredient_slug: 'vitamin-c', scientific_name: 'L-Ascorbic Acid',
      mechanism: 'Essential antioxidant and cofactor for collagen synthesis, immune function, and iron absorption. Supports glutathione recycling and may help maintain telomere length.',
      typical_dose: '500-2000 mg/day', subcategory: 'vitamin',
      pathways: ['antioxidant', 'immune regulation', 'collagen', 'iron absorption'],
      research: [{ authors: 'Carr AC, Maggini S', year: 2017, journal: 'Nutrients', finding: 'Vitamin C supports immune defense by supporting cellular functions of both innate and adaptive immunity.' }],
      interactions: [{ substance: 'Iron supplements', severity: 'info', mechanism: 'Enhances iron absorption — beneficial for deficiency, caution in iron overload' }],
      synergies: [{ ingredient: 'Collagen', mechanism: 'Essential cofactor for collagen synthesis' }, { ingredient: 'Quercetin', mechanism: 'Regenerates quercetin and enhances bioavailability' }],
      products: [
        { name: 'NOW Vitamin C-1000', slug: 'vitc-now-1000mg', brand: 'NOW Foods', dose_mg: 1000, form: 'tablet', servings: 250, prices: [{ vendor: 'iherb', price: 14.99, url: 'https://www.iherb.com/pr/now-vitamin-c-1000' }, { vendor: 'now-foods', price: 15.99, url: 'https://www.nowfoods.com/products/supplements/vitamin-c-1000' }] },
        { name: 'Life Extension Vitamin C 1000mg', slug: 'vitc-le-1000mg', brand: 'Life Extension', dose_mg: 1000, form: 'tablet', servings: 60, prices: [{ vendor: 'life-extension', price: 9.00, url: 'https://www.lifeextension.com/vitamins-supplements/item00081/vitamin-c-1000mg' }] },
        { name: 'Thorne Vitamin C with Flavonoids', slug: 'vitc-thorne-500mg', brand: 'Thorne', dose_mg: 500, form: 'capsule', servings: 90, prices: [{ vendor: 'thorne', price: 15.00, url: 'https://www.thorne.com/products/dp/vitamin-c-with-flavonoids' }] },
        { name: 'Garden of Life Vitamin Code Raw C', slug: 'vitc-gol-500mg', brand: 'Garden of Life', dose_mg: 500, form: 'capsule', servings: 120, prices: [{ vendor: 'garden-of-life', price: 24.99, url: 'https://www.gardenoflife.com/products/vitamin-c' }] },
      ],
    },
    // 26. Niacinamide (B3)
    {
      ingredient: 'Niacinamide (Vitamin B3)', ingredient_slug: 'niacinamide', scientific_name: 'Nicotinamide',
      mechanism: 'Amide form of niacin that does not cause flushing. NAD+ precursor via the salvage pathway. Supports skin health, DNA repair, and cellular energy production.',
      typical_dose: '500-1500 mg/day', subcategory: 'vitamin',
      pathways: ['NAD+', 'DNA repair', 'skin health', 'energy'],
      research: [{ authors: 'Chen AC, et al.', year: 2015, journal: 'NEJM', finding: 'Niacinamide 500 mg twice daily reduced non-melanoma skin cancer by 23% in high-risk patients.' }],
      interactions: [{ substance: 'High-dose niacin', severity: 'info', mechanism: 'Both contribute to NAD+ — watch total niacin/niacinamide intake' }],
      synergies: [{ ingredient: 'Nicotinamide Riboside', mechanism: 'Different NAD+ synthesis pathways — can be complementary' }],
      products: [
        { name: 'NOW Niacinamide 500mg', slug: 'niacinamide-now-500mg', brand: 'NOW Foods', dose_mg: 500, form: 'capsule', servings: 100, prices: [{ vendor: 'iherb', price: 6.99, url: 'https://www.iherb.com/pr/now-niacinamide-500mg' }, { vendor: 'now-foods', price: 7.99, url: 'https://www.nowfoods.com/products/supplements/niacinamide-500mg' }] },
        { name: 'Life Extension Vitamin B3 Niacinamide 500mg', slug: 'niacinamide-le-500mg', brand: 'Life Extension', dose_mg: 500, form: 'capsule', servings: 100, prices: [{ vendor: 'life-extension', price: 7.50, url: 'https://www.lifeextension.com/vitamins-supplements/item00372/vitamin-b3-niacinamide' }] },
        { name: 'Nutricost Niacinamide 500mg', slug: 'niacinamide-nutricost-500mg', brand: 'Nutricost', dose_mg: 500, form: 'capsule', servings: 240, prices: [{ vendor: 'nutricost', price: 9.95, url: 'https://www.nutricost.com/products/niacinamide-500mg' }] },
      ],
    },
    // 27. Melatonin
    {
      ingredient: 'Melatonin', ingredient_slug: 'melatonin', scientific_name: 'N-Acetyl-5-methoxytryptamine',
      mechanism: 'Hormone produced by the pineal gland that regulates circadian rhythm. Also a potent antioxidant that accumulates in mitochondria. Production declines with age.',
      typical_dose: '0.3-5 mg/day (lower doses often more effective)', subcategory: 'sleep',
      pathways: ['sleep/recovery', 'antioxidant', 'mitochondrial', 'immune regulation'],
      research: [{ authors: 'Ferracioli-Oda E, et al.', year: 2013, journal: 'PLoS ONE', finding: 'Melatonin significantly reduced sleep onset latency and increased total sleep time.' }],
      interactions: [{ substance: 'Blood thinners', severity: 'mild', mechanism: 'May increase bleeding risk' }, { substance: 'Diabetes medications', severity: 'mild', mechanism: 'May affect blood sugar levels' }],
      synergies: [{ ingredient: 'Magnesium', mechanism: 'Both support sleep onset and quality' }],
      products: [
        { name: 'NOW Melatonin 3mg', slug: 'melatonin-now-3mg', brand: 'NOW Foods', dose_mg: 3, form: 'capsule', servings: 180, prices: [{ vendor: 'iherb', price: 5.99, url: 'https://www.iherb.com/pr/now-melatonin-3mg' }, { vendor: 'now-foods', price: 6.99, url: 'https://www.nowfoods.com/products/supplements/melatonin-3mg' }] },
        { name: 'Life Extension Melatonin 3mg', slug: 'melatonin-le-3mg', brand: 'Life Extension', dose_mg: 3, form: 'capsule', servings: 60, prices: [{ vendor: 'life-extension', price: 6.75, url: 'https://www.lifeextension.com/vitamins-supplements/item00329/melatonin-3mg' }] },
        { name: 'Nutricost Melatonin 5mg', slug: 'melatonin-nutricost-5mg', brand: 'Nutricost', dose_mg: 5, form: 'tablet', servings: 240, prices: [{ vendor: 'nutricost', price: 8.95, url: 'https://www.nutricost.com/products/melatonin-5mg' }] },
      ],
    },
    // 28. Astaxanthin
    {
      ingredient: 'Astaxanthin', ingredient_slug: 'astaxanthin', scientific_name: '3,3\'-dihydroxy-beta,beta-carotene-4,4\'-dione',
      mechanism: 'Embeds into cellular and mitochondrial membranes, neutralizing oxidative stress. Activates Nrf2 antioxidant pathway.',
      typical_dose: '4-12 mg/day', subcategory: 'antioxidant',
      pathways: ['mitochondrial', 'antioxidant', 'anti-inflammatory'],
      research: [{ authors: 'Harrison DE, et al.', year: 2023, journal: 'GeroScience', finding: 'NIA ITP: Astaxanthin extended median male lifespan by 12% in mice.' }],
      interactions: [{ substance: 'Antihypertensives', severity: 'mild', mechanism: 'May lower blood pressure additively' }],
      synergies: [{ ingredient: 'Omega-3', mechanism: 'Both fat-soluble; co-ingestion enhances absorption' }],
      products: [
        { name: 'NOW Astaxanthin 12mg', slug: 'astaxanthin-now-12mg', brand: 'NOW Foods', dose_mg: 12, form: 'softgel', servings: 60, prices: [{ vendor: 'iherb', price: 24.99, url: 'https://www.iherb.com/pr/now-astaxanthin-12mg' }, { vendor: 'amazon', price: 22.99, url: 'https://www.amazon.com/dp/B00GW8GE82' }] },
        { name: 'Life Extension Astaxanthin 4mg', slug: 'astaxanthin-le-4mg', brand: 'Life Extension', dose_mg: 4, form: 'softgel', servings: 30, prices: [{ vendor: 'life-extension', price: 10.50, url: 'https://www.lifeextension.com/vitamins-supplements/item01923/astaxanthin' }] },
        { name: 'Nootropics Depot Astaxanthin 12mg', slug: 'astaxanthin-nd-12mg', brand: 'Nootropics Depot', dose_mg: 12, form: 'softgel', servings: 60, prices: [{ vendor: 'nootropics-depot', price: 26.99, url: 'https://nootropicsdepot.com/astaxanthin-softgels/' }] },
      ],
    },
    // 29. TMG
    {
      ingredient: 'TMG (Trimethylglycine)', ingredient_slug: 'tmg', scientific_name: 'Betaine anhydrous',
      mechanism: 'Methyl donor that converts homocysteine to methionine via BHMT. Provides methyl groups consumed during NR/NMN metabolism.',
      typical_dose: '500-1500 mg/day', subcategory: 'methylation',
      pathways: ['methylation', 'cardiovascular', 'liver health'],
      research: [{ authors: 'Olthof MR, Verhoef P', year: 2005, journal: 'J Nutr', finding: 'TMG lowered fasting homocysteine by 4 umol/L.' }],
      interactions: [],
      synergies: [{ ingredient: 'NR', mechanism: 'NR consumes methyl groups; TMG replenishes them' }],
      products: [
        { name: 'NOW TMG 1000mg', slug: 'tmg-now-1000mg', brand: 'NOW Foods', dose_mg: 1000, form: 'tablet', servings: 100, prices: [{ vendor: 'iherb', price: 12.99, url: 'https://www.iherb.com/pr/now-tmg-1000mg' }, { vendor: 'amazon', price: 11.49, url: 'https://www.amazon.com/dp/B000MGSC48' }] },
        { name: 'Thorne TMG 1000mg', slug: 'tmg-thorne-1000mg', brand: 'Thorne', dose_mg: 1000, form: 'capsule', servings: 60, prices: [{ vendor: 'thorne', price: 22.00, url: 'https://www.thorne.com/products/dp/tmg' }] },
        { name: 'Life Extension TMG 500mg', slug: 'tmg-le-500mg', brand: 'Life Extension', dose_mg: 500, form: 'capsule', servings: 60, prices: [{ vendor: 'life-extension', price: 7.50, url: 'https://www.lifeextension.com/vitamins-supplements/item01859/tmg' }] },
      ],
    },
    // 30. B12
    {
      ingredient: 'Vitamin B12 (Methylcobalamin)', ingredient_slug: 'vitamin-b12', scientific_name: 'Methylcobalamin',
      mechanism: 'Active form of B12 directly usable as a methyl donor. Essential for homocysteine metabolism and neurological function.',
      typical_dose: '1000-5000 mcg/day', subcategory: 'methylation',
      pathways: ['methylation', 'energy', 'neurological'],
      research: [{ authors: 'Smith AD, et al.', year: 2010, journal: 'PLoS ONE', finding: 'High-dose B vitamins slowed brain atrophy rate by 30% in elderly with mild cognitive impairment.' }],
      interactions: [{ substance: 'Metformin', severity: 'info', mechanism: 'Metformin reduces B12 absorption' }],
      synergies: [{ ingredient: '5-MTHF (Folate)', mechanism: 'B12 and folate work together in methionine cycle' }],
      products: [
        { name: 'Thorne Methylcobalamin 1000mcg', slug: 'b12-thorne-1000mcg', brand: 'Thorne', dose_mg: 1, dose_unit: 'mcg', form: 'capsule', servings: 60, prices: [{ vendor: 'thorne', price: 14.00, url: 'https://www.thorne.com/products/dp/methylcobalamin' }] },
        { name: 'NOW Methyl B-12 5000mcg', slug: 'b12-now-5000mcg', brand: 'NOW Foods', dose_mg: 5, dose_unit: 'mcg', form: 'lozenge', servings: 120, prices: [{ vendor: 'iherb', price: 13.99, url: 'https://www.iherb.com/pr/now-methyl-b12-5000mcg' }, { vendor: 'amazon', price: 11.99, url: 'https://www.amazon.com/dp/B003O1GGGK' }] },
        { name: 'Jarrow Methyl B-12 5000mcg', slug: 'b12-jarrow-5000mcg', brand: 'Jarrow Formulas', dose_mg: 5, dose_unit: 'mcg', form: 'lozenge', servings: 60, prices: [{ vendor: 'jarrow', price: 13.95, url: 'https://www.jarrow.com/products/methyl-b12-5000mcg' }] },
      ],
    },
    // 31. 5-MTHF
    {
      ingredient: '5-MTHF (Active Folate)', ingredient_slug: '5-mthf', scientific_name: '5-Methyltetrahydrofolate',
      mechanism: 'Bioactive form of folate bypassing MTHFR enzyme. Critical methyl donor for DNA synthesis and repair.',
      typical_dose: '400-1000 mcg/day', subcategory: 'methylation',
      pathways: ['methylation', 'DNA repair', 'neurological'],
      research: [{ authors: 'Scaglione F, Panzavolta G', year: 2014, journal: 'Drugs', finding: '5-MTHF bypasses MTHFR polymorphisms affecting 40%+ of population.' }],
      interactions: [{ substance: 'Methotrexate', severity: 'high', mechanism: 'Folate may reduce methotrexate efficacy' }],
      synergies: [{ ingredient: 'Vitamin B12', mechanism: 'Works in concert in methionine cycle' }],
      products: [
        { name: 'Thorne 5-MTHF 1mg', slug: '5mthf-thorne-1mg', brand: 'Thorne', dose_mg: 1, form: 'capsule', servings: 60, prices: [{ vendor: 'thorne', price: 16.00, url: 'https://www.thorne.com/products/dp/5-mthf-1-mg' }] },
        { name: 'Pure Encapsulations Folate 1000mcg', slug: '5mthf-pe-1000mcg', brand: 'Pure Encapsulations', dose_mg: 1, form: 'capsule', servings: 90, prices: [{ vendor: 'pure-encapsulations', price: 19.80, url: 'https://www.pureencapsulations.com/folate-1000.html' }] },
        { name: 'Jarrow Methyl Folate 400mcg', slug: '5mthf-jarrow-400mcg', brand: 'Jarrow Formulas', dose_mg: 0.4, form: 'capsule', servings: 60, prices: [{ vendor: 'jarrow', price: 8.95, url: 'https://www.jarrow.com/products/methyl-folate-400mcg' }] },
      ],
    },
    // 32. B6
    {
      ingredient: 'Vitamin B6 (P-5-P)', ingredient_slug: 'vitamin-b6', scientific_name: 'Pyridoxal-5-Phosphate',
      mechanism: 'Active form of B6 serving as cofactor for 150+ enzymatic reactions. Essential for neurotransmitter synthesis and homocysteine metabolism.',
      typical_dose: '25-100 mg/day as P-5-P', subcategory: 'methylation',
      pathways: ['methylation', 'neurological', 'immune'],
      research: [{ authors: 'Ueland PM, et al.', year: 2017, journal: 'Am J Clin Nutr', finding: 'B6 deficiency independently associated with inflammation and elevated homocysteine.' }],
      interactions: [{ substance: 'Levodopa', severity: 'moderate', mechanism: 'B6 can reduce levodopa efficacy' }],
      synergies: [{ ingredient: 'Vitamin B12', mechanism: 'B6 + B12 + folate optimize homocysteine metabolism' }],
      products: [
        { name: 'Thorne Pyridoxal 5\'-Phosphate 180mg', slug: 'b6-thorne-180mg', brand: 'Thorne', dose_mg: 180, form: 'capsule', servings: 60, prices: [{ vendor: 'thorne', price: 18.00, url: 'https://www.thorne.com/products/dp/pyridoxal-5-phosphate' }] },
        { name: 'NOW P-5-P 50mg', slug: 'b6-now-50mg', brand: 'NOW Foods', dose_mg: 50, form: 'capsule', servings: 90, prices: [{ vendor: 'iherb', price: 11.99, url: 'https://www.iherb.com/pr/now-p-5-p-50mg' }, { vendor: 'amazon', price: 9.99, url: 'https://www.amazon.com/dp/B001G7R05Q' }] },
      ],
    },
    // 33. Prebiotics (Inulin)
    {
      ingredient: 'Prebiotics (Inulin/GOS)', ingredient_slug: 'prebiotics', scientific_name: 'Inulin / Galactooligosaccharides',
      mechanism: 'Non-digestible fibers that selectively feed beneficial gut bacteria (Bifidobacteria, Lactobacillus). Promote short-chain fatty acid production including butyrate.',
      typical_dose: '5-10 g/day (start low, increase gradually)', subcategory: 'gut-health',
      pathways: ['gut health', 'immune regulation', 'metabolic'],
      research: [{ authors: 'Slavin J', year: 2013, journal: 'Nutrients', finding: 'Prebiotic fibers improve gut microbiota composition and increase mineral absorption.' }],
      interactions: [],
      synergies: [{ ingredient: 'Tributyrin', mechanism: 'Prebiotics feed butyrate producers while tributyrin provides direct butyrate' }],
      products: [
        { name: 'NOW Organic Inulin Powder', slug: 'prebiotics-now-inulin', brand: 'NOW Foods', dose_mg: 4500, form: 'powder', servings: 57, prices: [{ vendor: 'iherb', price: 10.99, url: 'https://www.iherb.com/pr/now-inulin-powder' }, { vendor: 'now-foods', price: 11.99, url: 'https://www.nowfoods.com/products/supplements/inulin-powder' }] },
        { name: 'Garden of Life Raw Organic Fiber', slug: 'prebiotics-gol-fiber', brand: 'Garden of Life', dose_mg: 9000, form: 'powder', servings: 40, prices: [{ vendor: 'garden-of-life', price: 24.99, url: 'https://www.gardenoflife.com/products/raw-organic-fiber' }] },
        { name: 'Bulk Supplements Inulin Powder', slug: 'prebiotics-bulk-inulin', brand: 'Bulk Supplements', dose_mg: 5000, form: 'powder', servings: 200, prices: [{ vendor: 'bulk-supplements', price: 16.96, url: 'https://www.bulksupplements.com/products/inulin-powder' }] },
      ],
    },
    // 34. Glucosamine
    {
      ingredient: 'Glucosamine', ingredient_slug: 'glucosamine', scientific_name: 'Glucosamine sulfate / HCl',
      mechanism: 'Amino sugar that serves as building block for glycosaminoglycans in cartilage. May slow cartilage degradation and has emerging evidence for longevity via hexosamine pathway.',
      typical_dose: '1500 mg/day', subcategory: 'skin-joint',
      pathways: ['joint health', 'anti-inflammatory', 'longevity'],
      research: [{ authors: 'Bell GA, et al.', year: 2012, journal: 'Eur J Epidemiology', finding: 'Regular glucosamine use associated with 18% lower all-cause mortality in large cohort study.' }],
      interactions: [{ substance: 'Warfarin', severity: 'moderate', mechanism: 'May increase INR and bleeding risk' }],
      synergies: [{ ingredient: 'MSM', mechanism: 'Glucosamine + MSM is a classic joint health combination' }],
      products: [
        { name: 'NOW Glucosamine Sulfate 750mg', slug: 'glucosamine-now-750mg', brand: 'NOW Foods', dose_mg: 750, form: 'capsule', servings: 240, prices: [{ vendor: 'iherb', price: 19.99, url: 'https://www.iherb.com/pr/now-glucosamine-sulfate-750mg' }] },
        { name: 'Jarrow Glucosamine + Chondroitin', slug: 'glucosamine-jarrow-750mg', brand: 'Jarrow Formulas', dose_mg: 750, form: 'capsule', servings: 120, prices: [{ vendor: 'jarrow', price: 22.95, url: 'https://www.jarrow.com/products/glucosamine-chondroitin' }] },
        { name: 'Nature\'s Way Glucosamine 1500mg', slug: 'glucosamine-nw-1500mg', brand: 'Nature\'s Way', dose_mg: 1500, form: 'tablet', servings: 60, prices: [{ vendor: 'natures-way', price: 14.99, url: 'https://www.naturesway.com/products/glucosamine-1500mg' }] },
      ],
    },
    // 35. MSM
    {
      ingredient: 'MSM', ingredient_slug: 'msm', scientific_name: 'Methylsulfonylmethane',
      mechanism: 'Organic sulfur compound that supports connective tissue, reduces inflammation, and provides sulfur for glutathione synthesis.',
      typical_dose: '1000-3000 mg/day', subcategory: 'skin-joint',
      pathways: ['joint health', 'anti-inflammatory', 'antioxidant', 'skin health'],
      research: [{ authors: 'Butawan M, et al.', year: 2017, journal: 'Nutrients', finding: 'MSM reduces inflammation, oxidative stress, and supports joint comfort in clinical trials.' }],
      interactions: [],
      synergies: [{ ingredient: 'Glucosamine', mechanism: 'Classic joint health combination' }, { ingredient: 'Vitamin C', mechanism: 'Both support collagen and connective tissue' }],
      products: [
        { name: 'NOW MSM 1000mg', slug: 'msm-now-1000mg', brand: 'NOW Foods', dose_mg: 1000, form: 'capsule', servings: 240, prices: [{ vendor: 'iherb', price: 14.99, url: 'https://www.iherb.com/pr/now-msm-1000mg' }, { vendor: 'now-foods', price: 15.99, url: 'https://www.nowfoods.com/products/supplements/msm-1000mg' }] },
        { name: 'Jarrow MSM 1000mg', slug: 'msm-jarrow-1000mg', brand: 'Jarrow Formulas', dose_mg: 1000, form: 'tablet', servings: 200, prices: [{ vendor: 'jarrow', price: 14.95, url: 'https://www.jarrow.com/products/msm-1000mg' }] },
        { name: 'Bulk Supplements MSM Powder', slug: 'msm-bulk-1g', brand: 'Bulk Supplements', dose_mg: 1000, form: 'powder', servings: 1000, prices: [{ vendor: 'bulk-supplements', price: 17.96, url: 'https://www.bulksupplements.com/products/msm-powder' }] },
      ],
    },
    // 36. PQQ
    {
      ingredient: 'PQQ (Pyrroloquinoline Quinone)', ingredient_slug: 'pqq', scientific_name: 'Pyrroloquinoline quinone disodium salt',
      mechanism: 'Stimulates mitochondrial biogenesis via PGC-1alpha activation. Potent antioxidant (up to 5000x the redox cycling capacity of vitamin C). Supports neuronal growth factors.',
      typical_dose: '10-20 mg/day', subcategory: 'mitochondrial',
      pathways: ['mitochondrial', 'cognitive', 'antioxidant', 'neuroprotective'],
      research: [{ authors: 'Harris CB, et al.', year: 2013, journal: 'J Nutr Biochem', finding: 'PQQ supplementation reduced inflammation markers (CRP, IL-6) in healthy adults.' }],
      interactions: [],
      synergies: [{ ingredient: 'CoQ10', mechanism: 'PQQ creates new mitochondria; CoQ10 optimizes existing ones' }],
      products: [
        { name: 'Life Extension PQQ 20mg', slug: 'pqq-le-20mg', brand: 'Life Extension', dose_mg: 20, form: 'capsule', servings: 30, prices: [{ vendor: 'life-extension', price: 18.00, url: 'https://www.lifeextension.com/vitamins-supplements/item01500/pqq-caps' }] },
        { name: 'Nootropics Depot PQQ 20mg', slug: 'pqq-nd-20mg', brand: 'Nootropics Depot', dose_mg: 20, form: 'capsule', servings: 60, prices: [{ vendor: 'nootropics-depot', price: 24.99, url: 'https://nootropicsdepot.com/pqq-capsules/' }] },
        { name: 'Jarrow PQQ 20mg', slug: 'pqq-jarrow-20mg', brand: 'Jarrow Formulas', dose_mg: 20, form: 'capsule', servings: 30, prices: [{ vendor: 'jarrow', price: 18.95, url: 'https://www.jarrow.com/products/pqq-20mg' }, { vendor: 'iherb', price: 17.49, url: 'https://www.iherb.com/pr/jarrow-pqq-20mg' }] },
      ],
    },
    // 37. NMN
    {
      ingredient: 'NMN (Nicotinamide Mononucleotide)', ingredient_slug: 'nmn', scientific_name: 'beta-Nicotinamide mononucleotide',
      mechanism: 'NAD+ precursor via the salvage pathway. Converted to NAD+ by NMNAT enzymes. Research suggests oral NMN effectively elevates NAD+ in humans.',
      typical_dose: '250-1000 mg/day', subcategory: 'nad-precursor',
      pathways: ['NAD+', 'mitochondrial', 'anti-aging', 'DNA repair'],
      research: [{ authors: 'Yi L, et al.', year: 2023, journal: 'GeroScience', finding: 'NMN supplementation elevated NAD+ and improved muscle function in middle-aged adults.' }],
      interactions: [{ substance: 'Methyl donors', severity: 'info', mechanism: 'Like NR, may consume methyl groups — consider pairing with TMG' }],
      synergies: [{ ingredient: 'TMG', mechanism: 'Replenishes methyl groups consumed during NMN metabolism' }, { ingredient: 'Apigenin', mechanism: 'Inhibits CD38 to prevent NAD+ degradation' }],
      products: [
        { name: 'Nootropics Depot NMN 250mg', slug: 'nmn-nd-250mg', brand: 'Nootropics Depot', dose_mg: 250, form: 'capsule', servings: 60, prices: [{ vendor: 'nootropics-depot', price: 34.99, url: 'https://nootropicsdepot.com/nmn-capsules/' }] },
        { name: 'Life Extension NAD+ Cell Regenerator (NMN) 250mg', slug: 'nmn-le-250mg', brand: 'Life Extension', dose_mg: 250, form: 'capsule', servings: 30, prices: [{ vendor: 'life-extension', price: 37.50, url: 'https://www.lifeextension.com/vitamins-supplements/item02344/nad-cell-regenerator-nmn' }] },
      ],
    },
    // 38. Spermidine
    {
      ingredient: 'Spermidine', ingredient_slug: 'spermidine', scientific_name: 'N-(3-aminopropyl)butane-1,4-diamine',
      mechanism: 'Potent inducer of autophagy. Promotes cellular recycling of damaged organelles and misfolded proteins.',
      typical_dose: '1-6 mg/day', subcategory: 'autophagy',
      pathways: ['autophagy', 'epigenetic', 'anti-inflammatory', 'cardiovascular'],
      research: [{ authors: 'Eisenberg T, et al.', year: 2016, journal: 'Nature Medicine', finding: 'Dietary spermidine extended lifespan and exerted cardioprotective effects in mice.' }],
      interactions: [],
      synergies: [{ ingredient: 'Fasting', mechanism: 'Spermidine mimics fasting-induced autophagy' }],
      products: [
        { name: 'Life Extension Geroprotect Autophagy Renew', slug: 'spermidine-le-autophagy', brand: 'Life Extension', dose_mg: 1, form: 'capsule', servings: 30, prices: [{ vendor: 'life-extension', price: 22.50, url: 'https://www.lifeextension.com/vitamins-supplements/item02415/geroprotect-autophagy-renew' }] },
        { name: 'spermidineLIFE 1mg', slug: 'spermidine-slife-1mg', brand: 'spermidineLIFE', dose_mg: 1, form: 'capsule', servings: 60, prices: [{ vendor: 'amazon', price: 49.95, url: 'https://www.amazon.com/dp/B096KSGWP5' }] },
      ],
    },
    // 39. Ca-AKG
    {
      ingredient: 'Calcium Alpha-Ketoglutarate', ingredient_slug: 'calcium-akg', scientific_name: 'Calcium 2-oxoglutarate',
      mechanism: 'Substrate for TET enzymes regulating epigenetic age through DNA methylation. Key Krebs cycle intermediate.',
      typical_dose: '1000 mg/day', subcategory: 'epigenetic',
      pathways: ['epigenetic', 'mitochondrial', 'anti-inflammatory'],
      research: [{ authors: 'Asadi Shahmirzadi A, et al.', year: 2020, journal: 'Cell Metabolism', finding: 'Ca-AKG extended lifespan ~12% and compressed morbidity in aging mice.' }],
      interactions: [{ substance: 'Calcium supplements', severity: 'info', mechanism: 'Contains calcium — consider total daily intake' }],
      synergies: [],
      products: [
        { name: 'ProHealth Longevity Ca-AKG 1000mg', slug: 'cakg-prohealth-1000mg', brand: 'ProHealth', dose_mg: 1000, form: 'capsule', servings: 60, prices: [{ vendor: 'amazon', price: 34.95, url: 'https://www.amazon.com/dp/B09BKFDLBG' }] },
        { name: 'Nootropics Depot Ca-AKG 500mg', slug: 'cakg-nd-500mg', brand: 'Nootropics Depot', dose_mg: 500, form: 'capsule', servings: 180, prices: [{ vendor: 'nootropics-depot', price: 24.99, url: 'https://nootropicsdepot.com/calcium-alpha-ketoglutarate/' }] },
      ],
    },
    // 40. Tetrahydrocurcumin
    {
      ingredient: 'Tetrahydrocurcumin', ingredient_slug: 'tetrahydrocurcumin', scientific_name: '1,7-bis(4-hydroxyphenyl)heptane-3,5-dione',
      mechanism: 'Active metabolite of curcumin with superior bioavailability. Potent anti-inflammatory via NF-kB inhibition.',
      typical_dose: '250-500 mg/day', subcategory: 'anti-inflammatory',
      pathways: ['anti-inflammatory', 'antioxidant', 'epigenetic'],
      research: [{ authors: 'Kitani K, et al.', year: 2007, journal: 'Biogerontology', finding: 'Mice fed tetrahydrocurcumin had 11.7% increased lifespan.' }],
      interactions: [{ substance: 'Anticoagulants', severity: 'mild', mechanism: 'Mild anti-platelet effects' }],
      synergies: [{ ingredient: 'Black pepper extract', mechanism: 'Piperine enhances curcuminoid bioavailability' }],
      products: [
        { name: 'Nootropics Depot Tetrahydrocurcumin 250mg', slug: 'thc-nd-250mg', brand: 'Nootropics Depot', dose_mg: 250, form: 'capsule', servings: 120, prices: [{ vendor: 'nootropics-depot', price: 21.99, url: 'https://nootropicsdepot.com/tetrahydrocurcumin-capsules/' }] },
        { name: 'Life Extension Curcumin Elite 500mg', slug: 'curcumin-le-500mg', brand: 'Life Extension', dose_mg: 500, form: 'capsule', servings: 60, prices: [{ vendor: 'life-extension', price: 22.50, url: 'https://www.lifeextension.com/vitamins-supplements/item02407/curcumin-elite' }] },
      ],
    },
    // 41. Hyaluronic Acid
    {
      ingredient: 'Hyaluronic Acid', ingredient_slug: 'hyaluronic-acid', scientific_name: 'Hyaluronan',
      mechanism: 'Maintains extracellular matrix hydration and supports skin elasticity and joint lubrication.',
      typical_dose: '100-200 mg/day', subcategory: 'skin-joint',
      pathways: ['skin/joint health', 'extracellular matrix'],
      research: [{ authors: 'Oe M, et al.', year: 2017, journal: 'J Evidence-Based CAM', finding: '120 mg/day oral HA improved skin hydration and wrinkle depth over 12 weeks.' }],
      interactions: [],
      synergies: [{ ingredient: 'Vitamin C', mechanism: 'Supports endogenous HA synthesis' }],
      products: [
        { name: 'NOW Hyaluronic Acid 100mg', slug: 'ha-now-100mg', brand: 'NOW Foods', dose_mg: 100, form: 'capsule', servings: 60, prices: [{ vendor: 'iherb', price: 18.99, url: 'https://www.iherb.com/pr/now-hyaluronic-acid-100mg' }, { vendor: 'amazon', price: 16.49, url: 'https://www.amazon.com/dp/B001F1G8FC' }] },
        { name: 'Life Extension Hyaluronic Acid 100mg', slug: 'ha-le-100mg', brand: 'Life Extension', dose_mg: 100, form: 'capsule', servings: 60, prices: [{ vendor: 'life-extension', price: 16.50, url: 'https://www.lifeextension.com/vitamins-supplements/item01878/skin-restoring-ceramides' }] },
      ],
    },
    // 42. Tributyrin
    {
      ingredient: 'Tributyrin', ingredient_slug: 'tributyrin', scientific_name: 'Glyceryl tributyrate',
      mechanism: 'Pro-drug delivering butyrate to the colon. Primary energy source for colonocytes, maintains gut barrier integrity.',
      typical_dose: '300-1000 mg/day', subcategory: 'gut-health',
      pathways: ['gut health', 'epigenetic', 'anti-inflammatory'],
      research: [{ authors: 'Liu H, et al.', year: 2018, journal: 'Advances in Nutrition', finding: 'Butyrate maintains intestinal barrier and has therapeutic potential in IBD.' }],
      interactions: [],
      synergies: [{ ingredient: 'Spermidine', mechanism: 'Complementary gut health mechanisms' }],
      products: [
        { name: 'BodyBio Tributyrin 500mg', slug: 'tributyrin-bodybio-500mg', brand: 'BodyBio', dose_mg: 500, form: 'capsule', servings: 60, prices: [{ vendor: 'amazon', price: 49.95, url: 'https://www.amazon.com/dp/B0BM3TY95X' }] },
        { name: 'Life Extension Florassist GI 250mg', slug: 'tributyrin-le-250mg', brand: 'Life Extension', dose_mg: 250, form: 'capsule', servings: 30, prices: [{ vendor: 'life-extension', price: 18.75, url: 'https://www.lifeextension.com/vitamins-supplements/item02125/florassist-gi' }] },
      ],
    },
    // 43. Ergothioneine
    {
      ingredient: 'Ergothioneine', ingredient_slug: 'ergothioneine', scientific_name: 'L-Ergothioneine',
      mechanism: 'Amino acid with a dedicated cellular transporter (OCTN1), suggesting evolutionary importance. Accumulates in mitochondria to protect against oxidative damage.',
      typical_dose: '5-25 mg/day', subcategory: 'antioxidant',
      pathways: ['mitochondrial', 'antioxidant', 'neuroprotective'],
      research: [{ authors: 'Cheah IK, et al.', year: 2016, journal: 'Free Radical Biology & Medicine', finding: 'Low blood ergothioneine levels associated with cognitive impairment and frailty.' }],
      interactions: [],
      synergies: [{ ingredient: 'Astaxanthin', mechanism: 'Complementary water-soluble and lipid-soluble antioxidants' }],
      products: [
        { name: 'Nootropics Depot Ergothioneine 5mg', slug: 'ergo-nd-5mg', brand: 'Nootropics Depot', dose_mg: 5, form: 'capsule', servings: 60, prices: [{ vendor: 'nootropics-depot', price: 19.99, url: 'https://nootropicsdepot.com/ergothioneine-capsules/' }] },
        { name: 'Life Extension Ergothioneine 5mg', slug: 'ergo-le-5mg', brand: 'Life Extension', dose_mg: 5, form: 'capsule', servings: 30, prices: [{ vendor: 'life-extension', price: 16.50, url: 'https://www.lifeextension.com/vitamins-supplements/item02431/essential-youth' }] },
      ],
    },
  ];

  const insertProducts = db.transaction(() => {
    for (const ing of ingredientData) {
      for (const prod of ing.products) {
        const result = insertProduct.run(
          prod.name, prod.slug, ing.ingredient, ing.ingredient_slug, prod.brand,
          prod.dose_mg, (prod as any).dose_unit || 'mg', prod.form, prod.servings,
          'supplement', ing.subcategory,
          `${ing.ingredient}: ${ing.mechanism}`,
          ing.mechanism, ing.typical_dose, ing.scientific_name,
          JSON.stringify(ing.research), JSON.stringify(ing.interactions),
          JSON.stringify(ing.synergies), JSON.stringify(ing.pathways),
        );
        const productId = result.lastInsertRowid as number;
        for (const p of prod.prices) {
          const vendorId = vid[p.vendor];
          if (!vendorId) continue;
          const affiliateUrl = `${p.url}?ref=longevitystack`;
          insertPrice.run(productId, vendorId, p.price, p.url, affiliateUrl);
        }
      }
    }
  });
  insertProducts();

  // ========== PROTOCOLS (Biohacker Stacks) ==========
  const insertStack = db.prepare(`
    INSERT INTO stacks (name, slug, description, goal, ingredients, dosing_notes, source, source_url, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const protocols = [
    {
      name: "Bryan Johnson's Blueprint",
      slug: 'bryan-johnson-blueprint',
      description: "Bryan Johnson's publicly shared supplement protocol from his Blueprint longevity program. Johnson spends over $2M/year on his anti-aging regimen. This represents the supplement portion of his stack that is available over-the-counter.",
      goal: "Comprehensive longevity optimization",
      ingredients: ['nr-le-300mg', 'tmg-now-1000mg', 'd3-thorne-5000iu', 'k2-le-200mcg', 'omega3-le-super', 'creatine-momentous-5g', 'vitc-now-1000mg', 'coq10-le-100mg', 'zinc-le-50mg', 'ashwagandha-nd-ksm66', 'garlic-le', 'curcumin-le-500mg', 'taurine-le-1000mg'],
      dosing_notes: "Johnson's protocol is highly specific with exact timing. Most supplements taken with breakfast. NR + TMG together in the morning. D3+K2 with fat-containing meal. This is a simplified representation — see blueprint.bryanjohnson.com for his full protocol.",
      source: 'Bryan Johnson - Blueprint Protocol',
      source_url: 'https://blueprint.bryanjohnson.com/',
    },
    {
      name: "Peter Attia's Core Stack",
      slug: 'peter-attia-stack',
      description: "Supplements Peter Attia has discussed taking on his podcast 'The Drive'. Attia is a physician focused on longevity medicine. He emphasizes that supplements are a small part of overall health strategy compared to exercise, sleep, nutrition, and emotional health.",
      goal: "Evidence-based longevity foundation",
      ingredients: ['d3-thorne-5000iu', 'omega3-le-super', 'magnesium-thorne-200mg', 'vitc-thorne-500mg', 'b12-thorne-1000mcg', 'ashwagandha-momentous-sensoril', 'creatine-thorne-5g'],
      dosing_notes: "Attia adjusts based on bloodwork. He's emphasized that individual needs vary. He takes magnesium before bed. Omega-3 dosing targets an Omega-3 Index above 8%. Get levels tested before supplementing.",
      source: 'Peter Attia - The Drive Podcast',
      source_url: 'https://peterattiamd.com/',
    },
    {
      name: "Andrew Huberman's Stack",
      slug: 'andrew-huberman-stack',
      description: "Supplements Andrew Huberman has discussed taking on the Huberman Lab podcast. Huberman is a Stanford neuroscience professor focused on brain health and performance. Many of these are available through Momentous, his partner brand.",
      goal: "Cognitive performance and brain health",
      ingredients: ['d3-thorne-5000iu', 'omega3-momentous', 'magnesium-thorne-200mg', 'theanine-momentous-200mg', 'alphagpc-momentous-300mg', 'ashwagandha-momentous-sensoril', 'apigenin-momentous-50mg', 'creatine-momentous-5g', 'nr-thorne-300mg', 'zinc-thorne-30mg'],
      dosing_notes: "Huberman's sleep stack (taken before bed): Magnesium Threonate (L-Threonate form), L-Theanine, Apigenin. Morning stack: D3, Omega-3, Alpha-GPC, Creatine. He cycles ashwagandha (1 month on, 1 month off).",
      source: 'Andrew Huberman - Huberman Lab Podcast',
      source_url: 'https://hubermanlab.com/',
    },
    {
      name: "Ben Greenfield's Stack",
      slug: 'ben-greenfield-stack',
      description: "Supplements from Ben Greenfield's published protocols in his book 'Boundless' and podcast. Greenfield is a biohacker and fitness expert focused on optimizing human performance and longevity.",
      goal: "Performance and longevity optimization",
      ingredients: ['d3-thorne-5000iu', 'k2-le-200mcg', 'omega3-nordic-1280mg', 'magnesium-now-200mg', 'creatine-now-5g', 'nac-now-600mg', 'coq10-le-100mg', 'berberine-le-500mg', 'collagen-vp-20g', 'astaxanthin-now-12mg', 'lionsmane-nd-500mg'],
      dosing_notes: "Greenfield typically takes antioxidants and fat-soluble vitamins with meals. NAC and berberine on empty stomach. Collagen in morning coffee. He emphasizes cycling certain supplements and adjusting based on bloodwork.",
      source: 'Ben Greenfield - Boundless / Podcast',
      source_url: 'https://bengreenfieldlife.com/',
    },
    {
      name: "Rhonda Patrick's Stack",
      slug: 'rhonda-patrick-stack',
      description: "Supplements Rhonda Patrick has discussed on her FoundMyFitness podcast and website. Patrick is a biomedical scientist focused on aging, cancer, and nutrition research. She emphasizes evidence-based supplementation.",
      goal: "Science-based health optimization",
      ingredients: ['d3-thorne-5000iu', 'k2-le-200mcg', 'omega3-nordic-1280mg', 'magnesium-thorne-200mg', 'vitc-thorne-500mg', 'sulforaphane-nd', 'nmn-nd-250mg'],
      dosing_notes: "Patrick has emphasized that her recommendations change as new research emerges. She targets specific blood levels: Omega-3 Index >8%, Vitamin D 40-60 ng/mL. She takes sulforaphane from broccoli sprouts or supplements.",
      source: 'Rhonda Patrick - FoundMyFitness',
      source_url: 'https://www.foundmyfitness.com/',
    },
  ];

  const insertProtocols = db.transaction(() => {
    for (const p of protocols) {
      insertStack.run(
        p.name, p.slug, p.description, p.goal,
        JSON.stringify(p.ingredients), p.dosing_notes,
        p.source, p.source_url, 1,
      );
    }
  });
  insertProtocols();
}
