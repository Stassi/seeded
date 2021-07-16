export interface CipherParams {
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

export interface CipherParamsOptional {
  count?: CipherParams['count']
  drop?: CipherParams['drop']
  max?: CipherParams['max']
  min?: CipherParams['min']
  seed?: CipherParams['seed']
  state?: CipherParams['state']
}

export interface CipherComponent {
  generated: number[]
  state: CipherParams['state']
}

export default interface Cipher extends CipherComponent {
  next: (count?: CipherParams['count']) => Cipher
}
