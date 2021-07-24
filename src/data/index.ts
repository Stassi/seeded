import maximumSafeBinary from './maximumSafeBinary'
import {
  numberRange as numberRangeErrorMessages,
  sampleWeight as sampleWeightErrorMessages,
} from './errorMessages.json'
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

const { underflow: sampleWeightUnderflowErrorMessage } =
  sampleWeightErrorMessages

export {
  bitsInOctet,
  defaultDrop,
  integerRangeUnderflowErrorMessage,
  intervalRangeUnderflowErrorMessage,
  maximumSafeBinary,
  maximumSafeBinaryLength,
  poolWidth,
  sampleWeightUnderflowErrorMessage,
}
