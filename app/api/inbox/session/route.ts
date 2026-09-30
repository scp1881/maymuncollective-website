/**
 * Signs in to (POST with `password`) or out of (POST with `signout`) the
 * inbox, then sends the browser back to /inbox.
 */
import { NextResponse } from "next/server";
import { INBOX_COOKIE_MAX_AGE, passwordMatches, sessionCookie, sessionValue } from "@/lib/inbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const back = (query = "") => NextResponse.redirect(new URL(`/inbox${query}`, request.url), 303);

  if (form?.get("signout")) {
    const res = back();
    res.cookies.set(sessionCookie("", 0));
    return res;
  }
  const input = form?.get("password");
  if (typeof input !== "string" || !passwordMatches(input)) {
    // A pause makes guessing slow without needing any stored state.
    await new Promise((r) => setTimeout(r, 800));
    return back("?error=1");
  }
  const res = back();
  res.cookies.set(sessionCookie(sessionValue(), INBOX_COOKIE_MAX_AGE));
  return res;
}
