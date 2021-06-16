import { Request } from '../Request'

interface GetCandlesMessage {
  name: 'get-candles'
  version: '2.0'
  body: {}
}

interface GetCandlesRequestArgs {
  active_id: number
  interval: number | string
  endtime: number
  amount: number
}

export class GetCandlesRequest extends Request<
  GetCandlesMessage,
  GetCandlesRequestArgs
> {
  public get name(): string {
    return 'sendMessage'
  }

  public async build({
    active_id,
    interval,
    endtime,
    amount,
  }: GetCandlesRequestArgs): Promise<GetCandlesMessage> {
    return {
      name: 'get-candles',
      version: '2.0',
      body: {
        active_id: active_id,
        size: interval,
        to: endtime,
        count: amount,
        '': active_id,
      },
    }
  }
}
