import type { S } from './strings'

type Split = ReturnType<typeof String.prototype.split>
type Splittable = { split: (separator: S) => Split }

export default function split(s: Splittable): Split {
  return s.split('')
}
