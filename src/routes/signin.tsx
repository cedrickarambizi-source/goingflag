import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GfButton, GfButtonLink, SectionHead } from "@/components/gf/ui";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — GoingFlag" },
      {
        name: "description",
        content: "Sign in to GoingFlag to manage bookings, saved fares and travel documents.",
      },
      { property: "og:title", content: "Sign in — GoingFlag" },
      { property: "og:description", content: "Manage bookings, saved fares and travel documents." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/trips` },
        });
        if (error) throw error;
        setMessage("Account created. If confirmation is required, check your inbox.");
        const { data } = await supabase.auth.getSession();
        if (data.session) navigate({ to: "/trips" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/trips" });
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setMessage(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result?.error) setMessage(result.error.message);
    else navigate({ to: "/trips" });
  }

  if (user) {
    return (
      <div className="gf-shell gf-section">
        <div className="max-w-md">
          <SectionHead index="Account" title="You're signed in" {...(user.email ? { intro: user.email } : {})} />
          <div className="mt-[30px] flex flex-wrap gap-[10px]">
            <GfButtonLink to="/trips">Open my trips</GfButtonLink>
            <GfButton variant="secondary" onClick={() => signOut()}>
              Sign out
            </GfButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gf-shell gf-section">
      <div className="max-w-md">
        <SectionHead
          index="Account"
          title={mode === "signin" ? "Sign in" : "Create an account"}
          intro="Your reservations, references and cancellation windows in one place."
        />

        <div className="mt-[30px]">
          <GfButton variant="secondary" className="w-full" onClick={google}>
            Continue with Google
          </GfButton>
        </div>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <span className="gf-caption text-iron">or email</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={submit}>
          <label htmlFor="gf-email" className="gf-caption text-iron">
            Email address
          </label>
          <input
            id="gf-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] placeholder:text-smoke focus:border-emerald focus:outline-none"
          />
          <label htmlFor="gf-password" className="gf-caption mt-5 block text-iron">
            Password
          </label>
          <input
            id="gf-password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] placeholder:text-smoke focus:border-emerald focus:outline-none"
          />
          <GfButton type="submit" className="mt-[30px] w-full" disabled={busy}>
            {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </GfButton>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="gf-body mt-5 text-graphite underline underline-offset-4 hover:text-ink"
        >
          {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>

        {message ? (
          <p aria-live="polite" className="gf-body mt-4 text-emerald">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
