export const allowedRouteBasesByRole = {
  'super admin': ['/', '/analytics', '/financial', '/groups', '/help', '/notifications', '/notifications-me', '/profile', '/security', '/settings', '/users', '/admin'],
  'admin': ['/', '/analytics', '/financial', '/groups', '/help', '/notifications', '/notifications-me', '/profile', '/security', '/settings', '/users'], // no /admin
  'customer support': ['/help', '/users', '/groups', '/profile'],
  'analyst': ['/users', '/groups', '/financial', '/analytics', '/profile'],
  'Compliance officer': ['/financial', '/profile'],
};

export function isPathAllowed(role, pathname) {
  if (!pathname) return true;
  if (!role) return true; // defer until role is known
  const bases = allowedRouteBasesByRole[role] || ['/'];
  return bases.some(base => (base === '/' ? pathname === '/' : pathname.startsWith(base)));
}

export function getFirstAllowedPath(role) {
  const bases = allowedRouteBasesByRole[role] || ['/'];
  return bases[0] || '/';
}
