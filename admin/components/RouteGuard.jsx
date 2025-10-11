'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { isPathAllowed, getFirstAllowedPath } from '../lib/accessControl';

export default function RouteGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // role resolution: prefer cached profile role when available in session/local storage
  const role = useMemo(() => {
    try {
      if (typeof window !== 'undefined' && user?.id) {
        const cacheKey = `admin_profile_${user.id}`;
        const raw = window.sessionStorage.getItem(cacheKey) || window.localStorage.getItem(cacheKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.role) return parsed.role;
        }
      }
    } catch (_) {}
    return user?.role;
  }, [user?.id, user?.role]);

  // Allow auth and onboarding pages unconditionally
  const isPublic = pathname?.startsWith('/auth') || pathname === '/onboarding';

  useEffect(() => {
    if (!pathname) return;
    if (isLoading) return; // wait until auth known
    if (isPublic) return; // never guard public pages

    if (!isPathAllowed(role, pathname)) {
      const redirectTo = getFirstAllowedPath(role);
      if (redirectTo !== pathname) {
        router.replace(redirectTo);
      }
    }
  }, [pathname, role, isLoading, isPublic, router]);

  return children;
}
