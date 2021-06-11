export type AtIndexCallback = (i: number) => any

export default function atIndex(a: any[]): AtIndexCallback {
  return (i: number): any => a[i]
}
