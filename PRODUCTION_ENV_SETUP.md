# 🔐 Production Environment Variables Setup

## Required Environment Variables

Your app needs these environment variables for the production build:

### 1. **EXPO_PUBLIC_SUPABASE_URL**
```
Your Supabase project URL
Example: https://cpvgznbnczuqzmyvaxdo.supabase.co
```

### 2. **EXPO_PUBLIC_SUPABASE_ANON_KEY**
```
Your Supabase anonymous (public) key
Find in: Supabase Dashboard > Settings > API
```

### 3. **EXPO_PUBLIC_API_BASE_URL**
```
Your production backend URL
Example: https://your-domain.com
```

### 4. **EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY**
```
Your Stripe publishable key (production or test)
Find in: Stripe Dashboard > Developers > API keys
```

---

## Setting Up with EAS

### Option 1: Using EAS CLI (Recommended)
```bash
cd /Users/mac/Downloads/ajo-sdk53/mobileapp

# Set environment variables for production builds
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "YOUR_SUPABASE_URL"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "YOUR_SUPABASE_ANON_KEY"
eas secret:create --scope project --name EXPO_PUBLIC_API_BASE_URL --value "YOUR_BACKEND_URL"
eas secret:create --scope project --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value "YOUR_STRIPE_KEY"
```

### Option 2: Using eas.json (Alternative)
Add to `eas.json`:
```json
{
  "build": {
    "production": {
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "YOUR_SUPABASE_URL",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "YOUR_SUPABASE_ANON_KEY",
        "EXPO_PUBLIC_API_BASE_URL": "YOUR_BACKEND_URL",
        "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY": "YOUR_STRIPE_KEY"
      }
    }
  }
}
```

### Option 3: Via Expo Dashboard
1. Go to https://expo.dev/accounts/codesavan/projects/ajo-mobile-app/secrets
2. Click "Create Secret"
3. Add each environment variable

---

## Verify Your Values

Before building, ensure:
- ✅ Supabase URL is your production database
- ✅ Backend URL is accessible from the internet (not localhost)
- ✅ Stripe key matches your deployment stage (test/production)
- ✅ All keys are from the correct environment

---

## Security Notes

⚠️ **Never commit these values to git!**
✅ Use EAS Secrets for production builds
✅ Keep sensitive keys in secure storage
✅ Rotate keys if compromised

---

## Quick Check Commands

```bash
# List all secrets
eas secret:list

# Delete a secret
eas secret:delete --name SECRET_NAME

# Push secrets from .env file
eas secret:push --scope project
```

---

**Next Step:** Once secrets are configured, proceed with `eas build --platform ios --profile production`
