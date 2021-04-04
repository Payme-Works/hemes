export interface ClassPrototype {
  prototype: any
}

export interface BaseHemes<T extends ClassPrototype> {
  getProvider<P = T['prototype']>(): P
}

export interface ProviderConstructor<T extends ClassPrototype> {
  new (hemes: BaseHemes<T>)
}
