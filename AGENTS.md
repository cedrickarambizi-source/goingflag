<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Hotelbeds checkout carries the full rate key, ISO currency, exact supplier total and occupancy; supplier totals must not be multiplied by nights or receive invented taxes.
- Local reservation insertion cannot confirm Hotelbeds inventory; block supplier-stay creation until supplier booking and payment handling are implemented.
- Admin pages live under the client-only authenticated layout; every admin server function independently checks has_role using the caller's RLS client to protect direct endpoint access.
- Administrator enrollment uses a server-owned verified-email trigger, never public signup metadata or browser-stored roles, to prevent privilege escalation.
- Homepage hotel cards reuse the existing Hotelbeds search function; never use development inventory or stock photographs as property-specific results.
