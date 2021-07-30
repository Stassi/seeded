import type { NumberCallback } from '../utilities/numbers'
import type { RoundKey } from './Ciphers'
import { poolWidth } from '../data'
import { addTo, remainder } from '../arithmetic'

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
