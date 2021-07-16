import maximumSafeBinary from './maximumSafeBinary'
import { numberRange as numberRangeErrorMessages } from './errorMessages.json'
import testCases from './testCases.json'
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
  } = numberRangeErrorMessages,
  { numberRange: numberRangeTestCases } = testCases

export {
  bitsInOctet,
  defaultDrop,
  integerRangeUnderflowErrorMessage,
  intervalRangeUnderflowErrorMessage,
  maximumSafeBinary,
  maximumSafeBinaryLength,
  numberRangeTestCases,
  poolWidth,
}
