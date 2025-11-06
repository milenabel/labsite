"use client";

import { useState } from "react";

type Props = {
  email: string;
  subject?: string;
  body?: string;
  children: React.ReactNode;
  className?: string;
  prefer?: "gmail" | "mailto"; // ← new
};

export default function EmailLink({
  email,
  subject,
  body,
  children,
  className,
  prefer = "mailto",
}: Props) {
  const [copied, setCopied] = useState(false);

  const mailto = (() => {
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (body) params.set("body", body);
    const q = params.toString();
    return `mailto:${email}${q ? `?${q}` : ""}`;
  })();

  const gmailUrl = (() => {
    const params = new URLSearchParams();
    params.set("view", "cm");
    params.set("fs", "1");
    params.set("to", email);
    if (subject) params.set("su", subject);
    if (body) params.set("body", body);
    return `https://mail.google.com/mail/?${params.toString()}`;
  })();

  const openGmail = () => {
    // Open immediately on click to avoid popup blockers
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
    // copy email for quick paste
    navigator.clipboard?.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  const onClick = (e: React.MouseEvent) => {
    if (prefer === "gmail") {
      e.preventDefault();     // don’t navigate to mailto
      openGmail();            // open Gmail tab synchronously
    }
    // If prefer === "mailto", do nothing: browser/OS handles it via href
  };

  // If user middle-clicks or cmd/ctrl-clicks, let the browser do its thing.
  return (
    <span className="inline-flex items-center gap-2">
      <a
        href={prefer === "mailto" ? mailto : gmailUrl}
        onClick={onClick}
        target={prefer === "gmail" ? "_blank" : undefined}
        rel={prefer === "gmail" ? "noopener noreferrer" : undefined}
        className={className ?? "inline-block rounded-lg px-4 py-2 text-sm font-medium hover:shadow-sm"}
      >
        {children}
      </a>
      <span className="text-xs text-gray-500">{copied ? "Copied email ✓" : ""}</span>
    </span>
  );
}
