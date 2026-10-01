import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CATEGORIES, type Submission } from "@/lib/contact/shared";
import { listSubmissions, storageMode } from "@/lib/contact/store";
import { INBOX_COOKIE, inboxConfigured, isSignedIn } from "@/lib/inbox";
import { inbox } from "@/content/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: inbox.title, robots: { index: false, follow: false } };

const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });
const size = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

/**
 * Messages sent through the contact stream, newest first, behind one shared
 * password (see lib/inbox.ts). Not linked from the site and not indexed.
 */
export default async function InboxPage({ searchParams }: { searchParams: { c?: string; error?: string } }) {
  const signedIn = isSignedIn(cookies().get(INBOX_COOKIE)?.value);

  if (!signedIn) {
    return (
      <main className="inbox inbox-lock">
        <div className="inbox-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-maymun.svg" alt="" width={120} height={69} />
          <h1 className="k-label">({inbox.title})</h1>
          {inboxConfigured() ? (
            <form action="/api/inbox/session" method="post">
              <p>{inbox.locked}</p>
              <label htmlFor="inbox-password">{inbox.password}</label>
              <input id="inbox-password" name="password" type="password" autoComplete="current-password" required autoFocus />
              {searchParams.error ? (
                <p className="inbox-error" role="alert">
                  {inbox.wrongPassword}
                </p>
              ) : null}
              <button type="submit">{inbox.signIn}</button>
            </form>
          ) : (
            <p>{inbox.notConfigured}</p>
          )}
        </div>
      </main>
    );
  }

  const all = await listSubmissions();
  const filter = CATEGORIES.includes(searchParams.c ?? "") ? searchParams.c : undefined;
  const shown = filter ? all.filter((s) => s.category === filter) : all;
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, all.filter((s) => s.category === c).length]));

  return (
    <main className="inbox">
      <header className="inbox-head">
        <div className="inbox-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-maymun.svg" alt="Maymun Collective" width={96} height={55} />
          <h1 className="k-label">({inbox.title})</h1>
          <p>{inbox.count(all.length)}</p>
        </div>
        <div className="inbox-actions">
          <a href="/api/inbox/export">{inbox.export}</a>
          <form action="/api/inbox/session" method="post">
            <button type="submit" name="signout" value="1">
              {inbox.signOut}
            </button>
          </form>
        </div>
      </header>

      {storageMode() === "off" ? <p className="inbox-error">{inbox.noStorage}</p> : null}

      <nav className="inbox-filter" aria-label="Filter by reason">
        <a href="/inbox" aria-current={!filter ? "page" : undefined}>
          {inbox.all} <span>{all.length}</span>
        </a>
        {CATEGORIES.map((c) => (
          <a key={c} href={`/inbox?c=${encodeURIComponent(c)}`} aria-current={filter === c ? "page" : undefined}>
            {c} <span>{counts[c]}</span>
          </a>
        ))}
      </nav>

      {shown.length === 0 ? (
        <p className="inbox-empty">{inbox.empty}</p>
      ) : (
        <ol className="inbox-list">
          {shown.map((s) => (
            <Item key={s.id} s={s} />
          ))}
        </ol>
      )}
    </main>
  );
}

function Item({ s }: { s: Submission }) {
  const reply = `mailto:${s.email}?subject=${encodeURIComponent(inbox.replySubject(s.category))}`;
  return (
    <li className="inbox-item">
      <div className="meta">
        <time dateTime={s.createdAt}>{when.format(new Date(s.createdAt))} UTC</time>
        <span className="tag">{s.category}</span>
      </div>
      <div className="who">
        <h2>{s.name}</h2>
        <a href={`mailto:${s.email}`}>{s.email}</a>
      </div>
      <p className="msg">{s.message}</p>
      <div className="foot">
        {s.attachment ? (
          <a className="file" href={`/api/inbox/file?path=${encodeURIComponent(s.attachment.pathname)}&name=${encodeURIComponent(s.attachment.filename)}`}>
            {s.attachment.filename} · {size(s.attachment.size)}
          </a>
        ) : (
          <span />
        )}
        <a className="reply" href={reply}>
          {inbox.reply} →
        </a>
      </div>
    </li>
  );
}
