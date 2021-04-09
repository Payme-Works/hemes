import { WebSocketEvent } from '../../../types'
import { HeartbeatRequest } from '../requests/Heartbeat'
import { Subscriber } from '../Subscriber'

export class HeartbeatSubscriber extends Subscriber<number> {
  public get name(): string {
    return 'heartbeat'
  }

  public update(event: WebSocketEvent<number>): void {
    this.webSocket.send(HeartbeatRequest, { heartbeatTime: String(event.msg) })
  }
}
