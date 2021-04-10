import { InitializationData } from './websocket/events/responses/GetInitializationData'
import { UnderlyingList } from './websocket/events/responses/GetUnderlyingList'
import { Profile } from './websocket/events/responses/Profile'

export interface LogInCredentials {
  email: string
  password: string
}

export type UnderlyingListType = 'digital-option'

export interface GetUnderlyingList {
  type: UnderlyingListType
}

export type InstrumentType = 'cfd' | 'forex' | 'crypto'

export interface GetInstruments {
  type: InstrumentType
}

export interface BaseIQOptionProvider {
  logIn(credentials: LogInCredentials): Promise<BaseIQOptionAccount>
}

export interface BaseIQOptionAccount {
  getInitializationData(): Promise<InitializationData>
  getProfile(): Promise<Profile>
  getUnderlyingList(data: GetUnderlyingList): Promise<UnderlyingList>
  getInstruments(data: GetInstruments): Promise<any>
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
    Request: EventRequestConstructor<Message, Args>,
    ...args: OptionalSpread<Args>
  ): Promise<WebSocketEvent<Message>>
  waitFor<Message>(
    Response: EventResponseConstructor<Message>,
    options?: WaitForOptions
  ): Promise<WebSocketEventHistory<Message> | undefined>
}

export type EventRequestConstructor<Message, Args> = new () => BaseEventRequest<
  Message,
  Args
>

export type EventResponseConstructor<
  Message
> = new () => BaseEventResponse<Message>

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
