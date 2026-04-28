import departuresData from "@/data/departures.json";
import pricing from "@/data/pricing.json";
import type { DepartureRow } from "@/types/departures";

export type SummaryData = {
  from: string;
  to: string;
  date: string;
  returnDate: string;
  tripType: string;
  departureId: string;
  returnDepartureId: string;
  adult: string;
  child: string;
  animal: string;
  car: string;
  camper: string;
  motorcycle: string;
  bicycle: string;
};

function toCount(value: string): number {
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? 0 : Math.max(0, n);
}

export function useSummaryPricing(data: SummaryData) {
  const isRoundTrip = data.tripType === "roundtrip";
  const tripMultiplier = isRoundTrip ? 2 : 1;

  const route = pricing.routes.find(
    (item) => item.from === data.from && item.to === data.to
  );

  const selectedDeparture =
    data.departureId &&
    (departuresData.departures as DepartureRow[]).find(
      (d) => d.id === data.departureId && d.from === data.from && d.to === data.to
    );

  const selectedReturnDeparture =
    isRoundTrip &&
    data.returnDepartureId &&
    (departuresData.departures as DepartureRow[]).find(
      (d) => d.id === data.returnDepartureId && d.from === data.to && d.to === data.from
    );

  const adult = toCount(data.adult);
  const child = toCount(data.child);
  const animal = toCount(data.animal);
  const car = toCount(data.car);
  const camper = toCount(data.camper);
  const motorcycle = toCount(data.motorcycle);
  const bicycle = toCount(data.bicycle);

  const passengersTotal = adult + child + animal;

  const baseFare = (() => {
    if (isRoundTrip) {
      if (selectedDeparture && selectedReturnDeparture)
        return selectedDeparture.baseFare + selectedReturnDeparture.baseFare;
      if (selectedDeparture) return selectedDeparture.baseFare * 2;
      return route ? route.basePrice * tripMultiplier : 0;
    }
    if (selectedDeparture) return selectedDeparture.baseFare;
    return route ? route.basePrice : 0;
  })();

  const passengersPrice = route
    ? (adult * route.passengers.adult +
        child * route.passengers.child +
        animal * route.passengers.animal) * tripMultiplier
    : 0;

  const vehiclesPrice = route
    ? (car * route.vehicles.car +
        camper * route.vehicles.camper +
        motorcycle * route.vehicles.motorcycle +
        bicycle * route.vehicles.bicycle) * tripMultiplier
    : 0;

  const totalPrice = baseFare + passengersPrice + vehiclesPrice;

  const passengerDetails = [
    { label: "Voksne", count: adult },
    { label: "Barn", count: child },
    { label: "Dyr", count: animal },
  ].filter((item) => item.count > 0);

  const vehicleDetails = [
    { label: "Personbil", count: car },
    { label: "Bobil", count: camper },
    { label: "MC", count: motorcycle },
    { label: "Sykkel", count: bicycle },
  ].filter((item) => item.count > 0);

  const passengerPriceDetails = route
    ? [
        { label: "Voksne", count: adult, price: adult * route.passengers.adult * tripMultiplier },
        { label: "Barn", count: child, price: child * route.passengers.child * tripMultiplier },
        { label: "Dyr", count: animal, price: animal * route.passengers.animal * tripMultiplier },
      ].filter((item) => item.count > 0)
    : [];

  const vehiclePriceDetails = route
    ? [
        { label: "Personbil", count: car, price: car * route.vehicles.car * tripMultiplier },
        { label: "Bobil", count: camper, price: camper * route.vehicles.camper * tripMultiplier },
        { label: "MC", count: motorcycle, price: motorcycle * route.vehicles.motorcycle * tripMultiplier },
        { label: "Sykkel", count: bicycle, price: bicycle * route.vehicles.bicycle * tripMultiplier },
      ].filter((item) => item.count > 0)
    : [];

  const vehiclesTotal = car + camper + motorcycle + bicycle;

  return {
    isRoundTrip,
    route,
    selectedDeparture,
    selectedReturnDeparture,
    passengersTotal,
    vehiclesTotal,
    baseFare,
    passengersPrice,
    vehiclesPrice,
    totalPrice,
    passengerDetails,
    vehicleDetails,
    passengerPriceDetails,
    vehiclePriceDetails,
  };
}
