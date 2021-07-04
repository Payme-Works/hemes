import { Active, ExpirationPeriod } from '../../../types'
import { getActiveId } from '../../../utils/getActiveId'
import { getExpirationPeriodTime } from '../../../utils/getExpirationPeriodTime'
import { Request } from '../Request'

interface GetCandlesMessage {
  name: 'get-candles'
  version: '2.0'
  body: {
    active_id: number
    size: number | string
    to: number
    count: number
  }
}

interface GetCandlesRequestArgs {
  active: Active
  timePeriod: ExpirationPeriod
  count: number
  toDate: Date | number
}

export class GetCandlesRequest extends Request<
  GetCandlesMessage,
  GetCandlesRequestArgs
> {
  public get name(): string {
    return 'sendMessage'
  }

  public async build({
    active,
    timePeriod,
    count,
    toDate,
  }: GetCandlesRequestArgs): Promise<GetCandlesMessage> {
    const activeId = getActiveId(active)

    const candlesTimePeriod: number = getExpirationPeriodTime(
      timePeriod,
      'seconds'
    )

    let candlesUntilDate: number = toDate as number

    if (toDate instanceof Date) {
      candlesUntilDate = toDate.getTime()
    }

    return {
      name: 'get-candles',
      version: '2.0',
      body: {
        active_id: activeId,
        size: candlesTimePeriod,
        count: count,
        to: candlesUntilDate,
      },
    }
  }
}
