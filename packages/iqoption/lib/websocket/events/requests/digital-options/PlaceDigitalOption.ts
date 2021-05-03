import { format } from 'date-fns'

import {
  Active,
  DigitalOptionExpirationPeriod,
  OrderAction,
} from '../../../../types'
import { getExpirationTime } from '../../../../utils/getExpirationTime'
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
  /*
    if duration == 1:
      exp, _ = get_expiration_time(timestamp, duration)
    else:
      now_date = datetime.fromtimestamp(timestamp) + timedelta(minutes=1, seconds=30)

      while True:
          if now_date.minute % duration == 0 and time.mktime(now_date.timetuple()) - timestamp > 30:
              break

          now_date = now_date + timedelta(minutes=1)

      exp = time.mktime(now_date.timetuple())
  */

  let expirationTime: number

  if (expirationPeriod === 'm1') {
    expirationTime = getExpirationTime(expirationPeriod)
  } else {
    /*
      now_date = datetime.fromtimestamp(timestamp) + timedelta(minutes=1, seconds=30)

      while True:
          if now_date.minute % duration == 0 and time.mktime(now_date.timetuple()) - timestamp > 30:
              break

          now_date = now_date + timedelta(minutes=1)

      exp = time.mktime(now_date.timetuple())
    */

    expirationTime = getExpirationTime(expirationPeriod)
  }

  const expirationTimeFormatted = format(expirationTime, 'yyyyMMddHHmm')

  console.log(format(expirationTime, 'yyyy/MM/dd HH:mm'))
  console.log(expirationTimeFormatted)

  const digitalOptionIdentifier =
    'do' +
    active +
    expirationTimeFormatted +
    'PT' +
    expirationPeriod.toUpperCase() +
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
    // user_balance_id,
    active,
    action,
    expiration_period,
  }: // amount,
  PlaceDigitalOptionRequestArgs): Promise<PlaceDigitalOptionRequestMessage> {
    const digitalOptionIdentifier = buildDigitalOptionIdentifier(
      active,
      expiration_period,
      action
    )

    console.log(digitalOptionIdentifier)

    throw new Error('Testing')

    // return {
    //   name: 'digital-options.place-digital-option',
    //   version: '1.0',
    //   body: {
    //     user_balance_id,
    //     instrument_id,
    //     amount: String(amount),
    //   },
    // }
  }
}
