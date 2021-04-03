export interface WebSocketEvent<T = any> {
  name: string
  msg: T
}
