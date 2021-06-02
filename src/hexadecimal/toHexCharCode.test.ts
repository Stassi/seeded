import hexTestCases from './hexTextCases'
import toHexCharCode from './toHexCharCode'

describe('toHexCharCode', () => {
  test.each(hexTestCases())(
    '"%s" should be character code "%s" in hexadecimal',
    (plaintextLetter, hexCode) => {
      expect(toHexCharCode(plaintextLetter)).toBe(hexCode)
    }
  )
})
