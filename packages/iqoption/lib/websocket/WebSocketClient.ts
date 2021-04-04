import md5 from 'md5'
import WebSocket from 'ws'

import {
  WebSocketEvent,
  WebSocketEventHistory,
  WebSocketEventHandler,
} from '../types'

import { HeartbeatEvent } from './events/Heartbeat'
import { ProfileEvent } from './events/Profile'

export class WebSocketClient {
  private webSocket: WebSocket

  private eventHandlers: WebSocketEventHandler[]

  public history: WebSocketEventHistory[]

  constructor() {
    this.eventHandlers = [new HeartbeatEvent(this), new ProfileEvent(this)]

    this.history = []
  }

  public subscribe() {
    this.webSocket = new WebSocket('wss://iqoption.com/echo/websocket')

    this.webSocket.on('message', (originEvent: string) => {
      const event = JSON.parse(originEvent) as WebSocketEvent

      this.history.push({
        ...event,
        at: Date.now(),
      })

      if (!['heartbeat', 'timeSync'].includes(event.name)) {
        console.log('⬇ ', event)
      }

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

      if (!['heartbeat', 'timeSync'].includes(event.name)) {
        console.log('⬆ ', event)
      }
    } catch (error) {
      console.error(error)
    }
  }
}
