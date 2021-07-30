import type { N, NumberCallback } from '../utilities/numbers'
import add from './add'

export default function addTo(x: N): NumberCallback {
  return (y: N): N => add(x, y)
}
