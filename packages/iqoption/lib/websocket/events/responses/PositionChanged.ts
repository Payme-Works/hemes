import { Response } from '../Response'

export interface Position {
  version: number
  id: string
  user_id: number
  user_balance_id: number
  platform_id: number
  external_id: number
  active_id: number
  instrument_id: string
  source: string
  instrument_type: string
  status: string
  open_time: number
  open_quote: number
  invest: number
  invest_enrolled: number
  sell_profit: number
  sell_profit_enrolled: number
  expected_profit: number
  expected_profit_enrolled: number
  pnl: number
  pnl_net: number
  current_price: number
  quote_timestamp: number
  swap: number
  raw_event: {
    id: number
    swap: number
    type: string
    count: number
    index: number
    margin: number
    orders: any[]
    status: string
    user_id: number
    close_at: any
    currency: string
    leverage: number
    create_at: number
    order_ids: number[]
    update_at: number
    buy_amount: number
    commission: number
    extra_data: {
      amount: number
      version: string
      spot_option: boolean
      use_trail_stop: boolean
      auto_margin_call: boolean
      last_change_reason: string
      open_received_time: number
      lower_instrument_id: string
      upper_instrument_id: string
      lower_instrument_strike: number
      upper_instrument_strike: number
      use_token_for_commission: boolean
    }
    last_index: number
    tpsl_extra: any
    margin_call: number
    sell_amount: number
    close_reason: any
    pnl_realized: number
    buy_avg_price: number
    currency_rate: number
    currency_unit: number
    instrument_id: string
    swap_enrolled: number
    user_group_id: number
    count_realized: number
    instrument_dir: string
    sell_avg_price: number
    instrument_type: string
    user_balance_id: number
    instrument_period: number
    instrument_strike: number
    user_balance_type: number
    open_quote_time_ms: number
    stop_lose_order_id: any
    buy_amount_enrolled: number
    close_effect_amount: any
    commission_enrolled: number
    instrument_active_id: number
    instrument_id_escape: string
    margin_call_enrolled: number
    sell_amount_enrolled: number
    take_profit_order_id: any
    instrument_expiration: number
    instrument_underlying: string
    open_underlying_price: number
    pnl_realized_enrolled: number
    buy_avg_price_enrolled: number
    close_underlying_price: any
    instrument_strike_value: number
    open_client_platform_id: number
    sell_avg_price_enrolled: number
    close_effect_amount_enrolled: any
  }
}

export class PositionChangedResponse extends Response<Position> {
  public get name(): string {
    return 'position-changed'
  }
}
