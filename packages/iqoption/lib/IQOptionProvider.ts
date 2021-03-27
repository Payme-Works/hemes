import axios from 'axios'
import WebSocket from 'ws'

import { Provider, Credentials } from '@hemes/core'

export class IQOptionProvider implements Provider {
  public async logIn({ email, password }: Credentials): Promise<boolean> {
    console.log('Credentials ->', { email, password })

    const api = axios.create({ baseURL: 'https://auth.iqoption.com/api/v2' })

    const response = await api.post('/login', { identifier: email, password })

    console.log('Login Response ->', response.data)

    const client = new WebSocket('wss://iqoption.com/echo/websocket')

    client.emit(
      JSON.stringify({
        name: 'ssid',
        msg: response.data.ssid,
        request_id: '',
      })
    )

    client.on('message', args => {
      console.log('WebSocket Client Message ->', args)
    })

    return true
  }
}
