import { Response } from '../Response'

export interface UnderlyingActive {
  active_id: number
  active_group_id: number
  active_type: string
  underlying: string
  schedule: Array<{
    open: number
    close: number
  }>
  is_enabled: boolean
  name: string
  localization_key: string
  image: string
  image_prefix: string
  precision: number
  start_time: number
  regulation_mode: string
  tags: {
    [key: string]: any
  }
  is_suspended: boolean
  subunderlying: any[]
}

export interface UnderlyingList {
  user_group_id: number
  type: string
  underlying: UnderlyingActive[]
}

export class GetUnderlyingListResponse extends Response<UnderlyingList> {
  public get name(): string {
    return 'underlying-list'
  }
}
