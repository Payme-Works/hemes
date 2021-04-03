import { IQWebSocket } from '../IQWebSocket'
import { MessageInterface, WebSocketEvent } from '../types'

export class Message implements MessageInterface {
  public webSocket: IQWebSocket

  constructor(socket: IQWebSocket) {
    this.webSocket = socket
  }

  handle(event: WebSocketEvent) {
    throw new Error('Method not implemented to event : ' + event)
  }

  public get getSocket(): IQWebSocket {
    return this.webSocket
  }
}
