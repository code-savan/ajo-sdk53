# Supabase OTP Configuration Guide

## Enable Email OTP for Signups

The error "Signups not allowed for otp" occurs because Supabase needs to be configured to allow OTP-based signups.

### Steps to Enable OTP Signups:

1. **Go to Supabase Dashboard**
   - Navigate to your project in [Supabase Dashboard](https://app.supabase.com)

2. **Configure Authentication Settings**
   - Go to **Authentication** → **Providers**
   - Make sure **Email** is enabled
   - Under Email settings, ensure:
     - ✅ Enable Email Signup
     - ✅ Enable Email Confirmations
     - ✅ Double check that "Confirm email" is enabled

3. **Configure Email Templates**
   - Go to **Authentication** → **Email Templates**
   - Select the **Confirm signup** template
   - Make sure the template contains `{{ .Token }}` to send the 6-digit OTP code
   - Example template:
     ```html
     <h2>Confirm your signup</h2>
     <p>Enter this code to confirm your email:</p>
     <h1>{{ .Token }}</h1>
     <p>This code will expire in 60 minutes.</p>
     ```

4. **Check Auth Settings**
   - Go to **Authentication** → **Configuration**
   - Under **Auth settings**, ensure:
     - ✅ Enable email confirmations is ON
     - ✅ Allow new users to sign up is ON

5. **Alternative: Use Traditional Flow**
   If OTP signups are still not working, you can use the traditional email/password signup flow:
   - The current implementation already handles this
   - Users will receive a confirmation email with a 6-digit code
   - After entering the code, their account will be verified

### Testing the Configuration:

1. Try signing up with a new email
2. Check your email for the 6-digit OTP code
3. Enter the code in the app
4. The user should be created and verified

### Troubleshooting:

If you're still getting the "Signups not allowed for otp" error:

1. **Check Supabase Plan**: Some features might be limited on the free plan
2. **Check Rate Limits**: Too many signup attempts might trigger rate limiting
3. **Use Magic Links**: As a fallback, you can configure magic links instead of OTP codes

### Current Implementation:

The app is already set up to handle both flows:
- **Primary**: Email/Password signup with OTP verification
- **Fallback**: If OTP fails, the traditional signup flow is used

The signup flow will:
1. Create user account in Supabase Auth
2. Send OTP code via email
3. Verify OTP and mark user as confirmed
4. Create user record in database with full_name
5. Proceed to PIN setup
