export function getFixedMilliseconds(value: number): number {
  const parsedValue = String(value)

  if (parsedValue.length === 10) {
    return Number(parsedValue + '000')
  }

  return value
}
