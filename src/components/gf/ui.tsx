import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- Button */

type ButtonVariant = "primary" | "secondary" | "quiet";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-[13px] text-[15px] font-medium leading-none transition-colors duration-200 disabled:pointer-events-none disabled:border-concrete disabled:text-concrete";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "border-black bg-black text-white hover:bg-[#1d1d1f]",
  secondary: "border-black bg-white text-black hover:bg-band",
  quiet: "border-transparent bg-band text-black hover:bg-[#ebebef]",
};

export function GfButton({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button className={cn(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function GfButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={cn(buttonBase, buttonVariants[variant], className)} {...props} />;
}

/* ------------------------------------------------------------ Arrow link */

export function ArrowLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group inline-flex items-baseline gap-2 text-[15px] text-black underline decoration-ash decoration-1 underline-offset-[6px] transition-colors hover:decoration-black",
        className,
      )}
      {...props}
    >
      {children as ReactNode}
      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

/* -------------------------------------------------------------- Section */

export function SectionHead({
  index,
  title,
  intro,
  action,
}: {
  index?: string;
  title: string;
  intro?: string;
  action?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-6 gap-y-4 border-b border-hairline pb-[30px] md:flex md:justify-between">
      <div className="min-w-0 max-w-2xl">
        {index ? <p className="gf-caption text-iron">{index}</p> : null}
        <h2 className="gf-heading mt-3">{title}</h2>
        {intro ? <p className="gf-body mt-4 text-graphite">{intro}</p> : null}
      </div>
      {action ? <div className="col-span-2 shrink-0 md:col-auto md:pb-2">{action}</div> : null}
    </header>
  );
}

/* ----------------------------------------------------------------- Bits */

export function Tag({ children }: { children: ReactNode }) {
  return <span className="gf-caption text-graphite">{children}</span>;
}

export function Price({ value, suffix, className }: { value: string; suffix?: string; className?: string }) {
  return (
    <span className={cn("gf-nums text-[15px] text-black", className)}>
      {value}
      {suffix ? <span className="text-graphite"> {suffix}</span> : null}
    </span>
  );
}

export function Stars({ count }: { count: number }) {
  return (
    <span className="text-[12px] tracking-[0.2em] text-black" aria-label={`${count} star property`}>
      {"★".repeat(count)}
    </span>
  );
}

type BreadcrumbItem = { label: string; to?: ComponentProps<typeof Link>["to"] };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="gf-caption text-iron">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {item.to ? (
              <Link to={item.to} className="text-graphite hover:text-black">
                {item.label}
              </Link>
            ) : (
              <span className="text-black">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------ Checkout CTA link */

export type CheckoutDraft = {
  kind: "stay" | "flight" | "experience" | "transfer" | "car" | "package";
  slug: string;
  title: string;
  location?: string;
  image?: string;
  price: number;
  unit: string;
  start?: string;
  end?: string;
  travellers?: number;
  quantity?: number;
};

export function CheckoutLink({
  draft,
  variant = "primary",
  className,
  children,
}: {
  draft: CheckoutDraft;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      to="/checkout"
      search={draft}
      className={cn(buttonBase, buttonVariants[variant], className)}
    >
      {children}
    </Link>
  );
}
