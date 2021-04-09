import '../../loadEnv'

import { Hemes } from '@hemes/core'
import { IQOptionProvider } from '@hemes/iqoption'

async function run() {
  const hemes = new Hemes(IQOptionProvider).getProvider()

  await hemes.logIn({
    email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
    password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
  })
}

run()
