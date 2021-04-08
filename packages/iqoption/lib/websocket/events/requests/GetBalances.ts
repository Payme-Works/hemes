import { Request } from '../Request'

interface GetBalancesRequestMessage {
  name: 'get-balances'
  version: '1.0'
}

export class GetBalancesRequest extends Request<GetBalancesRequestMessage> {
  public get name(): string {
    return 'sendMessage'
  }

  public async build(): Promise<GetBalancesRequestMessage> {
    return {
      name: 'get-balances',
      version: '1.0',
    }
  }
}
