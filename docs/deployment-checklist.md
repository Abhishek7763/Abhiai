# Release checklist
1. Run npm install, commit lockfile, run node --test tests/*.test.mjs and npm run build. Review dependency advisories.
2. Configure Vercel server-only AI_ADMIN_TOKEN and AI_PREVIEW_TOKEN with separate random 32-byte hex values. Generate AI_KEY_ENCRYPTION_KEY with openssl rand -hex 32; preserve it securely. Never commit secrets.
3. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Set SUPABASE_SERVICE_ROLE_KEY only on server. Enable AI_DATABASE_PROVIDERS only after validating encrypted storage.
4. Create the private Supabase Auth account; disable unwanted public signups and verify owner isolation before using private history.
5. Configure a verified free OpenRouter model and key. Keep AI_ALLOW_PAID=false and AI_PUBLIC_GUEST=false until live tests pass.
6. Test admin login/logout over HTTPS, session expiry, provider settings, chat streaming, private history, PWA and mobile layout.
7. Public launch requires distributed abuse protection; current guest cap is global, admin throttle per instance. PDF/Office parsing and real-time audio are not implemented.
8. Optional vision and Brave search require verified model capability and pricing. Keep search disabled until configured.
