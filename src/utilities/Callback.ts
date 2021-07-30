export type Callback<P, R> = (p: P) => R

export type IdentityCallback<T> = Callback<T, T>
