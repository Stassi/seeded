import type { IdentityCallback } from './Callback'

export type N = number
export type Ns = N[]
export type NumberCallback = IdentityCallback<N>
export type NumbersCallback = IdentityCallback<Ns>
