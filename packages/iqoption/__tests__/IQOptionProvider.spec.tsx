import { Hemes } from '@hemes/core'
import { IQOptionProvider } from '@hemes/iqoption'

describe('IQOptionProvider', () => {
  test('it be able to instance new Hemes with IQOption provider', async () => {
    const hemes = new Hemes(IQOptionProvider).getProvider()

    await hemes.signIn({
      email: 'test@test.com',
      password: '123456',
    })
  })
})
