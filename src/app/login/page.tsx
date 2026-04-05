"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setError("Auth not configured yet. Check back soon.");
      setLoading(false);
      return;
    }

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/dashboard";
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        setSuccess("Check your email for a confirmation link.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded bg-[var(--navy)] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1C3.686 1 1 3.686 1 7s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" stroke="white" strokeWidth="1.5"/>
                <path d="M7 4v3l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[var(--navy)]">
            {mode === "login" ? "Log in to your account" : "Create your account"}
          </h1>
          <p className="text-sm text-[var(--gray)] mt-1">
            {mode === "login" ? "Access your prescriptions and health records." : "Already a patient? "}
            {mode === "signup" && (
              <button onClick={() => setMode("login")} className="text-[var(--navy)] font-semibold hover:underline">Log in</button>
            )}
          </p>
        </div>

        {success ? (
          <div className="bg-[var(--green-light)] border border-[var(--green)] rounded-lg p-4 text-center text-sm text-[var(--green-dark)]">
            {success}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[var(--navy)] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-[var(--navy)]">Password</label>
                {mode === "login" && (
                  <a href="#" className="text-xs text-[var(--navy)] hover:underline">Forgot password?</a>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--navy)] text-white font-semibold py-3 rounded-lg hover:bg-[var(--navy-dark)] transition-colors disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          {mode === "login" ? (
            <p className="text-sm text-[var(--gray)]">
              New patient?{" "}
              <Link href="/intake" className="text-[var(--navy)] font-semibold hover:underline">
                Start your intake
              </Link>
            </p>
          ) : (
            <p className="text-sm text-[var(--gray)]">
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-[var(--navy)] font-semibold hover:underline">
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
