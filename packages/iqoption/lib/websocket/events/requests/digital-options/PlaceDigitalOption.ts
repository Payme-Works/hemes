import { formatToTimeZone } from 'date-fns-timezone'

import {
  Active,
  DigitalOptionExpirationPeriod,
  PositionDirection,
} from '../../../../types'
import { getExpirationDate } from '../../../../utils/getExpirationDate'
import { getExpirationPeriodTime } from '../../../../utils/getExpirationPeriodTime'
import { Request } from '../../Request'

type AbbreviatedPositionDirection = {
  [direction in PositionDirection]: string
}

interface PlaceDigitalOptionRequestMessage {
  name: 'digital-options.place-digital-option'
  version: '1.0'
  body: {
    user_balance_id: number
    instrument_id: string
    amount: string
  }
}

interface PlaceDigitalOptionRequestArgs {
  user_balance_id: number
  active: Active
  direction: PositionDirection
  expiration_period: DigitalOptionExpirationPeriod
  price: number
}

const abbreviatedPositionDirection: AbbreviatedPositionDirection = {
  call: 'C',
  put: 'P',
}

function buildDigitalOptionIdentifier(
  active: Active,
  expirationPeriod: DigitalOptionExpirationPeriod,
  direction: PositionDirection
) {
  const expirationDate = getExpirationDate(expirationPeriod, true)

  const expirationPeriodTime = getExpirationPeriodTime(
    expirationPeriod,
    'minutes'
  )

  const expirationTimeFormatted = formatToTimeZone(
    expirationDate,
    'YYYYMMDDHHmm',
    {
      timeZone: 'UTC',
    }
  )

  const digitalOptionIdentifier =
    'do' +
    active +
    expirationTimeFormatted +
    'PT' +
    expirationPeriodTime +
    'M' +
    abbreviatedPositionDirection[direction] +
    'SPT'

  return digitalOptionIdentifier
}

export class PlaceDigitalOptionRequest extends Request<
  PlaceDigitalOptionRequestMessage,
  PlaceDigitalOptionRequestArgs
> {
  public get name(): string {
    return 'sendMessage'
  }

  public async build({
    user_balance_id,
    active,
    direction,
    expiration_period,
    price,
  }: PlaceDigitalOptionRequestArgs): Promise<PlaceDigitalOptionRequestMessage> {
    const digitalOptionIdentifier = buildDigitalOptionIdentifier(
      active,
      expiration_period,
      direction
    )

    return {
      name: 'digital-options.place-digital-option',
      version: '1.0',
      body: {
        user_balance_id,
        instrument_id: digitalOptionIdentifier,
        amount: String(price),
      },
    }
  }
}
