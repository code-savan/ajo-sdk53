import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from './supabase'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000'
const BACKEND_JWT_KEY = 'backend_jwt'
const BACKEND_JWT_EXPIRES_AT_KEY = 'backend_jwt_expires_at'

async function getSupabaseAccessToken(): Promise<string | null> {
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session?.access_token) return null
  return data.session.access_token
}

async function exchangeForBackendJWT(): Promise<string | null> {
  const supaToken = await getSupabaseAccessToken()
  if (!supaToken) return null
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/exchange`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${supaToken}` },
    })
    if (!res.ok) return null
    const body = await res.json()
    const token = body?.data?.accessToken || body?.data?.access_token
    const expiresIn = body?.data?.expiresIn || 15 * 60
    if (token) {
      const expiresAt = Date.now() + expiresIn * 1000 - 30_000
      await AsyncStorage.multiSet([[BACKEND_JWT_KEY, token], [BACKEND_JWT_EXPIRES_AT_KEY, String(expiresAt)]])
      return token
    }
    return null
  } catch {
    return null
  }
}

async function getBackendJWT(): Promise<string | null> {
  const [token, expiresAtStr] = await AsyncStorage.multiGet([BACKEND_JWT_KEY, BACKEND_JWT_EXPIRES_AT_KEY]).then(pairs => pairs.map(p => p[1]))
  const expiresAt = expiresAtStr ? Number(expiresAtStr) : 0
  if (token && Date.now() < expiresAt) return token
  return await exchangeForBackendJWT()
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const jwt = await getBackendJWT()
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
  })
  if (!res.ok && res.status !== 304) {
    const txt = await res.text().catch(()=> '')
    throw new Error(txt || `GET ${path} failed: ${res.status}`)
  }
  const body = await res.json().catch(()=> ({}))
  return (body as any)?.data ?? body
}

export async function apiPost<T = any>(path: string, payload?: any): Promise<T> {
  const jwt = await getBackendJWT()
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: payload ? JSON.stringify(payload) : undefined,
  })
  if (!res.ok && res.status !== 304) {
    const txt = await res.text().catch(()=> '')
    throw new Error(txt || `POST ${path} failed: ${res.status}`)
  }
  const body = await res.json().catch(()=> ({}))
  return (body as any)?.data ?? body
}

export async function apiPut<T = any>(path: string, payload?: any): Promise<T> {
  const jwt = await getBackendJWT()
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: payload ? JSON.stringify(payload) : undefined,
  })
  if (!res.ok && res.status !== 304) {
    const txt = await res.text().catch(()=> '')
    throw new Error(txt || `PUT ${path} failed: ${res.status}`)
  }
  const body = await res.json().catch(()=> ({}))
  return (body as any)?.data ?? body
}
