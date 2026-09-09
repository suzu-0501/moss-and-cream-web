const GITHUB_PAGES_BASE = '/moss-and-cream-web-test';

export function withBasePath(path: string) {
  if (!path.startsWith('/') || typeof window === 'undefined') return path;
  if (!window.location.hostname.endsWith('.github.io')) return path;
  if (path === GITHUB_PAGES_BASE || path.startsWith(`${GITHUB_PAGES_BASE}/`)) return path;
  return `${GITHUB_PAGES_BASE}${path}`;
}
