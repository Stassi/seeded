import keyScheduler from './keyScheduler/keyScheduler'

interface ArcSeedInput {
  seed: string
  width?: number
}

export default function arcSeed({ seed, width = 256 }: ArcSeedInput) {
  const keyScheduled = keyScheduler({ seed, width })

  console.log(keyScheduled.state)

  return keyScheduled.state
}
