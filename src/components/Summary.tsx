import pricing from "@/data/pricing.json";

type SummaryData = {
  from: string;
  to: string;
  date: string;
  returnDate: string;
  tripType: string;
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

function formatNok(value: number): string {
  return `${new Intl.NumberFormat("nb-NO").format(value)} NOK`;
}

export default function Summary({ data }: { data: SummaryData }) {
  const route = pricing.routes.find(
    (item) => item.from === data.from && item.to === data.to
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

  const baseFare = route ? route.basePrice * tripMultiplier : 0;
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

  return (
    <section className="rounded-2xl border border-school_bus_yellow/50 bg-white p-6 shadow-sm">
      <h2 className="mb-4 border-b-2 border-school_bus_yellow/70 pb-2 text-2xl text-prussian_blue">
        Booking Summary
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-school_bus_yellow/35 bg-[#f7fbff] p-4">
          <h3 className="border-b border-school_bus_yellow/60 pb-2 text-lg font-semibold text-prussian_blue">
            Trip details
          </h3>
          <p className="text-prussian_blue/80">
            Route: {data.from} - {data.to}
          </p>
          <p className="text-prussian_blue/80">
            Trip type: {data.tripType === "oneway" ? "One way" : "Round trip"}
          </p>
          <p className="text-prussian_blue/80">Departure: {data.date || "-"}</p>
          <p className="text-prussian_blue/80">
            Return: {data.tripType === "oneway" ? "-" : data.returnDate || "-"}
          </p>
          <p className="text-prussian_blue/80">Passengers: {passengersTotal}</p>
          <p className="text-prussian_blue/80">
            Vehicles: {car + camper + motorcycle + bicycle}
          </p>
          {!route && (
            <p className="font-semibold text-red-600">
              Route pricing not found in pricing.json
            </p>
          )}
        </div>

        <div className="rounded-xl border border-school_bus_yellow/35 bg-[#f7fbff] p-4">
          <h3 className="mb-3 border-b border-school_bus_yellow/60 pb-2 text-lg font-semibold text-prussian_blue">
            Price
          </h3>
          <div className="space-y-2 text-prussian_blue/80">
            <div className="flex items-center justify-between">
              <span>Base fare</span>
              <span>{formatNok(baseFare)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Passengers</span>
              <span>{formatNok(passengersPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Vehicles</span>
              <span>{formatNok(vehiclesPrice)}</span>
            </div>
            <div className="my-2 border-t border-school_bus_yellow/70" />
            <div className="flex items-center justify-between text-lg font-semibold text-prussian_blue">
              <span>Total</span>
              <span>{formatNok(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
