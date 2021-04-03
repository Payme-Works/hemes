import { IQWebSocket } from '../IQWebSocket'
import { IProfile, WebSocketEvent } from '../types'
import { Message } from './Message'

export class Profile extends Message {
  public userProfile: IProfile

  constructor(socket: IQWebSocket) {
    super(socket)

    this.userProfile = new IProfile()
  }

  public handle(event: WebSocketEvent) {
    Object.assign(this.userProfile, event.msg)
  }
}
