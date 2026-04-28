export type DepartureRow = {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  durationMinutes: number;
  baseFare: number;
  tag?: string;
};

export type Departure = DepartureRow & {
  date: string | null;
};
