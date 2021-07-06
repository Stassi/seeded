import type { Integer } from './integer'
import delay from './utilities/delay'
import integer from './integer'

describe('integer', () => {
  describe(`deterministic`, () => {
    const seed: string = 'hello.',
      keyWidth: number = 5,
      doubleKeyWidth: number = keyWidth * 2,
      knownIntegers: number[] = [3, 4, 4, 2, 8],
      nextKnownIntegers: number[] = [9, 9, 6, 0, 1],
      compositeIntegers: number[] = [...knownIntegers, ...nextKnownIntegers]

    describe('first chained call', () => {
      const { generated, next: nextInteger }: Integer = integer({
        seed,
        count: keyWidth,
      })

      test('it should persistently return known integers', () => {
        expect(generated).toEqual(knownIntegers)
      })

      describe('second chained call', () => {
        test('it should persistently return known integers', () => {
          const { generated: generatedTwo }: Integer = nextInteger(keyWidth)
          expect(generatedTwo).toEqual(nextKnownIntegers)
        })
      })
    })

    describe('composite call', () => {
      test('it should persistently return known integers', () => {
        const { generated }: Integer = integer({
          seed,
          count: doubleKeyWidth,
        })

        expect(generated).toEqual(compositeIntegers)
      })
    })

    describe('state loading', () => {
      const { state }: Integer = integer({
          seed,
          count: keyWidth,
        }),
        { generated }: Integer = integer({
          state,
          count: keyWidth,
          drop: 0,
        })

      test('it should return known integers from a loaded state', () => {
        expect(generated).toEqual(nextKnownIntegers)
      })
    })
  })

  describe(`stochastic`, () => {
    describe('multiple instances', () => {
      test('it should return distinct values', async () => {
        const {
          generated: [x],
        }: Integer = integer()

        await delay(1)

        const {
          generated: [y],
        }: Integer = integer()

        expect(x === y).toBeFalsy()
      })

      test('it should return discrete values between [0, 10)', async () => {
        const {
          generated: [x],
        }: Integer = integer()

        await delay(1)

        const {
          generated: [y],
        }: Integer = integer()

        expect(x).toBeGreaterThanOrEqual(0)
        expect(x).toBeLessThan(10)
        expect(y).toBeGreaterThanOrEqual(0)
        expect(y).toBeLessThan(10)
      })
    })
  })
})
