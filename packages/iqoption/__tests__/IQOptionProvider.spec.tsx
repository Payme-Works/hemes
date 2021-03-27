import { Provider, Hemes } from '@hemes/core'
import { IQOptionProvider } from '@hemes/iqoption'

jest.mock(
  'ws',
  () =>
    class MockWebSocket {
      emit() {
        return jest.fn()
      }

      on() {
        return jest.fn()
      }
    }
)

let hemes: Provider

describe('IQOptionProvider', () => {
  beforeEach(() => {
    hemes = new Hemes(IQOptionProvider).getProvider()
  })

  it('should be able to log in with correct credentials', async () => {
    const result = await hemes.logIn({
      email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
      password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
    })

    expect(result).toBeTruthy()
  })
})
