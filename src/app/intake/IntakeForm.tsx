"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllStacks, Stack } from "@/lib/stacks";

// ─── Types ────────────────────────────────────────────────────────────────────

type YN = "yes" | "no" | "";
type Score = 0 | 1 | 2 | 3;
type StepId = "identity" | "stacks" | "contras" | "hrt" | "trt" | "medications" | "review";

type ContraItem = {
  id: string;
  text: string;
  severity: "HARD_STOP" | "FLAG";
  stopTitle?: string;
  stopMessage?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const SCORE_LABELS: Record<Score, string> = { 0: "None", 1: "Mild", 2: "Moderate", 3: "Severe" };

const HRT_SYMPTOMS = [
  { id: "hot-flashes", label: "Hot flashes" },
  { id: "night-sweats", label: "Night sweats" },
  { id: "sleep-disturbance", label: "Sleep disturbance" },
  { id: "mood-changes", label: "Mood changes / irritability" },
  { id: "brain-fog", label: "Brain fog / concentration" },
  { id: "vaginal-dryness", label: "Vaginal dryness" },
  { id: "pain-sex", label: "Pain during sex" },
  { id: "loss-of-libido", label: "Loss of libido" },
  { id: "joint-pain", label: "Joint pain / aches" },
  { id: "fatigue", label: "Fatigue" },
  { id: "weight-gain", label: "Weight / body composition changes" },
  { id: "hair-thinning", label: "Hair thinning" },
  { id: "skin-changes", label: "Skin dryness / changes" },
  { id: "urinary-symptoms", label: "Urinary urgency / frequency" },
];

const TRT_SYMPTOMS = [
  { id: "energy-trt", label: "Energy / fatigue" },
  { id: "libido-trt", label: "Libido / sex drive" },
  { id: "mood-trt", label: "Mood / depression" },
  { id: "strength-trt", label: "Strength / muscle mass" },
  { id: "sleep-trt", label: "Sleep quality" },
  { id: "cognitive-trt", label: "Cognitive function / brain fog" },
  { id: "body-comp-trt", label: "Body composition / fat gain" },
];

// ─── Contraindication data ─────────────────────────────────────────────────────
// Note: womens-hrt and testosterone-replacement are handled in dedicated steps.

const STACK_CONTRAS: Record<string, ContraItem[]> = {
  "core-cardio": [
    { id: "cc-nitrates", text: "Do you currently take nitrates (nitroglycerin, isosorbide)?", severity: "HARD_STOP", stopTitle: "Tadalafil + nitrates interaction", stopMessage: "Tadalafil combined with nitrates can cause a dangerous drop in blood pressure. This stack cannot be prescribed while you're on nitrate therapy. Please discuss alternatives with your primary care physician." },
    { id: "cc-liver", text: "Do you have severe liver disease?", severity: "HARD_STOP", stopTitle: "Liver disease", stopMessage: "Both rosuvastatin and tadalafil require hepatic metabolism. Severe liver disease is a contraindication for this stack." },
    { id: "cc-pregnant", text: "Are you currently pregnant?", severity: "HARD_STOP", stopTitle: "Pregnancy", stopMessage: "These medications are not safe in pregnancy." },
    { id: "cc-low-bp", text: "Do you have low blood pressure (hypotension)?", severity: "FLAG" },
    { id: "cc-alpha", text: "Do you take alpha-blockers (tamsulosin, prazosin, terazosin)?", severity: "FLAG" },
    { id: "cc-stroke", text: "Have you had a stroke or heart attack in the past 3 months?", severity: "FLAG" },
    { id: "cc-muscle-pain", text: "Have you had muscle pain or weakness while on a statin before?", severity: "FLAG" },
  ],
  "hair-men": [
    { id: "hm-conceiving", text: "Are you currently trying to conceive?", severity: "FLAG" },
    { id: "hm-sexual-se", text: "Have you had sexual side effects from finasteride or similar medications before?", severity: "FLAG" },
    { id: "hm-depression", text: "Do you have a current or recent history of depression?", severity: "FLAG" },
    { id: "hm-liver", text: "Do you have liver disease?", severity: "FLAG" },
    { id: "hm-low-bp", text: "Do you have low blood pressure?", severity: "FLAG" },
    { id: "hm-heart", text: "Do you have a history of heart failure or serious heart conditions?", severity: "FLAG" },
    { id: "hm-pregnant", text: "Are you or could you be pregnant?", severity: "HARD_STOP", stopTitle: "Pregnancy", stopMessage: "Finasteride is teratogenic and must not be taken during pregnancy." },
  ],
  "hair-pro-men": [
    { id: "hp-conceiving", text: "Are you currently trying to conceive?", severity: "FLAG" },
    { id: "hp-sexual-se", text: "Have you had sexual side effects from finasteride or dutasteride before?", severity: "FLAG" },
    { id: "hp-depression", text: "Do you have a current or recent history of depression?", severity: "FLAG" },
    { id: "hp-liver", text: "Do you have liver disease?", severity: "FLAG" },
    { id: "hp-low-bp", text: "Do you have low blood pressure?", severity: "FLAG" },
    { id: "hp-heart", text: "Do you have a history of heart failure or serious heart conditions?", severity: "FLAG" },
    { id: "hp-pregnant", text: "Are you or could you be pregnant?", severity: "HARD_STOP", stopTitle: "Pregnancy", stopMessage: "Dutasteride is teratogenic and must not be taken during pregnancy." },
  ],
  "hair-women": [
    { id: "hw-pregnant", text: "Are you currently pregnant or breastfeeding?", severity: "HARD_STOP", stopTitle: "Pregnancy", stopMessage: "Spironolactone is contraindicated in pregnancy and breastfeeding." },
    { id: "hw-kidney", text: "Do you have kidney disease?", severity: "FLAG" },
    { id: "hw-potassium", text: "Have you been told you have high potassium (hyperkalemia)?", severity: "FLAG" },
    { id: "hw-low-bp", text: "Do you have low blood pressure?", severity: "FLAG" },
  ],
  "skin": [
    { id: "sk-pregnant", text: "Are you currently pregnant, breastfeeding, or planning pregnancy in the next 3 months?", severity: "HARD_STOP", stopTitle: "Pregnancy", stopMessage: "Tretinoin is contraindicated in pregnancy. Please discontinue at least 1 month before attempting conception." },
    { id: "sk-sensitivity", text: "Do you have extremely sensitive skin or active eczema / rosacea?", severity: "FLAG" },
    { id: "sk-sun", text: "Do you have significant daily unprotected sun exposure (e.g. outdoor work)?", severity: "FLAG" },
  ],
  "inflammation": [
    { id: "ldn-opioids", text: "Are you currently taking opioid medications (oxycodone, hydrocodone, morphine, codeine, tramadol, buprenorphine, methadone)?", severity: "HARD_STOP", stopTitle: "Opioid medication conflict", stopMessage: "LDN is contraindicated with opioid medications. Taking LDN while on opioids causes immediate withdrawal. This stack cannot be prescribed while you're on opioid therapy." },
    { id: "ldn-recent-opioids", text: "Have you taken any opioid medications in the past 14 days?", severity: "HARD_STOP", stopTitle: "Recent opioid use", stopMessage: "LDN requires a minimum 14-day opioid-free window before starting. Please return once you have been off all opioids for at least 14 days." },
    { id: "ldn-mat", text: "Are you enrolled in a medication-assisted treatment program for opioid use disorder (Suboxone, methadone maintenance)?", severity: "HARD_STOP", stopTitle: "MAT program", stopMessage: "LDN is not appropriate while enrolled in opioid agonist maintenance therapy." },
    { id: "ldn-liver", text: "Do you have liver disease or significantly elevated liver enzymes?", severity: "FLAG" },
  ],
  "testosterone-enhancement": [
    { id: "enc-clots", text: "Have you had blood clots (DVT or pulmonary embolism) in the past?", severity: "FLAG" },
    { id: "enc-liver", text: "Do you have liver disease?", severity: "FLAG" },
    { id: "enc-vision", text: "Have you had visual disturbances on clomiphene or similar medications before?", severity: "FLAG" },
    { id: "enc-pituitary", text: "Do you have a known pituitary disorder or tumor?", severity: "FLAG" },
  ],
  "longevity-base": [
    { id: "lb-infection", text: "Do you have an active infection right now?", severity: "FLAG" },
    { id: "lb-immunocomp", text: "Are you immunocompromised (organ transplant, HIV, active cancer treatment)?", severity: "FLAG" },
    { id: "lb-surgery", text: "Have you had major surgery in the past 4 weeks, or do you have surgery planned in the next 4 weeks?", severity: "FLAG" },
    { id: "lb-egfr", text: "Do you have kidney disease with eGFR below 30?", severity: "HARD_STOP", stopTitle: "Kidney function", stopMessage: "Metformin is contraindicated when eGFR is below 30 due to lactic acidosis risk. The Longevity Base stack cannot be prescribed safely at this level of kidney function. Please consult your nephrologist." },
    { id: "lb-gi", text: "Do you have significant GI issues (gastroparesis, inflammatory bowel disease, gastric bypass)?", severity: "FLAG" },
    { id: "lb-lactic", text: "Do you have severe heart failure, severe liver disease, or a history of lactic acidosis?", severity: "HARD_STOP", stopTitle: "Lactic acidosis risk", stopMessage: "Metformin is contraindicated in conditions that significantly increase lactic acidosis risk. Please discuss with your primary care physician." },
    { id: "lb-alcohol", text: "Do you drink heavily (more than 14 drinks per week)?", severity: "FLAG" },
    { id: "lb-pregnant", text: "Are you currently pregnant or breastfeeding?", severity: "HARD_STOP", stopTitle: "Pregnancy", stopMessage: "Rapamycin and metformin are contraindicated in pregnancy." },
    { id: "lb-liver", text: "Do you have liver disease?", severity: "FLAG" },
  ],
  "longevity-glp1": [
    { id: "glp1-thyroid", text: "Have you been diagnosed with or told you are at high risk for medullary thyroid carcinoma?", severity: "HARD_STOP", stopTitle: "Medullary thyroid carcinoma", stopMessage: "GLP-1 receptor agonists are contraindicated in patients with known or suspected medullary thyroid carcinoma or MEN2 syndrome." },
    { id: "glp1-men2", text: "Do you have Multiple Endocrine Neoplasia syndrome type 2 (MEN2)?", severity: "HARD_STOP", stopTitle: "MEN2 syndrome", stopMessage: "GLP-1 receptor agonists are contraindicated in MEN2." },
    { id: "glp1-pancreatitis", text: "Have you had pancreatitis?", severity: "FLAG" },
    { id: "glp1-gastroparesis", text: "Do you have gastroparesis or severe GI motility issues?", severity: "FLAG" },
    { id: "glp1-gallbladder", text: "Do you have gallbladder disease or a history of gallstones?", severity: "FLAG" },
    { id: "glp1-pregnant", text: "Are you currently pregnant or breastfeeding?", severity: "HARD_STOP", stopTitle: "Pregnancy", stopMessage: "GLP-1 receptor agonists are contraindicated in pregnancy." },
    { id: "glp1-retinopathy", text: "Do you have diabetic retinopathy?", severity: "FLAG" },
    { id: "glp1-ondansetron", text: "Do you have a known allergy or sensitivity to ondansetron?", severity: "FLAG" },
    { id: "glp1-qtc", text: "Do you take medications that prolong the QT interval (certain antipsychotics, some antibiotics, antiarrhythmics)?", severity: "FLAG" },
  ],
  "longevity-sglt2": [
    { id: "sglt2-dka", text: "Have you had diabetic ketoacidosis?", severity: "FLAG" },
    { id: "sglt2-uti", text: "Do you have recurrent UTIs or yeast infections (more than 3 per year)?", severity: "FLAG" },
    { id: "sglt2-diuretics", text: "Are you currently on diuretics (water pills)?", severity: "FLAG" },
    { id: "sglt2-kidney", text: "Do you have kidney disease with eGFR below 45?", severity: "FLAG" },
    { id: "sglt2-pregnant", text: "Are you currently pregnant or breastfeeding?", severity: "HARD_STOP", stopTitle: "Pregnancy", stopMessage: "SGLT2 inhibitors are contraindicated in pregnancy." },
    { id: "sglt2-keto", text: "Do you follow prolonged fasting or a strict ketogenic diet?", severity: "FLAG" },
  ],
};

// HRT contraindications — Section C of the HRT step
const HRT_CONTRAS: ContraItem[] = [
  { id: "hrt-breast-cancer", text: "Have you ever been diagnosed with breast cancer?", severity: "HARD_STOP", stopTitle: "Breast cancer history", stopMessage: "HRT is generally contraindicated with a personal history of breast cancer. Please discuss hormone therapy options with your oncologist and gynecologist before proceeding." },
  { id: "hrt-endo-cancer", text: "Have you ever been diagnosed with endometrial (uterine) cancer?", severity: "HARD_STOP", stopTitle: "Endometrial cancer history", stopMessage: "Estrogen-containing HRT is generally contraindicated with a personal history of endometrial cancer. Please discuss with your gynecologist." },
  { id: "hrt-clots", text: "Have you ever had blood clots (DVT or pulmonary embolism)?", severity: "FLAG" },
  { id: "hrt-clotting-disorder", text: "Have you been diagnosed with an inherited clotting disorder (Factor V Leiden, antiphospholipid syndrome, etc.)?", severity: "FLAG" },
  { id: "hrt-family-breast", text: "Do you have a first-degree family history of breast cancer (mother, sister, or daughter)?", severity: "FLAG" },
  { id: "hrt-bleeding", text: "Have you had unexplained vaginal bleeding in the past 6 months?", severity: "HARD_STOP", stopTitle: "Unexplained vaginal bleeding", stopMessage: "Unexplained vaginal bleeding must be evaluated by a gynecologist before starting hormone therapy. This is a safety requirement, not a permanent disqualification. Once evaluated, you're welcome to return and complete your intake." },
  { id: "hrt-liver", text: "Do you have active liver disease?", severity: "FLAG" },
  { id: "hrt-smoking", text: "Do you currently smoke?", severity: "FLAG" },
  { id: "hrt-pregnant", text: "Are you currently pregnant or breastfeeding?", severity: "HARD_STOP", stopTitle: "Pregnancy", stopMessage: "Hormone replacement therapy is not appropriate during pregnancy or breastfeeding." },
];

// TRT contraindications — part of TRT step
const TRT_CONTRAS: ContraItem[] = [
  { id: "trt-prostate", text: "Have you been diagnosed with prostate cancer?", severity: "HARD_STOP", stopTitle: "Prostate cancer history", stopMessage: "Testosterone replacement is generally contraindicated with active or recent prostate cancer. Please discuss with your urologist or oncologist before proceeding." },
  { id: "trt-psa", text: "Have you had an elevated PSA or been told you have a prostate condition requiring monitoring?", severity: "FLAG" },
  { id: "trt-breast-cancer", text: "Have you been diagnosed with male breast cancer?", severity: "HARD_STOP", stopTitle: "Breast cancer history", stopMessage: "Testosterone replacement is contraindicated with male breast cancer." },
  { id: "trt-sleep-apnea", text: "Do you have untreated obstructive sleep apnea?", severity: "FLAG" },
  { id: "trt-clots", text: "Have you had blood clots (DVT or pulmonary embolism)?", severity: "FLAG" },
  { id: "trt-heart-failure", text: "Do you have severe or decompensated heart failure?", severity: "FLAG" },
  { id: "trt-hematocrit", text: "Have you been told you have high hematocrit (above 54%) or polycythemia?", severity: "FLAG" },
  { id: "trt-fertility", text: "Are you currently trying to conceive?", severity: "FLAG" },
  { id: "trt-liver", text: "Do you have liver disease?", severity: "FLAG" },
];

// ─── Small reusable components ────────────────────────────────────────────────

function YesNo({ value, onChange }: { value: YN; onChange: (v: YN) => void }) {
  return (
    <div className="flex gap-2 mt-2">
      {(["yes", "no"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`flex-1 py-3 rounded-lg border-2 text-sm font-semibold transition-colors ${
            value === v
              ? v === "yes"
                ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                : "border-[var(--green)] bg-[var(--card)] text-[var(--green)]"
              : "border-[var(--card-border)] text-[var(--muted)] hover:border-[var(--accent)]/30"
          }`}
        >
          {v === "yes" ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );
}

function ScoreInput({ value, onChange }: { value: Score; onChange: (v: Score) => void }) {
  return (
    <div className="grid grid-cols-4 gap-1.5 mt-2">
      {([0, 1, 2, 3] as Score[]).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`py-2.5 rounded-lg border-2 text-xs font-semibold transition-colors ${
            value === s
              ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
              : "border-[var(--card-border)] text-[var(--muted)] hover:border-[var(--accent)]/30"
          }`}
        >
          {SCORE_LABELS[s]}
        </button>
      ))}
    </div>
  );
}

function FieldInput({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">{label}</label>
      {children}
      {note && <p className="text-xs text-[var(--muted-light)] mt-1">{note}</p>}
    </div>
  );
}

function inputClass() {
  return "w-full bg-[var(--card)] border border-[var(--card-border)] rounded-lg px-3 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-light)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  initialStacks?: string[];
  initialGender?: "men" | "women";
}

export default function IntakeForm({ initialStacks = [], initialGender }: Props) {
  const allStacks = getAllStacks();

  // ── Infer gender from initial stacks if not provided ──────────────────────
  function inferGender(ids: string[]): "men" | "women" {
    if (initialGender) return initialGender;
    for (const id of ids) {
      const s = allStacks.find((s) => s.id === id);
      if (s?.forGender === "women") return "women";
      if (s?.forGender === "men") return "men";
    }
    return "men";
  }

  // ── Core state ────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStacks, setSelectedStacks] = useState<string[]>(
    initialStacks.filter((id) => !allStacks.find((s) => s.id === id)?.waitlist)
  );
  const [gender, setGender] = useState<"men" | "women">(inferGender(initialStacks));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [state, setState] = useState("");

  // ── Contraindication answers (all steps share this dict) ──────────────────
  const [contraAnswers, setContraAnswers] = useState<Record<string, YN>>({});

  // ── HRT state ─────────────────────────────────────────────────────────────
  const [hrtLastPeriod, setHRTLastPeriod] = useState("");
  const [hrtHysterectomy, setHRTHysterectomy] = useState<YN>("");
  const [hrtOvaries, setHRTOvaries] = useState("");
  const [hrtSurgicalDate, setHRTSurgicalDate] = useState("");
  const [hrtSymptoms, setHRTSymptoms] = useState<Record<string, Score>>({});
  const [hrtPriorHRT, setHRTPriorHRT] = useState<YN>("");
  const [hrtPriorHRTDetails, setHRTPriorHRTDetails] = useState("");
  const [hrtDeliveryPref, setHRTDeliveryPref] = useState("");
  const [hrtAddTestosterone, setHRTAddTestosterone] = useState("");
  const [hrtNotes, setHRTNotes] = useState("");

  // ── TRT state ─────────────────────────────────────────────────────────────
  const [trtSymptoms, setTRTSymptoms] = useState<Record<string, Score>>({});
  const [trtHasRecentLabs, setTRTHasRecentLabs] = useState<YN>("");
  const [trtLabOptOut, setTRTLabOptOut] = useState(false);
  const [trtDeliveryPref, setTRTDeliveryPref] = useState("");
  const [trtAddEnclomiphene, setTRTAddEnclomiphene] = useState("");
  const [trtPriorHistory, setTRTPriorHistory] = useState("");

  // ── Medications step ──────────────────────────────────────────────────────
  const [currentMeds, setCurrentMeds] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  // ── Checkout ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);

  // ─── Derived ─────────────────────────────────────────────────────────────

  const selectedStackObjects = useMemo(
    () => selectedStacks.map((id) => allStacks.find((s) => s.id === id)).filter(Boolean) as Stack[],
    [selectedStacks, allStacks]
  );

  const hasTRT = selectedStacks.includes("testosterone-replacement");
  const hasHRT = selectedStacks.includes("womens-hrt");

  // Active step sequence
  const activeStepIds = useMemo<StepId[]>(() => {
    const steps: StepId[] = ["identity", "stacks"];
    const hasContraStacks = selectedStacks.some(
      (id) => id !== "testosterone-replacement" && id !== "womens-hrt" && (STACK_CONTRAS[id]?.length ?? 0) > 0
    );
    if (hasContraStacks) steps.push("contras");
    if (hasHRT) steps.push("hrt");
    if (hasTRT) steps.push("trt");
    steps.push("medications", "review");
    return steps;
  }, [selectedStacks, hasHRT, hasTRT]);

  const currentStepId = activeStepIds[currentStep];

  const STEP_LABELS: Record<StepId, string> = {
    identity: "About You",
    stacks: "Your Stacks",
    contras: "Health Screening",
    hrt: "Hormone History",
    trt: "Testosterone Screening",
    medications: "Medications",
    review: "Review",
  };

  // Hard stop detection — checks all answered questions across all active contras
  const activeHardStop = useMemo((): ContraItem | null => {
    // Check stack contras
    for (const stackId of selectedStacks) {
      if (stackId === "testosterone-replacement" || stackId === "womens-hrt") continue;
      for (const item of STACK_CONTRAS[stackId] ?? []) {
        if (item.severity === "HARD_STOP" && contraAnswers[item.id] === "yes") return item;
      }
    }
    // Check HRT contras
    if (hasHRT) {
      for (const item of HRT_CONTRAS) {
        if (item.severity === "HARD_STOP" && contraAnswers[item.id] === "yes") return item;
      }
    }
    // Check TRT contras
    if (hasTRT) {
      for (const item of TRT_CONTRAS) {
        if (item.severity === "HARD_STOP" && contraAnswers[item.id] === "yes") return item;
      }
    }
    return null;
  }, [contraAnswers, selectedStacks, hasHRT, hasTRT]);

  // Flagged items for review summary
  const flaggedItems = useMemo(() => {
    const flags: string[] = [];
    const allContraLists = [
      ...selectedStacks.flatMap((id) => {
        if (id === "testosterone-replacement" || id === "womens-hrt") return [];
        return STACK_CONTRAS[id] ?? [];
      }),
      ...(hasHRT ? HRT_CONTRAS : []),
      ...(hasTRT ? TRT_CONTRAS : []),
    ];
    for (const item of allContraLists) {
      if (item.severity === "FLAG" && contraAnswers[item.id] === "yes") {
        flags.push(item.id);
      }
    }
    return flags;
  }, [contraAnswers, selectedStacks, hasHRT, hasTRT]);

  // TRT pricing
  const trtLabsIncluded = hasTRT && trtHasRecentLabs === "no" && !trtLabOptOut;
  const trtLabCost = trtLabsIncluded ? 79 : 0;
  const monthlyTotal = selectedStackObjects
    .filter((s) => s.ourPrice !== null)
    .reduce((sum, s) => sum + (s.ourPrice ?? 0), 0);
  const firstMonthTotal = monthlyTotal + trtLabCost;

  // ─── Helpers ─────────────────────────────────────────────────────────────

  function setContra(id: string, v: YN) {
    setContraAnswers((prev) => ({ ...prev, [id]: v }));
  }

  function toggleStack(stackId: string) {
    const stack = allStacks.find((s) => s.id === stackId);
    if (!stack || stack.waitlist) return;
    setSelectedStacks((prev) => {
      if (prev.includes(stackId)) return prev.filter((id) => id !== stackId);
      const exclusions = stack.exclusiveWith ?? [];
      const filtered = prev.filter((id) => !exclusions.includes(id));
      return [...filtered, stackId];
    });
  }

  function canAdvance(): boolean {
    if (activeHardStop && currentStepId !== "identity" && currentStepId !== "stacks") return false;
    switch (currentStepId) {
      case "identity": return !!name && !!email && !!dob && !!state;
      case "stacks": return selectedStacks.length > 0;
      case "contras": {
        const allItems = selectedStacks.flatMap((id) => {
          if (id === "testosterone-replacement" || id === "womens-hrt") return [];
          return STACK_CONTRAS[id] ?? [];
        });
        return allItems.every((item) => contraAnswers[item.id] === "yes" || contraAnswers[item.id] === "no");
      }
      case "hrt": {
        if (activeHardStop) return false;
        const hrtContraAnswered = HRT_CONTRAS.every(
          (item) => contraAnswers[item.id] === "yes" || contraAnswers[item.id] === "no"
        );
        return !!hrtLastPeriod && !!hrtDeliveryPref && hrtContraAnswered;
      }
      case "trt": {
        if (activeHardStop) return false;
        const trtContraAnswered = TRT_CONTRAS.every(
          (item) => contraAnswers[item.id] === "yes" || contraAnswers[item.id] === "no"
        );
        return trtContraAnswered && !!trtHasRecentLabs && !!trtDeliveryPref;
      }
      case "medications": return true;
      case "review": return true;
      default: return false;
    }
  }

  // ─── Checkout ─────────────────────────────────────────────────────────────

  async function handleCheckout() {
    setLoading(true);
    try {
      const intakeData = {
        name, email, gender, state, dob, currentMeds, additionalNotes,
        stacks: selectedStacks.join(","),
        flagged_items: flaggedItems.join(","),
        trt_labs_included: trtLabsIncluded ? "yes" : "no",
        hrt_delivery_pref: hrtDeliveryPref,
        hrt_testosterone: hrtAddTestosterone,
        trt_delivery_pref: trtDeliveryPref,
        trt_add_enclomiphene: trtAddEnclomiphene,
        hrt_prior: hrtPriorHRT === "yes" ? hrtPriorHRTDetails : "none",
        trt_prior: trtPriorHistory,
        // Symptom summaries
        hrt_symptoms: Object.entries(hrtSymptoms)
          .filter(([, v]) => v > 0)
          .map(([k, v]) => `${k}:${SCORE_LABELS[v]}`)
          .join(", "),
        trt_symptoms: Object.entries(trtSymptoms)
          .filter(([, v]) => v > 0)
          .map(([k, v]) => `${k}:${SCORE_LABELS[v]}`)
          .join(", "),
        hrt_notes: hrtNotes,
      };

      const res = await fetch("/api/intake/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stacks: selectedStacks, intakeData, labsIncluded: trtLabsIncluded }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        alert("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  // ─── Hard Stop Screen ─────────────────────────────────────────────────────

  if (
    activeHardStop &&
    currentStepId !== "identity" &&
    currentStepId !== "stacks"
  ) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-[var(--card)] border-2 border-red-500/30 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-3">
            {activeHardStop.stopTitle ?? "Unable to proceed"}
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-8">
            {activeHardStop.stopMessage}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setContraAnswers((prev) => ({ ...prev, [activeHardStop.id]: "" }));
              }}
              className="w-full py-3 bg-[var(--accent)] text-[var(--background)] font-semibold rounded-lg text-sm hover:bg-[var(--accent-hover)] transition-colors"
            >
              ← Go back and correct my answer
            </button>
            <Link
              href="/build-your-stack"
              className="block w-full py-3 border border-[var(--card-border)] text-[var(--muted)] font-medium rounded-lg text-sm hover:border-[var(--accent)]/30 transition-colors"
            >
              Browse other stacks
            </Link>
          </div>
          <p className="text-xs text-[var(--muted-light)] mt-6">
            Questions?{" "}
            <a href="mailto:hello@thelongevityagent.com" className="text-[var(--accent)] hover:underline">
              hello@thelongevityagent.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center gap-1 mb-2.5">
          {activeStepIds.map((id, i) => (
            <div key={id} className="flex items-center flex-1 last:flex-none">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                i < currentStep ? "bg-[var(--green)] text-[var(--background)]" :
                i === currentStep ? "bg-[var(--accent)] text-[var(--background)]" :
                "bg-[var(--card)] border border-[var(--card-border)] text-[var(--muted)]"
              }`}>
                {i < currentStep ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : i + 1}
              </div>
              {i < activeStepIds.length - 1 && (
                <div className={`flex-1 h-px mx-1 transition-colors ${i < currentStep ? "bg-[var(--green)]" : "bg-[var(--card-border)]"}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--muted)]">
          Step {currentStep + 1} of {activeStepIds.length} —{" "}
          <span className="font-medium text-[var(--foreground)]">{STEP_LABELS[currentStepId]}</span>
        </p>
      </div>

      {/* ── Step: Identity ─────────────────────────────────────────────────── */}
      {currentStepId === "identity" && (
        <div>
          <h1 className="text-2xl font-bold mb-1">Tell us about yourself</h1>
          <p className="text-sm text-[var(--muted)] mb-7">Your physician needs this to evaluate your request safely.</p>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldInput label="Full name">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith" className={inputClass()} />
              </FieldInput>
              <FieldInput label="Date of birth">
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
                  className={inputClass()} />
              </FieldInput>
            </div>
            <FieldInput label="Email address">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" className={inputClass()} />
            </FieldInput>
            <FieldInput label="State of residence" note="We serve all 50 states.">
              <select value={state} onChange={(e) => setState(e.target.value)} className={inputClass()}>
                <option value="">Select state</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FieldInput>
          </div>
        </div>
      )}

      {/* ── Step: Stacks ───────────────────────────────────────────────────── */}
      {currentStepId === "stacks" && (
        <div>
          <h2 className="text-2xl font-bold mb-1">Your protocol</h2>
          <p className="text-sm text-[var(--muted)] mb-5">
            Confirm your stack selection. Your physician reviews everything together.
          </p>

          {/* Gender toggle */}
          <div className="flex gap-2 mb-5">
            {(["men", "women"] as const).map((g) => (
              <button
                key={g}
                onClick={() => { setGender(g); setSelectedStacks([]); }}
                className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-semibold transition-colors ${
                  gender === g
                    ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                    : "border-[var(--card-border)] text-[var(--muted)] hover:border-[var(--accent)]/30"
                }`}
              >
                {g === "men" ? "Men's Health" : "Women's Health"}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {allStacks
              .filter((s) => s.forGender === gender || s.forGender === "both")
              .map((stack) => {
                const isSelected = selectedStacks.includes(stack.id);
                const isConflicted = !isSelected && (stack.exclusiveWith ?? []).some((id) => selectedStacks.includes(id));
                return (
                  <button
                    key={stack.id}
                    onClick={() => toggleStack(stack.id)}
                    disabled={!!isConflicted || !!stack.waitlist}
                    className={`w-full text-left border-2 rounded-xl px-4 py-4 transition-all ${
                      isSelected
                        ? "border-current bg-[var(--card)]"
                        : isConflicted || stack.waitlist
                        ? "border-[var(--card-border)] bg-[var(--card)] opacity-40 cursor-not-allowed"
                        : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)]/40"
                    }`}
                    style={isSelected ? { borderColor: stack.color } : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-10 rounded-full shrink-0" style={{ background: stack.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-[var(--foreground)]">{stack.name}</span>
                          {stack.badge && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: stack.color + "22", color: stack.color }}>
                              {stack.badge}
                            </span>
                          )}
                          {stack.waitlist && <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted)] font-medium">Waitlist</span>}
                          {isConflicted && <span className="text-xs text-[var(--muted-light)]">(exclusive with selection)</span>}
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          {stack.medications.map((m) => m.name).join(" + ")}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        {stack.waitlist ? (
                          <span className="text-xs text-[var(--muted)]">Waitlist</span>
                        ) : stack.ourPrice !== null ? (
                          <span className="font-bold text-sm text-[var(--green)]">${stack.ourPrice}/mo</span>
                        ) : (
                          <span className="text-xs text-[var(--muted-light)] font-mono">{"{{PRICE}}"}</span>
                        )}
                      </div>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? "border-current" : "border-[var(--card-border)]"
                      }`} style={isSelected ? { background: stack.color, borderColor: stack.color } : undefined}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Step: Contraindications ────────────────────────────────────────── */}
      {currentStepId === "contras" && (
        <div>
          <h2 className="text-2xl font-bold mb-1">Health screening</h2>
          <p className="text-sm text-[var(--muted)] mb-2">
            Answer yes or no. Flagged items go to your physician for review — they are not automatic disqualifications.
          </p>
          <div className="bg-[var(--accent-dim)] border border-[var(--accent)]/20 rounded-lg px-4 py-2.5 mb-7 text-xs text-[var(--muted)]">
            Nothing here disqualifies you automatically. Your physician reviews everything before prescribing.
          </div>

          <div className="space-y-8">
            {selectedStacks
              .filter((id) => id !== "testosterone-replacement" && id !== "womens-hrt" && (STACK_CONTRAS[id]?.length ?? 0) > 0)
              .map((stackId) => {
                const stack = allStacks.find((s) => s.id === stackId);
                const items = STACK_CONTRAS[stackId] ?? [];
                return (
                  <div key={stackId}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-6 rounded-full shrink-0" style={{ background: stack?.color ?? "#888" }} />
                      <h3 className="font-semibold text-[var(--foreground)] text-sm">{stack?.name}</h3>
                    </div>
                    <div className="space-y-5">
                      {items.map((item) => (
                        <div key={item.id}>
                          <div className="flex items-start gap-2">
                            <p className="text-sm text-[var(--foreground)] leading-relaxed flex-1">{item.text}</p>
                            {item.severity === "FLAG" && (
                              <span className="shrink-0 text-xs text-[var(--muted)] bg-[var(--surface)] px-2 py-0.5 rounded-full mt-0.5">reviewed by physician</span>
                            )}
                          </div>
                          <YesNo value={contraAnswers[item.id] as YN ?? ""} onChange={(v) => setContra(item.id, v)} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Step: HRT ──────────────────────────────────────────────────────── */}
      {currentStepId === "hrt" && (
        <div>
          <h2 className="text-2xl font-bold mb-1">Hormone history</h2>
          <p className="text-sm text-[var(--muted)] mb-7">
            HRT is prescribed based on your symptom profile and history — not a lab panel. Your physician will use this to build the right protocol for you.
          </p>

          {/* Section A: Eligibility */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide mb-4 pb-2 border-b border-[var(--card-border)]">
              A — Eligibility
            </h3>
            <div className="space-y-5">
              <FieldInput label="Menstrual status">
                <select value={hrtLastPeriod} onChange={(e) => setHRTLastPeriod(e.target.value)} className={inputClass()}>
                  <option value="">Select…</option>
                  <option value="regular">Regular cycles</option>
                  <option value="irregular">Irregular cycles (perimenopause)</option>
                  <option value="none-less-12mo">No period for less than 12 months</option>
                  <option value="none-12mo-plus">No period for 12 months or more (menopause)</option>
                  <option value="surgical">Surgical menopause</option>
                </select>
              </FieldInput>
              {hrtLastPeriod === "surgical" && (
                <FieldInput label="Date of surgery (approximate)">
                  <input type="date" value={hrtSurgicalDate} onChange={(e) => setHRTSurgicalDate(e.target.value)} className={inputClass()} />
                </FieldInput>
              )}
              <div>
                <p className="text-sm font-medium text-[var(--foreground)] mb-1">Have you had a hysterectomy?</p>
                <YesNo value={hrtHysterectomy} onChange={setHRTHysterectomy} />
              </div>
              {hrtHysterectomy === "yes" && (
                <FieldInput label="Are your ovaries present?">
                  <select value={hrtOvaries} onChange={(e) => setHRTOvaries(e.target.value)} className={inputClass()}>
                    <option value="">Select…</option>
                    <option value="both">Both ovaries intact</option>
                    <option value="one">One ovary</option>
                    <option value="none">No ovaries (bilateral oophorectomy)</option>
                  </select>
                </FieldInput>
              )}
            </div>
          </div>

          {/* Section B: Symptoms */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide mb-1 pb-2 border-b border-[var(--card-border)]">
              B — Symptom severity
            </h3>
            <p className="text-xs text-[var(--muted)] mb-4">Rate each symptom over the past 4 weeks.</p>
            <div className="space-y-5">
              {HRT_SYMPTOMS.map((s) => (
                <div key={s.id}>
                  <p className="text-sm text-[var(--foreground)]">{s.label}</p>
                  <ScoreInput
                    value={(hrtSymptoms[s.id] as Score) ?? 0}
                    onChange={(v) => setHRTSymptoms((prev) => ({ ...prev, [s.id]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section C: Contraindications */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide mb-1 pb-2 border-b border-[var(--card-border)]">
              C — Safety screening
            </h3>
            <p className="text-xs text-[var(--muted)] mb-4">Answer yes or no to each question.</p>
            <div className="space-y-5">
              {HRT_CONTRAS.map((item) => (
                <div key={item.id}>
                  <div className="flex items-start gap-2">
                    <p className="text-sm text-[var(--foreground)] leading-relaxed flex-1">{item.text}</p>
                    {item.severity === "FLAG" && (
                      <span className="shrink-0 text-xs text-[var(--muted)] bg-[var(--surface)] px-2 py-0.5 rounded-full mt-0.5">reviewed by physician</span>
                    )}
                  </div>
                  <YesNo value={contraAnswers[item.id] as YN ?? ""} onChange={(v) => setContra(item.id, v)} />
                </div>
              ))}
            </div>
          </div>

          {/* Section D: Prior HRT */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide mb-4 pb-2 border-b border-[var(--card-border)]">
              D — Prior hormone use
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-[var(--foreground)] mb-1">Have you used HRT before?</p>
                <YesNo value={hrtPriorHRT} onChange={setHRTPriorHRT} />
              </div>
              {hrtPriorHRT === "yes" && (
                <FieldInput label="What did you take, how long, and why did you stop?" note="Include product name, dose, and duration if you remember.">
                  <textarea value={hrtPriorHRTDetails} onChange={(e) => setHRTPriorHRTDetails(e.target.value)}
                    placeholder="e.g. Estradiol patch 0.05mg, ~2 years, stopped due to cost" rows={3}
                    className={inputClass() + " resize-none"} />
                </FieldInput>
              )}
            </div>
          </div>

          {/* Section E: Preferences */}
          <div className="mb-2">
            <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide mb-4 pb-2 border-b border-[var(--card-border)]">
              E — Preferences
            </h3>
            <div className="space-y-5">
              <FieldInput label="Delivery preference for estradiol">
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { id: "patch", label: "Patch" },
                    { id: "gel", label: "Gel / cream" },
                    { id: "oral", label: "Oral" },
                    { id: "no-pref", label: "No preference" },
                  ].map((opt) => (
                    <button key={opt.id} type="button" onClick={() => setHRTDeliveryPref(opt.id)}
                      className={`py-3 rounded-lg border-2 text-sm font-semibold transition-colors ${
                        hrtDeliveryPref === opt.id
                          ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                          : "border-[var(--card-border)] text-[var(--muted)] hover:border-[var(--accent)]/30"
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </FieldInput>

              <FieldInput label="Interest in adding low-dose testosterone?">
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { id: "yes", label: "Yes" },
                    { id: "no", label: "No" },
                    { id: "unsure", label: "Unsure" },
                  ].map((opt) => (
                    <button key={opt.id} type="button" onClick={() => setHRTAddTestosterone(opt.id)}
                      className={`py-3 rounded-lg border-2 text-sm font-semibold transition-colors ${
                        hrtAddTestosterone === opt.id
                          ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                          : "border-[var(--card-border)] text-[var(--muted)] hover:border-[var(--accent)]/30"
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </FieldInput>

              <FieldInput label="Anything else for the medical director?" note="Optional.">
                <textarea value={hrtNotes} onChange={(e) => setHRTNotes(e.target.value)}
                  placeholder="e.g. history of migraines, preference for low dose to start, specific concerns" rows={3}
                  className={inputClass() + " resize-none"} />
              </FieldInput>
            </div>
          </div>
        </div>
      )}

      {/* ── Step: TRT ──────────────────────────────────────────────────────── */}
      {currentStepId === "trt" && (
        <div>
          <h2 className="text-2xl font-bold mb-1">Testosterone screening</h2>
          <p className="text-sm text-[var(--muted)] mb-7">
            TRT requires lab work before your first prescription — we need to see your baseline testosterone, PSA, and hematocrit to prescribe safely and titrate correctly.
          </p>

          {/* Symptom scoring */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide mb-1 pb-2 border-b border-[var(--card-border)]">
              Symptoms
            </h3>
            <p className="text-xs text-[var(--muted)] mb-4">Rate each over the past 4 weeks.</p>
            <div className="space-y-5">
              {TRT_SYMPTOMS.map((s) => (
                <div key={s.id}>
                  <p className="text-sm text-[var(--foreground)]">{s.label}</p>
                  <ScoreInput
                    value={(trtSymptoms[s.id] as Score) ?? 0}
                    onChange={(v) => setTRTSymptoms((prev) => ({ ...prev, [s.id]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Contraindications */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide mb-1 pb-2 border-b border-[var(--card-border)]">
              Safety screening
            </h3>
            <p className="text-xs text-[var(--muted)] mb-4">Answer yes or no to each question.</p>
            <div className="space-y-5">
              {TRT_CONTRAS.map((item) => (
                <div key={item.id}>
                  <div className="flex items-start gap-2">
                    <p className="text-sm text-[var(--foreground)] leading-relaxed flex-1">{item.text}</p>
                    {item.severity === "FLAG" && (
                      <span className="shrink-0 text-xs text-[var(--muted)] bg-[var(--surface)] px-2 py-0.5 rounded-full mt-0.5">reviewed</span>
                    )}
                  </div>
                  <YesNo value={contraAnswers[item.id] as YN ?? ""} onChange={(v) => setContra(item.id, v)} />
                </div>
              ))}
            </div>
          </div>

          {/* Lab status */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide mb-1 pb-2 border-b border-[var(--card-border)]">
              Lab status
            </h3>
            <div className="bg-[var(--surface)] rounded-xl p-4 mb-4 text-xs text-[var(--muted)] leading-relaxed">
              <strong className="text-[var(--foreground)]">Why TRT requires labs:</strong> Testosterone replacement is the only product on The Longevity Agent that requires lab work. Unlike symptom-based protocols (HRT, LDN, GLP-1), TRT doses are titrated to blood values — not symptoms alone. We need total T, free T, LH, FSH, estradiol, PSA, hematocrit, and CBC to prescribe safely and adjust your dose.
            </div>
            <p className="text-sm font-medium text-[var(--foreground)] mb-3">
              Have you had a comprehensive testosterone panel (total T, free T, LH, FSH, estradiol, PSA, hematocrit) in the last 6 months?
            </p>
            <YesNo value={trtHasRecentLabs} onChange={setTRTHasRecentLabs} />

            {trtHasRecentLabs === "yes" && (
              <div className="mt-4 bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--green)] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">Lab panel waived — save $79</p>
                    <p className="text-xs text-[var(--muted)] mt-1">You can upload your recent results during onboarding, or we'll reach out to request them. No need to repeat labs.</p>
                  </div>
                </div>
              </div>
            )}

            {trtHasRecentLabs === "no" && (
              <div className="mt-4 space-y-3">
                <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">Lab panel included</p>
                      <p className="text-xs text-[var(--muted)] mt-1">Comprehensive testosterone panel at a partner lab near you. Results in 24–48 hours.</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-[var(--foreground)]">$79</p>
                      <p className="text-xs text-[var(--muted)]">one-time / yr</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTRTLabOptOut(!trtLabOptOut)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      trtLabOptOut ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--card-border)]"
                    }`}
                  >
                    {trtLabOptOut && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <p className="text-sm text-[var(--muted)]">I'll arrange my own labs — opt out of the included panel</p>
                </div>
                {trtLabOptOut && (
                  <div className="bg-[var(--surface)] rounded-lg px-4 py-3 text-xs text-[var(--muted)]">
                    Your physician will contact you with the required panel before issuing your prescription. Prescription is not released until labs are confirmed.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="mb-2">
            <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide mb-4 pb-2 border-b border-[var(--card-border)]">
              Preferences
            </h3>
            <div className="space-y-5">
              <FieldInput label="Delivery preference">
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { id: "cream", label: "Cream" },
                    { id: "injection", label: "Injection" },
                    { id: "no-pref", label: "No preference" },
                  ].map((opt) => (
                    <button key={opt.id} type="button" onClick={() => setTRTDeliveryPref(opt.id)}
                      className={`py-3 rounded-lg border-2 text-sm font-semibold transition-colors ${
                        trtDeliveryPref === opt.id
                          ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                          : "border-[var(--card-border)] text-[var(--muted)] hover:border-[var(--accent)]/30"
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </FieldInput>

              <FieldInput label="Add enclomiphene to maintain testicular function?" note="Enclomiphene can be co-prescribed with TRT to preserve fertility and testicular volume.">
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { id: "yes", label: "Yes" },
                    { id: "no", label: "No" },
                    { id: "unsure", label: "Discuss with physician" },
                  ].map((opt) => (
                    <button key={opt.id} type="button" onClick={() => setTRTAddEnclomiphene(opt.id)}
                      className={`py-3 rounded-lg border-2 text-xs font-semibold transition-colors ${
                        trtAddEnclomiphene === opt.id
                          ? "border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]"
                          : "border-[var(--card-border)] text-[var(--muted)] hover:border-[var(--accent)]/30"
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </FieldInput>

              <FieldInput label="Prior TRT history" note="Optional.">
                <textarea value={trtPriorHistory} onChange={(e) => setTRTPriorHistory(e.target.value)}
                  placeholder="e.g. testosterone cypionate 100mg/week for 18 months, stopped due to fertility concerns" rows={2}
                  className={inputClass() + " resize-none"} />
              </FieldInput>
            </div>
          </div>
        </div>
      )}

      {/* ── Step: Medications ─────────────────────────────────────────────── */}
      {currentStepId === "medications" && (
        <div>
          <h2 className="text-2xl font-bold mb-1">Current medications</h2>
          <p className="text-sm text-[var(--muted)] mb-7">
            Your physician checks all selected stacks for interactions with your current medications.
          </p>
          <div className="space-y-5">
            <FieldInput label="Current medications and supplements" note={'Or write "none" if none.'}>
              <textarea value={currentMeds} onChange={(e) => setCurrentMeds(e.target.value)}
                placeholder="e.g. Lisinopril 10mg, Vitamin D 5000 IU, Metformin 1000mg" rows={4}
                className={inputClass() + " resize-none"} />
            </FieldInput>
            <FieldInput label="Anything else for your physician?" note="Optional.">
              <textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Goals, questions, concerns, context you want your physician to know" rows={3}
                className={inputClass() + " resize-none"} />
            </FieldInput>
          </div>
          <div className="mt-5 bg-[var(--accent-dim)] border border-[var(--accent)]/20 rounded-lg p-4">
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              <strong className="text-[var(--foreground)]">Privacy:</strong> Your health information is HIPAA-protected and encrypted. It is never sold or shared with third parties. Only your physician sees your intake.
            </p>
          </div>
        </div>
      )}

      {/* ── Step: Review ──────────────────────────────────────────────────── */}
      {currentStepId === "review" && (
        <div>
          <h2 className="text-2xl font-bold mb-1">Review your order</h2>
          <p className="text-sm text-[var(--muted)] mb-7">Confirm before proceeding to payment.</p>

          <div className="bg-[var(--card)] rounded-xl border border-[var(--card-border)] divide-y divide-[var(--card-border)] mb-6">
            <div className="px-5 py-4">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">Patient</p>
              <p className="font-semibold text-[var(--foreground)]">{name}</p>
              <p className="text-sm text-[var(--muted)]">{email} · {state}</p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-3">Your protocol</p>
              <div className="space-y-2.5">
                {selectedStackObjects.map((s) => (
                  <div key={s.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{s.name}</p>
                      <p className="text-xs text-[var(--muted)]">{s.medications.map((m) => m.name).join(", ")}</p>
                    </div>
                    {s.ourPrice !== null ? (
                      <span className="text-sm font-bold text-[var(--green)]">${s.ourPrice}/mo</span>
                    ) : (
                      <span className="text-xs text-[var(--muted-light)] font-mono">{"{{PRICE}}"}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 py-4">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-[var(--muted)]">Physician review + prescription</p>
                <p className="text-sm font-semibold text-[var(--green)]">Included</p>
              </div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-[var(--muted)]">Monthly medication supply</p>
                <p className="text-sm font-semibold text-[var(--green)]">Included</p>
              </div>
              {trtLabsIncluded && (
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-[var(--muted)]">TRT lab panel (first year)</p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">$79 once</p>
                </div>
              )}
            </div>

            <div className="px-5 py-4">
              {trtLabsIncluded && firstMonthTotal !== monthlyTotal ? (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-[var(--muted)]">First month</p>
                    <p className="text-xl font-bold text-[var(--foreground)]">${firstMonthTotal}<span className="text-sm font-normal text-[var(--muted)] ml-1">total</span></p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-[var(--muted-light)]">Then</p>
                    <p className="text-sm text-[var(--green)] font-semibold">${monthlyTotal}/mo</p>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-[var(--muted)]">Monthly total</p>
                  <p className="text-xl font-bold text-[var(--green)]">${monthlyTotal}<span className="text-sm font-normal text-[var(--muted)] ml-1">/mo</span></p>
                </div>
              )}
            </div>
          </div>

          {flaggedItems.length > 0 && (
            <div className="bg-[var(--surface)] border border-[var(--card-border)] rounded-xl px-4 py-3 mb-5 text-xs text-[var(--muted)]">
              <strong className="text-[var(--foreground)]">{flaggedItems.length} item{flaggedItems.length > 1 ? "s" : ""} flagged for physician review.</strong> These won't prevent prescribing — your physician will review them as part of your intake.
            </div>
          )}

          <div className="space-y-3 mb-6">
            {[
              "A board-certified physician reviews your full protocol within 24–48 hours.",
              "If your physician declines to prescribe, you'll receive a full refund.",
              "Cancel anytime from your dashboard. No contracts.",
            ].map((line) => (
              <div key={line} className="flex items-start gap-2 text-xs text-[var(--muted)]">
                <svg className="w-4 h-4 text-[var(--green)] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {line}
              </div>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[var(--accent)] text-[var(--background)] font-bold py-4 rounded-xl hover:bg-[var(--accent-hover)] transition-colors text-base disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Redirecting to payment…
              </>
            ) : (
              <>
                Proceed to Payment
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </>
            )}
          </button>
          <p className="text-center text-xs text-[var(--muted-light)] mt-2">Secured by Stripe. We never store your card details.</p>
        </div>
      )}

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      {currentStepId !== "review" && (
        <div className={`mt-8 flex gap-3 ${currentStep === 0 ? "justify-end" : "justify-between"}`}>
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-5 py-3 border border-[var(--card-border)] text-[var(--foreground)] font-medium rounded-xl text-sm hover:border-[var(--accent)]/40 transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="px-7 py-3 bg-[var(--accent)] text-[var(--background)] font-semibold rounded-xl text-sm hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            Continue →
          </button>
        </div>
      )}
      {currentStep > 0 && currentStepId === "review" && (
        <button
          onClick={() => setCurrentStep((s) => s - 1)}
          className="mt-4 w-full py-3 border border-[var(--card-border)] text-[var(--muted)] font-medium rounded-xl text-sm hover:border-[var(--accent)]/30 transition-colors"
        >
          ← Back
        </button>
      )}

      <p className="mt-6 text-center text-xs text-[var(--muted-light)]">
        Questions?{" "}
        <Link href="mailto:hello@thelongevityagent.com" className="text-[var(--accent)] hover:underline">
          hello@thelongevityagent.com
        </Link>
      </p>
    </div>
  );
}
