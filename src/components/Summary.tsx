import { formatNok, formatDuration } from "@/utils/formatters";
import { useSummaryPricing, type SummaryData } from "@/hooks/useSummaryPricing";

function PriceGroup({
  label,
  items,
  sumLabel,
  total,
}: {
  label: string;
  items: { label: string; count: number; price: number }[];
  sumLabel: string;
  total: number;
}) {
  return (
    <div className="p-1">
      <div className="mb-2 font-medium text-prussian_blue">{label}</div>
      {items.length > 0 ? (
        <div className="space-y-1 pl-2 text-sm font-semibold text-school_bus_yellow">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span>{item.label} x {item.count}</span>
              <span className="font-bold">{formatNok(item.price)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="pl-2 text-sm text-prussian_blue/60">Ingen valgt</p>
      )}
      <div className="mt-2 border-t border-school_bus_yellow/50 pt-2">
        <div className="flex items-center justify-between text-prussian_blue">
          <span className="font-medium">{sumLabel}</span>
          <span className="font-bold">{formatNok(total)}</span>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-prussian_blue/80">
      {label}:{" "}
      <span className="font-bold text-prussian_blue">{value}</span>
    </p>
  );
}



export default function Summary({ data }: { data: SummaryData }) {
  const {
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
  } = useSummaryPricing(data);

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
          <DetailRow label="Rute" value={`${data.from} – ${data.to}`} />
          <DetailRow label="Turtype" value={data.tripType === "oneway" ? "En vei" : "Tur/retur"} />
          {selectedDeparture ? (
            <>
              <p className="font-bold text-prussian_blue">Utreise</p>
              <DetailRow label="Avgang" value={`kl. ${selectedDeparture.departureTime}`} />
              <DetailRow label="Varighet" value={formatDuration(selectedDeparture.durationMinutes)} />
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
                <DetailRow label="Avgang" value={`kl. ${selectedReturnDeparture.departureTime}`} />
                <DetailRow label="Varighet" value={formatDuration(selectedReturnDeparture.durationMinutes)} />
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
          {[
            { label: "Utreise", value: data.date || "–" },
            { label: "Retur", value: data.tripType === "oneway" ? "–" : data.returnDate || "–" },
            { label: "Reisende", value: String(passengersTotal) },
            {
              label: "Valgte reisende",
              value: passengerDetails.length > 0
                ? passengerDetails.map((item) => `${item.label} (${item.count})`).join(", ")
                : "Ingen",
            },
            { label: "Kjøretøy", value: String(vehiclesTotal) },
            {
              label: "Valgte kjøretøy",
              value: vehicleDetails.length > 0
                ? vehicleDetails.map((item) => `${item.label} (${item.count})`).join(", ")
                : "Ingen",
            },
          ].map(({ label, value }) => (
            <DetailRow key={label} label={label} value={value} />
          ))}
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

            {[
              { label: "Reisende", items: passengerPriceDetails, sumLabel: "Sum reisende", total: passengersPrice },
              { label: "Kjøretøy", items: vehiclePriceDetails, sumLabel: "Sum kjøretøy", total: vehiclesPrice },
            ].map(({ label, items, sumLabel, total }) => (
              <PriceGroup key={label} label={label} items={items} sumLabel={sumLabel} total={total} />
            ))}

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
