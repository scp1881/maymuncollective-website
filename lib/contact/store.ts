/**
 * Where contact submissions live. Server only.
 *
 * - "blob": a private Vercel Blob store (production). Connect one to the
 *   project in Vercel → Storage; that sets BLOB_STORE_ID, and the SDK then
 *   authenticates with Vercel's short-lived OIDC credentials (an older
 *   BLOB_READ_WRITE_TOKEN works too). Each submission is one JSON record under
 *   contact/submissions/, named by time so listings sort chronologically;
 *   attachments sit under contact/uploads/<draft id>/.
 * - "local": no store configured and not running on Vercel (development).
 *   The same layout is written to .data/ in the project (gitignored).
 * - "off": on Vercel without a store. Submissions are refused rather than
 *   written to a serverless disk that would silently forget them.
 */
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { get, head, list, put } from "@vercel/blob";
import { PATHS, safeFilename, type Attachment, type Submission } from "@/lib/contact/shared";

export type Mode = "blob" | "local" | "off";

export function storageMode(): Mode {
  if (process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (!process.env.VERCEL) return "local";
  return "off";
}

const LOCAL_ROOT = path.join(process.cwd(), ".data");
const local = (pathname: string) => {
  const p = path.join(LOCAL_ROOT, pathname);
  if (!p.startsWith(LOCAL_ROOT + path.sep)) throw new Error("Bad path");
  return p;
};

/** Record ids start with the UTC time, so they sort in the order received. */
export function newId(draft: string, at: Date) {
  return `${at.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z")}-${draft}`;
}

export async function saveSubmission(record: Submission): Promise<void> {
  const pathname = `${PATHS.submissions}${record.id}.json`;
  const body = JSON.stringify(record, null, 2);
  if (storageMode() === "blob") {
    await put(pathname, body, { access: "private", contentType: "application/json", addRandomSuffix: false });
    return;
  }
  const file = local(pathname);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, body, "utf8");
}

/** The newest submissions first. */
export async function listSubmissions(max = 300): Promise<Submission[]> {
  if (storageMode() === "blob") {
    const paths: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: PATHS.submissions, cursor, limit: 1000 });
      paths.push(...page.blobs.map((b) => b.pathname));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    const newest = paths.sort().reverse().slice(0, max);
    const records = await Promise.all(
      newest.map(async (p) => {
        const res = await get(p, { access: "private" });
        if (!res || res.statusCode !== 200) return null;
        return JSON.parse(await new Response(res.stream).text()) as Submission;
      }),
    );
    return records.filter((r): r is Submission => r !== null);
  }
  const dir = local(PATHS.submissions);
  const names = await fs.readdir(dir).catch(() => [] as string[]);
  const newest = names.filter((n) => n.endsWith(".json")).sort().reverse().slice(0, max);
  return Promise.all(newest.map(async (n) => JSON.parse(await fs.readFile(path.join(dir, n), "utf8")) as Submission));
}

/** Size and type of an uploaded blob, or null if it does not exist. */
export async function describeUpload(pathname: string): Promise<{ size: number; contentType: string } | null> {
  try {
    const h = await head(pathname);
    return { size: h.size, contentType: h.contentType };
  } catch {
    return null;
  }
}

/** Development only: stores a file that came in with the form post. */
export async function saveLocalUpload(draft: string, file: File): Promise<Attachment> {
  const filename = safeFilename(file.name);
  const pathname = `${PATHS.uploads}${draft}/${filename}`;
  const target = local(pathname);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, Buffer.from(await file.arrayBuffer()));
  return { pathname, filename, size: file.size, contentType: file.type || "application/octet-stream" };
}

/** An attachment's bytes, for the inbox download route. */
export async function readUpload(pathname: string): Promise<{ stream: ReadableStream; contentType: string; size: number } | null> {
  if (!pathname.startsWith(PATHS.uploads)) return null;
  if (storageMode() === "blob") {
    const res = await get(pathname, { access: "private" });
    if (!res || res.statusCode !== 200) return null;
    return { stream: res.stream, contentType: res.blob.contentType, size: res.blob.size };
  }
  const file = local(pathname);
  const stat = await fs.stat(file).catch(() => null);
  if (!stat) return null;
  return {
    stream: Readable.toWeb(createReadStream(file)) as ReadableStream,
    contentType: "application/octet-stream",
    size: stat.size,
  };
}
