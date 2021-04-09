import '../../loadEnv'

import { Hemes } from '@hemes/core'
import { IQOptionProvider } from '@hemes/iqoption'

async function run() {
  const hemes = new Hemes(IQOptionProvider).getProvider()

  const account = await hemes.logIn({
    email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
    password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
  })

  await new Promise(resolve => setTimeout(resolve, 5000))

  const profile = await account.getProfile()

  console.log('Has received profile ->', !!profile)
}

run()