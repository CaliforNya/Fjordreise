"use client";

import departuresData from "@/data/departures.json";
import {
  SELECTED_DEPARTURE_KEY,
  SELECTED_RETURN_DEPARTURE_KEY,
} from "@/constants/storage";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type Departure = {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  durationMinutes: number;
  baseFare: number;
  tag?: string;
  date: string | null;
};

type DepartureRow = {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  durationMinutes: number;
  baseFare: number;
  tag?: string;
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) return `${m} min`;
  if (m === 0) return `${h} t`;
  return `${h} t ${m} min`;
}

function formatNok(value: number): string {
  return `${new Intl.NumberFormat("nb-NO").format(value)} NOK`;
}

export default function ResultsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const date = searchParams.get("date") ?? "";
  const returnDate = searchParams.get("returnDate") ?? "";
  const tripType = searchParams.get("tripType") ?? "roundtrip";
  const outboundId = searchParams.get("outboundId") ?? "";

  const isRoundTrip = tripType === "roundtrip";
  const isReturnLeg = isRoundTrip && Boolean(outboundId);

  const fetchFrom = isReturnLeg ? to : from;
  const fetchTo = isReturnLeg ? from : to;
  const fetchDate = isReturnLeg ? returnDate : date;

  const selectedOutbound = useMemo(() => {
    if (!outboundId || !from || !to) return undefined;
    return (departuresData.departures as DepartureRow[]).find(
      (d) => d.id === outboundId && d.from === from && d.to === to
    );
  }, [outboundId, from, to]);

  const buildResultsUrlWithoutOutbound = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("outboundId");
    return `/results?${next.toString()}`;
  }, [searchParams]);

  const buildSummaryUrl = useCallback(
    (outId: string, returnId: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      next.delete("outboundId");
      next.set("departureId", outId);
      if (returnId) {
        next.set("returnDepartureId", returnId);
      } else {
        next.delete("returnDepartureId");
      }
      return `/summary?${next.toString()}`;
    },
    [searchParams]
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!from || !to) {
        setDepartures([]);
        setLoading(false);
        setError(
          "Mangler avreisested eller destinasjon. Gå tilbake og fyll ut søket."
        );
        return;
      }

      if (isReturnLeg && !returnDate) {
        setDepartures([]);
        setLoading(false);
        setError("Mangler returdato for å vise returavganger.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const q = new URLSearchParams({
          from: fetchFrom,
          to: fetchTo,
          date: fetchDate,
        });
        const res = await fetch(`/api/departures?${q.toString()}`);
        const data = (await res.json()) as {
          departures?: Departure[];
          error?: string;
        };

        if (!res.ok) {
          throw new Error(data.error ?? "Kunne ikke hente avganger");
        }

        if (!cancelled) {
          setDepartures(data.departures ?? []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Noe gikk galt");
          setDepartures([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [
    from,
    to,
    fetchFrom,
    fetchTo,
    fetchDate,
    isReturnLeg,
    returnDate,
  ]);

  function handleSelectOutbound(departureId: string) {
    sessionStorage.setItem(SELECTED_DEPARTURE_KEY, departureId);
    sessionStorage.removeItem(SELECTED_RETURN_DEPARTURE_KEY);
    const next = new URLSearchParams(searchParams.toString());
    next.set("outboundId", departureId);
    router.push(`/results?${next.toString()}`);
  }

  function handleSelectReturn(returnDepartureId: string) {
    if (!outboundId) return;
    sessionStorage.setItem(SELECTED_RETURN_DEPARTURE_KEY, returnDepartureId);
    router.push(buildSummaryUrl(outboundId, returnDepartureId));
  }

  function handleSelectOneWay(departureId: string) {
    sessionStorage.setItem(SELECTED_DEPARTURE_KEY, departureId);
    sessionStorage.removeItem(SELECTED_RETURN_DEPARTURE_KEY);
    router.push(buildSummaryUrl(departureId, null));
  }

  if (loading) {
    return (
      <div
        className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/50 bg-white/40 shadow-2xl backdrop-blur-sm"
        role="status"
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

  const headerRoute = (
    <p className="mt-2 text-lg text-prussian_blue/85">
      <span className="font-semibold text-ink_black">{fetchFrom}</span>
      <span className="mx-2 text-school_bus_yellow">→</span>
      <span className="font-semibold text-ink_black">{fetchTo}</span>
      {fetchDate ? (
        <span className="mt-1 block text-base font-normal text-prussian_blue/65 md:mt-0 md:ml-2 md:inline">
          · {isReturnLeg ? "Retur " : "Utreise "}
          {fetchDate}
        </span>
      ) : null}
    </p>
  );

  return (
    <section className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/50 bg-white/40 shadow-2xl backdrop-blur-sm">
      <header className="border-b border-prussian_blue/10 bg-white/75 px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-school_bus_yellow">
              {isRoundTrip && !isReturnLeg
                ? "Steg 1 av 2"
                : isReturnLeg
                  ? "Steg 2 av 2"
                  : "En vei"}
            </p>
            <h1 className="text-xl font-semibold text-prussian_blue md:text-2xl">
              {isReturnLeg
                ? "Velg returavgang"
                : isRoundTrip
                  ? "Velg utreise"
                  : "Tilgjengelige avganger"}
            </h1>
            {from && to ? headerRoute : null}
            <p className="mt-2 text-sm text-prussian_blue/70">
              {isReturnLeg
                ? "Velg én returavgang. Utreisen er allerede valgt."
                : isRoundTrip
                  ? "Først utreise — deretter får du velge retur."
                  : "Velg én avgang for å gå videre til oppsummering."}
            </p>
            {isReturnLeg && selectedOutbound ? (
              <div className="mt-3 rounded-lg border border-school_bus_yellow/50 bg-[#f7fbff] px-3 py-2 text-sm text-prussian_blue">
                <span className="font-semibold">Valgt utreise:</span> kl.{" "}
                {selectedOutbound.departureTime} ·{" "}
                {formatNok(selectedOutbound.baseFare)}
                {selectedOutbound.tag ? ` · ${selectedOutbound.tag}` : ""}
              </div>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            {isReturnLeg ? (
              <Link
                href={buildResultsUrlWithoutOutbound()}
                onClick={() => {
                  sessionStorage.removeItem(SELECTED_DEPARTURE_KEY);
                  sessionStorage.removeItem(SELECTED_RETURN_DEPARTURE_KEY);
                }}
                className="inline-flex items-center justify-center rounded-full border border-prussian_blue/25 bg-white/90 px-4 py-2 text-center text-sm font-semibold text-prussian_blue transition hover:border-prussian_blue/40 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prussian_blue"
              >
                ← Endre utreise
              </Link>
            ) : null}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-prussian_blue/25 bg-white/90 px-4 py-2 text-sm font-semibold text-prussian_blue transition hover:border-prussian_blue/40 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-prussian_blue"
            >
              <span aria-hidden>←</span>
              Tilbake til søk
            </Link>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-5">
        {error ? (
          <p className="rounded-lg border border-school_bus_yellow/70 bg-school_bus_yellow/25 px-3 py-2 text-sm font-medium text-prussian_blue">
            {error}
          </p>
        ) : null}

        {!error && departures.length === 0 ? (
          <p className="rounded-xl border border-school_bus_yellow/40 bg-[#f7fbff] px-4 py-3 text-prussian_blue/85">
            Ingen avganger funnet for {fetchFrom} → {fetchTo}
            {fetchDate ? ` den ${fetchDate}` : ""}. Prøv en annen rute eller
            dato.
          </p>
        ) : null}

        {!error && departures.length > 0 ? (
          <ul className="space-y-3">
            {departures.map((d) => (
              <li key={d.id}>
                <div className="flex flex-col gap-4 rounded-xl border border-school_bus_yellow/35 bg-white/75 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between md:p-5">
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div
                      className="hidden w-1 shrink-0 rounded-full bg-school_bus_yellow sm:block"
                      aria-hidden
                    />
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-2xl font-semibold tabular-nums text-prussian_blue">
                          {d.departureTime}
                        </span>
                        {d.date ? (
                          <span className="text-base text-prussian_blue/65">
                            {d.date}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-prussian_blue/75">
                        Varighet:{" "}
                        <span className="font-medium text-prussian_blue">
                          {formatDuration(d.durationMinutes)}
                        </span>
                      </p>
                      {d.tag ? (
                        <span className="inline-block rounded-full bg-school_bus_yellow/30 px-3 py-0.5 text-xs font-semibold text-ink_black">
                          {d.tag}
                        </span>
                      ) : null}
                      <p className="text-sm font-semibold text-school_bus_yellow">
                        Grunnpris fra {formatNok(d.baseFare)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (isReturnLeg) {
                        handleSelectReturn(d.id);
                      } else if (isRoundTrip) {
                        handleSelectOutbound(d.id);
                      } else {
                        handleSelectOneWay(d.id);
                      }
                    }}
                    className="shrink-0 rounded-full bg-regal_navy px-6 py-2.5 text-sm font-semibold text-school_bus_yellow transition hover:bg-prussian_blue active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school_bus_yellow"
                  >
                    {isReturnLeg
                      ? "Velg returavgang"
                      : isRoundTrip
                        ? "Velg utreise"
                        : "Velg avgang"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
