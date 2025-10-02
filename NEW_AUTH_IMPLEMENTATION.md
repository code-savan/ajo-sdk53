# New Authentication System Implementation

## Overview

This document describes the complete implementation of the new authentication system that combines Supabase authentication with custom PIN and biometric security.

## Key Components Created

### 1. Updated Auth Context (`contexts/SupabaseAuthContext.tsx`)
- Added `checkUserExists` method to verify if user has account and PIN
- Modified `signUpWithEmail` to include metadata and force OTP
- Updated `verifyOTP` to support both signup and magic link types

### 2. New Screens

#### `RegisterScreenV2.tsx` - Enhanced Registration
- **Features:**
  - Name field collection
  - Email/password signup
  - 6-digit OTP verification (not magic link)
  - Google OAuth option
  - Auto-advancing OTP input fields
  - Resend OTP functionality

#### `SetPinScreenV2.tsx` - PIN Setup with Biometrics
- **Features:**
  - 4-digit PIN creation with confirmation
  - Platform-specific biometric toggle (Face ID/Touch ID/Biometrics)
  - Stores PIN hash in users table
  - Stores biometric preference
  - Auto-advances after 4 digits

#### `LoginScreenV2.tsx` - Multi-Step Login
- **Features:**
  - Step 1: Email/phone entry
  - Step 2: PIN entry (if user has PIN)
  - Step 3: Password fallback
  - Biometric authentication if enabled
  - 3 failed PIN attempts → password required
  - Remembers last used email

### 3. Security Implementation

#### PIN Security
- PINs are hashed using SHA256 with email salt
- Stored in `users.pin_hash` column
- Never stored in plain text

#### Biometric Security
- Uses expo-local-authentication
- Biometric preference stored in users table
- SecureStore for sensitive data

#### Password Storage
- Passwords stored encrypted in SecureStore
- Used for background Supabase auth after PIN/biometric success
- Key format: `password_${email}`

## Authentication Flows

### Signup Flow
```
1. User enters: Name, Email, Password
2. App calls signUpWithEmail → Supabase sends OTP
3. User enters 6-digit OTP
4. App verifies OTP → Session created
5. Navigate to SetPinScreen
6. User creates 4-digit PIN + optional biometric
7. PIN hash stored in users table
8. Navigate to Main app
```

### Login Flow with PIN
```
1. User enters email/phone
2. App checks if user exists and has PIN
3. If PIN exists:
   - Show PIN screen
   - If biometric enabled, prompt biometric first
   - User enters 4-digit PIN
   - Verify PIN hash
   - Use stored password to sign in with Supabase
4. If no PIN: Show password screen
```

### Password Fallback
```
- After 3 failed PIN attempts
- User chooses "Use Password Instead"
- Forgot PIN option
- Standard Supabase password auth
```

## Database Schema Required

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  full_name TEXT,
  pin_hash TEXT,
  biometric_enabled BOOLEAN DEFAULT FALSE,
  biometric_type TEXT, -- 'face_id' | 'fingerprint' | null
  failed_pin_attempts INTEGER DEFAULT 0,
  stored_password BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Allow insert during signup
CREATE POLICY "Enable insert for authenticated users" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## Environment Variables

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

## Usage Instructions

### To Implement:

1. **Update imports in your App.tsx:**
   ```typescript
   import LoginScreen from './screens/auth/LoginScreenV2';
   import RegisterScreen from './screens/auth/RegisterScreenV2';
   import SetPinScreen from './screens/onboarding/SetPinScreenV2';
   ```

2. **Ensure Supabase configuration:**
   - Email authentication enabled
   - Email templates configured for OTP
   - Database schema created

3. **Update navigation:**
   - Replace Login with LoginScreenV2
   - Replace Register with RegisterScreenV2
   - Replace SetPin with SetPinScreenV2

### Testing:

1. **New User Flow:**
   - Sign up with name, email, password
   - Verify OTP code
   - Create PIN with optional biometric
   - Login with PIN/biometric

2. **Existing User Flow:**
   - Enter email
   - Use PIN or biometric
   - Fallback to password if needed

## Security Considerations

1. **PIN Storage:** Always hashed, never plain text
2. **Password Storage:** Encrypted in SecureStore
3. **Biometric:** Optional additional layer
4. **Session Management:** Handled by Supabase
5. **Failed Attempts:** Tracked and limited

## Key Benefits

- **User-Friendly:** PIN is easier than password for daily use
- **Secure:** Multiple layers (Supabase + PIN + Biometric)
- **Flexible:** Password fallback always available
- **Platform-Aware:** Proper Face ID/Touch ID labeling
- **Persistent:** Remembers user preferences

## Logout Behavior

- Supabase session cleared
- PIN and biometric settings preserved
- Stored email preserved
- User can quickly log back in with PIN

## Switch Account

- Clears all stored data
- Full re-authentication required
- New PIN setup if different user

This implementation provides a modern, secure, and user-friendly authentication experience that combines the best of Supabase's session management with custom PIN and biometric security layers.