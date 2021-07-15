export function floor(n: number): number {
  return Math.floor(n)
}

export default function floorMap(a: number[]): number[] {
  return a.map(floor)
}
