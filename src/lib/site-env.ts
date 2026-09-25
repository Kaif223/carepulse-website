/**
 * Resolution and validation of the deployment-specific settings.
 *
 * Pure functions of an env object, so the same rules run in next.config.ts
 * (to fail a bad production build) and in the app (to render), and can be
 * unit-tested without touching process.env.
 */

type Env = Record<string, string | undefined>;

const DEV_ORIGIN = 'http://localhost:3000';

/** Hostnames that are never a real public origin. */
const PLACEHOLDER_HOSTS = [/(^|\.)example\.(com|org|net)$/i, /(^|\.)carepulse\.example$/i, /your-domain/i];
const LOCAL_HOSTS = [/^localhost$/i, /^127\.\d+\.\d+\.\d+$/, /^0\.0\.0\.0$/, /^\[?::1\]?$/];

function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed.replace(/\/+$/, '') : null;
}

/**
 * The public origin used for canonical URLs, the sitemap, robots and Open
 * Graph. Order: the explicit setting; then, on Vercel preview deployments
 * only, the preview's own URL; then localhost for local development.
 */
export function resolveSiteUrl(env: Env): string {
  const explicit = clean(env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit;
  if (env.VERCEL_ENV === 'preview' && env.VERCEL_URL) return `https://${clean(env.VERCEL_URL)}`;
  return DEV_ORIGIN;
}

/** Vercel previews must never be indexed, whatever URL they are served on. */
export function isIndexable(env: Env): boolean {
  return env.VERCEL_ENV !== 'preview';
}

export function readAppUrl(env: Env): string | null {
  return clean(env.NEXT_PUBLIC_APP_URL);
}

export function readContactEmail(env: Env): string | null {
  return env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null;
}

function problemWithUrl(name: string, value: string, { allowLocal }: { allowLocal: boolean }): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return `${name} is not a valid URL: "${value}"`;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return `${name} must be an http(s) URL: "${value}"`;
  if (PLACEHOLDER_HOSTS.some((pattern) => pattern.test(url.hostname))) {
    return `${name} is still a placeholder: "${value}"`;
  }
  const isLocal = LOCAL_HOSTS.some((pattern) => pattern.test(url.hostname));
  if (isLocal && !allowLocal) return `${name} points at a local address: "${value}"`;
  if (!isLocal && url.protocol !== 'https:') return `${name} must use https in production: "${value}"`;
  return null;
}

/**
 * Everything wrong with the configuration of a production build, as
 * human-readable messages. An empty list means the build may proceed.
 *
 * SITE_URL_ALLOW_LOCAL=1 exists only for building the site to test it locally
 * (the Playwright suite sets it); it must never be set on a real deployment.
 */
export function productionConfigProblems(env: Env): string[] {
  const allowLocal = env.SITE_URL_ALLOW_LOCAL === '1';
  const problems: string[] = [];

  const explicit = clean(env.NEXT_PUBLIC_SITE_URL);
  const isPreview = env.VERCEL_ENV === 'preview' && !!env.VERCEL_URL;
  if (!explicit && !isPreview) {
    problems.push('NEXT_PUBLIC_SITE_URL is not set — canonical URLs, the sitemap and Open Graph need the public origin.');
  } else {
    const problem = problemWithUrl('NEXT_PUBLIC_SITE_URL', resolveSiteUrl(env), { allowLocal });
    if (problem) problems.push(problem);
  }

  const appUrl = readAppUrl(env);
  if (appUrl) {
    const problem = problemWithUrl('NEXT_PUBLIC_APP_URL', appUrl, { allowLocal });
    if (problem) problems.push(problem);
  }

  const email = readContactEmail(env);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    problems.push(`NEXT_PUBLIC_CONTACT_EMAIL is not a valid address: "${email}"`);
  }

  if (!appUrl && !email) {
    problems.push(
      'Neither NEXT_PUBLIC_CONTACT_EMAIL nor NEXT_PUBLIC_APP_URL is set — the page would have no real call to action.',
    );
  }

  return problems;
}
