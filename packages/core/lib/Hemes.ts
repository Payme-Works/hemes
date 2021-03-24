import { ProviderConstructor, BaseHemes, Provider } from './types'

export class Hemes<PC extends ProviderConstructor> implements BaseHemes {
  private HemesProvider: PC

  constructor(provider: PC) {
    this.HemesProvider = provider
  }

  getProvider(): Provider {
    return new this.HemesProvider(this)
  }
}
