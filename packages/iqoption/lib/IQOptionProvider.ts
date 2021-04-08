import axios, { AxiosInstance } from 'axios'

import {
  BaseIQOptionProvider,
  Credentials,
  WebSocketEventHistory,
} from './types'
import { Profile } from './websocket/events/interfaces/Profile'
import { GetBalancesRequest } from './websocket/events/requests/GetBalances'
import { SsidRequest } from './websocket/events/requests/SSID'
import { GetBalancesResponse } from './websocket/events/responses/GetBalances'
import { WebSocketClient } from './websocket/WebSocketClient'

export class IQOptionProvider implements BaseIQOptionProvider {
  private api: AxiosInstance
  private webSocket: WebSocketClient

  constructor() {
    this.api = axios.create({
      baseURL: 'https://iqoption.com/api',
    })

    this.webSocket = new WebSocketClient()
  }

  public async logIn({ email, password }: Credentials): Promise<boolean> {
    console.log('Credentials ->', { email, password })

    this.webSocket.subscribe()

    const authApi = axios.create({
      baseURL: 'https://auth.iqoption.com/api/v2',
    })

    const response = await authApi.post('/login', {
      identifier: email,
      password,
    })

    console.log('Login Response ->', response.data)

    this.api.defaults.headers.Authorization = `SSID ${response.data.ssid}`

    if (response.data.code === 'success') {
      await this.webSocket.send(SsidRequest, response.data.ssid)
    }

    return true
  }

  public async getProfile(): Promise<Profile> {
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
