import maximumSafeBinary from './maximumSafeBinary'
import {
  range,
  integerRangeUnderflow as integerRangeUnderflowErrorMessage,
  intervalRangeUnderflow as intervalRangeUnderflowErrorMessage,
} from './errorMessages.json'
import {
  bitsInOctet,
  defaultDrop,
  maximumSafeBinaryLength,
  poolWidth,
} from './metrics.json'

const { underflow: rangeUnderflowErrorMessage } = range

export {
  bitsInOctet,
  defaultDrop,
  integerRangeUnderflowErrorMessage,
  intervalRangeUnderflowErrorMessage,
  maximumSafeBinary,
  maximumSafeBinaryLength,
  poolWidth,
  rangeUnderflowErrorMessage,
}
