"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";

type IntakeData = {
  gender: "men" | "women" | "";
  name: string;
  email: string;
  dob: string;
  state: string;
  productSlug: string;
  currentMeds: string;
  conditions: string;
  allergies: string;
  goals: string;
};

const STEPS = ["About you", "Choose medication", "Health history", "Review & pay"];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

export default function IntakeForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IntakeData>({
    gender: "",
    name: "",
    email: "",
    dob: "",
    state: "",
    productSlug: "",
    currentMeds: "",
    conditions: "",
    allergies: "",
    goals: "",
  });

  const allProducts = getAllProducts();
  const filteredProducts = data.gender
    ? allProducts.filter((p) => p.forGender === data.gender || p.forGender === "both")
    : allProducts;

  const selectedProduct = allProducts.find((p) => p.slug === data.productSlug);

  function set(key: keyof IntakeData, value: string) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function canAdvance(): boolean {
    switch (step) {
      case 0: return !!data.gender && !!data.name && !!data.email && !!data.dob && !!data.state;
      case 1: return !!data.productSlug;
      case 2: return true; // health history is informational, not all required
      case 3: return true;
      default: return false;
    }
  }

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: data.productSlug,
          intakeData: {
            name: data.name,
            email: data.email,
            gender: data.gender,
            state: data.state,
            dob: data.dob,
            currentMeds: data.currentMeds,
            conditions: data.conditions,
            allergies: data.allergies,
            goals: data.goals,
          },
        }),
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

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">

      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center gap-1 mb-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                i < step ? "bg-[var(--green)] text-white" :
                i === step ? "bg-[var(--navy)] text-white" :
                "bg-gray-200 text-[var(--gray)]"
              }`}>
                {i < step ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-1 transition-colors ${i < step ? "bg-[var(--green)]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--gray)]">
          Step {step + 1} of {STEPS.length} — <span className="font-medium text-[var(--navy)]">{STEPS[step]}</span>
        </p>
      </div>

      {/* Step 0: About you */}
      {step === 0 && (
        <div>
          <h1 className="text-2xl font-bold text-[var(--navy)] mb-1">Tell us about yourself</h1>
          <p className="text-sm text-[var(--gray)] mb-8">Your physician needs this to evaluate your request safely.</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--navy)] mb-2">I&apos;m looking for</label>
              <div className="grid grid-cols-2 gap-3">
                {(["men", "women"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => set("gender", g)}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold text-sm transition-colors ${
                      data.gender === g
                        ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                        : "border-gray-200 text-[var(--navy)] hover:border-[var(--navy)]"
                    }`}
                  >
                    {g === "men" ? "Men's Health" : "Women's Health"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">Full name</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">Date of birth</label>
                <input
                  type="date"
                  value={data.dob}
                  onChange={(e) => set("dob", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">Email address</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">State of residence</label>
              <select
                value={data.state}
                onChange={(e) => set("state", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)] bg-white"
              >
                <option value="">Select state</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <p className="text-xs text-[var(--gray-light)] mt-1">We serve all 50 states.</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Choose medication */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-1">Choose your medication</h2>
          <p className="text-sm text-[var(--gray)] mb-6">
            Select one to start. You can add more after your physician review.
          </p>

          <div className="space-y-3">
            {filteredProducts.map((p) => (
              <button
                key={p.slug}
                onClick={() => set("productSlug", p.slug)}
                className={`w-full text-left border-2 rounded-xl p-4 transition-colors ${
                  data.productSlug === p.slug
                    ? "border-[var(--navy)] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--gray)]">{p.category}</span>
                    </div>
                    <p className="font-semibold text-[var(--navy)] text-sm">{p.name}</p>
                    <p className="text-xs text-[var(--gray)] mt-0.5 line-clamp-1">{p.tagline}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold text-[var(--green)]">${p.ourPrice}</span>
                    <span className="text-xs text-[var(--gray)] block">/mo</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Health history */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-1">Health history</h2>
          <p className="text-sm text-[var(--gray)] mb-6">
            Your physician needs this to prescribe safely. Answer as fully as you can. Nothing here is disqualifying on its own.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">
                Current medications <span className="text-[var(--gray)] font-normal">(include supplements)</span>
              </label>
              <textarea
                value={data.currentMeds}
                onChange={(e) => set("currentMeds", e.target.value)}
                placeholder="e.g. Lisinopril 10mg, Vitamin D 5000 IU, Aspirin 81mg"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)] resize-none"
              />
              <p className="text-xs text-[var(--gray-light)] mt-1">Or write &quot;none&quot; if none.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">
                Relevant medical conditions or diagnoses
              </label>
              <textarea
                value={data.conditions}
                onChange={(e) => set("conditions", e.target.value)}
                placeholder="e.g. hypertension, type 2 diabetes, autoimmune condition"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)] resize-none"
              />
              <p className="text-xs text-[var(--gray-light)] mt-1">Or write &quot;none&quot; if none.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">
                Known allergies or medication reactions
              </label>
              <textarea
                value={data.allergies}
                onChange={(e) => set("allergies", e.target.value)}
                placeholder="e.g. penicillin allergy, GI upset with NSAIDs"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)] resize-none"
              />
              <p className="text-xs text-[var(--gray-light)] mt-1">Or write &quot;none&quot; if none.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">
                What are you hoping to achieve?
              </label>
              <textarea
                value={data.goals}
                onChange={(e) => set("goals", e.target.value)}
                placeholder="e.g. lower cardiovascular risk, preserve hair, optimize testosterone, reduce inflammation"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)] resize-none"
              />
            </div>
          </div>

          <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Privacy:</strong> Your health information is HIPAA-protected and encrypted. It is never sold or shared with third parties. Only your physician can see your intake questionnaire.
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold text-[var(--navy)] mb-1">Review your order</h2>
          <p className="text-sm text-[var(--gray)] mb-8">Confirm the details before proceeding to payment.</p>

          <div className="bg-[var(--gray-bg)] rounded-xl border border-gray-200 divide-y divide-gray-200 mb-6">
            <div className="px-5 py-4">
              <p className="text-xs text-[var(--gray)] uppercase tracking-wide mb-1">Patient</p>
              <p className="font-semibold text-[var(--navy)]">{data.name}</p>
              <p className="text-sm text-[var(--gray)]">{data.email} · {data.state}</p>
            </div>

            {selectedProduct && (
              <div className="px-5 py-4">
                <p className="text-xs text-[var(--gray)] uppercase tracking-wide mb-1">Medication</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-[var(--navy)]">{selectedProduct.name}</p>
                    <p className="text-xs text-[var(--gray)] mt-0.5">{selectedProduct.category}</p>
                  </div>
                  <span className="text-xl font-bold text-[var(--green)]">
                    ${selectedProduct.ourPrice}<span className="text-sm font-normal text-[var(--gray)]">/mo</span>
                  </span>
                </div>
              </div>
            )}

            <div className="px-5 py-4">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-[var(--gray)]">Physician review</p>
                <p className="text-sm font-semibold text-[var(--green)]">Included</p>
              </div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-[var(--gray)]">Monthly medication supply</p>
                <p className="text-sm font-semibold text-[var(--green)]">Included</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-[var(--gray)]">Annual renewal</p>
                <p className="text-sm font-semibold text-[var(--green)]">Included</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2 text-xs text-[var(--gray)]">
              <svg className="w-4 h-4 text-[var(--green)] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              A licensed physician will review your intake within 24–48 hours before your prescription is issued.
            </div>
            <div className="flex items-start gap-2 text-xs text-[var(--gray)]">
              <svg className="w-4 h-4 text-[var(--green)] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              If your physician declines to prescribe, you&apos;ll receive a full refund. No questions asked.
            </div>
            <div className="flex items-start gap-2 text-xs text-[var(--gray)]">
              <svg className="w-4 h-4 text-[var(--green)] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Cancel anytime from your dashboard. No contracts.
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[var(--navy)] text-white font-bold py-4 rounded-lg hover:bg-[var(--navy-dark)] transition-colors text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Redirecting to payment...
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
          <p className="text-center text-xs text-[var(--gray-light)] mt-2">
            Secured by Stripe. We never store your card details.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className={`mt-8 flex gap-3 ${step === 0 ? "justify-end" : "justify-between"}`}>
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="px-5 py-2.5 border border-gray-300 text-[var(--navy)] font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
        )}
        {step < 3 && (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="px-6 py-2.5 bg-[var(--navy)] text-white font-semibold rounded-lg text-sm hover:bg-[var(--navy-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            Continue →
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-[var(--gray-light)]">
        Questions? Email{" "}
        <Link href="mailto:hello@thelongevityagent.com" className="text-[var(--navy)] hover:underline">
          hello@thelongevityagent.com
        </Link>
      </p>
    </div>
  );
}
