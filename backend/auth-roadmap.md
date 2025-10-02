# Ajo Authentication System Implementation Roadmap
## PIN-based Authentication with Biometric Support

This roadmap details the implementation of the complete authentication flow for the Ajo app using Clerk, Supabase, and custom PIN/biometric authentication.

## 🎯 Authentication Flow Overview

### User Journey
1. **First Time Users**: Welcome → Sign Up (Email/Phone) → Email Verification (OTP) → Set PIN → Enable Biometrics → Dashboard
2. **Returning Users**: 
   - **Logged In**: App Open → PIN/Biometric → Dashboard
   - **Logged Out**: App Open → Email/Phone Input → PIN → Dashboard
3. **OAuth Users**: Welcome → Google Sign In → Set PIN → Enable Biometrics → Dashboard

### Key Requirements
- ✅ 4-digit PIN for all transactions and app access
- ✅ Biometric authentication (Face ID/Fingerprint) as optional
- ✅ Local credential storage for seamless experience
- ✅ Email verification with 6-digit OTP
- ✅ Google OAuth integration
- ✅ Session management with automatic logout

---

## 📋 Phase 1: Environment & Basic Setup (Day 1-2)

### Prerequisites Setup
- [x] Clerk account configured
- [x] Supabase project with migrations enabled
- [ ] Required packages installed
- [ ] Environment variables configured

### Required Environment Variables
```env
# Clerk Configuration
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret

# Supabase Configuration  
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
EXPO_PUBLIC_APP_NAME=Ajo
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Package Installation
```bash
# Core Clerk packages
npx expo install @clerk/clerk-expo
npx expo install @clerk/clerk-expo/local-credentials

# Biometric authentication
npx expo install expo-local-authentication
npx expo install expo-secure-store

# Other required packages
npx expo install @supabase/supabase-js
npx expo install expo-crypto
npx expo install expo-constants
```

### Tasks
- [ ] Install all required packages
- [ ] Set up environment variables
- [ ] Configure Clerk in App.tsx
- [ ] Set up Supabase client
- [ ] Create basic authentication context

---

## 📋 Phase 2: Database Schema & Backend Setup (Day 2-3)

### Supabase Schema Updates
```sql
-- Update users table for PIN storage
ALTER TABLE users ADD COLUMN pin_hash TEXT;
ALTER TABLE users ADD COLUMN biometric_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN biometric_type TEXT; -- 'face_id', 'fingerprint', 'iris'
ALTER TABLE users ADD COLUMN local_auth_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN last_pin_attempt TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN failed_pin_attempts INTEGER DEFAULT 0;

-- User sessions for tracking login state
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Endpoints to Create
- [ ] `POST /api/auth/setup-pin` - Set user's PIN
- [ ] `POST /api/auth/verify-pin` - Verify PIN for authentication
- [ ] `PUT /api/auth/biometric-settings` - Enable/disable biometric auth
- [ ] `POST /api/auth/sync-user` - Sync Clerk user to Supabase

### Tasks
- [ ] Run database migrations
- [ ] Create authentication API endpoints
- [ ] Set up PIN hashing utilities
- [ ] Create session management logic

---

## 📋 Phase 3: Core Authentication Screens (Day 3-5)

### Screen Creation Priority

#### 1. Enhanced Sign Up Screen
**File**: `screens/signup/SignupScreen.tsx`
- [ ] Single input field for email/phone detection
- [ ] Google OAuth button integration
- [ ] Form validation and error handling
- [ ] Loading states and user feedback

#### 2. Email Verification Screen  
**File**: `screens/verification/VerifyEmailScreen.tsx`
- [ ] 6-digit OTP input component
- [ ] Resend code functionality with countdown timer
- [ ] Auto-submit on 6-digit completion
- [ ] Error handling for invalid codes

#### 3. Set PIN Screen (New)
**File**: `screens/onboarding/SetPinScreen.tsx`
- [ ] 4-digit PIN input with dots
- [ ] PIN confirmation field
- [ ] Show/hide toggle buttons
- [ ] Face ID enable toggle
- [ ] PIN strength validation
- [ ] Success confirmation modal

#### 4. Enhanced Login Screen
**File**: `screens/login/LoginScreen.tsx`
- [ ] Email/phone input (only when logged out)
- [ ] PIN input (always visible)
- [ ] Biometric authentication button
- [ ] "Use Face ID" option with emoji
- [ ] Local credentials detection

### UI Components to Create
- [ ] `PinInput` - Custom 4-digit PIN input
- [ ] `BiometricButton` - Face ID/Fingerprint button
- [ ] `OTPInput` - 6-digit OTP verification
- [ ] `LoadingSpinner` - Consistent loading indicator

