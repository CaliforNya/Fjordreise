"use client";

import pricing from "@/data/pricing.json";
import RouteDropdown from "@/components/RouteDropdown";
import ResetFormButton from "@/components/buttons/ResetFormButton";
import SearchButton from "@/components/buttons/SearchButton";
import {
  FORM_STORAGE_KEY,
  SELECTED_DEPARTURE_KEY,
  SELECTED_RETURN_DEPARTURE_KEY,
} from "@/constants/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PORT_OPTIONS = Array.from(
  new Set(pricing.routes.flatMap((route) => [route.from, route.to]))
);
type PassengerType = "adult" | "child" | "animal";
type VehicleType = "car" | "camper" | "motorcycle" | "bicycle";
type TripType = "roundtrip" | "oneway";

type FormSession = {
  from: string;
  to: string;
  date: string;
  returnDate: string;
  tripType: TripType;
  passengers: Record<PassengerType, number>;
  vehicles: Record<VehicleType, number>;
};

const DEFAULT_PASSENGERS: Record<PassengerType, number> = {
  adult: 1,
  child: 0,
  animal: 0,
};
const DEFAULT_VEHICLES: Record<VehicleType, number> = {
  car: 0,
  camper: 0,
  motorcycle: 0,
  bicycle: 0,
};

