/**
 * The contact stream's rules, shared by the browser (to show errors before a
 * round trip) and the server (which never trusts the browser). Keep every
 * limit here so the two cannot drift apart.
 */
import { contact } from "@/content/site";

export const CATEGORIES = contact.form.category.options;
export type Category = (typeof CATEGORIES)[number];

export const LIMITS = {
  name: 100,
  email: 254,
  message: 5000,
  filename: 200,
  fileBytes: 50 * 1024 * 1024,
} as const;

/** Media types accepted as attachments (auditions, demos, proposals). */
export const FILE_TYPES = [
  "audio/*",
  "video/*",
  "image/*",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-zip-compressed",
];
/** The same list for the file picker, plus extensions browsers may not type. */
export const FILE_ACCEPT = [...FILE_TYPES, ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".zip"].join(",");

export const fileTypeAllowed = (type: string) =>
  FILE_TYPES.some((t) => (t.endsWith("/*") ? type.startsWith(t.slice(0, -1)) : type === t));

/** Folder prefixes in the store. Records sort by time because of their names. */
export const PATHS = {
  submissions: "contact/submissions/",
  uploads: "contact/uploads/",
};

/** Draft ids are made in the browser before an upload, so they are checked. */
export const DRAFT_ID = /^[a-z0-9]{16}$/;

export type Attachment = { pathname: string; filename: string; size: number; contentType: string };

export type Submission = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  category: Category;
  message: string;
  attachment: Attachment | null;
};

export type Fields = { name: string; email: string; category: string; message: string };
export type FieldErrors = Partial<Record<keyof Fields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const { errors } = contact.form;

/** Errors for the fields of one step (0, 1 or 2), or of all three. */
export function validate(f: Fields, step: 0 | 1 | 2 | "all" = "all"): FieldErrors {
  const e: FieldErrors = {};
  const name = f.name.trim(), email = f.email.trim(), message = f.message.trim();
  if (step === 0 || step === "all") {
    if (!name || name.length > LIMITS.name) e.name = errors.name;
    if (!EMAIL.test(email) || email.length > LIMITS.email) e.email = errors.email;
  }
  if ((step === 1 || step === "all") && !CATEGORIES.includes(f.category as Category)) e.category = errors.category;
  if ((step === 2 || step === "all") && (!message || message.length > LIMITS.message)) e.message = errors.message;
  return e;
}

export function fileError(file: { type: string; size: number }): string | null {
  if (!fileTypeAllowed(file.type)) return errors.fileType;
  if (file.size > LIMITS.fileBytes) return errors.fileSize;
  return null;
}

/** A file name that is safe as the last segment of a storage path. */
export function safeFilename(name: string): string {
  const base = name.normalize("NFKD").replace(/[^\w.\- ]+/g, "").replace(/\s+/g, "-").replace(/^[.-]+/, "");
  return (base || "attachment").slice(-LIMITS.filename);
}
