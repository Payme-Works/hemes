import '../../loadEnv'

import { Hemes, sleep } from '@hemes/core'
import { IQOptionProvider, BaseIQOptionProvider } from '@hemes/iqoption'

async function run() {
  const hemes = new Hemes(IQOptionProvider).getProvider<BaseIQOptionProvider>()

  const account = await hemes.logIn({
    email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
    password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
  })

  const placedPosition = await account.placeDigitalOption({
    active: 'EURUSD',
    direction: 'call',
    expiration_period: 'm1',
    price: 1,
  })

  await sleep(10000)

  const position = await account.getPositionState(placedPosition.id)

  console.log('\n', 'Position state:', JSON.stringify(position), '\n')
}

run()
