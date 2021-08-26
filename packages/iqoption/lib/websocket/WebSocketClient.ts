import { format } from 'date-fns'
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
  EventResponseConstructor,
  CheckForUnion,
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

      if (!['heartbeat', 'timeSync', 'positions-state'].includes(event.name)) {
        console.log(
          '⬇',
          format(Date.now(), 'yyyy-MM-dd HH:mm:ss:SSS'),
          JSON.stringify(event)
        )
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
    args?: CheckForUnion<Args, never, Args>
  ): Promise<WebSocketEvent<Message>> {
    const request = new Request()

    while (this.webSocket.readyState !== 1) {
      console.log('Waiting socket to connect to send message...')

      await sleep(50)
    }

    const message = await request.build(args as any)

    const event: WebSocketEvent<Message> = {
      name: request.name,
      msg: message,
      request_id: md5(String(Math.random())),
    }

    try {
      this.webSocket.send(JSON.stringify(event))

      if (!['heartbeat', 'timeSync', 'positions-state'].includes(event.name)) {
        console.log(
          '⬆',
          format(Date.now(), 'yyyy-MM-dd HH:mm:ss:SSS'),
          JSON.stringify(event)
        )
      }
    } catch (err) {
      console.error(err)

      throw err
    }

    return event
  }

  public async waitFor<Message>(
    Response: EventResponseConstructor<Message>,
    options?: WaitForOptions<Message>
  ): Promise<WebSocketEventHistory<Message> | undefined> {
    const response = new Response()

    console.log(
      '⏰',
      format(Date.now(), 'yyyy-MM-dd HH:mm:ss:SSS'),
      response.name
    )

    return new Promise(async resolve => {
      let attempts = 0

      const initialTimeMillis = Date.now()

      while (Date.now() - initialTimeMillis <= (options?.timeout ?? 5000)) {
        if (attempts > 0) {
          await sleep(options?.delay || 100)
        }

        attempts += 1

        const reversedHistory = this.history.reverse()

        const findEvent = reversedHistory.find(event => {
          let result = true

          if (options?.requestId) {
            result = options?.requestId === event.request_id
          }

          return event.name === response.name && result
        }) as WebSocketEventHistory<Message>

        if (findEvent) {
          const responseTestPassed = response.test(findEvent)

          if (!responseTestPassed) {
            continue
          }

          if (options?.test) {
            const optionsTestPassed = options.test(findEvent)

            if (!optionsTestPassed) {
              continue
            }
          }

          resolve(findEvent)

          return
        }
      }

      resolve(undefined)
    })
  }
}
