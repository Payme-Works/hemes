import md5 from 'md5'
import WebSocket from 'ws'
import { Heartbeat } from './messages/Heartbeat'
import { Profile } from './messages/Profile'
import { WebSocketEvent } from './types'

export class IQWebSocket {
  private socket: WebSocket
  private beat: Heartbeat
  private profile: Profile

  constructor() {
    this.socket = new WebSocket('wss://iqoption.com/echo/websocket')
    this.beat = new Heartbeat(this)
    this.profile = new Profile(this)

    this.socket.on('message', (originEvent: string) => {
      const event = JSON.parse(originEvent) as WebSocketEvent

      console.log('⬇ ', event)

      if (event.name === 'heartbeat') this.beat.handle(event)
      if (event.name === 'profile') this.profile.handle(event)
    })

    this.socket.on('error', (originEvent: string) => {
      console.log('WebSocket error ->', originEvent)
    })

    this.socket.on('close', (originEvent: string) => {
      console.log('WebSocket closed ->', originEvent)
    })
  }

  public async sendMessage(name: string, message: any) {
    try {
      while (this.socket.readyState !== 1) {
        console.log('Waiting socket to connect to send message...')
        await this.delay(50)
      }

      const body = JSON.stringify({
        name,
        msg: message,
        request_id: md5(Math.random()),
      })

      this.socket.send(body)

      console.log('⬆ ', body)
    } catch (error) {
      console.error(error)
    }
  }

  public delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
