import maximumSafeBinary from './maximumSafeBinary'
import { numberRange as numberRangeErrorMessages } from './errorMessages.json'
import numberRangeTestCases from './numberRangeTestCases'
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
} = numberRangeErrorMessages

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
