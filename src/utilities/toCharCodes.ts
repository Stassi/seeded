import type { S } from './strings'
import map from './map'
import split from './split'

type MapCallback = ReturnType<typeof map>
type UTF16 = ReturnType<typeof String.prototype.charCodeAt>
type UTF16s = UTF16[]

const stringsToUTF16: MapCallback = map((x: S): UTF16 => x.charCodeAt(0))

export default function toCharCodes(s: S): UTF16s {
  return <UTF16s>stringsToUTF16(split(s))
}
