export function getFixedTimestamp(value: number): number {
  let parsedValue = String(value)

  for (let i = parsedValue.length; i < 13; i++) {
    parsedValue = parsedValue + '0'
  }

  return Number(parsedValue)
}
