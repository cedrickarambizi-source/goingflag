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

type Mode = "signin" | "signup" | "forgot";

const inputCls =
  "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] placeholder:text-smoke focus:border-emerald focus:outline-none";

const errorInputCls =
  "mt-2 w-full rounded-xl border border-emerald bg-white px-4 py-3 text-[15px] placeholder:text-smoke focus:outline-none";

function friendly(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "That email and password don't match an account.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "An account with this email already exists. Try signing in instead.";
  if (m.includes("email not confirmed")) return "Confirm your email first — check your inbox for the link.";
  if (m.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
  return message;
}

function SignIn() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function switchMode(next: Mode) {
    setMode(next);
    setErrors({});
    setFormError(null);
    setNotice(null);
    setPassword("");
    setConfirm("");
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next['email'] = "Enter a valid email address.";
    if (mode !== "forgot") {
      if (password.length < 8) next['password'] = "Use at least 8 characters.";
      else if (mode === "signup" && !/[0-9]/.test(password))
        next['password'] = "Include at least one number for a stronger password.";
    }
    if (mode === "signup" && confirm !== password) next['confirm'] = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setNotice(null);
    if (!validate()) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/trips` },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: "/trips" });
          return;
        }
        setNotice(
          `Almost there — we sent a confirmation link to ${email.trim()}. Open it to activate your account, then sign in.`,
        );
        setMode("signin");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        navigate({ to: "/trips" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setNotice(`If an account exists for ${email.trim()}, a password reset link is on its way.`);
      }
    } catch (err) {
      setFormError(friendly(err instanceof Error ? err.message : "Something went wrong. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setFormError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result?.error) setFormError(result.error.message);
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

  const heading =
    mode === "signin" ? "Sign in" : mode === "signup" ? "Create an account" : "Reset your password";
  const intro =
    mode === "forgot"
      ? "Enter the email on your account and we'll send a secure reset link."
      : "Your reservations, references and cancellation windows in one place.";

  return (
    <div className="gf-shell gf-section">
      <div className="max-w-md">
        <SectionHead index="Account" title={heading} intro={intro} />

        {mode !== "forgot" ? (
          <>
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
          </>
        ) : null}

        <form onSubmit={submit} noValidate className={mode === "forgot" ? "mt-[30px]" : undefined}>
          <label htmlFor="gf-email" className="gf-caption text-iron">
            Email address
          </label>
          <input
            id="gf-email"
            type="email"
            autoComplete="email"
            value={email}
            aria-invalid={Boolean(errors["email"])}
            aria-describedby={errors["email"] ? "gf-email-error" : undefined}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={errors["email"] ? errorInputCls : inputCls}
          />
          {errors["email"] ? (
            <p id="gf-email-error" className="gf-body mt-2 text-emerald">
              {errors["email"]}
            </p>
          ) : null}

          {mode !== "forgot" ? (
            <>
              <label htmlFor="gf-password" className="gf-caption mt-5 block text-iron">
                Password
              </label>
              <input
                id="gf-password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                aria-invalid={Boolean(errors["password"])}
                aria-describedby={errors["password"] ? "gf-password-error" : undefined}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className={errors["password"] ? errorInputCls : inputCls}
              />
              {errors["password"] ? (
                <p id="gf-password-error" className="gf-body mt-2 text-emerald">
                  {errors["password"]}
                </p>
              ) : null}
            </>
          ) : null}

          {mode === "signup" ? (
            <>
              <label htmlFor="gf-confirm" className="gf-caption mt-5 block text-iron">
                Confirm password
              </label>
              <input
                id="gf-confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                aria-invalid={Boolean(errors["confirm"])}
                aria-describedby={errors["confirm"] ? "gf-confirm-error" : undefined}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                className={errors["confirm"] ? errorInputCls : inputCls}
              />
              {errors["confirm"] ? (
                <p id="gf-confirm-error" className="gf-body mt-2 text-emerald">
                  {errors["confirm"]}
                </p>
              ) : null}
            </>
          ) : null}

          <GfButton type="submit" className="mt-[30px] w-full" disabled={busy}>
            {busy
              ? "Working…"
              : mode === "signin"
                ? "Sign in"
                : mode === "signup"
                  ? "Create account"
                  : "Send reset link"}
          </GfButton>
        </form>

        <div className="mt-5 flex flex-col gap-2">
          {mode !== "forgot" ? (
            <button
              type="button"
              onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
              className="gf-body self-start text-graphite underline underline-offset-4 hover:text-ink"
            >
              {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => switchMode(mode === "forgot" ? "signin" : "forgot")}
            className="gf-body self-start text-graphite underline underline-offset-4 hover:text-ink"
          >
            {mode === "forgot" ? "Back to sign in" : "Forgot your password?"}
          </button>
        </div>

        {formError ? (
          <p role="alert" className="gf-body mt-4 text-emerald">
            {formError}
          </p>
        ) : null}
        {notice ? (
          <p aria-live="polite" className="gf-body mt-4 rounded-xl border border-line bg-sand p-4 text-graphite">
            {notice}
          </p>
        ) : null}
      </div>
    </div>
  );
}
