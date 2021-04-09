import md5 from 'md5'
import WebSocket from 'ws'

import { sleep } from '@hemes/core'

import {
  WebSocketEvent,
  WebSocketEventHistory,
  BaseEventSubscriber,
  BaseWebSocketClient,
  WaitForOptions,
  EventRequestConstructor,
  OptionalSpread,
  EventResponseConstructor,
} from '../types'

import { HeartbeatSubscriber } from './events/subscribers/Heartbeat'

export class WebSocketClient implements BaseWebSocketClient {
  private webSocket: WebSocket

  private subscribers: BaseEventSubscriber[]

  public history: WebSocketEventHistory[]

  constructor() {
    this.subscribers = [new HeartbeatSubscriber(this)]

    this.history = []
  }

  public subscribe(): void {
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

      const eventHandler = this.subscribers.find(
        eventHandler => eventHandler.name === event.name
      )

      if (eventHandler) {
        eventHandler.update(event)
      }
    })

    this.webSocket.on('error', (originEvent: string) => {
      console.log('WebSocket error ->', originEvent)
    })

    this.webSocket.on('close', (originEvent: string) => {
      console.log('WebSocket closed ->', originEvent)
    })
  }

  public async send<Message, Args = undefined>(
    Request: EventRequestConstructor<Message, Args>,
    ...args: OptionalSpread<Args>
  ): Promise<WebSocketEvent<Message>> {
    const request = new Request()

    while (this.webSocket.readyState !== 1) {
      console.log('Waiting socket to connect to send message...')

      await sleep(50)
    }

    const message = await request.build(...args)

    const event: WebSocketEvent<Message> = {
      name: request.name,
      msg: message,
      request_id: md5(String(Math.random())),
    }

    try {
      this.webSocket.send(JSON.stringify(event))

      if (!['heartbeat', 'timeSync'].includes(event.name)) {
        console.log('⬆ ', event)
      }
    } catch (err) {
      console.error(err)

      throw err
    }

    return event
  }

  public async waitFor<Message>(
    Response: EventResponseConstructor<Message>,
    options?: WaitForOptions
  ): Promise<WebSocketEventHistory<Message> | undefined> {
    const response = new Response()

    return new Promise(async resolve => {
      let attempts = 0

      while (attempts < (options?.maxAttempts || 10)) {
        const findEvent = this.history.find(event => {
          let result = true

          if (options?.requestId) {
            result = options?.requestId === event.request_id
          }

          return event.name === response.name && result
        }) as WebSocketEventHistory<Message>

        if (findEvent) {
          const testPassed = response.test(findEvent)

          if (!testPassed) {
            resolve(undefined)

            return
          }

          resolve(findEvent)

          return
        }

        attempts += 1

        await sleep(options?.delay || 500)
      }

      resolve(undefined)
    })
  }
}
