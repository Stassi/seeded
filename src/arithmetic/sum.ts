import add from './add'

export default function sum(...n: number[]): number {
  return n.reduce((prev, current) => add(prev, current), 0)
}
