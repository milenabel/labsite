"use client";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/people", label: "People" },
  { href: "/pictures", label: "Lab Pictures" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/models", label: "Ready Models" },
  { href: "/llm", label: "LLM Home" },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap gap-x-5">
        {links.map((l) => (
          <Link key={l.href} className="text-sm hover:underline" href={l.href}>
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
