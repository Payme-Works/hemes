import { AxiosInstance } from 'axios'

import { BaseIQOptionAccount, GetInstruments, GetUnderlyingList } from './types'
import { GetBalancesRequest } from './websocket/events/requests/GetBalances'
import { GetInitializationDataRequest } from './websocket/events/requests/GetInitializationData'
import { GetInstrumentsRequest } from './websocket/events/requests/GetInstruments'
import { GetUnderlyingListRequest } from './websocket/events/requests/GetUnderlyingList'
import { GetBalancesResponse } from './websocket/events/responses/GetBalances'
import {
  GetInitializationDataResponse,
  InitializationData,
} from './websocket/events/responses/GetInitializationData'
import {
  GetInstrumentsResponse,
  Instruments,
} from './websocket/events/responses/GetInstruments'
import {
  GetUnderlyingListResponse,
  UnderlyingList,
} from './websocket/events/responses/GetUnderlyingList'
import { Profile, ProfileResponse } from './websocket/events/responses/Profile'
import { WebSocketClient } from './websocket/WebSocketClient'

export class IQOptionAccount implements BaseIQOptionAccount {
  constructor(private api: AxiosInstance, private webSocket: WebSocketClient) {
    console.log('API -> ', !!this.api)
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

  public async getUnderlyingList({
    type,
  }: GetUnderlyingList): Promise<UnderlyingList> {
    const request = await this.webSocket.send(GetUnderlyingListRequest, {
      type,
    })

    const underlyingListResponse = await this.webSocket.waitFor(
      GetUnderlyingListResponse,
      {
        requestId: request.request_id,
      }
    )

    if (!underlyingListResponse) {
      throw new Error('Underlying list event not found')
    }

    return underlyingListResponse.msg
  }

  public async getInstruments({ type }: GetInstruments): Promise<Instruments> {
    const request = await this.webSocket.send(GetInstrumentsRequest, {
      type,
    })

    const instrumentsResponse = await this.webSocket.waitFor(
      GetInstrumentsResponse,
      {
        requestId: request.request_id,
      }
    )

    if (!instrumentsResponse) {
      throw new Error('Instruments event not found')
    }

    return instrumentsResponse.msg
  }
}
