export interface User {
  id: string
  email: string
  phone?: string
  full_name: string
  profile_image_url?: string
  created_at: string
  last_login?: string
  is_verified: boolean
  status: 'active' | 'suspended' | 'inactive'
}

export interface Wallet {
  id: string
  user_id: string
  balance: number
  pending_balance: number
  created_at: string
  updated_at: string
}

export interface Group {
  id: string
  name: string
  description?: string
  admin_id: string
  contribution_amount: number
  frequency: 'daily' | 'weekly' | 'monthly'
  start_date: string
  end_date?: string
  status: 'pending' | 'active' | 'completed' | 'paused'
  max_members?: number
  current_round?: number
  total_rounds?: number
  created_at: string
  updated_at: string
}

export interface GroupMember {
  id: string
  group_id: string
  user_id: string
  joined_at: string
  position: number
  role: 'admin' | 'member'
  status: 'active' | 'inactive'
  total_contributed: number
  has_received_payout: boolean
}

export interface Transaction {
  id: string
  user_id: string
  group_id?: string
  wallet_id: string
  type: 'deposit' | 'withdrawal' | 'contribution' | 'payout' | 'fee'
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  description?: string
  reference_id?: string
  stripe_payment_intent_id?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'contribution_reminder' | 'payout_available' | 'group_invite' | 'transaction_update' | 'general'
  read: boolean
  data?: Record<string, any>
  created_at: string
}

export interface GroupInvite {
  id: string
  group_id: string
  invited_by: string
  invited_email?: string
  invited_phone?: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  expires_at: string
  created_at: string
}

// Request/Response types
export interface LoginRequest {
  email: string
  pin: string
}

export interface RegisterRequest {
  email: string
  phone?: string
  full_name: string
  pin: string
}

export interface CreateGroupRequest {
  name: string
  description?: string
  contribution_amount: number
  frequency: 'daily' | 'weekly' | 'monthly'
  start_date: string
  max_members?: number
}

export interface JoinGroupRequest {
  group_id: string
  invite_code?: string
}

export interface ContributeRequest {
  group_id: string
  amount: number
  payment_method_id: string
}

export interface FundWalletRequest {
  amount: number
  payment_method_id: string
}

export interface WithdrawRequest {
  amount: number
  bank_account_id: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  has_next: boolean
  has_prev: boolean
}
