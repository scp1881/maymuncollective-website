"use client";

import { useState } from "react";
import { ArrowRight, WhatsAppIcon } from "@/components/k/bits";
import { contact, ui } from "@/content/site";

/**
 * The pill with pagination and "Next step" from the reference's demo form,
 * stepping through the three ways to get in touch. Every step is a real
 * link; the ones not showing are visibility:hidden (out of the tab order and
 * the accessibility tree), and the pill announces the new step politely.
 * (Email, WhatsApp and the socials are also in the footer and the menu, so
 * nothing is only reachable through the steps.)
 */
export default function ContactSteps() {
  const [step, setStep] = useState(0);
  const wa = contact.whatsapp.replace(/\D/g, "");
  const steps = [
    <a key="email" href={`mailto:${contact.email}`} className="k-grow">
      {contact.email}
    </a>,
    <a key="wa" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label={ui.whatsappLabel(contact.whatsapp)} className="k-grow">
      <WhatsAppIcon /> {contact.whatsapp}
    </a>,
    ...contact.socials.map((s) => (
      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="k-grow">
        {s.label}
      </a>
    )),
  ];
  const groups = [[steps[0]], [steps[1]], steps.slice(2)];

  return (
    <>
      <div className="pill rv" style={{ ["--rv-y" as string]: "20%", ["--rv-delay" as string]: "0.4s" }} aria-live="polite">
        {groups.map((g, i) => (
          <div key={i} className={`step ${i === 2 ? "socials" : ""} ${i === step ? "is-on" : ""}`} aria-hidden={i !== step}>
            {g}
          </div>
        ))}
      </div>
      <div className="pagination rv" aria-hidden="true" style={{ ["--rv-y" as string]: "0", ["--rv-delay" as string]: "0.5s" }}>
        {groups.map((_, i) => (
          <i key={i} className={i === step ? "is-on" : ""} />
        ))}
      </div>
      <button type="button" className="next rv" style={{ ["--rv-y" as string]: "40%", ["--rv-delay" as string]: "0.6s" }} onClick={() => setStep((s) => (s + 1) % groups.length)}>
        {ui.nextStep}
        <ArrowRight />
      </button>
    </>
  );
}
