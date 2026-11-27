# V1 architecture

- Guest history: browser IndexedDB, no account required.
- Private workspace: Supabase Auth, owner-scoped RLS, separate admin authorization.
- Provider gateway: server-only credentials, explicit provider allowlist, bounded retries and quotas; free-only mode fails closed.
- Attachments: size/type limits and capability checks; private storage by default.
- PWA: offline history only; never cache authenticated API responses.
- Deployment: Vercel; build and security checks required before public release.

Database migrations and runtime implementation are pending. No live schema changes yet.
