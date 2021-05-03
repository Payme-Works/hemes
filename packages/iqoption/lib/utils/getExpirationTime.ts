import { set, addMinutes, format } from 'date-fns'

import { ExpirationPeriod } from '../types'

import { getExpirationPeriodTime } from './getExpirationPeriodTime'
import { getFixedTimestamp } from './getFixedTimestamp'

export function getExpirationTime(expirationPeriod: ExpirationPeriod): number {
  const now = Date.now()
  let expDate = set(now, { seconds: 0, milliseconds: 0 })

  if (addMinutes(expDate, 1).getTime() - Date.now() > 30) {
    expDate = addMinutes(expDate, 1)
  } else {
    expDate = addMinutes(expDate, 2)
  }

  const expirationTimes: string[] = []

  for (let i = 1; i <= 5; i++) {
    expirationTimes.push(String(expDate.getTime()).substring(0, 10))
    expDate = addMinutes(expDate, 1)
  }

  for (let i = 0; i < 50; i) {
    if (
      Number(format(expDate, 'mm')) % 15 === 0 &&
      expDate.getTime() - now > 60 * 5
    ) {
      expirationTimes.push(String(expDate.getTime()).substring(0, 10))
      i++
    }

    expDate = addMinutes(expDate, 1)
  }

  const remaining: number[] = []

  for (const time of expirationTimes) {
    remaining.push(Number(time) - Number(String(Date.now()).substring(0, 10)))
  }

  const close = remaining.map(item =>
    Math.abs(item - 60 * getExpirationPeriodTime(expirationPeriod, 'minutes'))
  )

  const minClose = Math.min(...close)
  const findMinCloseIndex = close.indexOf(minClose)

  const expirationTime = Number(expirationTimes[findMinCloseIndex])

  const fixedExpirationTimestamp = getFixedTimestamp(expirationTime)

  return fixedExpirationTimestamp
}
