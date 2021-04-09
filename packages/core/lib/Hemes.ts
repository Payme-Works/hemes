import { BaseHemes, ClassPrototype, ProviderConstructor } from './types'

export class Hemes<T extends ClassPrototype> implements BaseHemes<T> {
  private provider: any

  constructor(HemesProvider: T & ProviderConstructor<T>) {
    this.provider = new HemesProvider(this)
  }

  public getProvider<P = T['prototype']>(): P {
    return this.provider
  }
}
