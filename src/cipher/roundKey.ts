import type { RemainderCallback } from '../arithmetic'
import type { RoundKey } from './Ciphers'
import { poolWidth } from '../data'
import { remainder, addTo as addToModule } from '../arithmetic'

const remainderPoolWidth: RemainderCallback = remainder(poolWidth)

type RoundKeyState = RoundKey['state']

export default function roundKey(state: RoundKeyState): RoundKey {
  const addTo: RoundKey['addTo'] = addToModule(state)

  function create(newState: RoundKeyState): RoundKey {
    return roundKey(remainderPoolWidth(newState))
  }

  return { addTo, create, state }
}
