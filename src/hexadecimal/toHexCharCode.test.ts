import hexTestCases from './hexTextCases'
import toHexCharCode from './toHexCharCode'

const { cases, name } = hexTestCases()

describe('toHexCharCode', () => {
  test.each(cases)(name, (plaintextLetter, hexCode) => {
    expect(toHexCharCode(<string>plaintextLetter)).toBe(hexCode)
  })
})
