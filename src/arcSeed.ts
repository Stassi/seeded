import keyScheduler from './keyScheduler/keyScheduler'

export default function arcSeed(): any {
  const keyScheduled = keyScheduler({
    key: [1, 2, 3, 4, 5, 6, 7, 8],
    width: 256,
  })

  console.log({ keyScheduled })

  return keyScheduled
}
