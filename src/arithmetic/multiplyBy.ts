import multiply from './multiply'

export type MultiplyByCallback = (y: number) => number

export default function multiplyBy(x: number): MultiplyByCallback {
  return (y: number) => multiply(x, y)
}