export default function SearchForm() {
  const router = useRouter();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [from, setFrom] = useState("Bergen");
  const [to, setTo] = useState("Stavanger");
  const [date, setDate] = useState(tomorrow);
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState<TripType>("roundtrip");
  const [passengers, setPassengers] = useState(() => ({ ...DEFAULT_PASSENGERS }));
  const [vehicles, setVehicles] = useState(() => ({ ...DEFAULT_VEHICLES }));
  const [isSessionReady, setIsSessionReady] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) {
      setIsSessionReady(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<FormSession>;
      setFrom(parsed.from ?? "Bergen");
      setTo(parsed.to ?? "Stavanger");
      setDate(parsed.date ?? tomorrow);
      setReturnDate(parsed.returnDate ?? "");
      setTripType(parsed.tripType === "oneway" ? "oneway" : "roundtrip");
      setPassengers({
        adult: Math.max(0, parsed.passengers?.adult ?? DEFAULT_PASSENGERS.adult),
        child: Math.max(0, parsed.passengers?.child ?? DEFAULT_PASSENGERS.child),
        animal: Math.max(0, parsed.passengers?.animal ?? DEFAULT_PASSENGERS.animal),
      });
      setVehicles({
        car: Math.max(0, parsed.vehicles?.car ?? DEFAULT_VEHICLES.car),
        camper: Math.max(0, parsed.vehicles?.camper ?? DEFAULT_VEHICLES.camper),
        motorcycle: Math.max(
          0,
          parsed.vehicles?.motorcycle ?? DEFAULT_VEHICLES.motorcycle
        ),
        bicycle: Math.max(0, parsed.vehicles?.bicycle ?? DEFAULT_VEHICLES.bicycle),
      });
    } catch {
      sessionStorage.removeItem(FORM_STORAGE_KEY);
    } finally {
      setIsSessionReady(true);
    }
  }, [tomorrow]);

  useEffect(() => {
    if (!isSessionReady) return;
    const data: FormSession = {
      from,
      to,
      date,
      returnDate,
      tripType,
      passengers,
      vehicles,
    };
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
  }, [
    from,
    to,
    date,
    returnDate,
    tripType,
    passengers,
    vehicles,
    isSessionReady,
  ]);

  function updatePassengerCount(type: PassengerType, delta: number) {
    setPassengers((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  }

  function updateVehicleCount(vehicle: VehicleType, delta: number) {
    setVehicles((prev) => ({
      ...prev,
      [vehicle]: Math.max(0, prev[vehicle] + delta),
    }));
  }

  const samePorts = from === to;
  const missingDepartureDate = !date;
  const today = new Date().toISOString().slice(0, 10);
  const departureInPast = Boolean(date) && date < today;
  const missingReturnDate = tripType === "roundtrip" && !returnDate;
  const invalidDateOrder =
    tripType === "roundtrip" && Boolean(date) && Boolean(returnDate) && returnDate < date;
  const totalPassengers =
    passengers.adult + passengers.child + passengers.animal;
  const peopleWithoutAnimals = passengers.adult + passengers.child;
  const motorVehicles = vehicles.car + vehicles.camper + vehicles.motorcycle;
  const totalVehicles = motorVehicles + vehicles.bicycle;
  const requiresGroupBooking = totalPassengers > 10;
  const tooManyMotorVehiclesForAdults = motorVehicles > passengers.adult;
  const tooManyBicyclesForPeople = vehicles.bicycle > peopleWithoutAnimals;
  const hasAtLeastOnePaidItem = totalPassengers + totalVehicles > 0;
  const missingAdultCompanion =
    passengers.adult < 1 && (passengers.child > 0 || passengers.animal > 0);
  const missingAdultForVehicle =
    passengers.adult < 1 && motorVehicles > 0;
  const validationMessage = samePorts
    ? "Velg to ulike steder for Fra og Til."
    : missingDepartureDate
      ? "Velg utreisedato for å fortsette."
      : departureInPast
        ? "Utreisedato kan ikke være i fortiden."
      : missingReturnDate
        ? "Velg returdato for tur/retur."
        : invalidDateOrder
          ? "Returdato kan ikke være før utreisedato."
          : !hasAtLeastOnePaidItem
            ? "Velg minst ett reisende- eller kjøretøyvalg."
          : missingAdultCompanion
            ? "Barn og dyr kan ikke reise alene. Legg til minst 1 voksen."
            : missingAdultForVehicle
              ? "Kjøretøy krever minst 1 voksen reisende."
          : requiresGroupBooking
            ? "Ved mer enn 10 reisende, kontakt salgsavdelingen for gruppebestilling."
            : tooManyMotorVehiclesForAdults
              ? "Bil, bobil og MC kan ikke være flere enn antall voksne."
              : tooManyBicyclesForPeople
                ? "Antall sykler kan ikke være høyere enn antall personer (voksne + barn)."
      : "";
  const canSubmit =
    !samePorts &&
    !missingDepartureDate &&
    !departureInPast &&
    !missingReturnDate &&
    !invalidDateOrder &&
    hasAtLeastOnePaidItem &&
    !requiresGroupBooking &&
    !tooManyMotorVehiclesForAdults &&
    !tooManyBicyclesForPeople &&
    !missingAdultCompanion &&
    !missingAdultForVehicle;

  const handleSearch = () => {
    if (!canSubmit) return;
    const params = new URLSearchParams({
      from,
      to,
      date,
      tripType,
      adult: String(passengers.adult),
      child: String(passengers.child),
      animal: String(passengers.animal),
      car: String(vehicles.car),
      camper: String(vehicles.camper),
      motorcycle: String(vehicles.motorcycle),
      bicycle: String(vehicles.bicycle),
    });
    if (tripType === "roundtrip") {
      params.set("returnDate", returnDate);
    }

    sessionStorage.removeItem(SELECTED_DEPARTURE_KEY);
    sessionStorage.removeItem(SELECTED_RETURN_DEPARTURE_KEY);
    router.push(`/results?${params.toString()}`);
  };

  const handleReset = () => {
    setFrom("Bergen");
    setTo("Stavanger");
    setDate(tomorrow);
    setReturnDate("");
    setTripType("roundtrip");
    setPassengers({ ...DEFAULT_PASSENGERS });
    setVehicles({ ...DEFAULT_VEHICLES });
    sessionStorage.removeItem(FORM_STORAGE_KEY);
    sessionStorage.removeItem(SELECTED_DEPARTURE_KEY);
    sessionStorage.removeItem(SELECTED_RETURN_DEPARTURE_KEY);
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
          onClick={() => {
            setTripType("oneway");
            setReturnDate("");
          }}
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
            <label className="text-sm font-semibold text-prussian_blue/70">
              Fra
            </label>
            <span className="inline-flex md:hidden">
              <ResetFormButton onClick={handleReset} />
            </span>
          </div>
          <RouteDropdown value={from} onChange={setFrom} options={PORT_OPTIONS} />
        </div>

        <div className="border-b border-prussian_blue/10 bg-white/70 p-4">
          <div className="mb-2 flex min-h-10 flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-semibold text-prussian_blue/70">
              Til
            </label>
            <span className="hidden md:inline-flex">
              <ResetFormButton onClick={handleReset} />
            </span>
          </div>
          <RouteDropdown value={to} onChange={setTo} options={PORT_OPTIONS} />
        </div>

        <div className="border-b border-r border-prussian_blue/10 bg-white/70 p-4">
          <label className="mb-2 block text-sm font-semibold text-prussian_blue/70">
            Utreise
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
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
            min={date || undefined}
            className="w-full rounded-lg border border-prussian_blue/25 bg-white px-3 py-2.5 text-base font-semibold text-ink_black focus:outline-none focus:ring-2 focus:ring-prussian_blue/40 disabled:opacity-50"
          />
        </div>

        <div className="border-r border-prussian_blue/10 bg-white/70 p-4">
          <label className="mb-2 block text-sm font-semibold text-prussian_blue/70">
            Reisende
          </label>
          <div className="space-y-2 rounded-lg border border-prussian_blue/20 bg-white p-3">
            {(
              [
                { key: "adult", label: "Voksen" },
                { key: "child", label: "Barn (0-12 år)" },
                { key: "animal", label: "Dyr" },
              ] as { key: PassengerType; label: string }[]
            ).map((item) => (
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
                    onClick={() => updatePassengerCount(item.key, -1)}
                    className="h-9 w-9 rounded-full border border-prussian_blue/25 text-lg text-prussian_blue transition hover:bg-school_bus_yellow/45 hover:text-ink_black active:bg-regal_navy/85 active:text-school_bus_yellow"
                  >
                    -
                  </button>
                  <div className="w-12 rounded-md border border-prussian_blue/25 py-1 text-center text-base font-semibold text-ink_black">
                    {passengers[item.key]}
                  </div>
                  <button
                    type="button"
                    onClick={() => updatePassengerCount(item.key, 1)}
                    className="h-9 w-9 rounded-full border border-prussian_blue/25 text-lg text-prussian_blue transition hover:bg-school_bus_yellow/45 hover:text-ink_black active:bg-regal_navy/85 active:text-school_bus_yellow"
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
            {(
              [
                { key: "car", label: "Personbil" },
                { key: "camper", label: "Bobil" },
                { key: "motorcycle", label: "MC" },
                { key: "bicycle", label: "Sykkel" },
              ] as { key: VehicleType; label: string }[]
            ).map((item) => (
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
                    onClick={() => updateVehicleCount(item.key, -1)}
                    className="h-9 w-9 rounded-full border border-prussian_blue/25 text-lg text-prussian_blue transition hover:bg-school_bus_yellow/45 hover:text-ink_black active:bg-regal_navy/85 active:text-school_bus_yellow"
                  >
                    -
                  </button>
                  <div className="w-12 rounded-md border border-prussian_blue/25 py-1 text-center text-base font-semibold text-ink_black">
                    {vehicles[item.key]}
                  </div>
                  <button
                    type="button"
                    onClick={() => updateVehicleCount(item.key, 1)}
                    className="h-9 w-9 rounded-full border border-prussian_blue/25 text-lg text-prussian_blue transition hover:bg-school_bus_yellow/45 hover:text-ink_black active:bg-regal_navy/85 active:text-school_bus_yellow"
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