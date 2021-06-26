export interface ForEachProperty {
  forEach: (fn: ForEachCallback) => void
}

export type ForEachCallback = (value: any, index: number, array: any[]) => void

export default function forEach(a: any[]) {
  return (fn: ForEachCallback): void => a.forEach(fn)
}
