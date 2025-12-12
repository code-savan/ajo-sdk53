/**
 * Mobile App API Tests: Wallet Endpoints
 *
 * Tests wallet API endpoints from mobile app perspective
 */

import { api } from '../setup';
import { createClient } from '@supabase/supabase-js';

describe('Mobile App: Wallet API', () => {
  const TEST_EMAIL = `test_mobile_${Date.now()}@test.ajo.app`;
  const TEST_PASSWORD = `TestPass_${Date.now()}!`;

  let supabaseAccessToken: string | null = null;
  let backendJWT: string | null = null;
  let userId: string | null = null;

  // Setup: Create test user and get tokens
  beforeAll(async () => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Skipping wallet tests - Supabase not configured');
      return;
    }

    // Create user with admin client
    if (serviceRoleKey) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey);

      const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        email_confirm: true,
      });

      if (createError) {
        console.warn('Failed to create test user:', createError);
        return;
      }

      userId = userData.user?.id || null;

      // Sign in to get access token
      const client = createClient(supabaseUrl, supabaseKey);
      const { data: signInData } = await client.auth.signInWithPassword({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

      supabaseAccessToken = signInData.session?.access_token || null;

      // Exchange for backend JWT
      if (supabaseAccessToken) {
        const { data } = await api.post('/api/auth/exchange', undefined, supabaseAccessToken);
        backendJWT = data.data?.accessToken || null;
      }
    }
  });

  // Cleanup
  afterAll(async () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

    if (userId && serviceRoleKey && supabaseUrl) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      await adminClient.from('users').delete().eq('id', userId);
      await adminClient.auth.admin.deleteUser(userId);
    }
  });

  describe('Get Wallet', () => {
    it('should require authentication', async () => {
      const { status, data } = await api.get('/api/wallet');

      expect(status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('should return wallet for authenticated user', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status, data } = await api.get('/api/wallet', backendJWT);

      expect(status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('Get Wallet Balance', () => {
    it('should return balance for authenticated user', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status, data } = await api.get('/api/wallet/balance', backendJWT);

      expect(status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data?.balance_cents !== undefined).toBe(true);
    });
  });

  describe('Get Transactions', () => {
    it('should return transaction list', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status, data } = await api.get('/api/wallet/transactions', backendJWT);

      expect(status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe('Funding Intent', () => {
    it('should create funding intent', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status, data } = await api.post(
        '/api/wallet/funding-intent',
        { amount_cents: 10000 },
        backendJWT
      );

      expect(status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data?.payment_intent_id).toBeDefined();
    });

    it('should reject invalid amount', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status, data } = await api.post(
        '/api/wallet/funding-intent',
        { amount_cents: -100 },
        backendJWT
      );

      expect(status).toBe(400);
      expect(data.success).toBe(false);
    });
  });
});
