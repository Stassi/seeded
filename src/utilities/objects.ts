export type KeyPrimitives = number | string | symbol

export type UniformValues<Keys extends KeyPrimitives, Value> = {
  [Key in Keys]: Value
}
