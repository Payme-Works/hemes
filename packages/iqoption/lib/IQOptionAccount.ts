import { AxiosInstance } from 'axios'

import { BaseIQOptionAccount, WebSocketEventHistory } from './types'
import { Profile } from './websocket/events/interfaces/Profile'
import { GetBalancesRequest } from './websocket/events/requests/GetBalances'
import { GetBalancesResponse } from './websocket/events/responses/GetBalances'
import { WebSocketClient } from './websocket/WebSocketClient'

export class IQOptionAccount implements BaseIQOptionAccount {
  constructor(private api: AxiosInstance, private webSocket: WebSocketClient) {}

  public async getProfile(): Promise<Profile> {
    console.log('API -> ', !!this.api)

    const profileEvent = this.webSocket.history.find(
      event => event.name === 'profile'
    ) as WebSocketEventHistory<Profile>

    const request = await this.webSocket.send(GetBalancesRequest)

    const balancesEvent = await this.webSocket.waitFor(GetBalancesResponse, {
      requestId: request.request_id,
    })

    if (!balancesEvent) {
      return profileEvent.msg
    }

    return {
      ...profileEvent.msg,
      balances: balancesEvent.msg,
    }
  }
}
