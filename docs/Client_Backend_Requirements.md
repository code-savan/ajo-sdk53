# Ajo App Backend Requirements
## Client Requirements Document

This document outlines all the external accounts and services that need to be set up for the Ajo app's backend infrastructure.

## Payment Processing - Stripe

### Requirements:
1. **Create a Stripe Account:**
   - Sign up for a Stripe account at [stripe.com](https://stripe.com)
   - Complete the business verification process
   - Set up the account to handle your local currency requirements

2. **Set up Stripe Connect:**
   - Enable Stripe Connect in your dashboard (required for managing multiple user balances)
   - Configure payout settings according to your business model

3. **Create API Keys:**
   - Generate both test (sandbox) and production API keys
   - Keep these keys secure and never share them publicly

4. **Team Access:**
   - Add developer access for our technical team via email: codesavan@proton.me
   - Grant appropriate permissions (Developer or Admin recommended)

5. **Webhook Configuration:**
   - Our development team will provide webhook endpoints once the backend is deployed
   - You'll need to configure these in your Stripe dashboard

### Deliverables:
- Stripe Account ID
- Team invitation confirmation
- Confirmation that Stripe Connect is enabled

## Database & Storage - Supabase

### Requirements:
1. **Create a Supabase Account:**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project for the Ajo app

2. **Project Setup:**
   - Select an appropriate region close to your target user base
   - Choose a pricing plan suitable for your expected usage (Pro plan recommended for production)

3. **Team Access:**
   - Add developer access for our technical team via email: codesavan@proton.me
   - Grant appropriate permissions (Owner or Admin recommended)

### Deliverables:
- Supabase Project URL
- Admin API keys (will be reset after setup)
- Database login credentials

## Push Notifications - Firebase

### Requirements:
1. **Create a Firebase Account:**
   - Use your Google account to sign in at [firebase.google.com](https://firebase.google.com)
   - Create a new Firebase project for the Ajo app

2. **Configure Firebase Cloud Messaging (FCM):**
   - Enable Firebase Cloud Messaging in your project
   - For iOS push notifications, upload your Apple Push Notification service (APNs) certificate

3. **Add Firebase to Your Apps:**
   - Register both Android and iOS apps in your Firebase project
   - Download the configuration files (google-services.json for Android, GoogleService-Info.plist for iOS)

4. **Team Access:**
   - Add developer access for our technical team via email: codesavan@proton.me
   - Grant appropriate permissions (Editor or Owner recommended)

### Deliverables:
- Firebase Project ID
- Web API Key
- Team invitation confirmation
- Server key for FCM

## Email Service Provider (Optional)

If you'd like to use a specific email service provider for transactional emails (account verification, receipts, etc.):

1. **Create an account** with your preferred email service provider (Sendgrid, Mailgun, etc.)
2. **Generate API keys**
3. **Add developer access** for our technical team via email: codesavan@proton.me

## Domain & DNS (If Applicable)

If you plan to use a custom domain for the API:

1. **Register your domain** (if not already registered)
2. **Provide DNS access** or be prepared to add the necessary DNS records when provided by our team

## Next Steps

Once you've completed the setup of these services, please compile all the credentials and access information into a secure document and share it with our team through an encrypted channel.

Our development team will then:
1. Configure the backend services
2. Set up the necessary integrations
3. Deploy the initial version of the API
4. Provide you with comprehensive documentation for the backend

If you have any questions about these requirements, please contact our technical team at codesavan@proton.me.

---

**IMPORTANT SECURITY NOTE:** Never share API keys, passwords, or other sensitive credentials via unsecured channels like email. Use a secure password manager or encrypted communication.
