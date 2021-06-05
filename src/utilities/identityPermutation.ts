export type KeyStream = number[]

export default function identityPermutation(width: number): KeyStream {
  // @ts-ignore
  return [...Array(width).keys()]
}
