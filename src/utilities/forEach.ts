export interface ForEachProperty {
  forEach: (fn: ForEachCallback) => void
}

export type ForEachCallback = (
  value: number,
  index: number,
  array: number[]
) => void

export default function forEach(a: any[]) {
  return (fn: ForEachCallback): void => a.forEach(fn)
}
