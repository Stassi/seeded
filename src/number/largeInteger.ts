import type { CipherComponent, CipherParams } from '../cipher'
import ceiling from '../utilities/ceiling'
import floorMap from '../utilities/floorMap'
import interval from './interval'

export default function largeInteger({
  count,
  max,
  min,
  state: prevState,
  ...props
}: CipherParams): CipherComponent {
  const { state, generated: generatedInterval }: CipherComponent = interval({
      ...props,
      count,
      max,
      min: ceiling(min),
      state: prevState,
    }),
    generated: CipherComponent['generated'] = floorMap(generatedInterval)

  return {
    generated,
    state,
  }
}
