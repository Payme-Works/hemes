import { set, addMinutes, format, add } from 'date-fns'

import { ExpirationPeriod } from '../types'

import { getExpirationPeriodTime } from './getExpirationPeriodTime'
import { getFixedTimestamp } from './getFixedTimestamp'

export function getExpirationDate(
  expirationPeriod: ExpirationPeriod,
  isDigital = false
): Date {
  const now = new Date()

  const expirationPeriodTime = getExpirationPeriodTime(
    expirationPeriod,
    'minutes'
  )

  if (expirationPeriod !== 'm1' && isDigital) {
    let expirationDate = add(now, {
      minutes: 1,
      seconds: 30,
    })

    while (
      expirationDate.getMinutes() % expirationPeriodTime !== 0 ||
      expirationDate.getTime() - Date.now() <= 30
    ) {
      expirationDate = addMinutes(expirationDate, 1)
    }

    return expirationDate
  }

  let expirationDate = set(now, { seconds: 0, milliseconds: 0 })

  if ((addMinutes(expirationDate, 1).getTime() - Date.now()) / 1000 > 30) {
    expirationDate = addMinutes(expirationDate, 1)
  } else {
    expirationDate = addMinutes(expirationDate, 2)
  }

  const expirationTimes: string[] = []

  for (let i = 1; i <= 5; i++) {
    expirationTimes.push(String(expirationDate.getTime()).substring(0, 10))
    expirationDate = addMinutes(expirationDate, 1)
  }

  for (let i = 0; i < 50; i) {
    if (
      Number(format(expirationDate, 'mm')) % 15 === 0 &&
      expirationDate.getTime() - now.getTime() > 60 * 5
    ) {
      expirationTimes.push(String(expirationDate.getTime()).substring(0, 10))
      i++
    }

    expirationDate = addMinutes(expirationDate, 1)
  }

  const remaining: number[] = []

  for (const time of expirationTimes) {
    remaining.push(Number(time) - Number(String(Date.now()).substring(0, 10)))
  }

  const close = remaining.map(item =>
    Math.abs(item - 60 * expirationPeriodTime)
  )

  const minClose = Math.min(...close)
  const findMinCloseIndex = close.indexOf(minClose)

  const expirationTime = Number(expirationTimes[findMinCloseIndex])

  const fixedExpirationTimestamp = getFixedTimestamp(expirationTime)

  return new Date(fixedExpirationTimestamp)
}
