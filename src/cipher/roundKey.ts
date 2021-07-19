import type { AddToCallBack, RemainderCallback } from '../arithmetic'
import { poolWidth } from '../data'
import { remainder, addTo as addToModule } from '../arithmetic'

const remainderPoolWidth: RemainderCallback = remainder(poolWidth)

export type RoundKeyState = number

export interface RoundKey {
  addTo: AddToCallBack
  create: (state: RoundKeyState) => RoundKey
  state: RoundKeyState
}

export default function roundKey(state: RoundKeyState): RoundKey {
  const addTo: AddToCallBack = addToModule(state)

  function create(newState: RoundKeyState): RoundKey {
    return roundKey(remainderPoolWidth(newState))
  }

  return { addTo, create, state }
}
