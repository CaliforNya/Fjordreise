import { getToday } from "@/utils/formatters";

export type PassengerType = "adult" | "child" | "animal";
export type VehicleType = "car" | "camper" | "motorcycle" | "bicycle";
export type TripType = "roundtrip" | "oneway";

export type SearchFormValues = {
  from: string;
  to: string;
  date: string;
  returnDate: string;
  tripType: TripType;
  passengers: Record<PassengerType, number>;
  vehicles: Record<VehicleType, number>;
};

export function validateSearchForm(values: SearchFormValues): string {
  const { from, to, date, returnDate, tripType, passengers, vehicles } = values;

  const today = getToday();
  const motorVehicles = vehicles.car + vehicles.camper + vehicles.motorcycle;
  const totalVehicles = motorVehicles + vehicles.bicycle;
  const totalPassengers = passengers.adult + passengers.child + passengers.animal;
  const peopleWithoutAnimals = passengers.adult + passengers.child;

  if (from === to) return "Velg to ulike steder for Fra og Til.";
  if (!date) return "Velg utreisedato for å fortsette.";
  if (date < today) return "Utreisedato kan ikke være i fortiden.";
  if (tripType === "roundtrip" && !returnDate) return "Velg returdato for tur/retur.";
  if (tripType === "roundtrip" && returnDate && returnDate < date)
    return "Returdato kan ikke være før utreisedato.";
  if (totalPassengers + totalVehicles === 0)
    return "Velg minst ett reisende- eller kjøretøyvalg.";
  if (passengers.adult < 1 && (passengers.child > 0 || passengers.animal > 0))
    return "Barn og dyr kan ikke reise alene. Legg til minst 1 voksen.";
  if (passengers.adult < 1 && motorVehicles > 0)
    return "Kjøretøy krever minst 1 voksen reisende.";
  if (totalPassengers > 10)
    return "Ved mer enn 10 reisende, kontakt salgsavdelingen for gruppebestilling.";
  if (motorVehicles > passengers.adult)
    return "Bil, bobil og MC kan ikke være flere enn antall voksne.";
  if (vehicles.bicycle > peopleWithoutAnimals)
    return "Antall sykler kan ikke være høyere enn antall personer (voksne + barn).";

  return "";
}
