import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm flex justify-between">
        <div>© 2025 University of Utah</div>
        <div className="space-x-4">
          {/* Either use Link… */}
          <Link href="/privacy" prefetch={false} className="underline" suppressHydrationWarning>
            <span data-gramm="false" data-gramm_editor="false">Privacy Policy</span>
          </Link>

          {/* …or plain <a>, still OK with suppression */}
          {/* <a href="/privacy" className="underline" suppressHydrationWarning data-gramm="false" data-gramm_editor="false">Privacy Policy</a> */}
        </div>
      </div>
    </footer>
  );
}
