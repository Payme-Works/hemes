import { formatToTimeZone } from 'date-fns-timezone'

import {
  ActivePair,
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
  version: '2.0'
  body: {
    user_balance_id: number
    instrument_id: string
    amount: string
    instrument_index: number
    asset_id: number
  }
}

interface PlaceDigitalOptionRequestArgs {
  user_balance_id: number
  active: ActivePair
  direction: PositionDirection
  expiration_period: DigitalOptionExpirationPeriod
  price: number
}

const abbreviatedPositionDirection: AbbreviatedPositionDirection = {
  call: 'C',
  put: 'P',
}

// do816A20240805D165000T5MCSPT
// do1A20240805D165000T1MPSPT

// do1A20240805D172500T5CSPT

// doBITCOIN202408051650PT5MCSPT
// doEURUSD202408051700PT5MCSPT

function buildDigitalOptionIdentifier(
  active: ActivePair,
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
    'A' +
    expirationTimeFormatted.substring(0, 8) + // dateFormat
    'D' +
    expirationTimeFormatted.substring(8, 12) + // timeFormat
    '00T' +
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
      version: '2.0',
      body: {
        user_balance_id,
        instrument_id: digitalOptionIdentifier,
        amount: String(price),
        instrument_index: 797064,
        asset_id: Number(active),
      },
    }
  }
}
