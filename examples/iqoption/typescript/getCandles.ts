import { Hemes } from '@hemes/core'
import {
  BaseIQOptionProvider,
  CandleInterval,
  IQOptionProvider,
} from '@hemes/iqoption'
import '../../loadEnv'

async function run() {
  const hemes = new Hemes(IQOptionProvider).getProvider<BaseIQOptionProvider>()

  const account = await hemes.logIn({
    email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
    password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
  })

  const candles = await hemes.getCandles(
    6,
    CandleInterval['1S'],
    10,
    Date.now()
  )

  console.log('Account', !!account)
  console.log('\n', 'Candles', candles, '\n')
}

run()
