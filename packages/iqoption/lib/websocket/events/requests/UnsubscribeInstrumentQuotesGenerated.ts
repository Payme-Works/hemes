import { Active, ExpirationPeriod, InstrumentType } from '../../../types'
import { getActiveId } from '../../../utils/getActiveId'
import { getExpirationPeriodTime } from '../../../utils/getExpirationPeriodTime'
import { Request } from '../Request'

interface UnsubscribeInstrumentQuotesGeneratedMessage {
  name: 'instrument-quotes-generated'
  version: '1.0'
  params: {
    routingFilters: {
      active: number
      expiration_period: number
      kind: InstrumentType
    }
  }
}

interface UnsubscribeInstrumentQuotesGeneratedArgs {
  active: Active
  expiration_period: ExpirationPeriod
  kind: InstrumentType
}

export class UnsubscribeInstrumentQuotesGeneratedRequest extends Request<
  UnsubscribeInstrumentQuotesGeneratedMessage,
  UnsubscribeInstrumentQuotesGeneratedArgs
> {
  public get name(): string {
    return 'unsubscribeMessage'
  }

  public async build({
    active,
    expiration_period,
    kind,
  }: UnsubscribeInstrumentQuotesGeneratedArgs): Promise<UnsubscribeInstrumentQuotesGeneratedMessage> {
    const activeId = getActiveId(active)
    const expirationPeriodTime = getExpirationPeriodTime(expiration_period)

    return {
      name: 'instrument-quotes-generated',
      version: '1.0',
      params: {
        routingFilters: {
          active: activeId,
          expiration_period: expirationPeriodTime,
          kind,
        },
      },
    }
  }
}
