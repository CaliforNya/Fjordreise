"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  validateSearchForm,
  type PassengerType,
  type VehicleType,
  type TripType,
} from "@/utils/searchFormValidation";
import {
  FORM_STORAGE_KEY,
  SELECTED_DEPARTURE_KEY,
  SELECTED_RETURN_DEPARTURE_KEY,
} from "@/constants/storage";
import { getToday, getTomorrow } from "@/utils/formatters";

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

export function useSearchForm() {
  const router = useRouter();
  const tomorrow = getTomorrow();

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
        motorcycle: Math.max(0, parsed.vehicles?.motorcycle ?? DEFAULT_VEHICLES.motorcycle),
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
    const data: FormSession = { from, to, date, returnDate, tripType, passengers, vehicles };
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
  }, [from, to, date, returnDate, tripType, passengers, vehicles, isSessionReady]);

  function updatePassengerCount(type: PassengerType, delta: number) {
    setPassengers((prev) => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));
  }

  function updateVehicleCount(vehicle: VehicleType, delta: number) {
    setVehicles((prev) => ({ ...prev, [vehicle]: Math.max(0, prev[vehicle] + delta) }));
  }

  const today = getToday();
  const validationMessage = validateSearchForm({ from, to, date, returnDate, tripType, passengers, vehicles });
  const canSubmit = validationMessage === "";

  function handleSearch() {
    if (!canSubmit) return;
    const params = new URLSearchParams({
      from, to, date, tripType,
      adult: String(passengers.adult),
      child: String(passengers.child),
      animal: String(passengers.animal),
      car: String(vehicles.car),
      camper: String(vehicles.camper),
      motorcycle: String(vehicles.motorcycle),
      bicycle: String(vehicles.bicycle),
    });
    if (tripType === "roundtrip") params.set("returnDate", returnDate);
    sessionStorage.removeItem(SELECTED_DEPARTURE_KEY);
    sessionStorage.removeItem(SELECTED_RETURN_DEPARTURE_KEY);
    router.push(`/results?${params.toString()}`);
  }

  function handleReset() {
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
  }

  return {
    from, setFrom,
    to, setTo,
    date, setDate,
    returnDate, setReturnDate,
    tripType, setTripType,
    passengers,
    vehicles,
    today,
    validationMessage,
    canSubmit,
    updatePassengerCount,
    updateVehicleCount,
    handleSearch,
    handleReset,
  };
}
