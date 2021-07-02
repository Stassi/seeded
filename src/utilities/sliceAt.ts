type ArrayOrString = any[] | string

export type SliceAtCallback = (x: ArrayOrString) => any

export default function sliceAt(n: number): SliceAtCallback {
  return (x: ArrayOrString) => x.slice(n)
}
