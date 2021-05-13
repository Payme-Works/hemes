import { Active, ExpirationPeriod, OrderDirection } from '../../../../types'
import { getActiveId } from '../../../../utils/getActiveId'
import { getExpirationDate } from '../../../../utils/getExpirationDate'
import { Request } from '../../Request'

interface OpenOptionRequestMessage {
  name: 'binary-options.open-option'
  version: '1.0'
  body: {
    user_balance_id: number
    active_id: number
    option_type_id: number
    direction: OrderDirection
    expired: number
    price: number
  }
}

interface OpenOptionRequestArgs {
  user_balance_id: number
  active: Active
  direction: OrderDirection
  expiration_period: ExpirationPeriod
  price: number
}

export type BinaryOptionTypeId = 1

export type TurboOptionTypeId = 3

export class OpenOptionRequest extends Request<
  OpenOptionRequestMessage,
  OpenOptionRequestArgs
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
  }: OpenOptionRequestArgs): Promise<OpenOptionRequestMessage> {
    const activeId = getActiveId(active)

    let optionTypeId: BinaryOptionTypeId | TurboOptionTypeId

    if (expiration_period === 'm1' || expiration_period === 'm5') {
      optionTypeId = 3
    } else {
      optionTypeId = 1
    }

    const expirationDate = getExpirationDate(expiration_period)

    const parsedExpirationTime = String(expirationDate.getTime())
    const validExpiredTime = Number(
      parsedExpirationTime.substring(0, parsedExpirationTime.length - 3)
    )

    return {
      name: 'binary-options.open-option',
      version: '1.0',
      body: {
        user_balance_id,
        active_id: activeId,
        option_type_id: optionTypeId,
        direction,
        expired: validExpiredTime,
        price,
      },
    }
  }
}
