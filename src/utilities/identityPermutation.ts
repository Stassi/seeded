export type Pool = number[]

export default function identityPermutation(width: number): Pool {
  // @ts-ignore
  return [...Array(width).keys()]
}
