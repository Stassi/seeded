import type { BinaryNumberToIntervalCallback } from './binaryNumberToInterval'
import binaryNumberToInterval from './binaryNumberToInterval'
import binaryToNumber from './binaryToNumber'
import concatenate from './concatenate'
import negate from './negate'
import { NumbersCipherTuple } from '../cipher'
import octetsNeededForLength from './octetsNeededForLength'
import sliceAt, { SliceAtCallback } from './sliceAt'
import toFixedBinaryOctets from './toFixedBinaryOctets'
import { bitsInOctet, maximumSafeBinaryLength } from '../integers.json'

const maxSafeBinaryToInterval: BinaryNumberToIntervalCallback =
  binaryNumberToInterval(maximumSafeBinaryLength)

export const octetsNeededForMaxSafeBinary: number = octetsNeededForLength(
  maximumSafeBinaryLength
)

const sliceToMaxSafeBinary: SliceAtCallback = sliceAt(
  octetsNeededForMaxSafeBinary * bitsInOctet + negate(maximumSafeBinaryLength)
)

export default function octetToInterval(key: NumbersCipherTuple[0]): number {
  return maxSafeBinaryToInterval(
    binaryToNumber(sliceToMaxSafeBinary(concatenate(toFixedBinaryOctets(key))))
  )
}
