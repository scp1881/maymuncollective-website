/**
 * Issues short-lived tokens so the browser can upload an attachment straight
 * to the private Blob store (files can be far larger than the 4.5 MB a
 * function accepts). The contact form has no login, so the token is fenced
 * in instead: one folder per draft id, the accepted media types, the size
 * limit, and 30 minutes. The upload only becomes part of a submission when
 * /api/contact checks it and writes the record.
 */
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { FILE_TYPES, LIMITS } from "@/lib/contact/shared";
import { storageMode } from "@/lib/contact/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_PATH = new RegExp(`^contact/uploads/[a-z0-9]{16}/[^/]{1,${LIMITS.filename}}$`);

export async function POST(request: Request) {
  if (storageMode() !== "blob") return NextResponse.json({ error: "unavailable" }, { status: 503 });
  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!UPLOAD_PATH.test(pathname)) throw new Error("Invalid upload path");
        return {
          allowedContentTypes: FILE_TYPES,
          maximumSizeInBytes: LIMITS.fileBytes,
          addRandomSuffix: true,
          validUntil: Date.now() + 30 * 60 * 1000,
        };
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
