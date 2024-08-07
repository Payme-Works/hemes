import '../../loadEnv'

import { Hemes } from '@hemes/core'
import {
  IQOptionProvider,
  BaseIQOptionProvider,
  ActivePair,
} from '@hemes/iqoption'

async function run() {
  const hemes = new Hemes(IQOptionProvider).getProvider<BaseIQOptionProvider>()

  const account = await hemes.logIn({
    email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
    password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
  })

  const position = await account.placeDigitalOption({
    active: ActivePair.APPLE,
    direction: 'call',
    expiration_period: 'm5',
    price: 1000,
  })

  console.log('\n', 'Position:', JSON.stringify(position), '\n')
}

run()
