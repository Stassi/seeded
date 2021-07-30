import type { Callback } from './Callback'

type IsNumberCallback = Callback<number, boolean>

export const strictlyEqualsOne: IsNumberCallback = strictlyEquals(1)
export const strictlyEqualsZero: IsNumberCallback = strictlyEquals(0)

export default function strictlyEquals<T>(x: T): Callback<T, boolean> {
  return (y: T) => x === y
}
