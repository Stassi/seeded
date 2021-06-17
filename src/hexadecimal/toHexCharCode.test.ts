import hexTestCases from './hexTextCases'
import toHexCharCode from './toHexCharCode'

const { cases, name } = hexTestCases()

describe('toHexCharCode', () => {
  test.each(cases)(name, (plaintextLetter: string, hexCode: string) => {
    expect(toHexCharCode(plaintextLetter)).toBe(hexCode)
  })
})
