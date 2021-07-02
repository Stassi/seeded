describe('interval', () => {
  describe(`deterministic`, () => {
    const seed: string = 'hello.',
      keyWidth: number = 5,
      doubleKeyWidth: number = keyWidth * 2,
      knownIntervals: number[] = [
        0.09530453672732464, 0.289083174852129, 0.6187731397359575,
        0.21672739780799022, 0.3513632540465652,
      ],
      nextKnownIntervals: number[] = [
        0.6881552357812133, 0.20458416697748794, 0.06062310602522847,
        0.522549827384321, 0.8543837916790913,
      ],
      compositeInterval: number[] = [...knownIntervals, ...nextKnownIntervals]

    describe('first chained call', () => {
      describe('second chained call', () => {})
    })

    describe('composite call', () => {})

    describe('state loading', () => {})
  })

  describe(`stochastic`, () => {})
})
