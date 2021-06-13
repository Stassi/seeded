import arcSeed, { ArcSeed, KeyStream } from './arcSeed'

describe('arcSeed', () => {
  const seed = 'hello.'
  test('it needs a name', () => {
    const { keyStream }: ArcSeed = arcSeed({ seed })
    const { key }: KeyStream = keyStream(5)
    expect(key).toEqual([84, 98, 80, 93, 113])
  })
})
