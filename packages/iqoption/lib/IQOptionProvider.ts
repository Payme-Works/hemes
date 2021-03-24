import { Provider, Credentials } from '@hemes/core'

export class IQOptionProvider implements Provider {
  public async signIn(credentials: Credentials): Promise<void> {
    console.log(credentials)
  }
}
