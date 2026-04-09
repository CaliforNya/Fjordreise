import Summary from "@/components/Summary";
import BackToHomeButton from "@/components/buttons/BackToHomeButton";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(
  searchParams: SearchParams,
  key: string,
  fallback = ""
): string {
  const value = searchParams[key];
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export default async function SummaryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  const summaryData = {
    from: getParam(resolvedSearchParams, "from", "Bergen"),
    to: getParam(resolvedSearchParams, "to", "Stavanger"),
    date: getParam(resolvedSearchParams, "date"),
    returnDate: getParam(resolvedSearchParams, "returnDate"),
    tripType: getParam(resolvedSearchParams, "tripType", "roundtrip"),
    departureId: getParam(resolvedSearchParams, "departureId"),
    returnDepartureId: getParam(resolvedSearchParams, "returnDepartureId"),
    adult: getParam(resolvedSearchParams, "adult", "1"),
    child: getParam(resolvedSearchParams, "child", "0"),
    animal: getParam(resolvedSearchParams, "animal", "0"),
    car: getParam(resolvedSearchParams, "car", "0"),
    camper: getParam(resolvedSearchParams, "camper", "0"),
    motorcycle: getParam(resolvedSearchParams, "motorcycle", "0"),
    bicycle: getParam(resolvedSearchParams, "bicycle", "0"),
  };

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-white/50"
      />
      <main className="w-full !max-w-none !px-0">
        <div className="content-wrapper page-stack pt-6">
          <h1 className="text-prussian_blue">Oppsummering av turen</h1>
          <Summary data={summaryData} />
          <BackToHomeButton />
        </div>
      </main>
    </>
  );
}
