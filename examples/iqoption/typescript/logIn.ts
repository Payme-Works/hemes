import { Hemes } from '@hemes/core'
import { IQOptionProvider } from '@hemes/iqoption'

async function run() {
  const hemes = new Hemes(IQOptionProvider).getProvider()

  await hemes.logIn({
    email: 'test@test.com',
    password: '123456',
  })
}

run()
