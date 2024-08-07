import '../../loadEnv'

import { Hemes } from '@hemes/core'
import { IQOptionProvider, BaseIQOptionProvider } from '@hemes/iqoption'

async function run() {
  try {
    const hemes = new Hemes(
      IQOptionProvider
    ).getProvider<BaseIQOptionProvider>()

    const account = await hemes.logIn({
      email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
      password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
    })

    console.time('getProfile')

    const profile = await account.getProfile()

    console.log()
    console.log('👤 Profile:', JSON.stringify(profile))
    console.log()
    console.log(
      '🏦 Balances:',
      JSON.stringify(
        profile.balances.map(balance => ({
          type: balance.type,
          currency: balance.currency,
          amount: balance.amount,
        }))
      )
    )
    console.log()
    console.timeEnd('getProfile')
    console.log()
  } catch (error) {
    console.error(error)
  }
}

run()
