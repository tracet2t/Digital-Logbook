const formatDelta = (delta: number, suffix: string) => {
  if (delta === 0) return "No change";
  if (delta > 0) return `${delta} ${suffix}`;
  return `${Math.abs(delta)} fewer`;
};

const formatDeltaVs = (delta: number) => {
  if (delta === 0) return "No change vs yesterday";
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta} vs yesterday`;
};

const normalizeQuery = (value: string) => value.trim().toLowerCase();

const matchesQuery = (value: string, query: string) =>
  value.toLowerCase().includes(query);

export { formatDelta, formatDeltaVs, normalizeQuery, matchesQuery };
