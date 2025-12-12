/**
 * Mobile App Auth Tests: Token Exchange
 *
 * Tests the token exchange flow from Supabase to Backend JWT
 */

import { api } from '../setup';
import { createClient } from '@supabase/supabase-js';

describe('Mobile App: Token Exchange', () => {
  const TEST_EMAIL = `test_token_${Date.now()}@test.ajo.app`;
  const TEST_PASSWORD = `TestPass_${Date.now()}!`;

  let supabaseAccessToken: string | null = null;
  let userId: string | null = null;

  beforeAll(async () => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey || !serviceRoleKey) {
      console.warn('Skipping token tests - credentials not configured');
      return;
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: userData } = await adminClient.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
    });

    userId = userData.user?.id || null;

    const client = createClient(supabaseUrl, supabaseKey);
    const { data: signInData } = await client.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    supabaseAccessToken = signInData.session?.access_token || null;
  });

  afterAll(async () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

    if (userId && serviceRoleKey && supabaseUrl) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      await adminClient.from('users').delete().eq('id', userId);
      await adminClient.auth.admin.deleteUser(userId);
    }
  });

  describe('Exchange Endpoint', () => {
    it('should exchange Supabase token for backend JWT', async () => {
      if (!supabaseAccessToken) {
        console.warn('Skipping - no Supabase token');
        return;
      }

      const { status, data } = await api.post(
        '/api/auth/exchange',
        undefined,
        supabaseAccessToken
      );

      expect(status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data?.accessToken).toBeDefined();
      expect(data.data?.refreshToken).toBeDefined();
      expect(data.data?.expiresIn).toBeDefined();
    });

    it('should reject invalid Supabase token', async () => {
      const { status, data } = await api.post(
        '/api/auth/exchange',
        undefined,
        'invalid_token_here'
      );

      expect(status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('should reject request without token', async () => {
      const { status, data } = await api.post('/api/auth/exchange');

      expect(status).toBe(401);
      expect(data.success).toBe(false);
    });
  });

  describe('JWT Validity', () => {
    it('should return JWT that works with protected endpoints', async () => {
      if (!supabaseAccessToken) {
        console.warn('Skipping - no Supabase token');
        return;
      }

      // Get backend JWT
      const { data: exchangeData } = await api.post(
        '/api/auth/exchange',
        undefined,
        supabaseAccessToken
      );

      const backendJWT = exchangeData.data?.accessToken;
      expect(backendJWT).toBeDefined();

      // Use it on protected endpoint
      const { status, data } = await api.get('/api/users/profile', backendJWT);

      expect(status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should return tokens with correct expiration', async () => {
      if (!supabaseAccessToken) {
        console.warn('Skipping - no Supabase token');
        return;
      }

      const { data } = await api.post(
        '/api/auth/exchange',
        undefined,
        supabaseAccessToken
      );

      expect(data.data?.expiresIn).toBe(15 * 60); // 15 minutes
    });
  });
});
