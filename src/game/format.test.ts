import { describe, expect, it } from 'vitest'
import { formatNumber, formatRate } from './format'

describe('formatNumber', () => {
  it('formats small integers plainly', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(42)).toBe('42')
    expect(formatNumber(999)).toBe('999')
  })

  it('shows one decimal for small fractional values', () => {
    expect(formatNumber(3.14)).toBe('3.1')
  })

  it('applies compact suffixes for large values', () => {
    expect(formatNumber(1_500)).toBe('1.50K')
    expect(formatNumber(2_300_000)).toBe('2.30M')
    expect(formatNumber(7_800_000_000)).toBe('7.80B')
  })

  it('handles infinity gracefully', () => {
    expect(formatNumber(Infinity)).toBe('∞')
  })
})

describe('formatRate', () => {
  it('appends a per-second suffix', () => {
    expect(formatRate(1_500)).toBe('1.50K/s')
  })
})
