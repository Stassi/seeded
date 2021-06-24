import ceiling from './ceiling'
import { bitsInOctet } from '../integers.json'

export default function octetsNeededForLength(n: number): number {
  return ceiling(n / bitsInOctet)
}
