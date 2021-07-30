import type { N, NumberCallback } from '../utilities/numbers'

export default function remainder(divisor: N): NumberCallback {
  return (dividend: N): N => dividend % divisor
}
