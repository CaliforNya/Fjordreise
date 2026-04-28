export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getTomorrow(): string {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function formatNok(value: number): string {
  return `${new Intl.NumberFormat("nb-NO").format(value)} NOK`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) return `${m} min`;
  if (m === 0) return `${h} t`;
  return `${h} t ${m} min`;
}
