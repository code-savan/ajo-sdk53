/**
 * Mobile App API Tests: Groups Endpoints
 *
 * Tests group API endpoints from mobile app perspective
 */

import { api } from '../setup';
import { createClient } from '@supabase/supabase-js';

describe('Mobile App: Groups API', () => {
  const TEST_EMAIL = `test_mobile_grp_${Date.now()}@test.ajo.app`;
  const TEST_PASSWORD = `TestPass_${Date.now()}!`;

  let backendJWT: string | null = null;
  let userId: string | null = null;
  let createdGroupId: string | null = null;

  beforeAll(async () => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey || !serviceRoleKey) {
      console.warn('Skipping groups tests - credentials not configured');
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

    if (signInData.session?.access_token) {
      const { data } = await api.post('/api/auth/exchange', undefined, signInData.session.access_token);
      backendJWT = data.data?.accessToken || null;
    }
  });

  afterAll(async () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && serviceRoleKey) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey);

      if (createdGroupId) {
        await adminClient.from('group_members').delete().eq('group_id', createdGroupId);
        await adminClient.from('groups').delete().eq('id', createdGroupId);
      }

      if (userId) {
        await adminClient.from('users').delete().eq('id', userId);
        await adminClient.auth.admin.deleteUser(userId);
      }
    }
  });

  describe('Get User Groups', () => {
    it('should require authentication', async () => {
      const { status } = await api.get('/api/groups');
      expect(status).toBe(401);
    });

    it('should return groups list for authenticated user', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status, data } = await api.get('/api/groups', backendJWT);

      expect(status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe('Create Group', () => {
    it('should create a new group', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status, data } = await api.post(
        '/api/groups',
        {
          name: 'Mobile App Test Group',
          description: 'Created from mobile app test',
          size: 5,
          contribution_amount_cents: 5000,
          goal_amount_cents: 25000,
          frequency: 'monthly',
        },
        backendJWT
      );

      expect(status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data?.group?.id).toBeDefined();

      createdGroupId = data.data?.group?.id;
    });

    it('should reject invalid group data', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status, data } = await api.post(
        '/api/groups',
        { name: 'Incomplete' }, // Missing required fields
        backendJWT
      );

      expect(status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('Get Group Details', () => {
    it('should get group details', async () => {
      if (!backendJWT || !createdGroupId) {
        console.warn('Skipping - no JWT or group');
        return;
      }

      const { status, data } = await api.get(`/api/groups/${createdGroupId}`, backendJWT);

      expect(status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data?.name).toBe('Mobile App Test Group');
    });

    it('should return 404 for non-existent group', async () => {
      if (!backendJWT) {
        console.warn('Skipping - no JWT');
        return;
      }

      const { status } = await api.get(
        '/api/groups/00000000-0000-0000-0000-000000000000',
        backendJWT
      );

      expect(status).toBe(404);
    });
  });

  describe('Group Members', () => {
    it('should get group members', async () => {
      if (!backendJWT || !createdGroupId) {
        console.warn('Skipping - no JWT or group');
        return;
      }

      const { status, data } = await api.get(
        `/api/groups/${createdGroupId}/members`,
        backendJWT
      );

      expect(status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });
  });

  describe('Group Balance', () => {
    it('should get group balance', async () => {
      if (!backendJWT || !createdGroupId) {
        console.warn('Skipping - no JWT or group');
        return;
      }

      const { status, data } = await api.get(
        `/api/groups/${createdGroupId}/balance`,
        backendJWT
      );

      expect(status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data?.balance_cents !== undefined).toBe(true);
    });
  });
});
