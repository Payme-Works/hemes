import '../../loadEnv'

import { Hemes } from '@hemes/core'
import { IQOptionProvider } from '@hemes/iqoption'

async function run() {
  const hemes = new Hemes(IQOptionProvider).getProvider()

  const account = await hemes.logIn({
    email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
    password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
  })

  const position = await account.placeDigitalOption({
    active: 'EURUSD',
    direction: 'call',
    expiration_period: 'm15',
    price: 1,
  })

  console.log('\n', 'Position:', JSON.stringify(position), '\n')
}

run()
