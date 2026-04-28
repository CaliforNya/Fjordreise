"use client";

import { formatNok, formatDuration } from "@/utils/formatters";
import type { Departure } from "@/types/departures";

type Props = {
  departure: Departure;
  isReturnLeg: boolean;
  isRoundTrip: boolean;
  onSelect: (id: string) => void;
};

export default function DepartureCard({ departure: d, isReturnLeg, isRoundTrip, onSelect }: Props) {
  const buttonLabel = isReturnLeg
    ? "Velg returavgang"
    : isRoundTrip
      ? "Velg utreise"
      : "Velg avgang";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-school_bus_yellow/35 bg-white/75 p-4 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between md:p-5">
      <div className="flex min-w-0 flex-1 gap-4">
        <div className="hidden w-1 shrink-0 rounded-full bg-school_bus_yellow sm:block" aria-hidden />
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-2xl font-semibold tabular-nums text-prussian_blue">
              {d.departureTime}
            </span>
            {d.date ? (
              <span className="text-base text-prussian_blue/65">{d.date}</span>
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
        onClick={() => onSelect(d.id)}
        className="shrink-0 rounded-full bg-regal_navy px-6 py-2.5 text-sm font-semibold text-school_bus_yellow transition hover:bg-prussian_blue active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school_bus_yellow"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
