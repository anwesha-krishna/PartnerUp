/**
 * Client-Side Security Utilities for ProjectMatch
 * Enforces sanitization against XSS, script injection, and unsafe URL protocols.
 */

/**
 * Sanitizes plain text by removing HTML markup, script tags, and event handlers.
 * @param {string} str - User input string
 * @returns {string} Sanitized string
 */
export function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<\s*(script|style|iframe|object|embed|applet)[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|iframe|object|embed|applet)[\s\S]*?>/gi, '')
    .replace(/(javascript|vbscript|data\s*:\s*text\/html)\s*:/gi, '')
    .replace(/\s*on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Validates and sanitizes external URLs (GitHub, LinkedIn, Portfolios).
 * Only http: and https: protocols are permitted. Neutralizes javascript: or data: XSS payloads.
 * 
 * @param {string} url - Target URL string
 * @param {string} [fallback='#'] - Fallback URL if invalid
 * @returns {string} Valid URL or fallback
 */
export function sanitizeUrl(url, fallback = '#') {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return fallback;
  } catch {
    // If relative path without protocol, ensure it doesn't start with javascript: or data:
    if (/^(javascript|data|vbscript):/i.test(trimmed)) {
      return fallback;
    }
    // If it's a domain without protocol like "github.com/user"
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return fallback;
  }
}

/**
 * Validates email address format
 * @param {string} email - Email address
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email) && email.length <= 120;
}

/**
 * Sanitizes an array of string items (e.g. skills, tags, languages).
 * @param {Array<string>} arr - Input array
 * @returns {Array<string>} Sanitized unique non-empty string array
 */
export function sanitizeArray(arr) {
  if (!Array.isArray(arr)) return [];
  const sanitized = arr
    .map((item) => sanitizeText(typeof item === 'string' ? item : String(item)))
    .filter(Boolean);
  return Array.from(new Set(sanitized));
}
