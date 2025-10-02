# Ajo Backend API Structure
## API Endpoints with Clerk Authentication

This document outlines all API endpoints for the Ajo savings app backend, integrating with Clerk for authentication.

## Base Configuration

- **Base URL**: `/api`
- **Authentication**: Clerk JWT tokens
- **Response Format**: JSON
- **Rate Limiting**: 100 requests per 15 minutes per user

## Authentication Flow with Clerk

### Clerk Integration Pattern
```typescript
// middleware/auth.ts
import { getAuth } from '@clerk/nextjs/server';

export async function withAuth(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return userId;
}
```

### User Sync with Supabase
- Clerk webhooks sync user data to Supabase `users` table
- PIN authentication handled separately in app
- Clerk userId used as primary key in Supabase

## API Endpoints

### 🔐 Authentication & User Management

#### `POST /api/auth/sync-user`
Sync user data from Clerk webhook
```typescript
// Webhook from Clerk when user signs up/updates
{
  id: string;        // Clerk user ID
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
}
```

#### `POST /api/auth/setup-pin`
Set up PIN for app-specific authentication
```typescript
Request: {
  pin: string; // 6-digit PIN
}
Response: {
  success: boolean;
}
```

#### `POST /api/auth/verify-pin`
Verify PIN for sensitive operations
```typescript
Request: {
  pin: string;
}
Response: {
  success: boolean;
  token: string; // Short-lived token for sensitive ops
}
```

#### `GET /api/users/profile`
Get current user profile
```typescript
Response: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profileImageUrl?: string;
  isVerified: boolean;
  preferences: object;
  createdAt: string;
}
```

#### `PUT /api/users/profile`
Update user profile
```typescript
Request: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  preferences?: object;
}
```

### 💰 Wallet Management

#### `GET /api/wallet`
Get user wallet balance and details
```typescript
Response: {
  id: string;
  balance: number;
  pendingBalance: number;
  reservedBalance: number;
  currency: string;
}
```

#### `POST /api/wallet/fund`
Fund wallet from external payment method
```typescript
Request: {
  amount: number;
  paymentMethodId: string; // Stripe payment method ID
  currency?: string;
}
Response: {
  transactionId: string;
  status: 'pending' | 'processing' | 'completed';
  clientSecret?: string; // For 3DS authentication
}
```

#### `POST /api/wallet/withdraw`
Withdraw funds from wallet
```typescript
Request: {
  amount: number;
  bankAccountId: string;
  pin: string; // Required for withdrawals
}
Response: {
  transactionId: string;
  status: 'pending' | 'processing';
  estimatedArrival: string;
}
```

#### `GET /api/wallet/transactions`
Get wallet transaction history
```typescript
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20, max: 100)
- type: 'deposit' | 'withdrawal' | 'all'
- startDate: string (ISO date)
- endDate: string (ISO date)

Response: {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  }
}
```

### 👥 Group Management

#### `POST /api/groups`
Create a new savings group
```typescript
Request: {
  name: string;
  description?: string;
  contributionAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: string; // ISO date
  maxMembers?: number;
}
Response: {
  group: Group;
  inviteCode: string;
}
```

#### `GET /api/groups`
Get user's groups
```typescript
Query Parameters:
- status: 'pending' | 'active' | 'completed' | 'all'
- role: 'admin' | 'member' | 'all'

Response: {
  groups: Group[];
}
```

#### `GET /api/groups/[groupId]`
Get group details
```typescript
Response: {
  group: Group;
  members: GroupMember[];
  myRole: 'admin' | 'member';
  nextPayout: {
    recipient: User;
    amount: number;
    date: string;
  };
  recentContributions: Transaction[];
}
```

#### `PUT /api/groups/[groupId]`
Update group (admin only)
```typescript
Request: {
  name?: string;
  description?: string;
  status?: 'active' | 'paused' | 'completed';
}
```

#### `POST /api/groups/[groupId]/join`
Join group via invite code
```typescript
Request: {
  inviteCode: string;
}
Response: {
  member: GroupMember;
}
```

#### `POST /api/groups/[groupId]/invite`
Invite members to group (admin/members)
```typescript
Request: {
  emails?: string[];
  phones?: string[];
  message?: string;
}
Response: {
  invites: GroupInvite[];
}
```

#### `POST /api/groups/[groupId]/contribute`
Make contribution to group
```typescript
Request: {
  amount: number;
  useWallet?: boolean; // If false, use Stripe
  paymentMethodId?: string; // Required if useWallet is false
  pin: string; // Always required for contributions
}
Response: {
  transaction: Transaction;
  contribution: GroupContribution;
  newWalletBalance?: number;
}
```

#### `GET /api/groups/[groupId]/contributions`
Get group contribution history
```typescript
Query Parameters:
- userId: string (optional, admin only)
- status: 'pending' | 'paid' | 'overdue'
- round: number

Response: {
  contributions: GroupContribution[];
  summary: {
    totalCollected: number;
    pendingAmount: number;
    nextDueDate: string;
  }
}
```

#### `GET /api/groups/[groupId]/members`
Get group members
```typescript
Response: {
  members: GroupMember[];
  adminId: string;
}
```

#### `DELETE /api/groups/[groupId]/members/[userId]`
Remove member from group (admin only)
```typescript
Response: {
  success: boolean;
}
```

### 🔔 Notifications

