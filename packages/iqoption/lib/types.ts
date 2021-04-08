import { Profile } from './websocket/events/interfaces/Profile'

export interface Credentials {
  email: string
  password: string
}

export interface BaseIQOptionProvider {
  logIn(credentials: Credentials): Promise<boolean>
  getProfile(): Promise<Profile>
}

export interface WebSocketEvent<Message = any> {
  request_id?: string
  name: string
  msg: Message
  status?: number
  microserviceName?: string
}

export interface WebSocketEventHistory<Message = any>
  extends WebSocketEvent<Message> {
  at: number
}

export interface WaitForOptions {
  requestId?: string
  maxAttempts?: number
  delay?: number
}

export type OptionalSpread<Arg = undefined> = Arg extends undefined ? [] : [Arg]

export interface BaseWebSocketClient {
  history: WebSocketEventHistory[]

  subscribe(): void

  send<Message, Args = undefined>(
    Request: EventRequestNew<Message, Args>,
    ...args: OptionalSpread<Args>
  ): Promise<WebSocketEvent<Message>>
  waitFor<Message>(
    Response: EventResponseNew<Message>,
    options?: WaitForOptions
  ): Promise<WebSocketEventHistory<Message> | undefined>
}

export type EventRequestNew<Message, Args> = new () => BaseEventRequest<
  Message,
  Args
>

export type EventResponseNew<Message> = new () => BaseEventResponse<Message>

export interface BaseEventRequest<Message = any, Args = undefined> {
  name: string

  build(...args: OptionalSpread<Args>): Promise<Message>
}

export interface BaseEventResponse<Message = any> {
  name: string

  test(event: WebSocketEvent<Message>): Promise<boolean>
}

export interface BaseEventSubscriber<Message = any> {
  webSocket: BaseWebSocketClient

  name: string

  update(event: WebSocketEvent<Message>): void
}
