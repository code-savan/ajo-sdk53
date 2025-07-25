# Ajo App Backend Requirements
## Client Requirements Document

 To build the backend infrastructure for your application, I'll need access to a few external services. This document outlines the accounts you need to create and the access you need to provide.

**Important: You are only responsible for creating these accounts and adding me as a team member. I will handle all configuration, setup, and integration work myself.**

---

## Payment Processing - Stripe

### What You Need To Do:
1. **Create a Stripe Account:**
   - Sign up for a Stripe account at [stripe.com](https://stripe.com)
   - Complete the business verification process (this requires your business details)
   - The account should be created in your business name with your business information

2. **Add Me To Your Team:**
   - Go to the Stripe Dashboard → Settings → Team management
   - Click "Invite" and add my email: codesavan@proton.me
   - Grant me Admin level access so I can configure all necessary settings

### Why This Is Needed:
Stripe will handle all payment processing for the app, including wallet funding, withdrawals, and group contributions. As the business owner, you need to own this account for legal and tax purposes, but I need access to set up the technical integration.

### What I'll Handle:
- Setting up Stripe Connect for managing user balances
- Creating and managing API keys
- Configuring webhooks and payment flows
- Setting up all payment methods and transaction handling

### What You'll Provide Me:
- Confirmation that you've created the Stripe account
- Confirmation that you've invited me to the team

---

## Database & Storage - Supabase

### What You Need To Do:
1. **Create a Supabase Account:**
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new organization with your company name
   - Select a pricing plan that fits your budget (The Pro plan is recommended for production use, but we can start with the Free plan for development)

2. **Add Me To Your Team:**
   - Go to Organization Settings → Team members
   - Invite me using my email: eric.marvelboy@gmail.com
   - Grant me Owner permissions so I can set up all database components (Or you can drop the login details)

### Why This Is Needed:
Supabase will store all your application data securely, including user profiles, savings groups, and transaction records. Your ownership of this account ensures you maintain control of your data.

### What I'll Handle:
- Creating and structuring all databases
- Setting up authentication systems
- Configuring security rules and access controls
- Managing storage buckets for files and images
- Creating database backups and migration strategies

### What You'll Provide Me:
- Confirmation that you've created the Supabase account and project
- Confirmation that you've invited me to the team
- The Login Credentials of the Supabase Account

---

## Push Notifications - Firebase

### What You Need To Do:
1. **Create a Firebase Account:**
   - Use your Google account (or create one) to sign in at [firebase.google.com](https://firebase.google.com)
   - Create a new Firebase project with your company/app name

2. **Add Me To Your Team:**
   - In your Firebase project settings, find the "Users and permissions" section
   - Add my email: eric.marvelboy@gmail.com (gmail neccessary for google account)
   - Grant me Owner permissions so I can configure all necessary services

### Why This Is Needed:
Firebase will power the app's push notification system, letting users know about contribution reminders, successful transactions, and group updates. Having your own Firebase account ensures these notifications come from your business entity.

### What I'll Handle:
- Setting up Firebase Cloud Messaging (FCM)
- Configuring all notification types and templates
- Handling iOS and Android specific requirements
- Setting up scheduled and triggered notifications
- Managing notification analytics

### What You'll Provide Me:
- Confirmation that you've created the Firebase project
- Confirmation that you've invited me to the project team

---

## Email Service Provider (Optional)

### What You Need To Do (Optional):
If you want to send transactional emails (account verification, receipts, etc.) from a professional email domain:

1. **Choose and Create an Account:**
   - Sign up with an email service like SendGrid, Mailgun, or Postmark
   - You can let me know which one you prefer, or I can recommend one based on your needs

2. **Add Me To Your Team:**
   - Invite me as a team member using: eric.marvelboy@gmail.com (gmail neccessary for google account)
   - Grant me full access to configure the service

### Why This Is Needed:
Transactional emails increase user trust and provide important notifications when users can't receive push notifications. These emails should come from your business domain for professionalism and deliverability.

### What I'll Handle:
- Creating email templates
- Setting up all technical integrations
- Configuring sender authentication (SPF, DKIM)
- Managing email delivery and tracking

---

## Domain & DNS (If Applicable)

### What You Need To Do (If Applicable):
If you want to use a custom domain for the API and app services:

1. **Choose and Register a Domain:**
   - If you don't already have a domain for this app, register one through a provider like Namecheap, GoDaddy, or Google Domains

2. **Provide DNS Access:**
   - Either add me as a user to your domain registrar account
   - Or stand ready to add DNS records that I'll provide you

### Why This Is Needed:
A custom domain creates a professional appearance and builds brand recognition. It also provides consistency if you later change hosting providers.

### What I'll Handle:
- Creating all necessary DNS records
- Setting up SSL certificates for security
- Configuring domain forwarding and routing

---

## Next Steps

Here's what happens after you've created these accounts:

1. **Let me know when you're done:**
   - Send me an email at codesavan@proton.me confirming you've created all accounts and invited me
   - No need to send any passwords or API keys - your team invitations will give me the access I need

2. **What I'll do next:**
   - Configure all backend services and security settings
   - Set up all necessary integrations between systems
   - Build and deploy the API that powers your mobile app
   - Keep you updated on progress throughout the development process

3. **Timeline:**
   - Once I have access to all services, I can begin backend setup immediately
   - I'll provide you with regular updates on development progress

If you have any questions or need clarification about any of these requirements, please don't hesitate to contact me directly at eric.marvelboy@gmail.com. I'm here to help make this process as smooth as possible for you.

---

**IMPORTANT SECURITY NOTE:** You don't need to send me any API keys directly. The team member invitations to each service will give me the access I need to create and manage these credentials securely. This approach is safer for everyone involved.
