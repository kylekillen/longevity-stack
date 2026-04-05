"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: Supabase auth when project is configured
    // const supabase = createBrowserClient(...)
    // await supabase.auth.signInWithPassword({ email, password })
    alert("Auth coming soon — Supabase project needed.");
    setLoading(false);
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
          <h1 className="text-2xl font-bold text-[var(--navy)]">Log in to your account</h1>
          <p className="text-sm text-[var(--gray)] mt-1">Access your prescriptions and health records.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              <a href="#" className="text-xs text-[var(--navy)] hover:underline">Forgot password?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--navy)] focus:ring-1 focus:ring-[var(--navy)]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--navy)] text-white font-semibold py-3 rounded-lg hover:bg-[var(--navy-dark)] transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--gray)] mt-6">
          New patient?{" "}
          <Link href="/intake" className="text-[var(--navy)] font-semibold hover:underline">
            Start your intake
          </Link>
        </p>
      </div>
    </div>
  );
}
