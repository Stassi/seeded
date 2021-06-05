export default function sum(...n: number[]): number {
  return n.reduce((prev, current) => {
    return prev + current
  }, 0)
}
