import ceiling from './ceiling'
import { bitsInOctet } from '../data'

export default function octetsNeededForLength(n: number): number {
  return ceiling(n / bitsInOctet)
}
