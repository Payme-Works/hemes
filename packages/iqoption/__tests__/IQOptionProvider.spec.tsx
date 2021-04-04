import { Hemes } from '@hemes/core'
import { IQOptionProvider, BaseIQOptionProvider } from '@hemes/iqoption'

const mockWebSocketClient = {
  subscribe: jest.fn(),
  send: jest.fn(),
}

jest.mock('../lib/websocket/WebSocketClient', () => ({
  WebSocketClient: class MockWebSocketClient {
    subscribe() {
      return mockWebSocketClient.subscribe()
    }

    send(...args: any[]) {
      return mockWebSocketClient.send(...args)
    }
  },
}))

let hemes: BaseIQOptionProvider

describe('IQOptionProvider', () => {
  beforeEach(() => {
    hemes = new Hemes(IQOptionProvider).getProvider<BaseIQOptionProvider>()
  })

  it('should be able to log in with correct credentials', async () => {
    const result = await hemes.logIn({
      email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
      password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
    })

    expect(result).toBeTruthy()

    expect(mockWebSocketClient.subscribe).toBeCalled()
    expect(mockWebSocketClient.send).toBeCalledWith('ssid', expect.any(String))
  })
})
