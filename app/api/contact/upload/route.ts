/**
 * Presigned uploads: lets the browser put an attachment straight into the
 * private Blob store (files can be far larger than the 4.5 MB a function
 * accepts). Works with the project's OIDC connection, so no long-lived token
 * is involved. The contact form has no login, so each signed URL is fenced
 * in instead: one exact path inside the draft's own folder, the accepted
 * media types, the size limit, 30 minutes, and no overwriting. The upload
 * only becomes part of a submission once /api/contact checks it and writes
 * the record.
 */
import { issueSignedToken } from "@vercel/blob";
import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { FILE_TYPES, LIMITS } from "@/lib/contact/shared";
import { storageMode } from "@/lib/contact/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_PATH = new RegExp(`^contact/uploads/[a-z0-9]{16}/[^/]{1,${LIMITS.filename}}$`);

export async function POST(request: Request) {
  if (storageMode() !== "blob") return NextResponse.json({ error: "unavailable" }, { status: 503 });
  try {
    const body = (await request.json()) as HandleUploadPresignedBody;
    const result = await handleUploadPresigned({
      body,
      request,
      getSignedToken: async (pathname) => {
        if (!UPLOAD_PATH.test(pathname)) throw new Error("Invalid upload path");
        const validUntil = Date.now() + 30 * 60 * 1000;
        const fence = { allowedContentTypes: FILE_TYPES, maximumSizeInBytes: LIMITS.fileBytes, validUntil };
        const token = await issueSignedToken({ pathname, operations: ["put"], ...fence });
        // The path is already unique (a random draft folder per message),
        // so no suffix is added, and an existing file is never overwritten.
        return { token, urlOptions: { ...fence, addRandomSuffix: false, allowOverwrite: false } };
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
