import { WebSocketClient } from './websocket/WebSocketClient'

export interface BaseWebSocketClient {
  webSocket: WebSocket
  eventHandlers: WebSocketEventHandler[]
}

export interface WebSocketEvent<T = any> {
  name: string
  msg: T
}

export interface WebSocketEventHandler<T = any> {
  webSocket: WebSocketClient

  name: string

  handle(event: WebSocketEvent<T>): void
}
