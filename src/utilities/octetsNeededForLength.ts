import ceiling from './ceiling'

export default function octetsNeededForLength(n: number): number {
  return ceiling(n / 8)
}
