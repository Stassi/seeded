export default function sum(...n: number[]): number {
  return n.reduce((prev, current) => prev + current, 0)
}
