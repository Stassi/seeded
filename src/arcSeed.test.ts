import arcSeed from './arcSeed'

describe('arcSeed', () => {
  test('seed: "hello." should output 0.9282578795792454', () => {
    expect(arcSeed()).toEqual(0.9282578795792454)
  })
})
