import toBinary from './toBinary'
import { bitsInOctet } from '../data'

export function toFixedBinaryOctet(n: number): string {
  return toBinary(n).padStart(bitsInOctet, '0')
}

export default function toFixedBinaryOctets(a: number[]): string[] {
  return a.map(toFixedBinaryOctet)
}
