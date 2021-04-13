import { InstrumentType } from '../../../types'
import { Response } from '../Response'

export interface AssetInfo {
  active_id: number
  cur_price: {
    value: number
    is_valid: boolean
  }
  diff_1h: {
    value: number
    is_valid: boolean
  }
  diff_trading_day: {
    value: number
    is_valid: boolean
  }
  expiration: {
    value: number
    is_valid: boolean
  }
  popularity: {
    value: number
    is_valid: boolean
  }
  prev_price: {
    value: number
    is_valid: boolean
  }
  spot_profit: {
    value: number
    is_valid: boolean
  }
  spread: {
    value: number
    is_valid: boolean
  }
  volatility: {
    value: number
    is_valid: boolean
  }
  volume: {
    value: number
    is_valid: boolean
  }
}

export interface TopAssets {
  data: AssetInfo[]
  instrument_type: InstrumentType
}

export class GetTopAssetsResponse extends Response<TopAssets> {
  public get name(): string {
    return 'top-assets'
  }
}
