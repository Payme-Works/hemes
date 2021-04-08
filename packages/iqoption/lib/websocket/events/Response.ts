import { BaseEventResponse, WebSocketEvent } from '../../types'

export abstract class Response<Message = any>
  implements BaseEventResponse<Message> {
  public abstract get name(): string

  public async test(event: WebSocketEvent<Message>): Promise<boolean> {
    return !!event
  }
}
