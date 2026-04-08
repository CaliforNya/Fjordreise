"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchForm() {
  const router = useRouter();

  const [from, setFrom] = useState("Bergen");
  const [to, setTo] = useState("Stavanger");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");
  const [passengers, setPassengers] = useState({
    voksen: 1,
    barn: 0,
    dyr: 0,
  });
  const [vehicles, setVehicles] = useState({
    personbil: 0,
    bobil: 0,
    mc: 0,
    sykkel: 0,
  });

  function updatePassengerCount(
    type: "voksen" | "barn" | "dyr",
    delta: number
  ) {
    setPassengers((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  }

  function updateVehicleCount(
    vehicle: "personbil" | "bobil" | "mc" | "sykkel",
    delta: number
  ) {
    setVehicles((prev) => ({
      ...prev,
      [vehicle]: Math.max(0, prev[vehicle] + delta),
    }));
  }

  const handleSearch = () => {
    if (!date) return;
    const totalPeople = passengers.voksen + passengers.barn + passengers.dyr;

    router.push(
      `/results?from=${from}&to=${to}&date=${date}&returnDate=${returnDate}&people=${totalPeople}&tripType=${tripType}`
    );
  };

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
          onClick={() => setTripType("oneway")}
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
          <label className="mb-2 block text-sm font-semibold text-prussian_blue/70">
            Fra
          </label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-lg border border-prussian_blue/25 bg-white px-3 py-2.5 text-lg font-semibold text-ink_black focus:outline-none focus:ring-2 focus:ring-prussian_blue/40"
          >
            <option>Bergen</option>
            <option>Stavanger</option>
            <option>Hirtshals</option>
          </select>
        </div>

        <div className="border-b border-prussian_blue/10 bg-white/70 p-4">
          <label className="mb-2 block text-sm font-semibold text-prussian_blue/70">
            Til
          </label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-lg border border-prussian_blue/25 bg-white px-3 py-2.5 text-lg font-semibold text-ink_black focus:outline-none focus:ring-2 focus:ring-prussian_blue/40"
          >
            <option>Bergen</option>
            <option>Stavanger</option>
            <option>Hirtshals</option>
          </select>
        </div>

        <div className="border-b border-r border-prussian_blue/10 bg-white/70 p-4">
          <label className="mb-2 block text-sm font-semibold text-prussian_blue/70">
            Utreise
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-prussian_blue/25 bg-white px-3 py-2.5 text-base font-semibold text-ink_black focus:outline-none focus:ring-2 focus:ring-prussian_blue/40"
          />
        </div>

        <div className="border-b border-prussian_blue/10 bg-white/70 p-4">
          <label className="mb-2 block text-sm font-semibold text-prussian_blue/70">
            Retur
          </label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            disabled={tripType === "oneway"}
            className="w-full rounded-lg border border-prussian_blue/25 bg-white px-3 py-2.5 text-base font-semibold text-ink_black focus:outline-none focus:ring-2 focus:ring-prussian_blue/40 disabled:opacity-50"
          />
        </div>

        <div className="border-r border-prussian_blue/10 bg-white/70 p-4">
          <label className="mb-2 block text-sm font-semibold text-prussian_blue/70">
            Reisende
          </label>
          <div className="space-y-2 rounded-lg border border-prussian_blue/20 bg-white p-3">
            {[
              { key: "voksen", label: "Voksen" },
              { key: "barn", label: "Barn" },
              { key: "dyr", label: "Dyr" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 border-b border-prussian_blue/10 pb-1.5 last:border-b-0 last:pb-0"
              >
                <span className="text-base font-semibold text-ink_black">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updatePassengerCount(
                        item.key as "voksen" | "barn" | "dyr",
                        -1
                      )
                    }
                    className="h-9 w-9 rounded-full border border-prussian_blue/25 text-lg text-prussian_blue transition hover:bg-prussian_blue/10"
                  >
                    -
                  </button>
                  <div className="w-12 rounded-md border border-prussian_blue/25 py-1 text-center text-base font-semibold text-ink_black">
                    {passengers[item.key as keyof typeof passengers]}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updatePassengerCount(
                        item.key as "voksen" | "barn" | "dyr",
                        1
                      )
                    }
                    className="h-9 w-9 rounded-full border border-prussian_blue/25 text-lg text-prussian_blue transition hover:bg-prussian_blue/10"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 p-4">
          <label className="mb-2 block text-sm font-semibold text-prussian_blue/70">
            Kjøretøy
          </label>
          <div className="space-y-2 rounded-lg border border-prussian_blue/20 bg-white p-3">
            {[
              { key: "personbil", label: "Personbil" },
              { key: "bobil", label: "Bobil" },
              { key: "mc", label: "MC" },
              { key: "sykkel", label: "Sykkel" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 border-b border-prussian_blue/10 pb-1.5 last:border-b-0 last:pb-0"
              >
                <span className="text-base font-semibold text-ink_black">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateVehicleCount(
                        item.key as "personbil" | "bobil" | "mc" | "sykkel",
                        -1
                      )
                    }
                    className="h-9 w-9 rounded-full border border-prussian_blue/25 text-lg text-prussian_blue transition hover:bg-prussian_blue/10"
                  >
                    -
                  </button>
                  <div className="w-12 rounded-md border border-prussian_blue/25 py-1 text-center text-base font-semibold text-ink_black">
                    {vehicles[item.key as keyof typeof vehicles]}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateVehicleCount(
                        item.key as "personbil" | "bobil" | "mc" | "sykkel",
                        1
                      )
                    }
                    className="h-9 w-9 rounded-full border border-prussian_blue/25 text-lg text-prussian_blue transition hover:bg-prussian_blue/10"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={handleSearch}
          disabled={!date}
          className="w-full rounded-full bg-prussian_blue px-6 py-3 text-lg font-semibold text-school_bus_yellow transition hover:bg-regal_navy active:scale-[0.99] active:bg-ink_black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-school_bus_yellow disabled:cursor-not-allowed disabled:bg-prussian_blue/60 disabled:text-gold/80"
        >
          Søk
        </button>
      </div>
    </section>
  );
}