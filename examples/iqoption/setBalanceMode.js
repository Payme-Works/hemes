import '../../loadEnv'

import { Hemes, sleep } from '@hemes/core'
import { IQOptionProvider } from '@hemes/iqoption'

async function run() {
  const hemes = new Hemes(IQOptionProvider).getProvider()

  const account = await hemes.logIn({
    email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
    password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
  })

  await sleep(5000)

  await account.setBalanceMode('practice')

  const profile = await account.getProfile()

  console.log(profile.balance, profile.balance_id, profile.balance_type)
}

run()
