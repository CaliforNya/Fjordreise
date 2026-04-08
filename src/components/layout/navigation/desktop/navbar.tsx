import Link from "next/link";

export function NavBarDesktop() {
  return (
    <nav className="hidden items-center gap-2 md:flex">
      <Link
        href="/"
        className="rounded-full px-4 py-2 text-sm font-semibold text-prussian_blue transition hover:bg-gold hover:text-ink_black"
      >
        Home
      </Link>
      <Link
        href="/results"
        className="rounded-full px-4 py-2 text-sm font-semibold text-prussian_blue transition hover:bg-gold hover:text-ink_black"
      >
        Results
      </Link>
      <Link
        href="/summary"
        className="rounded-full px-4 py-2 text-sm font-semibold text-prussian_blue transition hover:bg-gold hover:text-ink_black"
      >
        Summary
      </Link>
    </nav>
  );
}
