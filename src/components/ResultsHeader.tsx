"use client";

import { formatNok } from "@/utils/formatters";
import {
  SELECTED_DEPARTURE_KEY,
  SELECTED_RETURN_DEPARTURE_KEY,
} from "@/constants/storage";
import type { DepartureRow } from "@/types/departures";
import Link from "next/link";

type Props = {
  from: string;
  to: string;
  fetchFrom: string;
  fetchTo: string;
  fetchDate: string;
  isRoundTrip: boolean;
  isReturnLeg: boolean;
  selectedOutbound: DepartureRow | undefined;
  buildResultsUrlWithoutOutbound: () => string;
};

export default function ResultsHeader({
  from,
  to,
  fetchFrom,
  fetchTo,
  fetchDate,
  isRoundTrip,
  isReturnLeg,
  selectedOutbound,
  buildResultsUrlWithoutOutbound,
}: Props) {
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
    <header className="border-b border-prussian_blue/10 bg-white/75 px-4 py-4 md:px-6 md:py-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-school_bus_yellow">
            {isRoundTrip && !isReturnLeg ? "Steg 1 av 2" : isReturnLeg ? "Steg 2 av 2" : "En vei"}
          </p>
          <h1 className="text-xl font-semibold text-prussian_blue md:text-2xl">
            {isReturnLeg ? "Velg returavgang" : isRoundTrip ? "Velg utreise" : "Tilgjengelige avganger"}
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
              {selectedOutbound.departureTime} · {formatNok(selectedOutbound.baseFare)}
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
  );
}
