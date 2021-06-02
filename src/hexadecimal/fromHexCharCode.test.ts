import fromHexCharCode from './fromHexCharCode'
import hexTestCases from './hexTextCases'

describe('fromHexCharCode', () => {
  test.each(hexTestCases())(
    '"%s" should be character code "%s" in hexadecimal',
    (plaintextLetter: string, hexCode: string) => {
      expect(fromHexCharCode(hexCode)).toBe(plaintextLetter)
    }
  )
})
