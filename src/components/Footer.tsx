import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between text-sm">
        <div className="text-brand-700">Made by Milena Belianovich</div>
        <div>
          <a href="/privacy" className="text-brand-700 hover:underline">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

