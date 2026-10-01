"use client";

import { useCallback, useEffect, useId, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { ArrowRight } from "@/components/k/bits";
import { contact } from "@/content/site";
import { CATEGORIES, FILE_ACCEPT, LIMITS, PATHS, fileError, safeFilename, validate, type FieldErrors, type Fields } from "@/lib/contact/shared";

/**
 * The contact stream: the reference's pill, pagination and "Next step"
 * button, now a three-step form — name and email, then the reason (a
 * dropdown), then the message with an optional file. Each step is checked
 * before moving on; the whole thing is checked again on the server.
 *
 * Files go straight from the browser to the private Blob store (so auditions
 * can be larger than a function accepts) and are only attached to a
 * submission once /api/contact has verified them. In development, without a
 * store, the file rides along with the post instead.
 *
 * The steps not showing are disabled fieldsets (out of the tab order); the
 * current step is announced politely, errors assertively, and focus moves to
 * the first field of each new step.
 */
const f = contact.form;
const TOTAL = 3;
const EMPTY: Fields = { name: "", email: "", category: "", message: "" };

type Phase = "edit" | "uploading" | "sending" | "done";

function draftId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => (b % 36).toString(36)).join("");
}

const fmtSize = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

export default function ContactStream() {
  const uid = useId();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [fileErr, setFileErr] = useState<string | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("edit");
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [thanksName, setThanksName] = useState("");
  const [hp, setHp] = useState("");

  const draft = useRef("");
  const touched = useRef<number | null>(null);
  const moved = useRef(false);
  const streamRef = useRef<HTMLFormElement | null>(null);
  const stepRefs = useRef<(HTMLFieldSetElement | null)[]>([]);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const doneRef = useRef<HTMLDivElement | null>(null);
  const [listTop, setListTop] = useState(0);

  useEffect(() => {
    draft.current = draftId();
  }, []);

  const busy = phase === "uploading" || phase === "sending";
  const id = (s: string) => `${uid}-${s}`;
  const set = (k: keyof Fields) => (v: string) => {
    if (touched.current === null) touched.current = Date.now();
    setFields((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
    setFormErr(null);
  };

  // Focus the first field of a step the user has moved to (never on load:
  // that would scroll the page to the form).
  useEffect(() => {
    if (!moved.current) return;
    const first = stepRefs.current[step]?.querySelector<HTMLElement>("input, textarea, button");
    const t = window.setTimeout(() => first?.focus({ preventScroll: true }), 60);
    return () => window.clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (phase === "done") doneRef.current?.focus({ preventScroll: true });
  }, [phase]);

  /* ── the reason dropdown ─────────────────────────────────────────────── */
  const place = useCallback(() => {
    const form = streamRef.current, btn = triggerRef.current;
    if (!form || !btn) return;
    setListTop(btn.getBoundingClientRect().bottom - form.getBoundingClientRect().top + 10);
  }, []);

  const openList = () => {
    const i = CATEGORIES.indexOf(fields.category);
    setActive(i < 0 ? 0 : i);
    place();
    setOpen(true);
    requestAnimationFrame(() => listRef.current?.focus({ preventScroll: true }));
  };
  const closeList = (refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus({ preventScroll: true });
  };
  const choose = (i: number) => {
    set("category")(CATEGORIES[i]);
    closeList();
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!listRef.current?.contains(t) && !triggerRef.current?.contains(t)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  const onListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const last = CATEGORIES.length - 1;
    if (e.key === "ArrowDown") setActive((a) => Math.min(last, a + 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(last);
    else if (e.key === "Enter" || e.key === " ") choose(active);
    else if (e.key === "Escape") closeList();
    else if (e.key === "Tab") setOpen(false);
    else return;
    if (e.key !== "Tab") e.preventDefault();
  };
  const onTriggerKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openList();
    }
  };

  /* ── the file ─────────────────────────────────────────────────────────── */
  const takeFile = (next: File | null) => {
    setFormErr(null);
    if (!next) {
      setFile(null);
      setFileErr(null);
      return;
    }
    const err = fileError(next);
    setFileErr(err);
    setFile(err ? null : next);
  };
  const onDrag = (e: DragEvent) => {
    if (step !== 2 || busy || !e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    setDragging(e.type === "dragover" || e.type === "dragenter");
  };
  const onDrop = (e: DragEvent) => {
    if (step !== 2 || busy) return;
    e.preventDefault();
    setDragging(false);
    takeFile(e.dataTransfer.files?.[0] ?? null);
  };

  /* ── moving through the steps, and sending ─────────────────────────────── */
  const goTo = (s: 0 | 1 | 2) => {
    moved.current = true;
    setOpen(false);
    setStep(s);
  };

  const focusInvalid = (errs: FieldErrors) => {
    const order: (keyof Fields)[] = ["name", "email", "category", "message"];
    const k = order.find((key) => errs[key]);
    if (!k) return;
    const el = k === "category" ? triggerRef.current : document.getElementById(id(k));
    el?.focus({ preventScroll: true });
  };

  const send = async () => {
    setFormErr(null);
    const body = new FormData();
    (Object.keys(fields) as (keyof Fields)[]).forEach((k) => body.append(k, fields[k]));
    body.append("draft", draft.current);
    body.append("elapsed", String(Date.now() - (touched.current ?? Date.now())));
    body.append("website", hp);
    try {
      const { mode } = (await fetch("/api/contact", { cache: "no-store" }).then((r) => r.json())) as { mode: string };
      if (mode === "off") throw new Error("unavailable");
      if (file) {
        if (mode === "blob") {
          setPhase("uploading");
          setProgress(0);
          // Loaded only when someone actually attaches a file, so the upload
          // client stays out of every visitor's first load.
          const { uploadPresigned } = await import("@vercel/blob/client");
          const blob = await uploadPresigned(`${PATHS.uploads}${draft.current}/${safeFilename(file.name)}`, file, {
            access: "private",
            handleUploadUrl: "/api/contact/upload",
            multipart: file.size > 16 * 1024 * 1024,
            onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
          });
          body.append("attachment", JSON.stringify({ pathname: blob.pathname, filename: file.name }));
        } else {
          body.append("file", file);
        }
      }
      setPhase("sending");
      const res = await fetch("/api/contact", { method: "POST", body });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setThanksName(fields.name.trim().split(/\s+/)[0]);
      setPhase("done");
    } catch {
      setPhase("edit");
      setFormErr(f.errors.generic);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || phase === "done") return;
    if (step < 2) {
      const errs = validate(fields, step);
      setErrors(errs);
      if (Object.keys(errs).length) return focusInvalid(errs);
      goTo((step + 1) as 1 | 2);
      return;
    }
    const errs = validate(fields, "all");
    setErrors(errs);
    if (errs.name || errs.email) return goTo(0);
    if (errs.category) return goTo(1);
    if (Object.keys(errs).length) return focusInvalid(errs);
    if (fileErr) return;
    void send();
  };

  const again = () => {
    draft.current = draftId();
    touched.current = Date.now();
    setFields((p) => ({ ...EMPTY, name: p.name, email: p.email }));
    setFile(null);
    setFileErr(null);
    setErrors({});
    setPhase("edit");
    goTo(1);
  };

  const stepError = step === 0 ? errors.name || errors.email : step === 1 ? errors.category : errors.message || fileErr;
  const shownError = formErr || stepError || "";
  const done = phase === "done";
  const nextLabel = phase === "uploading" ? f.uploading(progress) : phase === "sending" ? f.sending : step < 2 ? f.next : f.send;
  const invalid = (k: keyof Fields) => (errors[k] ? { "aria-invalid": true, "aria-describedby": id("error") } : {});

  return (
    <form ref={streamRef} className="stream" data-step={done ? "done" : step} noValidate onSubmit={onSubmit} aria-labelledby="contact-heading">
      <div
        className={`pill rv ${dragging ? "is-drag" : ""}`}
        style={{ ["--rv-y" as string]: "20%", ["--rv-delay" as string]: "0.4s" }}
        onDragEnter={onDrag}
        onDragOver={onDrag}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {/* 1 · name and email */}
        <fieldset ref={(el) => { stepRefs.current[0] = el; }} className={`step s-details ${step === 0 && !done ? "is-on" : ""}`} disabled={step !== 0 || done || busy}>
          <legend className="sr-only">{f.stepOf(1, TOTAL, f.steps[0])}</legend>
          <div className="field">
            <label htmlFor={id("name")}>{f.name.label}</label>
            <input
              id={id("name")}
              name="name"
              autoComplete="name"
              maxLength={LIMITS.name}
              placeholder={f.name.placeholder}
              value={fields.name}
              onChange={(e) => set("name")(e.target.value)}
              {...invalid("name")}
            />
          </div>
          <span className="divider" aria-hidden="true" />
          <div className="field">
            <label htmlFor={id("email")}>{f.email.label}</label>
            <input
              id={id("email")}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              placeholder={f.email.placeholder}
              value={fields.email}
              onChange={(e) => set("email")(e.target.value)}
              {...invalid("email")}
            />
          </div>
        </fieldset>

        {/* 2 · the reason */}
        <fieldset ref={(el) => { stepRefs.current[1] = el; }} className={`step s-reason ${step === 1 && !done ? "is-on" : ""}`} disabled={step !== 1 || done || busy}>
          <legend className="sr-only">{f.stepOf(2, TOTAL, f.steps[1])}</legend>
          <div className="field">
            <span className="label" id={id("category-label")}>
              {f.category.label}
            </span>
            <button
              ref={triggerRef}
              type="button"
              className={`select ${fields.category ? "" : "is-empty"}`}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={id("list")}
              aria-labelledby={`${id("category-label")} ${id("category-value")}`}
              onClick={() => (open ? closeList() : openList())}
              onKeyDown={onTriggerKey}
              {...(errors.category ? { "aria-invalid": true, "aria-describedby": id("error") } : {})}
            >
              <span id={id("category-value")}>{fields.category || f.category.placeholder}</span>
              <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                <path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </div>
        </fieldset>

        {/* 3 · the message and an optional file */}
        <fieldset ref={(el) => { stepRefs.current[2] = el; }} className={`step s-message ${step === 2 && !done ? "is-on" : ""}`} disabled={step !== 2 || done || busy}>
          <legend className="sr-only">{f.stepOf(3, TOTAL, f.steps[2])}</legend>
          <label htmlFor={id("message")}>{f.message.label}</label>
          <textarea
            id={id("message")}
            name="message"
            maxLength={LIMITS.message}
            placeholder={f.message.placeholder}
            value={fields.message}
            onChange={(e) => set("message")(e.target.value)}
            {...invalid("message")}
          />
          <div className="attach">
            <input
              ref={fileRef}
              id={id("file")}
              className="sr-only"
              type="file"
              accept={FILE_ACCEPT}
              aria-describedby={id("file-hint")}
              onChange={(e) => {
                takeFile(e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />
            {file ? (
              <span className="chip">
                <PaperClip />
                <span className="name">{file.name}</span>
                <span className="size">{fmtSize(file.size)}</span>
                <button type="button" aria-label={`${f.file.remove}: ${file.name}`} onClick={() => takeFile(null)}>
                  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </button>
              </span>
            ) : (
              <label htmlFor={id("file")} className="add">
                <PaperClip />
                {f.file.add}
              </label>
            )}
            <span className="hint" id={id("file-hint")}>
              {f.file.hint}
            </span>
          </div>
          <span className="drop" aria-hidden="true">
            {f.file.drop}
          </span>
        </fieldset>

        {/* sent */}
        <div ref={doneRef} className={`step s-done ${done ? "is-on" : ""}`} tabIndex={-1} aria-hidden={!done}>
          <p>{f.success(thanksName)}</p>
        </div>
      </div>

      {open ? (
        <ul
          ref={listRef}
          id={id("list")}
          className="listbox"
          role="listbox"
          tabIndex={-1}
          aria-labelledby={id("category-label")}
          aria-activedescendant={id(`opt-${active}`)}
          style={{ top: listTop }}
          onKeyDown={onListKey}
        >
          {CATEGORIES.map((c, i) => (
            <li
              key={c}
              id={id(`opt-${i}`)}
              role="option"
              aria-selected={fields.category === c}
              className={i === active ? "is-active" : ""}
              onPointerMove={() => i !== active && setActive(i)}
              onClick={() => choose(i)}
            >
              {c}
              {fields.category === c ? (
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M3 8.5l3.2 3L13 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {/* A field people never see; bots fill it in. */}
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
        </label>
      </div>

      <p id={id("error")} className="stream-error" role="alert">
        {shownError}
      </p>
      <p className="sr-only" aria-live="polite">
        {done ? "" : f.stepOf(step + 1, TOTAL, f.steps[step])}
      </p>

      <div className="pagination rv" aria-hidden="true" style={{ ["--rv-y" as string]: "0", ["--rv-delay" as string]: "0.5s" }}>
        {[0, 1, 2].map((i) => (
          <i key={i} className={done || i === step ? "is-on" : i < step ? "is-past" : ""} />
        ))}
      </div>

      <div className="actions rv" style={{ ["--rv-y" as string]: "40%", ["--rv-delay" as string]: "0.6s" }}>
        {done ? (
          <button type="button" className="next" onClick={again}>
            {f.again}
            <ArrowRight />
          </button>
        ) : (
          <>
            {step > 0 ? (
              <button type="button" className="back" onClick={() => goTo((step - 1) as 0 | 1)} disabled={busy}>
                <ArrowRight />
                {f.back}
              </button>
            ) : null}
            <button type="submit" className="next" aria-busy={busy} disabled={busy}>
              {nextLabel}
              <ArrowRight />
            </button>
          </>
        )}
      </div>
    </form>
  );
}

function PaperClip() {
  return (
    <svg className="clip" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M10.5 4.5L5.2 9.8a1.6 1.6 0 002.3 2.3l5.4-5.4a3 3 0 00-4.3-4.3L3.2 7.8a4.3 4.3 0 006.1 6.1l4-4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
