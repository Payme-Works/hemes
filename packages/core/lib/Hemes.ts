import { ProviderConstructor, BaseHemes, Provider } from './types'

export class Hemes<PC extends ProviderConstructor> implements BaseHemes {
  private provider: Provider

  constructor(HemesProvider: PC) {
    this.provider = new HemesProvider(this)
  }

  public getProvider(): Provider {
    return this.provider
  }
}
