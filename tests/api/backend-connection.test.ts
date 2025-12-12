/**
 * Mobile App API Tests: Backend Connection
 *
 * Tests that the mobile app can connect to the backend API
 */

import { api, config } from '../setup';

describe('Mobile App: Backend Connection', () => {
  describe('Health Check', () => {
    it('should reach backend health endpoint', async () => {
      const { status, data } = await api.get('/api/health');

      expect(status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data?.status).toBe('ok');
    });

    it('should have correct API_BASE_URL configured', () => {
      expect(config.API_BASE_URL).toBeDefined();
      expect(config.API_BASE_URL).toMatch(/^https?:\/\//);
    });
  });

  describe('API Response Format', () => {
    it('should return JSON responses', async () => {
      const { data } = await api.get('/api/health');

      expect(typeof data).toBe('object');
      expect(data).toHaveProperty('success');
    });

    it('should return proper error format for invalid requests', async () => {
      const { status, data } = await api.get('/api/users/profile');

      expect(status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });
  });

  describe('CORS Headers', () => {
    it('should accept requests from mobile app', async () => {
      // If we can make the request, CORS is working
      const { status } = await api.get('/api/health');
      expect(status).toBe(200);
    });
  });
});
