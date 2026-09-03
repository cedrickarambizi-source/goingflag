import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GfButton, GfButtonLink, SectionHead } from "@/components/gf/ui";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Choose a new password — GoingFlag" },
      {
        name: "description",
        content: "Set a new password for your GoingFlag account and get back to your reservations.",
      },
      { property: "og:title", content: "Choose a new password — GoingFlag" },
      { property: "og:description", content: "Set a new GoingFlag account password." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

const inputCls =
  "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] placeholder:text-smoke focus:border-emerald focus:outline-none";

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState<"checking" | "ok" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setReady(data.session ? "ok" : "invalid");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) setReady("ok");
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const next: Record<string, string> = {};
    if (password.length < 8) next.password = "Use at least 8 characters.";
    else if (!/[0-9]/.test(password)) next.password = "Include at least one number.";
    if (confirm !== password) next.confirm = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate({ to: "/trips" }), 1200);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not update your password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="gf-shell gf-section">
      <div className="max-w-md">
        <SectionHead
          index="Account"
          title="Choose a new password"
          intro="Pick something you haven't used before. You'll stay signed in on this device."
        />

        {ready === "checking" ? (
          <p className="gf-body mt-[30px] text-graphite">Checking your reset link…</p>
        ) : ready === "invalid" ? (
          <div className="mt-[30px] rounded-2xl border border-line bg-sand p-[30px]">
            <p className="gf-sub">This reset link is no longer valid</p>
            <p className="gf-body mt-3 text-graphite">
              Reset links expire after a short while and can only be used once. Request a fresh one.
            </p>
            <div className="mt-6">
              <GfButtonLink to="/signin">Back to sign in</GfButtonLink>
            </div>
          </div>
        ) : done ? (
          <div className="mt-[30px] rounded-2xl border border-line bg-sand p-[30px]">
            <p className="gf-sub">Password updated</p>
            <p className="gf-body mt-3 text-graphite">Taking you to your trips…</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-[30px]">
            <label htmlFor="rp-password" className="gf-caption text-iron">
              New password
            </label>
            <input
              id="rp-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              aria-invalid={Boolean(errors["password"])}
              className={inputCls}
            />
            {errors["password"] ? <p className="gf-body mt-2 text-emerald">{errors["password"]}</p> : null}

            <label htmlFor="rp-confirm" className="gf-caption mt-5 block text-iron">
              Confirm new password
            </label>
            <input
              id="rp-confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              aria-invalid={Boolean(errors["confirm"])}
              className={inputCls}
            />
            {errors["confirm"] ? <p className="gf-body mt-2 text-emerald">{errors["confirm"]}</p> : null}

            <GfButton type="submit" className="mt-[30px] w-full" disabled={busy}>
              {busy ? "Saving…" : "Update password"}
            </GfButton>

            {formError ? (
              <p role="alert" className="gf-body mt-4 text-emerald">
                {formError}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}
