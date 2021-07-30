import type { N, NumberCallback } from '../utilities/numbers'
import multiply from './multiply'

export default function multiplyBy(x: N): NumberCallback {
  return (y: N): N => multiply(x, y)
}
