import axios, { AxiosInstance } from 'axios'

import { IQOptionAccount } from './IQOptionAccount'
import {
  BaseIQOptionAccount,
  BaseIQOptionProvider,
  LogInCredentials,
} from './types'
import { SsidRequest } from './websocket/events/requests/SSID'
import { WebSocketClient } from './websocket/WebSocketClient'

interface LoginResponse {
  code: string
  ssid: string
}

export class IQOptionProvider implements BaseIQOptionProvider {
  private api: AxiosInstance
  private webSocket: WebSocketClient

  constructor() {
    this.api = axios.create({
      baseURL: 'https://iqoption.com/api',
    })

    this.webSocket = new WebSocketClient()
  }

  public async logIn({
    email,
    password,
  }: LogInCredentials): Promise<BaseIQOptionAccount> {
    console.log('Credentials ->', { email, password })

    this.webSocket.subscribe()

    const authApi = axios.create({
      baseURL: 'https://auth.iqoption.com/api/v2',
    })

    const response = await authApi.post<LoginResponse>('/login', {
      identifier: email,
      password,
    })

    console.log('Login Response ->', response.data)

    this.api.defaults.headers.Authorization = `SSID ${response.data.ssid}`

    if (response.data.code !== 'success') {
      throw new Error('Login failed')
    }

    await this.webSocket.send(SsidRequest, response.data.ssid)

    const account = new IQOptionAccount(this.api, this.webSocket)

    return account
  }
}
