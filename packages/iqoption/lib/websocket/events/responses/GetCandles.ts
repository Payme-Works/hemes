import { Candle } from 'packages/iqoption/lib/types'

import { Response } from '../Response'

export interface CandlesResponse {
  candles: Candle[]
}

export class GetCandlesResponse extends Response<CandlesResponse> {
  public get name(): string {
    return 'candles'
  }
}
