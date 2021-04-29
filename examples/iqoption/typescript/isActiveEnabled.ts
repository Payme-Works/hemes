import '../../loadEnv'

import { Hemes, sleep } from '@hemes/core'
import { IQOptionProvider, BaseIQOptionProvider } from '@hemes/iqoption'

async function run() {
  const hemes = new Hemes(IQOptionProvider).getProvider<BaseIQOptionProvider>()

  const account = await hemes.logIn({
    email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
    password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
  })

  await sleep(5000)

  const isEnabled = await account.isActiveEnabled(
    'EURUSD',
    'binary-option',
    'm1'
  )

  console.log(isEnabled)
}

run()