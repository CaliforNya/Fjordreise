import departuresData from "@/data/departures.json";
import { NextResponse } from "next/server";

type DepartureTemplate = {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  durationMinutes: number;
  baseFare: number;
  tag?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from")?.trim() ?? "";
  const to = searchParams.get("to")?.trim() ?? "";
  const date = searchParams.get("date")?.trim() ?? "";

  if (!from || !to) {
    return NextResponse.json(
      { error: "Mangler fra eller til", departures: [] },
      { status: 400 }
    );
  }

  const list = (departuresData.departures as DepartureTemplate[])
    .filter((d) => d.from === from && d.to === to)
    .map((d) => ({
      ...d,
      date: date || null,
    }));

  return NextResponse.json({ departures: list });
}
