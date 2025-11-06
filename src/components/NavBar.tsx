"use client";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/people", label: "People" },
  { href: "/gallery", label: "Gallery" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/models", label: "Ready Models" },
  { href: "/llm", label: "LLM Home" },
];

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="font-semibold tracking-wide text-brand-700">Lab</div>
        <div className="flex items-center gap-4">
          {links.map((l) => (
            <Link 
              key={l.href} 
              href={l.href} 
              prefetch={false} 
              className="text-sm text-gray-700 hover:text-brand-700 hover:underline">
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}