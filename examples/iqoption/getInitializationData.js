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

  const initializationData = await account.getInitializationData()

  console.log(JSON.stringify(initializationData))
}

run()
