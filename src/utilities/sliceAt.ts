export type SliceAtCallback = (s: string) => string

export default function sliceAt(n: number): SliceAtCallback {
  return (s: string) => s.slice(n)
}
