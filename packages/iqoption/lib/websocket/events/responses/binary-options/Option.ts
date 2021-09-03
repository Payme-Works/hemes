import { Response } from '../../Response'

export interface Option {
  user_id: number
  refund_value: number
  price: number
  exp: number
  created: number
  created_millisecond: number
  time_rate: number
  type: string
  act: number
  direction: string
  exp_value: number
  value: number
  profit_income: number
  profit_return: number
  id: number
  robot_id: null
  request_id: string
  client_platform_id: number
  message?: 'Asset is currently unavailable. Please try again in a few minutes.'
}

export class OptionResponse extends Response<Option> {
  public get name(): string {
    return 'option'
  }
}
