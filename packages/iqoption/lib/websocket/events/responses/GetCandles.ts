import { Candle } from 'packages/iqoption/lib/types'

import { Response } from '../Response'

export interface CandleResponseData {
  candles: Candle[]
}

export class GetCandlesResponse extends Response<CandleResponseData> {
  public get name(): string {
    return 'candles'
  }
}