#### `GET /api/notifications`
Get user notifications
```typescript
Query Parameters:
- read: boolean
- type: NotificationType
- limit: number (default: 50)

Response: {
  notifications: Notification[];
  unreadCount: number;
}
```

#### `PUT /api/notifications/[notificationId]/read`
Mark notification as read
```typescript
Response: {
  success: boolean;
}
```

#### `PUT /api/notifications/read-all`
Mark all notifications as read
```typescript
Response: {
  success: boolean;
  updatedCount: number;
}
```

#### `GET /api/notifications/preferences`
Get notification preferences
```typescript
Response: {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  contributionReminders: boolean;
  payoutAlerts: boolean;
  groupUpdates: boolean;
  securityAlerts: boolean;
}
```

#### `PUT /api/notifications/preferences`
Update notification preferences
```typescript
Request: {
  pushNotifications?: boolean;
  emailNotifications?: boolean;
  contributionReminders?: boolean;
  payoutAlerts?: boolean;
  groupUpdates?: boolean;
}
```

### 💳 Payment Methods

#### `GET /api/payment-methods`
Get user's saved payment methods
```typescript
Response: {
  paymentMethods: PaymentMethod[];
}
```

#### `POST /api/payment-methods`
Add new payment method
```typescript
Request: {
  stripePaymentMethodId: string;
  isDefault?: boolean;
}
Response: {
  paymentMethod: PaymentMethod;
}
```

#### `DELETE /api/payment-methods/[paymentMethodId]`
Remove payment method
```typescript
Response: {
  success: boolean;
}
```

#### `PUT /api/payment-methods/[paymentMethodId]/default`
Set payment method as default
```typescript
Response: {
  success: boolean;
}
```

### 📊 Analytics & Reporting

#### `GET /api/analytics/dashboard`
Get user dashboard analytics
```typescript
Response: {
  totalSavings: number;
  activeGroups: number;
  totalContributions: number;
  upcomingPayouts: number;
  monthlyContributions: {
    month: string;
    amount: number;
  }[];
  groupPerformance: {
    groupId: string;
    name: string;
    contributed: number;
    target: number;
    completion: number;
  }[];
}
```

#### `GET /api/groups/[groupId]/analytics`
Get group-specific analytics (admin only)
```typescript
Response: {
  totalCollected: number;
  averageContribution: number;
  memberParticipation: {
    userId: string;
    name: string;
    contributionRate: number;
    totalContributed: number;
  }[];
  payoutSchedule: {
    round: number;
    recipient: string;
    amount: number;
    dueDate: string;
    status: string;
  }[];
}
```

### 🔧 Admin Operations

#### `POST /api/admin/groups/[groupId]/payout`
Process group payout (admin only)
```typescript
Request: {
  recipientId: string;
  amount: number;
  round: number;
  pin: string; // Admin PIN verification
}
Response: {
  payout: GroupPayout;
  transaction: Transaction;
}
```

#### `GET /api/admin/groups/[groupId]/audit`
Get group audit trail (admin only)
```typescript
Response: {
  auditLogs: AuditLog[];
}
```

### 📱 App-specific Endpoints

#### `POST /api/app/biometric-setup`
Set up biometric authentication
```typescript
Request: {
  enabled: boolean;
  biometricType: 'face_id' | 'fingerprint';
}
```

#### `GET /api/app/invite-link/[inviteCode]`
Get invite details for deep linking
```typescript
Response: {
  group: {
    id: string;
    name: string;
    adminName: string;
    contributionAmount: number;
    frequency: string;
    memberCount: number;
  };
  isValid: boolean;
  expiresAt: string;
}
```

## Webhook Endpoints

### `POST /api/webhooks/clerk`
Handle Clerk user events
```typescript
// User created, updated, deleted
{
  type: 'user.created' | 'user.updated' | 'user.deleted';
  data: ClerkUser;
}
```

### `POST /api/webhooks/stripe`
Handle Stripe payment events
```typescript
// Payment intents, charges, transfers, etc.
{
  type: string;
  data: {
    object: StripeObject;
  };
}
```

## Error Handling

### Standard Error Response
```typescript
{
  error: {
    code: string;
    message: string;
    details?: object;
  };
  timestamp: string;
  requestId: string;
}
```

### Common Error Codes
- `AUTH_REQUIRED`: Authentication required
- `INVALID_PIN`: Invalid PIN provided
- `INSUFFICIENT_FUNDS`: Not enough wallet balance
- `GROUP_FULL`: Group has reached maximum members
- `INVALID_INVITE`: Invite code invalid or expired
- `PAYMENT_FAILED`: Payment processing failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `VALIDATION_ERROR`: Request validation failed

## Security Considerations

1. **PIN Verification**: Required for financial operations
2. **Rate Limiting**: Applied per endpoint and user
3. **Input Validation**: All inputs validated and sanitized
4. **Audit Logging**: Sensitive operations logged
5. **Encryption**: Sensitive data encrypted at rest
6. **HTTPS Only**: All communications over HTTPS
7. **CORS Policy**: Strict CORS configuration
8. **SQL Injection Protection**: Parameterized queries only

## Testing Strategy

1. **Unit Tests**: Individual endpoint logic
2. **Integration Tests**: Database and external service integration
3. **E2E Tests**: Complete user flows
4. **Load Tests**: Performance under load
5. **Security Tests**: Penetration testing for vulnerabilities
