import { InstrumentType, PositionDirection } from '../types'

export type PositionResult = 'win' | 'loss' | 'equal'

interface Prices {
  open: number
  close: number
}

export function getCandleResult(
  instrumentType: InstrumentType,
  direction: PositionDirection,
  prices: Prices
): PositionResult {
  const { open, close } = prices

  if (close === open) {
    if (instrumentType === 'digital-option') {
      return 'loss'
    }

    return 'equal'
  }

  if (
    (direction === 'call' && close > open) ||
    (direction === 'put' && close < open)
  ) {
    return 'win'
  }

  return 'loss'
}
