import type { Callback } from './Callback'

type ForEach = typeof Array.prototype.forEach
type ForEachParameter = Parameters<ForEach>[0]
type ForEachReturns = ReturnType<ForEach>
type ForEachCallback = Callback<ForEachParameter, ForEachReturns>

export interface ForEachProperty {
  forEach: ForEachCallback
}

export default function forEach<T>(a: T[]): ForEachCallback {
  return (fn: ForEachParameter) => a.forEach(fn)
}