---

## 📋 Phase 4: Authentication Logic Implementation (Day 5-7)

### Authentication Context
**File**: `contexts/AuthContext.tsx`
```typescript
interface AuthContextType {
  // User state
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  
  // PIN management
  hasPin: boolean;
  setupPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  
  // Biometric management
  biometricEnabled: boolean;
  enableBiometric: () => Promise<void>;
  disableBiometric: () => Promise<void>;
  authenticateWithBiometric: () => Promise<boolean>;
  
  // Session management
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}
```

### Core Authentication Functions
- [ ] PIN encryption/hashing utilities
- [ ] Biometric authentication setup
- [ ] Local credentials management
- [ ] Session token management
- [ ] Auto-logout on app backgrounding

### Security Features
- [ ] PIN attempt limiting (5 attempts → lockout)
- [ ] Session expiration handling
- [ ] Secure storage for sensitive data
- [ ] Device fingerprinting for security

---

## 📋 Phase 5: Navigation & Flow Control (Day 7-8)

### Navigation Logic
**File**: `App.tsx` Updates
```typescript
// Navigation flow based on auth state
const getInitialRoute = () => {
  if (!isLoaded) return 'Loading';
  if (!isSignedIn) return 'Welcome';
  if (!hasPin) return 'SetPin';
  return 'MainTabs';
};
```

### Route Protection
- [ ] Protected routes for authenticated users
- [ ] PIN verification for sensitive screens
- [ ] Automatic redirect on session expiry
- [ ] Deep linking with authentication checks

### Screen Flow Implementation
- [ ] Welcome → SignUp/Login routing
- [ ] SignUp → Verification → SetPin flow
- [ ] Login → PIN verification → Dashboard
- [ ] Session restoration on app restart

---

## 📋 Phase 6: Testing & Validation (Day 8-9)

### Test Scenarios
1. **New User Registration**
   - Email sign up → OTP verification → PIN setup → Dashboard
   - Google OAuth → PIN setup → Dashboard
   - Invalid email/OTP error handling

2. **Returning User Login**
   - With local credentials: PIN only → Dashboard
   - Without local credentials: Email + PIN → Dashboard
   - Biometric authentication → Dashboard

3. **Security Testing**
   - Invalid PIN attempts and lockout
   - Session expiration and renewal
   - Biometric fallback to PIN
   - App backgrounding and foreground PIN requirement

### Testing Tools
- [ ] Jest unit tests for authentication logic
- [ ] Expo development build for device testing
- [ ] Manual testing on iOS/Android devices
- [ ] Integration testing with Clerk/Supabase

---

## 🚀 Implementation Tasks Breakdown

### Immediate Tasks (Start Here)

#### Task 1: Environment Setup
```bash
# Install packages
npx expo install @clerk/clerk-expo @clerk/clerk-expo/local-credentials
npx expo install expo-local-authentication expo-secure-store
npx expo install @supabase/supabase-js expo-crypto
```

#### Task 2: Environment Variables
Create `.env.local`:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

#### Task 3: Basic Clerk Setup
Update `App.tsx` with ClerkProvider:
```typescript
import { ClerkProvider } from '@clerk/clerk-expo';

export default function App() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      {/* Your existing app */}
    </ClerkProvider>
  );
}
```

#### Task 4: Create PIN Setup Screen
Based on your screenshots, create the PIN setup UI with:
- Title: "Set Your 4-Digit PIN"
- Description with security message
- PIN input fields with show/hide toggle
- Face ID toggle switch
- Save button

---

## 📱 Local Development Setup

### Start Development Server
```bash
# Navigate to project
cd /Users/mac/Downloads/ajo-sdk53

# Start Expo development server
npx expo start

# Or for development build
npx expo run:ios
```

### Test on Device
1. Install Expo Go app on iPhone
2. Scan QR code from terminal
3. Test authentication flow
4. Monitor console for errors

---

## 🔧 Next Steps

1. **Confirm Environment Variables** - Get your Clerk publishable key
2. **Install Required Packages** - Run the package installation commands
3. **Create PIN Setup Screen** - Build the UI matching your screenshots
4. **Implement Basic Authentication Flow** - Start with sign up → PIN setup
5. **Test on Device** - Verify the flow works on your iPhone

Would you like me to start implementing any of these tasks? I can begin with the environment setup and package installation, then move on to creating the PIN setup screen matching your UI design.

<function_calls>
<invoke name="mark_todo_as_done">
<parameter name="todo_ids">["f17c9785-9375-400a-86ab-5e257345a068"]
