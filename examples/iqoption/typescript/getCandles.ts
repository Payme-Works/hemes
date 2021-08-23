import '../../loadEnv'

import { Hemes } from '@hemes/core'
import { IQOptionProvider, BaseIQOptionProvider } from '@hemes/iqoption'

async function run() {
  const hemes = new Hemes(IQOptionProvider).getProvider<BaseIQOptionProvider>()

  const account = await hemes.logIn({
    email: String(process.env.TEST_IQOPTION_ACCOUNT_EMAIL),
    password: String(process.env.TEST_IQOPTION_ACCOUNT_PASSWORD),
  })

  const candles = await account.getCandles('EURUSD-OTC', 'm5', 2)

  const fixedCandlesTime = candles.map(candle => ({
    ...candle,
    open: Number(candle.open.toFixed(5)),
    close: Number(candle.close.toFixed(5)),
  }))

  console.log('\n', 'Candles', fixedCandlesTime, '\n')
}

run()
