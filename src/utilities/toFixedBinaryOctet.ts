import toBinary from './toBinary'

export default function toFixedBinaryOctet(n: number): string {
  return toBinary(n).padStart(8, '0')
}
