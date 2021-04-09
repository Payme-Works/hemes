import { Balance } from '../interfaces/Profile'
import { Response } from '../Response'

export class GetBalancesResponse extends Response<Balance[]> {
  public get name(): string {
    return 'balances'
  }
}
