import arcSeed from './arcSeed'

describe('arcSeed', () => {
  const seed = 'hello.'
  test(`seed: "${seed}" should output 0.9282578795792454`, () => {
    expect(arcSeed({ seed })).toEqual(0.9282578795792454)
  })
})
