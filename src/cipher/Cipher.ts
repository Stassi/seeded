export interface CipherInput {
  count: number
  drop: number
  max: number
  min: number
  seed: string
  state: {
    i: number
    pool: number[]
    roundKey: number
  }
}

export interface CipherInputOptional {
  count?: CipherInput['count']
  drop?: CipherInput['drop']
  max?: CipherInput['max']
  min?: CipherInput['min']
  seed?: CipherInput['seed']
  state?: CipherInput['state']
}

export default interface Cipher {
  generated: number[]
  next: (count?: CipherInput['count']) => Cipher
  state: CipherInput['state']
}
