/**
 * The inbox's lock. Server only.
 *
 * One shared password, INBOX_PASSWORD, set in Vercel → Settings →
 * Environment Variables (and in .env.local for development). Signing in
 * sets an httpOnly cookie holding an HMAC derived from the password, so
 * changing the password signs everyone out.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const INBOX_COOKIE = "mc_inbox";
export const INBOX_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const password = () => process.env.INBOX_PASSWORD || "";

export const inboxConfigured = () => password().length > 0;

const digest = (key: string, value: string) => createHmac("sha256", key).update(value).digest();

function same(a: Buffer, b: Buffer) {
  return a.length === b.length && timingSafeEqual(a, b);
}

export function passwordMatches(input: string): boolean {
  if (!inboxConfigured()) return false;
  return same(digest("compare", input), digest("compare", password()));
}

export function sessionValue(): string {
  return digest(password(), "maymun-inbox-v1").toString("hex");
}

export function isSignedIn(cookie: string | undefined): boolean {
  if (!inboxConfigured() || !cookie) return false;
  return same(Buffer.from(cookie), Buffer.from(sessionValue()));
}

export function sessionCookie(value: string, maxAge: number) {
  return {
    name: INBOX_COOKIE,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}
