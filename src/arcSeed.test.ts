import arcSeed, { ArcSeed } from './arcSeed'
import identityPermutation from './utilities/identityPermutation'

const PLACEHOLDER_KEY_LENGTH_5 = identityPermutation(5)

describe('arcSeed', () => {
  const seed = 'hello.'
  test('it needs a name', () => {
    const { keyStream }: ArcSeed = arcSeed({ seed })
    const { key } = keyStream(5)
    expect(key).toEqual(PLACEHOLDER_KEY_LENGTH_5)
  })
})
