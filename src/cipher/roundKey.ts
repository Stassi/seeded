import type { RecursiveState } from '../utilities/state'
import type { N, NumberCallback } from '../utilities/numbers'
import { poolWidth } from '../data'
import { addTo, remainder } from '../arithmetic'

interface RoundKey extends RecursiveState<RoundKey, N> {
  addTo: NumberCallback
}

type RoundKeyState = RoundKey['state']

const remainderPoolWidth: NumberCallback = remainder(poolWidth)

export default function roundKey(state: RoundKeyState): RoundKey {
  return {
    state,
    addTo: addTo(state),
    create(newState: RoundKeyState): RoundKey {
      return roundKey(remainderPoolWidth(newState))
    },
  }
}
