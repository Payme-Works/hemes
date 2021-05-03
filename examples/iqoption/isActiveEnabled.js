import '../../loadEnv'

import { Hemes } from '@hemes/core'
import { IQOptionProvider } from '@hemes/iqoption'

async function run() {
  const hemes = new Hemes(IQOptionProvider).getProvider()

  const account = await hemes.logIn({
    email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
    password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
  })

  const isEnabled = await account.isActiveEnabled(
    'EURUSD',
    'binary-option',
    'm1'
  )

  console.log(isEnabled)
}

run()
