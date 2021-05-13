import { WebSocketEvent, InstrumentType, Active } from '../../../types'
import { Response } from '../Response'

export interface InstrumentQuote {
  price: {
    ask: any
    bid: number
  }
  symbols: string[]
}

export interface InstrumentQuotesGenerated {
  active: number
  expiration: {
    instant: string
    period: number
    timestamp: number
  }
  instant: string
  kind: InstrumentType
  quotes: InstrumentQuote[]
  timestamp: number
  underlying: Active
}

export class SubscriptionInstrumentQuotesGenerated extends Response<InstrumentQuotesGenerated> {
  public get name(): string {
    return 'instrument-quotes-generated'
  }

  public async test(
    event: WebSocketEvent<InstrumentQuotesGenerated>
  ): Promise<boolean> {
    return event.microserviceName === 'pricing-instruments'
  }
}
