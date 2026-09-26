const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']

/** Format large numbers compactly (e.g. 1_234_567 -> "1.23M"). */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '∞'
  if (value < 1000) {
    return value < 10 && !Number.isInteger(value) ? value.toFixed(1) : Math.floor(value).toString()
  }
  const tier = Math.min(SUFFIXES.length - 1, Math.floor(Math.log10(value) / 3))
  const scaled = value / Math.pow(10, tier * 3)
  return `${scaled.toFixed(2)}${SUFFIXES[tier]}`
}

/** Format a per-second rate. */
export function formatRate(value: number): string {
  return `${formatNumber(value)}/s`
}
