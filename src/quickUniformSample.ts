import type { Sample, SampleParams } from './sample'
import sample from './sample'

export type QuickUniformSample<T> = Sample<T>
export type QuickUniformSampleParams<T> = SampleParams<T>

export default function quickUniformSample<T>(
  props: QuickUniformSampleParams<T>
): QuickUniformSample<T> {
  return sample(props)
}
