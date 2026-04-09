import Link from "next/link";

export default function BackToHomeButton() {
  return (
    <div className="flex justify-center">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-regal_navy px-6 py-2.5 text-sm font-semibold text-school_bus_yellow shadow-sm transition hover:bg-prussian_blue active:scale-[0.99] active:bg-ink_black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school_bus_yellow"
      >
        <span aria-hidden>←</span>
        Tilbake til forsiden
      </Link>
    </div>
  );
}
