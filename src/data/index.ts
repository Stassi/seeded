import maximumSafeBinary from './maximumSafeBinary'
import { range } from './errorMessages.json'
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
  maximumSafeBinary,
  maximumSafeBinaryLength,
  poolWidth,
  rangeUnderflowErrorMessage,
}
