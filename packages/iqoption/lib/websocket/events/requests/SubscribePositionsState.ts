import { Request } from '../Request'

interface SubscribePositionsStateMessage {
  name: 'positions-state'
}

export class SubscribePositionsState extends Request<SubscribePositionsStateMessage> {
  public get name(): string {
    return 'subscribeMessage'
  }

  public async build(): Promise<SubscribePositionsStateMessage> {
    return {
      name: 'positions-state',
    }
  }
}
