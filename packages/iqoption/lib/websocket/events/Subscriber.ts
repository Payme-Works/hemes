import { BaseEventSubscriber, WebSocketEvent } from '../../types'
import { WebSocketClient } from '../WebSocketClient'

export abstract class Subscriber<Message = any>
  implements BaseEventSubscriber<Message> {
  constructor(public webSocket: WebSocketClient) {}

  public abstract get name(): string

  public abstract update(event: WebSocketEvent<Message>): void
}
