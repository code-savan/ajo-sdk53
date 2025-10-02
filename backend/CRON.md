# Rotation Scheduler (Cron)

Use a scheduler to execute group rotations when `next_charge_at` is due.

## Vercel Cron example

Add to `vercel.json`:

```
{
  "crons": [
    { "path": "/api/cron/rotate", "schedule": "0 * * * *" }
  ]
}
```

Create `pages/api/cron/rotate.ts` to:
- Query groups where `status='active'` and `next_charge_at <= now()` (limit/batch by page).
- Call `POST /api/groups/:id/rotate/execute` for each.

Note: In this repo, you can directly implement a server-side function that selects due groups via Supabase admin client and calls the rotation execute code, or reuse the endpoint.

## Stripe Webhook
- Ensure `payment_intent.succeeded` events reach `/api/stripe/webhook`.
- Use Stripe CLI locally:
  - `stripe listen --events payment_intent.succeeded,payment_intent.payment_failed,customer.cash_balance.funds_available --forward-to http://localhost:3000/api/stripe/webhook`
