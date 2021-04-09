import { AxiosInstance } from 'axios'

import { BaseIQOptionAccount } from './types'
import { GetBalancesRequest } from './websocket/events/requests/GetBalances'
import { GetInitializationDataRequest } from './websocket/events/requests/GetInitializationData'
import { GetBalancesResponse } from './websocket/events/responses/GetBalances'
import {
  GetInitializationDataResponse,
  InitializationData,
} from './websocket/events/responses/GetInitializationData'
import { Profile, ProfileResponse } from './websocket/events/responses/Profile'
import { WebSocketClient } from './websocket/WebSocketClient'

export class IQOptionAccount implements BaseIQOptionAccount {
  constructor(private api: AxiosInstance, private webSocket: WebSocketClient) {
    console.log('API -> ', !!this.api)
  }

  public async getInitializationData(): Promise<InitializationData> {
    const request = await this.webSocket.send(GetInitializationDataRequest)

    const initializationDataResponse = await this.webSocket.waitFor(
      GetInitializationDataResponse,
      {
        requestId: request.request_id,
      }
    )

    if (!initializationDataResponse) {
      throw new Error('Initialization data event not found')
    }

    return initializationDataResponse.msg
  }

  public async getProfile(): Promise<Profile> {
    const profileEvent = await this.webSocket.waitFor(ProfileResponse)

    if (!profileEvent) {
      throw new Error('Profile event not found')
    }

    const request = await this.webSocket.send(GetBalancesRequest)

    const balancesResponse = await this.webSocket.waitFor(GetBalancesResponse, {
      requestId: request.request_id,
    })

    if (!balancesResponse) {
      return profileEvent.msg
    }

    return {
      ...profileEvent.msg,
      balances: balancesResponse.msg,
    }
  }
}
