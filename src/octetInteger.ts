import type { CipherInput, Octet } from './octet'
import octet from './octet'

interface OctetIntegerInput extends CipherInput {}

export interface OctetInteger extends Octet {}

export default function octetInteger(props: OctetIntegerInput): OctetInteger {
  return octet(props)
}
