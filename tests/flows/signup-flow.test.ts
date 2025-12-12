/**
 * Mobile App Flow Tests: Signup Flow
 *
 * Tests the complete signup flow as experienced by mobile app user
 */

import { api } from '../setup';
import { createClient } from '@supabase/supabase-js';

describe('Mobile App Flow: Signup', () => {
  const TEST_EMAIL = `test_signup_flow_${Date.now()}@test.ajo.app`;
  const TEST_PASSWORD = `TestPass_${Date.now()}!`;
  const TEST_NAME = 'Test Signup User';

  let userId: string | null = null;
  let backendJWT: string | null = null;

  afterAll(async () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

    if (userId && serviceRoleKey && supabaseUrl) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      await adminClient.from('notifications').delete().eq('user_id', userId);
      await adminClient.from('wallets').delete().eq('user_id', userId);
      await adminClient.from('users').delete().eq('id', userId);
      await adminClient.auth.admin.deleteUser(userId);
    }
  });

  describe('Step 1: User Registration', () => {
    it('should create account via Supabase', async () => {
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !serviceRoleKey) {
        console.warn('Skipping - credentials not configured');
        return;
      }

      const adminClient = createClient(supabaseUrl, serviceRoleKey);

      const { data, error } = await adminClient.auth.admin.createUser({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: TEST_NAME },
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user?.email).toBe(TEST_EMAIL);

      userId = data.user?.id || null;
    });
  });

  describe('Step 2: Sign In', () => {
    it('should sign in and get Supabase token', async () => {
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey || !userId) {
        console.warn('Skipping - not configured or no user');
        return;
      }

      const client = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await client.auth.signInWithPassword({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

      expect(error).toBeNull();
      expect(data.session?.access_token).toBeDefined();
    });
  });

  describe('Step 3: Token Exchange', () => {
    it('should exchange Supabase token for backend JWT', async () => {
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey || !userId) {
        console.warn('Skipping - not configured or no user');
        return;
      }

      const client = createClient(supabaseUrl, supabaseKey);
      const { data: signInData } = await client.auth.signInWithPassword({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

      const { status, data } = await api.post(
        '/api/auth/exchange',
        undefined,
        signInData.session!.access_token
      );

      expect(status).toBe(200);
      expect(data.data?.accessToken).toBeDefined();

      backendJWT = data.data?.accessToken;
    });
  });

  describe('Step 4: Profile Setup', () => {
    it('should get/create profile with Stripe customer', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status, data } = await api.get('/api/users/profile', backendJWT);

      expect(status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data?.id).toBe(userId);
      expect(data.data?.stripe_customer_id).toBeDefined();
    });

    it('should update profile with full name', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status, data } = await api.put(
        '/api/users/profile',
        { full_name: TEST_NAME },
        backendJWT
      );

      expect(status).toBe(200);
      expect(data.data?.full_name).toBe(TEST_NAME);
    });
  });

  describe('Step 5: Wallet Creation', () => {
    it('should have wallet created', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status, data } = await api.get('/api/wallet', backendJWT);

      expect(status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should have zero balance initially', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status, data } = await api.get('/api/wallet/balance', backendJWT);

      expect(status).toBe(200);
      expect(data.data?.balance_cents).toBe(0);
    });
  });

  describe('Step 6: Access All Features', () => {
    it('should access groups endpoint', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status } = await api.get('/api/groups', backendJWT);
      expect(status).toBe(200);
    });

    it('should access notifications endpoint', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status } = await api.get('/api/notifications', backendJWT);
      expect(status).toBe(200);
    });

    it('should access transactions endpoint', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status } = await api.get('/api/wallet/transactions', backendJWT);
      expect(status).toBe(200);
    });
  });
});
