type PlaintextAndHexPairs = [string?, string?][]

export default function hexTestCases(): PlaintextAndHexPairs {
  const plaintext: string[] = 'HELLOWORLD'.split(''),
    hexEncoded: string[] = [
      '48',
      '45',
      '4c',
      '4c',
      '4f',
      '57',
      '4f',
      '52',
      '4c',
      '44',
    ]

  let cases: PlaintextAndHexPairs = []
  for (let i = 0; i < plaintext.length; i++) {
    cases[i] = [plaintext[i], hexEncoded[i]]
  }

  return cases
}
