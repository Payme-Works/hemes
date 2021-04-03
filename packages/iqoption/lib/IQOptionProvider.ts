import axios, { AxiosInstance } from 'axios'

import { Provider, Credentials } from '@hemes/core'

import { WebSocketClient } from './websocket/WebSocketClient'

export class IQOptionProvider implements Provider {
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

  public async getProfile() {}
}
