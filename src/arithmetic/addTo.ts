import add from './add'

export type AddToCallBack = (n: number) => number

export default function addTo(x: number): AddToCallBack {
  return (y) => add(x, y)
}
