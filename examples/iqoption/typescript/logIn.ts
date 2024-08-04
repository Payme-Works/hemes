import '../../loadEnv'

import { Hemes } from '@hemes/core'
import { BaseIQOptionProvider, IQOptionProvider } from '@hemes/iqoption'

async function run() {
  try {
    const hemes = new Hemes(IQOptionProvider).getProvider<BaseIQOptionProvider>()

    await hemes.logIn({
      email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
      password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
    })
  } catch (error) {
    console.error(error)
  }
}

run()
