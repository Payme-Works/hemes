import { InstrumentType } from '../../../types'
import { Response } from '../Response'

export interface Instrument {
  ticker: string
  is_visible: boolean
  id: string
  active_id: number
  active_group_id: number
  active_type: string
  underlying: string
  schedule: Array<{
    open: number
    close: number
  }>
  is_enabled: number
  name: string
  localization_key: string
  image: string
  image_prefix: string
  precision: number
  pip_scale: number
  start_time: number
  last_ask: any
  last_bid: any
  currency_left_side: string
  currency_right_side: string
  expirations: any[]
  tags: {
    [key: string]: any
  }
  is_suspended: boolean
}

export interface Instruments {
  user_group_id: number
  is_regulated: boolean
  type: InstrumentType
  instruments: Instrument[]
}

export class GetInstrumentsResponse extends Response<Instruments> {
  public get name(): string {
    return 'instruments'
  }
}
