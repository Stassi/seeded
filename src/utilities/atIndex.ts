import type { Callback } from './Callback'
import type { N } from './numbers'

type AtIndexCallback<T> = Callback<N, T>

export interface AtIndexProperty<T> {
  atIndex: AtIndexCallback<T>
}

export default function atIndex<T>(a: T[]): AtIndexCallback<T> {
  return (i: number): T => a[i]
}
