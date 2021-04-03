import { WebSocketEventHandler, WebSocketEvent } from '../types'

import { WebSocketClient } from './WebSocketClient'

export abstract class BaseEventHandler<T = any>
  implements WebSocketEventHandler<T> {
  constructor(public webSocket: WebSocketClient) {}

  public abstract get name(): string

  public abstract handle(event: WebSocketEvent<T>): void
}
