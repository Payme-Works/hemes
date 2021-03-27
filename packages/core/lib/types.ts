export interface Credentials {
  email: string
  password: string
}

export interface BaseHemes {
  getProvider(): Provider
}

export interface Provider {
  logIn(credentials: Credentials): Promise<boolean>
}

export interface ProviderConstructor {
  new (hemes: BaseHemes)
}
