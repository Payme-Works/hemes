import axios from 'axios'
import WebSocket from 'ws'

import { Provider, Credentials } from '@hemes/core'

import { WebSocketEvent } from './types'

export class IQOptionProvider implements Provider {
  private requestCounter: number

  // private readonly api: AxiosInstance
  private readonly webSocket: WebSocket

  constructor() {
    this.requestCounter = 0

    // this.api = axios.create({ baseURL: 'https://iqoption.com/api' })
    this.webSocket = new WebSocket('wss://iqoption.com/echo/websocket')
  }

  private sendMessage(name: string, message: any) {
    this.requestCounter += 1

    this.webSocket.emit(
      JSON.stringify({
        name,
        msg: message,
        request_id: this.requestCounter,
      })
    )
  }

  public async logIn({ email, password }: Credentials): Promise<boolean> {
    console.log('Credentials ->', { email, password })

    const authApi = axios.create({
      baseURL: 'https://auth.iqoption.com/api/v2',
    })

    const response = await authApi.post('/login', {
      identifier: email,
      password,
    })

    console.log('Login Response ->', response.data)

    this.webSocket.on('message', (originEvent: string) => {
      const event = JSON.parse(originEvent) as WebSocketEvent

      console.log('WebSocket Client Message ->', event)

      if (event.name === 'heartbeat') {
        this.sendMessage('heartbeat', {
          heartbeatTime: Number(event.msg),
          userTime: Date.now(),
        })
      }
    })

    return true
  }
}
