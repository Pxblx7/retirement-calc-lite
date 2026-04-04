/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'

// ─── Content Security Policy ──────────────────────────────────────────────────
// Explicit directives for easy auditing and future expansion.
const ContentSecurityPolicy = [
  "default-src 'self'",

  // Next.js RSC requires 'unsafe-inline' for inline script payloads.
  // 'unsafe-eval' is only added in development for Turbopack hot-module reload.
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",

  // Supabase Auth + DB (HTTPS + WebSocket for realtime)
  // Vercel Speed Insights
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com",

  // Favicon + data: URIs (SVG icons, chart canvas blobs)
  "img-src 'self' data: blob:",

  // Tailwind uses inline <style> blocks at build time
  "style-src 'self' 'unsafe-inline'",

  // Google Fonts (pre-authorized for safety)
  "font-src 'self' https://fonts.gstatic.com",

  // Disallow embedding this app inside any <iframe>
  "frame-ancestors 'none'",

  // Forbid plugins (Flash, Java applets, etc.)
  "object-src 'none'",

  // Prevent <base> tag hijacking
  "base-uri 'self'",
].join('; ')

// ─── Security header set ──────────────────────────────────────────────────────

const securityHeaders = [
  // Clickjacking protection (belt + suspenders alongside frame-ancestors CSP)
  { key: 'X-Frame-Options', value: 'DENY' },

  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Limit referrer information sent to third-party origins
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // Disable browser features the app never uses
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },

  // Primary XSS / injection defence
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
]

// ─── Next.js config ───────────────────────────────────────────────────────────

const nextConfig = {
  images: {
    unoptimized: true,
  },

  // Allow access from local-network devices (phone / tablet on same WiFi)
  allowedDevOrigins: ['192.168.0.*', '192.168.1.*', '10.0.0.*'],

  // M1 — HTTP Security Headers
  // Applied to every route in the application.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
