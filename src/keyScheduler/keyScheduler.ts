import identityPermutation from '../utilities/identityPermutation'
import atIndex from '../utilities/atIndex'
import length from '../utilities/length'
import remainder from '../utilities/remainder'
import swapPointer, { SwapPointer } from './swapPointer'

const stateWidth = 256

export default function keyScheduler(key: number[]): number[] {
  let i: number = 0
  let j: SwapPointer = swapPointer()
  let state: number[] = identityPermutation(stateWidth)
  const remainderKeyLength = remainder(length(key))
  const atKeyIndex = atIndex(key)
  const atStateIndex = atIndex(state)

  for (; i < stateWidth; i++) {
    j = j.create(j.addTo(atKeyIndex(remainderKeyLength(i)), atStateIndex(i)))
    state[j.state] = i
    state[i] = j.state
  }

  return state
}
