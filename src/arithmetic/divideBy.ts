import type { N, NumberCallback } from '../utilities/numbers'

export default function divideBy(denominator: N): NumberCallback {
  return (numerator: N): N => numerator / denominator
}
