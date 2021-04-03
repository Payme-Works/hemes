import md5 from 'md5'
import WebSocket from 'ws'

import { WebSocketEvent, WebSocketEventHandler } from '../types'

import { Heartbeat } from './events/Heartbeat'
import { Profile } from './events/Profile'

export class WebSocketClient {
  private webSocket: WebSocket

  private eventHandlers: WebSocketEventHandler[]

  constructor() {
    this.eventHandlers = [new Heartbeat(this), new Profile(this)]
  }

  public subscribe() {
    this.webSocket = new WebSocket('wss://iqoption.com/echo/websocket')

    this.webSocket.on('message', (originEvent: string) => {
      const event = JSON.parse(originEvent) as WebSocketEvent

      console.log('⬇ ', event)

      const eventHandler = this.eventHandlers.find(
        eventHandler => eventHandler.name === event.name
      )

      if (eventHandler) {
        eventHandler.handle(event)
      }
    })

    this.webSocket.on('error', (originEvent: string) => {
      console.log('WebSocket error ->', originEvent)
    })

    this.webSocket.on('close', (originEvent: string) => {
      console.log('WebSocket closed ->', originEvent)
    })
  }

  public async send<M = any>(name: string, message: M) {
    try {
      while (this.webSocket.readyState !== 1) {
        console.log('Waiting socket to connect to send message...')

        await new Promise(resolve => setTimeout(resolve, 50))
      }

      const event = {
        name,
        msg: message,
        request_id: md5(String(Math.random())),
      }

      this.webSocket.send(JSON.stringify(event))

      console.log('⬆ ', event)
    } catch (error) {
      console.error(error)
    }
  }
}
