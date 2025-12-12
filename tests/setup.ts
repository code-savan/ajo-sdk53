/**
 * Mobile App Test Setup
 * Tests API integration from mobile app perspective
 */

import 'react-native-url-polyfill/auto';

// Load environment variables
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment
beforeAll(() => {
  console.log('\n📱 Starting Mobile App Integration Tests\n');
  console.log('API Base URL:', API_BASE_URL);
  console.log('Supabase URL:', SUPABASE_URL ? '✓ Set' : '✗ Missing');
  console.log('-------------------------------------------\n');
});

afterAll(() => {
  console.log('\n-------------------------------------------');
  console.log('📱 Mobile app tests completed\n');
});

// Export config for tests
export const config = {
  API_BASE_URL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
};

// Test helpers
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  options: { body?: any; token?: string } = {}
): Promise<{ status: number; data: any }> {
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  return { status: response.status, data };
}

export const api = {
  get: (path: string, token?: string) => apiRequest('GET', path, { token }),
  post: (path: string, body?: any, token?: string) => apiRequest('POST', path, { body, token }),
  put: (path: string, body?: any, token?: string) => apiRequest('PUT', path, { body, token }),
  delete: (path: string, token?: string) => apiRequest('DELETE', path, { token }),
};
