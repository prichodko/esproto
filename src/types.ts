import type { Reader } from './reader'
import type { Writer } from './writer'

export type Encoding =
  | 'bytes'
  | 'string'
  | 'bool'
  | 'double'
  | 'float'
  | 'int32'
  | 'int64'
  | 'uint32'
  | 'uint64'
  | 'sint32'
  | 'sint64'
  | 'fixed32'
  | 'fixed64'
  | 'sfixed32'
  | 'sfixed64'

export type Codec<T = any> = {
  encode: (writer: Writer, value: T) => void
  decode: (reader: Reader) => T
}
