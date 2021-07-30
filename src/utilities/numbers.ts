import type { IdentityCallback } from './Callback'
import type { KeyPrimitives, UniformValues } from './objects'

export type N = number
export type Ns = N[]

export type NumberCallback = IdentityCallback<N>
export type NumbersCallback = IdentityCallback<Ns>

export type NumberProperties<Keys extends KeyPrimitives> = UniformValues<
  Keys,
  N
>

export type NumbersProperties<Keys extends KeyPrimitives> = UniformValues<
  Keys,
  Ns
>
