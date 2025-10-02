# Quick Migration Instructions

## Current Status
✅ Your app is currently running with Clerk authentication
✅ The new Supabase authentication system is fully implemented and ready
✅ Environment variables are properly configured

## To Switch to Supabase Authentication:

### Step 1: Backup Current App File
```bash
cp App.tsx App.clerk-backup.tsx
```

### Step 2: Replace with Supabase Version
```bash
cp App.supabase.tsx App.tsx
```

### Step 3: Restart Expo
```bash
# Stop the current server (Ctrl+C)
npx expo start --clear
```

## What You'll Get:

### New Authentication Features:
- ✅ Email/Password login and registration
- ✅ Email OTP (Magic Links)
- ✅ Session persistence across app restarts
- ✅ Google OAuth (ready - just needs Supabase dashboard setup)
- ✅ Phone OTP authentication (methods ready to use)

### New Screens:
- `LoginScreen` - Modern login with email/password or magic link
- `RegisterScreen` - User registration 
- `EmailOTPScreen` - OTP verification (updated for Supabase)
- `MainAppScreen` - Example authenticated screen

### Navigation Flow:
1. No session → Welcome → Login/Register
2. Has session but no PIN → SetPin
3. Complete auth → MainTabs

## Important Notes:

1. **Supabase Dashboard Setup Required**:
   - Enable Email authentication
   - Configure email templates
   - Set up OAuth providers if needed

2. **Your Existing Screens**: 
   - All your existing screens (Groups, Wallet, Profile, etc.) will continue to work
   - The auth context is now `useAuth()` from `SupabaseAuthContext`

3. **Environment Variables**:
   - Already configured in your .env.local
   - Using your Supabase project credentials

## Testing the New System:

1. After switching, try:
   - Creating a new account with email/password
   - Logging in with email/password
   - Using the magic link option
   - Checking session persistence (close and reopen app)

2. The existing PIN system will work with the new auth

## Rolling Back:

If you need to go back to Clerk:
```bash
cp App.clerk-backup.tsx App.tsx
npx expo start --clear
```

The migration is complete and ready to use!
