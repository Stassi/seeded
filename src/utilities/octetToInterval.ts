import type { StringCallback } from './strings'
import type { N, Ns, NumberCallback } from './numbers'
import binaryToNumber from './binaryToNumber'
import ceiling from './ceiling'
import concatenate from './concatenate'
import sliceAt from './sliceAt'
import toFixedBinaryOctets from './toFixedBinaryOctets'
import {
  add,
  divideBy,
  multiply,
  multiplyBy,
  negate,
  raiseTwoToPowerOf,
} from '../arithmetic'
import { bitsInOctet, maximumSafeBinaryLength } from '../data'

const maxSafeBinaryToInterval: NumberCallback = multiplyBy(
  raiseTwoToPowerOf(negate(maximumSafeBinaryLength))
)

const divideByBitsInOctet: NumberCallback = divideBy(bitsInOctet)

export const octetsNeededForMaxSafeBinary: N = ceiling(
  divideByBitsInOctet(maximumSafeBinaryLength)
)

const sliceToMaxSafeBinary = <StringCallback>(
  sliceAt(
    add(
      negate(maximumSafeBinaryLength),
      multiply(octetsNeededForMaxSafeBinary, bitsInOctet)
    )
  )
)

export default function octetToInterval(octet: Ns): N {
  return maxSafeBinaryToInterval(
    binaryToNumber(
      sliceToMaxSafeBinary(concatenate(toFixedBinaryOctets(octet)))
    )
  )
}
