import ResultsList from "@/components/ResultsList";
import { Suspense } from "react";

function ResultsLoadingShell() {
  return (
    <div
      className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/50 bg-white/40 shadow-2xl backdrop-blur-sm"
      role="status"
      aria-label="Laster avganger"
    >
      <div className="h-24 animate-pulse bg-white/60" />
      <div className="space-y-3 p-4 md:p-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-prussian_blue/10 bg-white/50"
          />
        ))}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-white/50"
      />
      <main className="relative z-10 w-full !max-w-none !px-0">
        <div className="content-wrapper page-stack pt-6">
          <Suspense fallback={<ResultsLoadingShell />}>
            <ResultsList />
          </Suspense>
        </div>
      </main>
    </>
  );
}
