import { Response } from '../Response'

export interface Balance {
  id: number
  user_id: number
  type: number
  amount: number
  enrolled_amount: number
  enrolled_sum_amount: number
  hold_amount: number
  orders_amount: number
  currency: string
  tournament_id: number
  tournament_name: number
  is_fiat: boolean
  is_marginal: boolean
  has_deposits: boolean
  auth_amount: number
  equivalent: number
}

export class GetBalancesResponse extends Response<Balance[]> {
  public get name(): string {
    return 'balances'
  }
}
