import Summary from "@/components/Summary";

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

export default function SummaryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const summaryData = {
    from: getParam(searchParams, "from", "Bergen"),
    to: getParam(searchParams, "to", "Stavanger"),
    date: getParam(searchParams, "date"),
    returnDate: getParam(searchParams, "returnDate"),
    tripType: getParam(searchParams, "tripType", "roundtrip"),
    adult: getParam(searchParams, "adult", "1"),
    child: getParam(searchParams, "child", "0"),
    animal: getParam(searchParams, "animal", "0"),
    car: getParam(searchParams, "car", "0"),
    camper: getParam(searchParams, "camper", "0"),
    motorcycle: getParam(searchParams, "motorcycle", "0"),
    bicycle: getParam(searchParams, "bicycle", "0"),
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
          <h1 className="text-prussian_blue">Opsummering av turen</h1>
          <Summary data={summaryData} />
        </div>
      </main>
    </>
  );
}
