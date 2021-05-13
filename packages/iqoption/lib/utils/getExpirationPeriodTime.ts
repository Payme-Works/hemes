import { ExpirationPeriod } from '../types'

type Time = 'seconds' | 'minutes' | 'hours'

type ExpirationPeriodsTime = {
  [keyIgnored in ExpirationPeriod]: number
}

const expirationPeriodsTimes: ExpirationPeriodsTime = {
  m1: 60,
  m5: 300,
  m15: 900,
  m30: 1800,
  h1: 3600,
}

export function getExpirationPeriodTime(
  expirationPeriod: ExpirationPeriod,
  time: Time = 'seconds'
): number {
  const seconds = expirationPeriodsTimes[expirationPeriod]

  if (time === 'minutes') {
    return seconds / 60
  } else if (time === 'hours') {
    return seconds / 3600
  }

  return seconds
}
