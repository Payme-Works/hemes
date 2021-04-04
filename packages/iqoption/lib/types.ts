import { Profile } from './websocket/events/Profile'
import { WebSocketClient } from './websocket/WebSocketClient'

export interface Credentials {
  email: string
  password: string
}

export interface BaseIQOptionProvider {
  logIn(credentials: Credentials): Promise<boolean>
  getProfile(): Promise<Profile>
}

export interface BaseWebSocketClient {
  webSocket: WebSocket
  eventHandlers: WebSocketEventHandler[]
}

export interface WebSocketEvent<T = any> {
  name: string
  msg: T
}

export interface WebSocketEventHistory<T = any> extends WebSocketEvent<T> {
  at: number
}

export interface WebSocketEventHandler<T = any> {
  webSocket: WebSocketClient

  name: string

  handle(event: WebSocketEvent<T>): void
}
