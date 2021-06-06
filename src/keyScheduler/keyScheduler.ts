import key, { Key } from './key'
import pool, { Pool } from './pool'
import swapPointer, { SwapPointer } from './swapPointer'

interface KeySchedulerInput {
  key: number[]
  width: number
}

export default function keyScheduler({
  width,
  key: keyParam,
}: KeySchedulerInput): number[] {
  const k: Key = key(keyParam)
  let j: SwapPointer = swapPointer({ width })
  let s: Pool = pool({ width })

  s.forEach((i: number): void => {
    j = j.create(j.addTo(k.atIndex(i), s.atIndex(i)))
    s = s.create(s.swapIndices(i, j.state))
  })

  return s.state
}
