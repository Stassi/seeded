import fromHexCharCode from './fromHexCharCode'
import hexTestCases from './hexTextCases'

const { cases, name } = hexTestCases()

describe('fromHexCharCode', () => {
  test.each(cases)(name, (plaintextLetter: string, hexCode: string) => {
    expect(fromHexCharCode(hexCode)).toBe(plaintextLetter)
  })
})
