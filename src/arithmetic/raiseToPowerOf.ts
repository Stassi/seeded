type RaiseToPowerOfCallback = (exponent: number) => number

function raiseToPowerOf(base: number): RaiseToPowerOfCallback {
  return (exponent: number) => base ** exponent
}

const raiseTwoToPowerOf: RaiseToPowerOfCallback = raiseToPowerOf(2)

export default raiseTwoToPowerOf
