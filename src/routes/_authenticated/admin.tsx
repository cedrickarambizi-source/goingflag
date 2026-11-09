import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { RefreshCw, Search, ShieldCheck, XCircle } from "lucide-react";
import { GfButton } from "@/components/gf/ui";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { getAdminAccess, listAdminReservations, cancelAdminReservation } from "@/lib/gf/admin.functions";
import { filterReservations } from "@/lib/gf/admin";
import { isSupplierStay, money } from "@/lib/gf/booking";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [
    { title: "Admin reservations — GoingFlag" },
    { name: "description", content: "GoingFlag administrator reservation management." },
    { property: "og:title", content: "Admin reservations — GoingFlag" },
    { property: "og:description", content: "GoingFlag administrator reservation management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const accessFn = useServerFn(getAdminAccess);
  const listFn = useServerFn(listAdminReservations);
  const cancelFn = useServerFn(cancelAdminReservation);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Tables<"reservations"> | null>(null);
  const [notice, setNotice] = useState("");
  const access = useQuery({ queryKey: ["admin-access"], queryFn: () => accessFn(), retry: false });
  const reservations = useQuery({ queryKey: ["admin-reservations"], queryFn: () => listFn(), enabled: access.data?.isAdmin === true, retry: false });
  const cancel = useMutation({
    mutationFn: (id: string) => cancelFn({ data: { id } }),
    onSuccess: async () => {
      setNotice(`${selected?.reference ?? "Reservation"} cancelled locally. No supplier cancellation or refund was processed.`);
      setSelected(null);
      await Promise.all(["admin-reservations", "reservations", "reservation"].map((key) => queryClient.invalidateQueries({ queryKey: [key] })));
    },
  });
  const rows = reservations.data ?? [];
  const filtered = filterReservations(rows, search, status);

  if (access.isPending) return <div className="gf-shell gf-section" role="status">Checking administrator access…</div>;
  if (access.error || !access.data?.isAdmin) return (
    <div className="gf-shell gf-section space-y-6">
      <ShieldCheck className="h-8 w-8 text-emerald" />
      <h1 className="gf-heading">{access.error ? "Access check unavailable" : "Administrator access required"}</h1>
      <p className="gf-body text-muted-foreground">{access.error ? "Please try again." : "This account does not have administrator access."}</p>
      {access.error ? <GfButton onClick={() => access.refetch()}>Try again</GfButton> : <Link to="/signin" search={{ admin: true }} className="inline-flex rounded-full bg-primary px-6 py-3 text-primary-foreground">Admin sign-in</Link>}
    </div>
  );

  return (
    <div className="gf-shell gf-section">
      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-8">
        <div><p className="gf-caption flex items-center gap-2 text-emerald"><ShieldCheck size={16} /> Administration</p><h1 className="gf-heading mt-3">Reservations</h1></div>
        <GfButton variant="secondary" onClick={() => reservations.refetch()} disabled={reservations.isFetching}><RefreshCw size={16} className={reservations.isFetching ? "animate-spin" : ""} /> Refresh</GfButton>
      </header>
      <dl className="grid grid-cols-3 gap-4 border-b border-line py-7">
        {[["All reservations", rows.length], ["Active", rows.filter((row) => row.status !== "cancelled").length], ["Cancelled", rows.filter((row) => row.status === "cancelled").length]].map(([label, count]) => <div key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="gf-nums mt-2 text-3xl font-medium">{count}</dd></div>)}
      </dl>
      <div className="flex flex-col gap-3 py-6 sm:flex-row">
        <label className="relative flex-1"><span className="sr-only">Search reservations</span><Search className="absolute left-3 top-3.5 text-muted-foreground" size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Reference, guest, email, property or location" className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label>
        <label><span className="sr-only">Reservation status</span><select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border border-input bg-background p-3 text-sm sm:w-44"><option value="all">All statuses</option>{Array.from(new Set(["confirmed", "cancelled", ...rows.map((row) => row.status)])).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      </div>
      {notice ? <p role="status" className="mb-5 rounded-lg bg-emerald-soft p-4 text-sm text-emerald">{notice}</p> : null}
      {reservations.isPending ? <p role="status" className="py-12 text-muted-foreground">Loading reservations…</p> : reservations.error ? <p role="alert" className="py-8 text-destructive">Could not load reservations. Use Refresh to try again.</p> : filtered.length === 0 ? <div className="border-y border-line py-16 text-center"><h2 className="gf-sub">{rows.length ? "No matching reservations" : "No reservations yet"}</h2>{rows.length ? <GfButton variant="quiet" className="mt-5" onClick={() => { setSearch(""); setStatus("all"); }}>Clear filters</GfButton> : null}</div> : (
        <>
          <p className="mb-3 text-sm text-muted-foreground">{filtered.length} of {rows.length} reservations</p>
          <div className="overflow-x-auto border-y border-line">
            <table className="w-full min-w-[940px] text-left text-sm">
              <thead className="bg-band text-muted-foreground"><tr>{["Reservation", "Guest", "Dates / travellers", "Total", "Status", "Action"].map((label) => <th key={label} scope="col" className="px-4 py-4 font-medium">{label}</th>)}</tr></thead>
              <tbody>{filtered.map((row) => <tr key={row.id} className="border-t border-line">
                <td className="max-w-64 px-4 py-5"><Link to="/booking/$reference" params={{ reference: row.reference }} className="gf-nums font-medium text-emerald underline underline-offset-4">{row.reference}</Link><p className="mt-2 break-words font-medium">{row.title}</p><p className="mt-1 text-muted-foreground">{row.kind}{row.location ? ` · ${row.location}` : ""}</p></td>
                <td className="max-w-60 px-4 py-5"><p>{row.lead_name}</p><p className="mt-1 break-all text-muted-foreground">{row.lead_email}</p>{row.lead_phone ? <p className="mt-1 text-muted-foreground">{row.lead_phone}</p> : null}</td>
                <td className="px-4 py-5"><p>{row.start_date ?? "—"}{row.end_date ? ` → ${row.end_date}` : ""}</p><p className="mt-1 text-muted-foreground">{row.travellers} travellers · {row.quantity} units</p></td>
                <td className="whitespace-nowrap px-4 py-5 gf-nums">{money(row.total_cents, row.currency)}</td>
                <td className="px-4 py-5"><span className={row.status === "cancelled" ? "text-muted-foreground" : "text-emerald"}>{row.status}</span></td>
                <td className="px-4 py-5">{row.status === "cancelled" ? "—" : isSupplierStay(row.kind, row.item_slug) ? <span className="text-muted-foreground">Contact supplier</span> : <GfButton variant="quiet" disabled={cancel.isPending} onClick={() => { cancel.reset(); setSelected(row); }}><XCircle size={16} /> Cancel</GfButton>}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </>
      )}
      <AlertDialog open={Boolean(selected)} onOpenChange={(open) => { if (!open && !cancel.isPending) setSelected(null); }}>
        <AlertDialogContent className="w-[calc(100%-2rem)] rounded-lg shadow-none">
          <AlertDialogTitle>Cancel {selected?.reference}?</AlertDialogTitle>
          <AlertDialogDescription>This marks {selected?.title} as cancelled in GoingFlag. It does not cancel supplier inventory or issue a refund.</AlertDialogDescription>
          {cancel.error ? <p role="alert" className="text-sm text-destructive">{cancel.error.message}</p> : null}
          <div className="flex flex-wrap justify-end gap-3"><GfButton variant="secondary" disabled={cancel.isPending} onClick={() => setSelected(null)}>Keep reservation</GfButton><GfButton disabled={cancel.isPending} onClick={() => { if (selected) cancel.mutate(selected.id); }}>{cancel.isPending ? "Cancelling…" : "Cancel reservation"}</GfButton></div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}