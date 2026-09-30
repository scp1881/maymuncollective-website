/** Every submission as a CSV file, for a signed-in inbox reader. */
import { cookies } from "next/headers";
import { listSubmissions } from "@/lib/contact/store";
import { INBOX_COOKIE, isSignedIn } from "@/lib/inbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Quote every cell, and defuse cells a spreadsheet would run as a formula.
const cell = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;

export async function GET() {
  if (!isSignedIn(cookies().get(INBOX_COOKIE)?.value)) return new Response("Not signed in", { status: 401 });
  const rows = await listSubmissions(10000);
  const header = ["Received (UTC)", "Name", "Email", "Reason", "Message", "Attachment"];
  const lines = [header, ...rows.map((s) => [s.createdAt, s.name, s.email, s.category, s.message, s.attachment?.filename ?? ""])];
  const csv = "﻿" + lines.map((r) => r.map(cell).join(",")).join("\r\n");
  const day = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="maymun-contact-${day}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
