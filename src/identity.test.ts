import identity from './identity'

describe('identity', () => {
  test('"a" should be "a"', () => {
    expect(identity('a')).toBe('a')
  })
})
