import { bitsInOctet } from './octetToInterval'
import toBinary from './toBinary'

export function toFixedBinaryOctet(n: number): string {
  return toBinary(n).padStart(bitsInOctet, '0')
}

export default function toFixedBinaryOctets(a: number[]): string[] {
  return a.map(toFixedBinaryOctet)
}
