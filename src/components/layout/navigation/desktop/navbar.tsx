import SummaryNavLink from "@/components/layout/navigation/SummaryNavLink";
import Link from "next/link";

export function NavBarDesktop() {
  return (
    <nav className="hidden items-center gap-6 md:flex">
      <Link
        href="/"
        className="border-b border-transparent py-1 text-base font-medium text-prussian_blue transition hover:border-prussian_blue/40 hover:text-regal_navy"
      >
        Home
      </Link>
      <SummaryNavLink className="border-b border-transparent py-1 text-base font-medium text-prussian_blue transition hover:border-prussian_blue/40 hover:text-regal_navy">
        Summary
      </SummaryNavLink>
    </nav>
  );
}
