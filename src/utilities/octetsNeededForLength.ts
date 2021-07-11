import ceiling from './ceiling'
import { bitsInOctet } from '../metrics.json'

export default function octetsNeededForLength(n: number): number {
  return ceiling(n / bitsInOctet)
}
