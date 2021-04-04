import { WebSocketEvent } from '../../types'
import { BaseEventHandler } from '../BaseEventHandler'

export class HeartbeatEvent extends BaseEventHandler<number> {
  public get name(): string {
    return 'heartbeat'
  }

  public handle(event: WebSocketEvent<number>): void {
    this.webSocket.send('heartbeat', {
      heartbeatTime: String(event.msg),
      userTime: String(Date.now()),
    })
  }
}
