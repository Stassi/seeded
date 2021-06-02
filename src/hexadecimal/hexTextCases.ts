type PlaintextAndHexPairs = [string?, string?][]

interface HexTestCases {
  cases: PlaintextAndHexPairs
  name: string
}

export default function hexTestCases(): HexTestCases {
  const cases: PlaintextAndHexPairs = [],
    plaintext: string[] = 'HELLOWORLD'.split(''),
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

  for (let i = 0; i < plaintext.length; i++) {
    cases[i] = [plaintext[i], hexEncoded[i]]
  }

  return { cases, name: '"%s" should be character code "%s" in hexadecimal' }
}
