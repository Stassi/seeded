interface IntegerInput {}

export type Integer = {}

export default function integer({ ...props }: IntegerInput = {}): Integer {
  return { ...props }
}
