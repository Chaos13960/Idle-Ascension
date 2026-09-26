const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']

/** Format a large number with short scale suffixes (e.g. 1.23M). */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '0'
  if (value < 1000) {
    return value % 1 === 0 ? value.toString() : value.toFixed(1)
  }
  const tier = Math.min(Math.floor(Math.log10(value) / 3), SUFFIXES.length - 1)
  const scaled = value / Math.pow(1000, tier)
  return `${scaled.toFixed(2)}${SUFFIXES[tier]}`
}
