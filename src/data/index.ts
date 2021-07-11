import maximumSafeBinary from './maximumSafeBinary'
import { range as rangeErrorMessages } from './errorMessages.json'
import {
  bitsInOctet,
  defaultDrop,
  maximumSafeBinaryLength,
  poolWidth,
} from './metrics.json'

const {
  underflow: {
    integer: integerRangeUnderflowErrorMessage,
    interval: intervalRangeUnderflowErrorMessage,
  },
} = rangeErrorMessages

export {
  bitsInOctet,
  defaultDrop,
  integerRangeUnderflowErrorMessage,
  intervalRangeUnderflowErrorMessage,
  maximumSafeBinary,
  maximumSafeBinaryLength,
  poolWidth,
}
