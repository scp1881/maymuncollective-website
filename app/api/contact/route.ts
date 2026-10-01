/**
 * The contact stream's endpoint.
 *
 * GET  → { mode } so the form knows whether files go straight to the Blob
 *        store ("blob") or ride along with the post ("local", development).
 * POST → multipart form: name, email, category, message, draft (the id the
 *        browser chose), elapsed (ms since the form appeared), website (a
 *        honeypot that people never see), and either `attachment` (JSON
 *        describing a file already uploaded to the store) or `file`.
 */
import { NextResponse } from "next/server";
import { DRAFT_ID, LIMITS, PATHS, fileError, fileTypeAllowed, safeFilename, validate, type Attachment } from "@/lib/contact/shared";
import { describeUpload, newId, saveLocalUpload, saveSubmission, storageMode } from "@/lib/contact/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  return json({ mode: storageMode() });
}

export async function POST(request: Request) {
  const mode = storageMode();
  if (mode === "off") return json({ error: "unavailable" }, 503);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "bad-request" }, 400);
  }
  const str = (key: string) => {
    const v = form.get(key);
    return typeof v === "string" ? v : "";
  };

  // Bots fill in the hidden field or submit three steps in under two
  // seconds; answer them as if all went well and store nothing.
  if (str("website") || !(Number(str("elapsed")) >= 2000)) return json({ ok: true });

  const fields = { name: str("name"), email: str("email"), category: str("category"), message: str("message") };
  const errors = validate(fields);
  if (Object.keys(errors).length) return json({ error: "invalid", errors }, 400);

  const draft = str("draft");
  if (!DRAFT_ID.test(draft)) return json({ error: "bad-request" }, 400);

  let attachment: Attachment | null = null;
  if (mode === "blob") {
    const raw = str("attachment");
    if (raw) {
      let ref: { pathname?: unknown; filename?: unknown };
      try {
        ref = JSON.parse(raw);
      } catch {
        return json({ error: "bad-request" }, 400);
      }
      const pathname = typeof ref.pathname === "string" ? ref.pathname : "";
      if (!pathname.startsWith(`${PATHS.uploads}${draft}/`)) return json({ error: "bad-request" }, 400);
      const found = await describeUpload(pathname);
      if (!found || found.size > LIMITS.fileBytes || !fileTypeAllowed(found.contentType)) return json({ error: "bad-file" }, 400);
      attachment = {
        pathname,
        filename: safeFilename(typeof ref.filename === "string" ? ref.filename : pathname.split("/").pop() ?? ""),
        size: found.size,
        contentType: found.contentType,
      };
    }
  } else {
    const file = form.get("file");
    if (file instanceof File && file.size > 0) {
      if (fileError(file)) return json({ error: "bad-file" }, 400);
      attachment = await saveLocalUpload(draft, file);
    }
  }

  const now = new Date();
  try {
    await saveSubmission({
      id: newId(draft, now),
      createdAt: now.toISOString(),
      name: fields.name.trim(),
      email: fields.email.trim(),
      category: fields.category,
      message: fields.message.trim(),
      attachment,
    });
  } catch (err) {
    console.error("contact: could not save submission", err);
    return json({ error: "storage" }, 500);
  }
  return json({ ok: true });
}
