"use client";

import pricing from "@/data/pricing.json";
import RouteDropdown from "@/components/RouteDropdown";
import ResetFormButton from "@/components/buttons/ResetFormButton";
import SearchButton from "@/components/buttons/SearchButton";
import { useSearchForm } from "@/hooks/useSearchForm";
import type { PassengerType, VehicleType } from "@/utils/searchFormValidation";

const PORT_OPTIONS = Array.from(
  new Set(pricing.routes.flatMap((route) => [route.from, route.to]))
);

function CounterRow({
  label,
  value,
  onDecrement,
  onIncrement,
}: {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-prussian_blue/10 pb-1.5 last:border-b-0 last:pb-0">
      <span className="text-base font-semibold text-ink_black">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrement}
          className="h-9 w-9 rounded-full border border-prussian_blue/25 text-lg text-prussian_blue transition hover:bg-school_bus_yellow/45 hover:text-ink_black active:bg-regal_navy/85 active:text-school_bus_yellow"
        >
          -
        </button>
        <div className="w-12 rounded-md border border-prussian_blue/25 py-1 text-center text-base font-semibold text-ink_black">
          {value}
        </div>
        <button
          type="button"
          onClick={onIncrement}
          className="h-9 w-9 rounded-full border border-prussian_blue/25 text-lg text-prussian_blue transition hover:bg-school_bus_yellow/45 hover:text-ink_black active:bg-regal_navy/85 active:text-school_bus_yellow"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function SearchForm() {
  const {
    from, setFrom,
    to, setTo,
    date, setDate,
    returnDate, setReturnDate,
    tripType, setTripType,
    passengers, vehicles,
    today,
    validationMessage, canSubmit,
    updatePassengerCount, updateVehicleCount,
    handleSearch, handleReset,
  } = useSearchForm();

  return (
    <section className="mx-auto mt-4 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/50 bg-white/40 shadow-2xl backdrop-blur-sm">
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => setTripType("roundtrip")}
          className={`border-b-4 px-4 py-3 text-left text-base font-semibold transition ${
            tripType === "roundtrip"
              ? "border-school_bus_yellow bg-white text-ink_black"
              : "border-transparent bg-prussian_blue/10 text-prussian_blue/70 hover:bg-prussian_blue/15 hover:text-prussian_blue active:bg-prussian_blue/20"
          }`}
        >
          Tur/retur
        </button>
        <button
          type="button"
          onClick={() => { setTripType("oneway"); setReturnDate(""); }}
          className={`border-b-4 px-4 py-3 text-left text-base font-semibold transition ${
            tripType === "oneway"
              ? "border-school_bus_yellow bg-white text-ink_black"
              : "border-transparent bg-prussian_blue/10 text-prussian_blue/70 hover:bg-prussian_blue/15 hover:text-prussian_blue active:bg-prussian_blue/20"
          }`}
        >
          En vei
        </button>
      </div>

      <div className="grid grid-cols-1 border-t border-prussian_blue/10 md:grid-cols-2">
        <div className="border-b border-r border-prussian_blue/10 bg-white/70 p-4">
          <div className="mb-2 flex min-h-10 flex-wrap items-center justify-between gap-2 md:justify-start">
            <label className="text-sm font-semibold text-prussian_blue/70">Fra</label>
            <span className="inline-flex md:hidden">
              <ResetFormButton onClick={handleReset} />
            </span>
          </div>
          <RouteDropdown value={from} onChange={setFrom} options={PORT_OPTIONS} />
        </div>

        <div className="border-b border-prussian_blue/10 bg-white/70 p-4">
          <div className="mb-2 flex min-h-10 flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-semibold text-prussian_blue/70">Til</label>
            <span className="hidden md:inline-flex">
              <ResetFormButton onClick={handleReset} />
            </span>
          </div>
          <RouteDropdown value={to} onChange={setTo} options={PORT_OPTIONS} />
        </div>

        <div className="border-b border-r border-prussian_blue/10 bg-white/70 p-4">
          <label className="mb-2 block text-sm font-semibold text-prussian_blue/70">Utreise</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            className="w-full rounded-lg border border-prussian_blue/25 bg-white px-3 py-2.5 text-base font-semibold text-ink_black focus:outline-none focus:ring-2 focus:ring-prussian_blue/40"
          />
        </div>

        <div className="border-b border-prussian_blue/10 bg-white/70 p-4">
          <label className="mb-2 block text-sm font-semibold text-prussian_blue/70">Retur</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            disabled={tripType === "oneway"}
            min={date || undefined}
            className="w-full rounded-lg border border-prussian_blue/25 bg-white px-3 py-2.5 text-base font-semibold text-ink_black focus:outline-none focus:ring-2 focus:ring-prussian_blue/40 disabled:opacity-50"
          />
        </div>

        <div className="border-r border-prussian_blue/10 bg-white/70 p-4">
          <label className="mb-2 block text-sm font-semibold text-prussian_blue/70">Reisende</label>
          <div className="space-y-2 rounded-lg border border-prussian_blue/20 bg-white p-3">
            {(
              [
                { key: "adult", label: "Voksen" },
                { key: "child", label: "Barn (0-12 år)" },
                { key: "animal", label: "Dyr" },
              ] as { key: PassengerType; label: string }[]
            ).map((item) => (
              <CounterRow
                key={item.key}
                label={item.label}
                value={passengers[item.key]}
                onDecrement={() => updatePassengerCount(item.key, -1)}
                onIncrement={() => updatePassengerCount(item.key, 1)}
              />
            ))}
          </div>
        </div>

        <div className="bg-white/70 p-4">
          <label className="mb-2 block text-sm font-semibold text-prussian_blue/70">Kjøretøy</label>
          <div className="space-y-2 rounded-lg border border-prussian_blue/20 bg-white p-3">
            {(
              [
                { key: "car", label: "Personbil" },
                { key: "camper", label: "Bobil" },
                { key: "motorcycle", label: "MC" },
                { key: "bicycle", label: "Sykkel" },
              ] as { key: VehicleType; label: string }[]
            ).map((item) => (
              <CounterRow
                key={item.key}
                label={item.label}
                value={vehicles[item.key]}
                onDecrement={() => updateVehicleCount(item.key, -1)}
                onIncrement={() => updateVehicleCount(item.key, 1)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {validationMessage && (
          <p className="mb-3 rounded-lg border border-school_bus_yellow bg-school_bus_yellow/40 px-3 py-2 text-sm font-medium text-prussian_blue">
            {validationMessage}
          </p>
        )}
        <SearchButton onClick={handleSearch} disabled={!canSubmit} />
      </div>
    </section>
  );
}
