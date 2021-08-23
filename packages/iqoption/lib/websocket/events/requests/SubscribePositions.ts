import { Request } from '../Request'

interface SubscribePositionsMessage {
  name: 'subscribe-positions'
  version: '1.0'
  body: {
    frequency: 'frequent'
    ids: string[]
  }
}

interface SubscribePositionsArgs {
  positions_ids: string[]
}

export class SubscribePositions extends Request<
  SubscribePositionsMessage,
  SubscribePositionsArgs
> {
  public get name(): string {
    return 'sendMessage'
  }

  public async build({
    positions_ids,
  }: SubscribePositionsArgs): Promise<SubscribePositionsMessage> {
    return {
      name: 'subscribe-positions',
      version: '1.0',
      body: {
        frequency: 'frequent',
        ids: positions_ids,
      },
    }
  }
}
