import axios, { AxiosInstance } from 'axios'

import { sleep } from '@hemes/core'

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

  private isCorsBypassEnabled: boolean
  private corsBypassServer: string

  constructor() {
    this.api = axios.create({
      baseURL: 'https://iqoption.com/api',
    })

    this.webSocket = new WebSocketClient()
  }

  public async enableCorsBypass(server: string): Promise<void> {
    this.isCorsBypassEnabled = true
    this.corsBypassServer = server

    this.api.interceptors.request.use(cf => {
      return {
        ...cf,
        baseURL: `${server}/${cf.baseURL}`,
      }
    })
  }

  public async logIn({
    email,
    password,
  }: LogInCredentials): Promise<BaseIQOptionAccount> {
    this.webSocket.subscribe()

    const authApi = axios.create({
      baseURL: 'https://auth.iqoption.com/api/v2',
    })

    if (this.isCorsBypassEnabled) {
      authApi.interceptors.request.use(cf => {
        return {
          ...cf,
          baseURL: `${this.corsBypassServer}/${cf.baseURL}`,
        }
      })
    }

    const response = await authApi.post<LoginResponse>('/login', {
      identifier: email,
      password,
    })

    this.api.defaults.headers.Authorization = `SSID ${response.data.ssid}`

    if (response.data.code !== 'success') {
      throw new Error('Login failed')
    }

    await this.webSocket.send(SsidRequest, response.data.ssid)

    await sleep(5000)

    const account = new IQOptionAccount(this.api, this.webSocket)

    await account.setBalanceMode('practice')

    return account
  }
}
