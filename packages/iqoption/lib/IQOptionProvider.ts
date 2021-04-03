import axios, { AxiosInstance } from 'axios'

import { Provider, Credentials } from '@hemes/core'
import { IQWebSocket } from './IQWebSocket'

export class IQOptionProvider implements Provider {
  private loginApi: AxiosInstance
  private ws: IQWebSocket

  constructor() {
    this.loginApi = axios.create({
      baseURL: 'https://auth.iqoption.com/api/v2',
    })

    this.ws = new IQWebSocket()
  }

  public async logIn({ email, password }: Credentials): Promise<boolean> {
    console.log('Credentials ->', { email, password })

    const response = await this.loginApi.post('/login', {
      identifier: email,
      password,
    })

    console.log('Login Response ->', response.data)
    if (response.data.code == 'success') {
      this.ws.sendMessage('ssid', response.data.ssid)
    }

    return true
  }

  public async getProfile() {}
}
