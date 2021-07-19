import type { DivideByCallback, MultiplyByCallback } from '../arithmetic'
import type { SliceAtCallback } from './sliceAt'
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

const maxSafeBinaryToInterval: MultiplyByCallback = multiplyBy(
  raiseTwoToPowerOf(negate(maximumSafeBinaryLength))
)

const divideByBitsInOctet: DivideByCallback = divideBy(bitsInOctet)

export const octetsNeededForMaxSafeBinary: number = ceiling(
  divideByBitsInOctet(maximumSafeBinaryLength)
)

const sliceToMaxSafeBinary: SliceAtCallback = sliceAt(
  add(
    negate(maximumSafeBinaryLength),
    multiply(octetsNeededForMaxSafeBinary, bitsInOctet)
  )
)

export default function octetToInterval(octet: number[]): number {
  return maxSafeBinaryToInterval(
    binaryToNumber(
      sliceToMaxSafeBinary(concatenate(toFixedBinaryOctets(octet)))
    )
  )
}
