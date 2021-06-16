import fromHexCharCode from './fromHexCharCode'
import hexTestCases from './hexTextCases'

const { cases, name } = hexTestCases()

describe('fromHexCharCode', () => {
  test.each(cases)(name, (plaintextLetter, hexCode) => {
    expect(fromHexCharCode(<string>hexCode)).toBe(plaintextLetter)
  })
})
