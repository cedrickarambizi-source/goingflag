import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  beforeLoad: () => { throw redirect({ to: "/signin", search: { admin: true } }); },
  head: () => ({ meta: [
    { title: "Account access — GoingFlag" },
    { name: "description", content: "Secure account access for GoingFlag." },
    { property: "og:title", content: "Account access — GoingFlag" },
    { property: "og:description", content: "Secure account access for GoingFlag." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
});