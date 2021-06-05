import keyScheduler from './keyScheduler/keyScheduler'

export default function arcSeed(): any {
  const keyScheduled: number[] = keyScheduler([1, 2, 3, 4, 5, 6, 7, 8])

  console.log({ keyScheduled })

  return keyScheduled
}
