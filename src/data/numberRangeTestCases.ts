import maximumSafeBinary from './maximumSafeBinary'
import testCases from './testCases.json'

const { numberRange: numberRangeTestCasesPrev } = testCases,
  numberRangeTestCases = [
    ...numberRangeTestCasesPrev,
    {
      expected: {
        integer: [
          [
            429213476091897, 1301914878543128, 2786706481541730,
            976053428009042, 1582399419995796,
          ],
          [
            3099175663437328, 921365178165718, 273022197705261,
            2353355207890545, 3847802525837347,
          ],
        ],
        interval: [
          [
            429213476091897, 1301914878543128, 2786706481541730,
            976053428009042, 1582399419995796,
          ],
          [
            3099175663437328, 921365178165718, 273022197705261,
            2353355207890545, 3847802525837347,
          ],
        ],
      },
      max: maximumSafeBinary,
      min: 0,
    },
    {
      expected: {
        integer: [
          [
            4503599627370495, 4503599627370495, 4503599627370495,
            4503599627370495, 4503599627370495,
          ],
          [
            4503599627370495, 4503599627370495, 4503599627370495,
            4503599627370495, 4503599627370495,
          ],
        ],
        interval: [
          [
            4503599627370495, 4503599627370495.5, 4503599627370495.5,
            4503599627370495, 4503599627370495.5,
          ],
          [
            4503599627370495.5,
            4503599627370495,
            4503599627370495,
            4503599627370495.5,
            maximumSafeBinary,
          ],
        ],
      },
      max: maximumSafeBinary,
      min: maximumSafeBinary - 1,
    },
  ]

export default numberRangeTestCases
