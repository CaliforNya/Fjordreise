"use client";

import departuresData from "@/data/departures.json";
import {
  SELECTED_DEPARTURE_KEY,
  SELECTED_RETURN_DEPARTURE_KEY,
} from "@/constants/storage";
import type { DepartureRow, Departure } from "@/types/departures";
import DepartureCard from "@/components/DepartureCard";
import ResultsHeader from "@/components/ResultsHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";




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

  return (
    <section className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white/50 bg-white/40 shadow-2xl backdrop-blur-sm">
      <ResultsHeader
        from={from}
        to={to}
        fetchFrom={fetchFrom}
        fetchTo={fetchTo}
        fetchDate={fetchDate}
        isRoundTrip={isRoundTrip}
        isReturnLeg={isReturnLeg}
        selectedOutbound={selectedOutbound}
        buildResultsUrlWithoutOutbound={buildResultsUrlWithoutOutbound}
      />

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
                <DepartureCard
                  departure={d}
                  isReturnLeg={isReturnLeg}
                  isRoundTrip={isRoundTrip}
                  onSelect={(id) => {
                    if (isReturnLeg) handleSelectReturn(id);
                    else if (isRoundTrip) handleSelectOutbound(id);
                    else handleSelectOneWay(id);
                  }}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
