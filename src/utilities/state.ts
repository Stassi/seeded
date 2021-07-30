import type { Callback } from './Callback'

export type RecursiveState<Self, State> = {
  create: Callback<State, Self>
  state: State
}
