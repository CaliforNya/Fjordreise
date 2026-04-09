import departuresData from "@/data/departures.json";
import pricing from "@/data/pricing.json";

type SummaryData = {
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

type DepartureRow = {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  durationMinutes: number;
  baseFare: number;
};

function toCount(value: string): number {
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? 0 : Math.max(0, n);
}

function formatNok(value: number): string {
  return `${new Intl.NumberFormat("nb-NO").format(value)} NOK`;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) return `${m} min`;
  if (m === 0) return `${h} t`;
  return `${h} t ${m} min`;
}

export default function Summary({ data }: { data: SummaryData }) {
  const isRoundTrip = data.tripType === "roundtrip";

  const route = pricing.routes.find(
    (item) => item.from === data.from && item.to === data.to
  );

  const selectedDeparture =
    data.departureId &&
    (departuresData.departures as DepartureRow[]).find(
      (d) =>
        d.id === data.departureId &&
        d.from === data.from &&
        d.to === data.to
    );

  const selectedReturnDeparture =
    isRoundTrip &&
    data.returnDepartureId &&
    (departuresData.departures as DepartureRow[]).find(
      (d) =>
        d.id === data.returnDepartureId &&
        d.from === data.to &&
        d.to === data.from
    );

  const adult = toCount(data.adult);
  const child = toCount(data.child);
  const animal = toCount(data.animal);

  const car = toCount(data.car);
  const camper = toCount(data.camper);
  const motorcycle = toCount(data.motorcycle);
  const bicycle = toCount(data.bicycle);

  const passengersTotal = adult + child + animal;
  const tripMultiplier = data.tripType === "roundtrip" ? 2 : 1;

  const baseFare = (() => {
    if (isRoundTrip) {
      if (selectedDeparture && selectedReturnDeparture) {
        return selectedDeparture.baseFare + selectedReturnDeparture.baseFare;
      }
      if (selectedDeparture) {
        return selectedDeparture.baseFare * 2;
      }
      return route ? route.basePrice * tripMultiplier : 0;
    }
    if (selectedDeparture) {
      return selectedDeparture.baseFare;
    }
    return route ? route.basePrice : 0;
  })();
  const passengersPrice = route
    ? (adult * route.passengers.adult +
        child * route.passengers.child +
        animal * route.passengers.animal) *
      tripMultiplier
    : 0;
  const vehiclesPrice = route
    ? (car * route.vehicles.car +
        camper * route.vehicles.camper +
        motorcycle * route.vehicles.motorcycle +
        bicycle * route.vehicles.bicycle) *
      tripMultiplier
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
        {
          label: "Voksne",
          count: adult,
          price: adult * route.passengers.adult * tripMultiplier,
        },
        {
          label: "Barn",
          count: child,
          price: child * route.passengers.child * tripMultiplier,
        },
        {
          label: "Dyr",
          count: animal,
          price: animal * route.passengers.animal * tripMultiplier,
        },
      ].filter((item) => item.count > 0)
    : [];
  const vehiclePriceDetails = route
    ? [
        {
          label: "Personbil",
          count: car,
          price: car * route.vehicles.car * tripMultiplier,
        },
        {
          label: "Bobil",
          count: camper,
          price: camper * route.vehicles.camper * tripMultiplier,
        },
        {
          label: "MC",
          count: motorcycle,
          price: motorcycle * route.vehicles.motorcycle * tripMultiplier,
        },
        {
          label: "Sykkel",
          count: bicycle,
          price: bicycle * route.vehicles.bicycle * tripMultiplier,
        },
      ].filter((item) => item.count > 0)
    : [];

  return (
    <section className="rounded-2xl border border-school_bus_yellow/50 bg-white p-6 shadow-sm">
      <h2 className="mb-4 border-b-2 border-school_bus_yellow/70 pb-2 text-2xl text-prussian_blue">
        Oppsummering
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-school_bus_yellow/35 bg-[#f7fbff] p-4">
          <h3 className="border-b border-school_bus_yellow/60 pb-2 text-lg font-semibold text-prussian_blue">
            Turdetaljer
          </h3>
          <p className="text-prussian_blue/80">
            Rute:{" "}
            <span className="font-bold text-prussian_blue">
              {data.from} – {data.to}
            </span>
          </p>
          <p className="text-prussian_blue/80">
            Turtype:{" "}
            <span className="font-bold text-prussian_blue">
              {data.tripType === "oneway" ? "En vei" : "Tur/retur"}
            </span>
          </p>
          {selectedDeparture ? (
            <>
              <p className="font-bold text-prussian_blue">Utreise</p>
              <p className="text-prussian_blue/80">
                Avgang: kl.{" "}
                <span className="font-bold text-prussian_blue">
                  {selectedDeparture.departureTime}
                </span>
              </p>
              <p className="text-prussian_blue/80">
                Varighet:{" "}
                <span className="font-bold text-prussian_blue">
                  {formatDuration(selectedDeparture.durationMinutes)}
                </span>
              </p>
              <p className="text-sm font-bold text-school_bus_yellow">
                Grunnpris ut: {formatNok(selectedDeparture.baseFare)}
              </p>
            </>
          ) : data.departureId ? (
            <p className="text-sm font-semibold text-red-600">
              Ugyldig utreise. Gå til resultater og velg på nytt.
            </p>
          ) : (
            <p className="text-sm text-prussian_blue/65">
              Ingen utreise valgt — grunnpris fra rute i prislisten.
            </p>
          )}
          {isRoundTrip ? (
            selectedReturnDeparture ? (
              <>
                <p className="mt-2 font-bold text-prussian_blue">Retur</p>
                <p className="text-prussian_blue/80">
                  Avgang: kl.{" "}
                  <span className="font-bold text-prussian_blue">
                    {selectedReturnDeparture.departureTime}
                  </span>
                </p>
                <p className="text-prussian_blue/80">
                  Varighet:{" "}
                  <span className="font-bold text-prussian_blue">
                    {formatDuration(selectedReturnDeparture.durationMinutes)}
                  </span>
                </p>
                <p className="text-sm font-bold text-school_bus_yellow">
                  Grunnpris retur: {formatNok(selectedReturnDeparture.baseFare)}
                </p>
              </>
            ) : data.returnDepartureId ? (
              <p className="text-sm font-semibold text-red-600">
                Ugyldig returavgang. Gå til resultater og velg retur på nytt.
              </p>
            ) : selectedDeparture ? (
              <p className="mt-2 text-sm text-prussian_blue/70">
                Ingen returavgang valgt — grunnpris er foreløpig 2× utreise til
                du fullfører valg på resultatsiden.
              </p>
            ) : null
          ) : null}
          <p className="text-prussian_blue/80">
            Utreise:{" "}
            <span className="font-bold text-prussian_blue">
              {data.date || "–"}
            </span>
          </p>
          <p className="text-prussian_blue/80">
            Retur:{" "}
            <span className="font-bold text-prussian_blue">
              {data.tripType === "oneway" ? "–" : data.returnDate || "–"}
            </span>
          </p>
          <p className="text-prussian_blue/80">
            Reisende:{" "}
            <span className="font-bold text-prussian_blue">
              {passengersTotal}
            </span>
          </p>
          <p className="text-prussian_blue/80">
            Valgte reisende:{" "}
            <span className="font-bold text-prussian_blue">
              {passengerDetails.length > 0
                ? passengerDetails
                    .map((item) => `${item.label} (${item.count})`)
                    .join(", ")
                : "Ingen"}
            </span>
          </p>
          <p className="text-prussian_blue/80">
            Kjøretøy:{" "}
            <span className="font-bold text-prussian_blue">
              {car + camper + motorcycle + bicycle}
            </span>
          </p>
          <p className="text-prussian_blue/80">
            Valgte kjøretøy:{" "}
            <span className="font-bold text-prussian_blue">
              {vehicleDetails.length > 0
                ? vehicleDetails
                    .map((item) => `${item.label} (${item.count})`)
                    .join(", ")
                : "Ingen"}
            </span>
          </p>
          {!route && (
            <p className="font-semibold text-red-600">
              Fant ingen pris for valgt rute i pricing.json
            </p>
          )}
        </div>

        <div className="rounded-xl border border-school_bus_yellow/35 bg-[#f7fbff] p-4">
          <h3 className="mb-3 border-b border-school_bus_yellow/60 pb-2 text-lg font-semibold text-prussian_blue">
            Pris
          </h3>
          <div className="space-y-3 text-prussian_blue">
            <div className="flex items-center justify-between font-medium">
              <span>
                Grunnpris
                {selectedDeparture && selectedReturnDeparture && isRoundTrip
                  ? " (ut + retur)"
                  : selectedDeparture
                    ? isRoundTrip
                      ? " (utreise ×2 uten valgt retur)"
                      : " (valgt avgang)"
                    : ""}
              </span>
              <span className="font-bold text-prussian_blue">
                {formatNok(baseFare)}
              </span>
            </div>

            <div className="p-1">
              <div className="mb-2 font-medium text-prussian_blue">Reisende</div>
              {passengerPriceDetails.length > 0 ? (
                <div className="space-y-1 pl-2 text-sm font-semibold text-school_bus_yellow">
                  {passengerPriceDetails.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <span>
                        {item.label} x {item.count}
                      </span>
                      <span className="font-bold">{formatNok(item.price)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="pl-2 text-sm text-prussian_blue/60">Ingen valgt</p>
              )}
              <div className="mt-2 border-t border-school_bus_yellow/50 pt-2">
                <div className="flex items-center justify-between text-prussian_blue">
                  <span className="font-medium">Sum reisende</span>
                  <span className="font-bold">{formatNok(passengersPrice)}</span>
                </div>
              </div>
            </div>

            <div className="p-1">
              <div className="mb-2 font-medium text-prussian_blue">Kjøretøy</div>
              {vehiclePriceDetails.length > 0 ? (
                <div className="space-y-1 pl-2 text-sm font-semibold text-school_bus_yellow">
                  {vehiclePriceDetails.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <span>
                        {item.label} x {item.count}
                      </span>
                      <span className="font-bold">{formatNok(item.price)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="pl-2 text-sm text-prussian_blue/60">Ingen valgt</p>
              )}
              <div className="mt-2 border-t border-school_bus_yellow/50 pt-2">
                <div className="flex items-center justify-between text-prussian_blue">
                  <span className="font-medium">Sum kjøretøy</span>
                  <span className="font-bold">{formatNok(vehiclesPrice)}</span>
                </div>
              </div>
            </div>

            <div className="mt-2 rounded-lg border-2 border-school_bus_yellow/70 bg-[#f7fbff] px-4 py-3">
              <div className="flex items-center justify-between text-lg text-prussian_blue">
                <span className="font-bold">Totalt</span>
                <span className="font-bold text-regal_navy">
                  {formatNok(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
