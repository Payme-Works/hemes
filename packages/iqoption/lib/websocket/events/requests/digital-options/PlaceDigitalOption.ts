import { formatToTimeZone } from 'date-fns-timezone'
import { getExpirationPeriodTime } from 'packages/iqoption/lib/utils/getExpirationPeriodTime'

import {
  Active,
  DigitalOptionExpirationPeriod,
  OrderAction,
} from '../../../../types'
import { getExpirationDate } from '../../../../utils/getExpirationDate'
import { Request } from '../../Request'

type AbbreviatedOrderAction = {
  [action in OrderAction]: string
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
  action: OrderAction
  expiration_period: DigitalOptionExpirationPeriod
  amount: number
}

const abbreviatedOrderAction: AbbreviatedOrderAction = {
  call: 'C',
  put: 'P',
}

function buildDigitalOptionIdentifier(
  active: Active,
  expirationPeriod: DigitalOptionExpirationPeriod,
  action: OrderAction
) {
  const expirationDate = getExpirationDate(expirationPeriod)

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
    abbreviatedOrderAction[action] +
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
    action,
    expiration_period,
    amount,
  }: PlaceDigitalOptionRequestArgs): Promise<PlaceDigitalOptionRequestMessage> {
    const digitalOptionIdentifier = buildDigitalOptionIdentifier(
      active,
      expiration_period,
      action
    )

    console.log(digitalOptionIdentifier)

    return {
      name: 'digital-options.place-digital-option',
      version: '1.0',
      body: {
        user_balance_id,
        instrument_id: digitalOptionIdentifier,
        amount: String(amount),
      },
    }
  }
}
