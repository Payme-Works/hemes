import { Request } from '../Request'

interface HeartbeatRequestMessage {
  heartbeatTime: string
  userTime: string
}

interface HeartbeatRequestArgs {
  heartbeatTime: string
}

export class HeartbeatRequest extends Request<
  HeartbeatRequestMessage,
  HeartbeatRequestArgs
> {
  public get name(): string {
    return 'heartbeat'
  }

  public async build({
    heartbeatTime,
  }: HeartbeatRequestArgs): Promise<HeartbeatRequestMessage> {
    return {
      heartbeatTime: heartbeatTime,
      userTime: String(Date.now()),
    }
  }
}
