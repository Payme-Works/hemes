import { getExpirationPeriodTime } from 'packages/iqoption/lib/utils/getExpirationPeriodTime'

import { Active, ExpirationPeriod, InstrumentType } from '../../../types'
import { getActiveId } from '../../../utils/getActiveId'
import { Request } from '../Request'

interface SubscribeInstrumentQuotesGeneratedRequestMessage {
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

interface SubscribeInstrumentQuotesGeneratedRequestArgs {
  active: Active
  expiration_period: ExpirationPeriod
  kind: InstrumentType
}

export class SubscribeInstrumentQuotesGeneratedRequest extends Request<
  SubscribeInstrumentQuotesGeneratedRequestMessage,
  SubscribeInstrumentQuotesGeneratedRequestArgs
> {
  public get name(): string {
    return 'subscribeMessage'
  }

  public async build({
    active,
    expiration_period,
    kind,
  }: SubscribeInstrumentQuotesGeneratedRequestArgs): Promise<SubscribeInstrumentQuotesGeneratedRequestMessage> {
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
