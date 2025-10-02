## Environment Setup Guide

This project uses two environments: the mobile app (Expo/React Native) and the backend (Next.js API in `backend/`). Below are the required variables and how to obtain them.

### Backend (.env)
Create `backend/.env` from `backend/.env.example`.

- SUPABASE_URL: Supabase Dashboard → Settings → API → Project URL
- SUPABASE_ANON_KEY: Supabase Dashboard → Settings → API → anon public key
- SUPABASE_SERVICE_ROLE_KEY: Supabase Dashboard → Settings → API → service_role key (backend only)
- JWT_SECRET: Generate a strong random string (e.g., `openssl rand -base64 48`)
- JWT_REFRESH_SECRET: Generate another strong random string
- STRIPE_SECRET_KEY: Stripe Dashboard → Developers → API keys → Secret key (Test first)
- STRIPE_WEBHOOK_SECRET: Stripe Dashboard → Developers → Webhooks → Add endpoint → copy Signing secret (use Stripe CLI locally)
- STRIPE_DEFAULT_CURRENCY: Your operating currency (e.g., usd, ngn, eur)
- STRIPE_PLATFORM_FEE_BPS: Platform fee in basis points (300 = 3%)
- STRIPE_CONNECT_REDIRECT_URL: Your deployed URL that completes onboarding (e.g., https://api.example.com/api/stripe/connect/return)
- STRIPE_CONNECT_REFRESH_URL: Onboarding refresh URL (e.g., https://api.example.com/api/stripe/connect/refresh)
- PUBLIC_BASE_URL: Public base URL of the backend (e.g., http://localhost:3000 for local or your prod URL)

Recommended local values:
- PUBLIC_BASE_URL=http://localhost:3000
- STRIPE_CONNECT_REDIRECT_URL=http://localhost:3000/api/stripe/connect/return
- STRIPE_CONNECT_REFRESH_URL=http://localhost:3000/api/stripe/connect/refresh

Webhook (local):
1. Install Stripe CLI and login.
2. Start local forwarding:
   - `stripe listen --events payment_intent.succeeded,payment_intent.payment_failed,customer.cash_balance.funds_available --forward-to http://localhost:3000/api/stripe/webhook`
3. Copy the printed `whsec_...` and set STRIPE_WEBHOOK_SECRET.

### Mobile App (Expo)
Use `.env` or your preferred method to set Expo public envs. The app reads:
- EXPO_PUBLIC_SUPABASE_URL: Supabase Project URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY: Supabase anon public key

These are used in `lib/supabase.ts`.

### Accounts to Prepare
- Stripe: Enable Connect (Express), set payout settings, and get API keys.
- Supabase: Create project and obtain URL/keys.

### Operational Notes
- Use Test mode first for Stripe; switch to Live after verification.
- Keep service role keys ONLY on the backend, never on the client.
- For push notifications (Expo), store device tokens; no extra key is required for sending via the Expo push service.
