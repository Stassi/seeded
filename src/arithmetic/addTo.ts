import add from './add'

export type AddToCallback = (n: number) => number

export default function addTo(x: number): AddToCallback {
  return (y) => add(x, y)
}
