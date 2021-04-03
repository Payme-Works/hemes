import { IQWebSocket } from '../IQWebSocket'
import { WebSocketEvent } from '../types'
import { Message } from './Message'

export class Heartbeat extends Message {
  constructor(socket: IQWebSocket) {
    super(socket)
  }

  public handle(event: WebSocketEvent) {
    this.getSocket.sendMessage('heartbeat', {
      heartbeatTime: String(event.msg),
      userTime: String(Date.now()),
    })
  }
}
