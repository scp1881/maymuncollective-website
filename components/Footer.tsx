import Wordmark from "@/components/Wordmark";
import { footer } from "@/content/site";

export default function Footer() {
  return (
    <footer className="fold">
      <div className="container-page flex flex-wrap items-center justify-between gap-6 py-10">
        <Wordmark className="h-10" />
        <p className="text-small text-ink-soft">{footer.note}</p>
      </div>
    </footer>
  );
}
