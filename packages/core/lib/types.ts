export interface Credentials {
  email: string
  password: string
}

export interface Provider {
  signIn(credentials: Credentials): Promise<void>
}

export interface BaseHemes {
  getProvider(): Provider
}

export interface ProviderConstructor {
  new (hemes: BaseHemes)
}
