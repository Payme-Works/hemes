import { Response } from '../Response'

export interface ActiveInfo {
  name: string
  group_id: number
  image: string
  description: string
  exchange: string
  minimal_bet: number
  maximal_bet: number
  top_traders_enabled: boolean
  id: number
  precision: number
  option: {
    profit: {
      commission: number
      refund_min: number
      refund_max: number
    }
    exp_time: number
    bet_close_time: {
      [key: string]: {
        enabled: boolean
        title: string | boolean
      }
    }
    count: number
    special: {
      [key: string]: {
        enabled: boolean
        title: string
      }
    }
  }
  sum: number
  enabled: boolean
  deadtime: number
  schedule: [number, number][]
  minmax: {
    min: number
    max: number
  }
  start_time: number
  provider: string
  is_buyback: number
  is_suspended: boolean
  buyback_deadtime: number
  rollover_enabled: boolean
  rollover_commission: number
}

export interface InitializationData {
  binary: {
    actives: {
      [key: string]: ActiveInfo
    }
    list: any[]
  }
  turbo: {
    actives: {
      [key: string]: ActiveInfo
    }
    list: any[]
  }
  currency: string
  is_buyback: number
  signals_history: any[]
  groups: {
    [key: string]: string
  }
}

export class GetInitializationDataResponse extends Response<InitializationData> {
  public get name(): string {
    return 'initialization-data'
  }
}
