import { Callback } from './Callback'

type ArrayMap = typeof Array.prototype.map
type Map = ReturnType<ArrayMap>
type MapParam = Parameters<ArrayMap>[0]
type Mappable = { map: (fn: MapParam) => Map }
type MapCallback = Callback<Mappable, Map>

export default function map(fn: MapParam): MapCallback {
  return (a: Mappable): Map => a.map(fn)
}
