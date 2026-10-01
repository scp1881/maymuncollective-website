/** Streams one attachment to a signed-in inbox reader. */
import { cookies } from "next/headers";
import { safeFilename } from "@/lib/contact/shared";
import { readUpload } from "@/lib/contact/store";
import { INBOX_COOKIE, isSignedIn } from "@/lib/inbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isSignedIn(cookies().get(INBOX_COOKIE)?.value)) return new Response("Not signed in", { status: 401 });
  const url = new URL(request.url);
  const pathname = url.searchParams.get("path") ?? "";
  const file = await readUpload(pathname);
  if (!file) return new Response("Not found", { status: 404 });
  const name = safeFilename(url.searchParams.get("name") ?? pathname.split("/").pop() ?? "attachment");
  return new Response(file.stream, {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.size),
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
