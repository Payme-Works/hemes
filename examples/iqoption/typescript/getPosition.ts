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
    active: 'EURUSD-OTC',
    direction: 'call',
    expiration_period: 'm1',
    price: 1,
  })

  await sleep(100000)

  const position = await account.getPosition(placedPosition.id, {
    status: 'closed',
  })

  console.log('\n', 'Position:', JSON.stringify(position), '\n')
}

run()
