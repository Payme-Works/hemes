import axios, { AxiosInstance } from 'axios'

import {
  BaseIQOptionProvider,
  Credentials,
  WebSocketEventHistory,
} from './types'
import { Profile, Balance } from './websocket/events/Profile'
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
      this.webSocket.send('ssid', response.data.ssid)
    }

    return true
  }

  public async getProfile(): Promise<Profile> {
    const profileEvent = this.webSocket.history.find(
      event => event.name === 'profile'
    ) as WebSocketEventHistory<Profile>

    this.webSocket.send('sendMessage', {
      name: 'get-balances',
      version: '1.0',
    })

    await new Promise(resolve => setTimeout(resolve, 2500))

    const balances = await new Promise<Balance[]>(resolve => {
      const event = this.webSocket.history.find(
        event => event.name === 'balances'
      ) as WebSocketEventHistory<Balance[]>

      resolve(event.msg)
    })

    return {
      ...profileEvent.msg,
      balances,
    }
  }
}
