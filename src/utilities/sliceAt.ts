type StringOrArray<T> = string | T[]

export default function sliceAt(n: number) {
  return <T>(sliceable: StringOrArray<T>): StringOrArray<T> =>
    sliceable.slice(n)
}
