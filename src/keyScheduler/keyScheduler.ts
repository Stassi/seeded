import atIndex from '../utilities/atIndex'
import identityPermutation, {
  KeyStream,
} from '../utilities/identityPermutation'
import length from '../utilities/length'
import remainder from '../utilities/remainder'
import swapPointer, { SwapPointer } from './swapPointer'

interface KeySchedulerInput {
  key: number[]
  keyStreamWidth: number
}

export default function keyScheduler({
  key,
  keyStreamWidth,
}: KeySchedulerInput): KeyStream {
  let j: SwapPointer = swapPointer({ width: keyStreamWidth })
  let keyStream: KeyStream = identityPermutation(keyStreamWidth)
  const keyStreamOriginal: KeyStream = [...keyStream]
  const remainderKeyLength = remainder(length(key))
  const atKeyIndex = atIndex(key)
  const atKeyStreamIndex = atIndex(keyStream)

  keyStreamOriginal.forEach((i: number): void => {
    j = j.create(
      j.addTo(atKeyIndex(remainderKeyLength(i)), atKeyStreamIndex(i))
    )
    keyStream[j.state] = i
    keyStream[i] = j.state
  })

  return keyStream
}
