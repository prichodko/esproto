import type { Reader } from './reader'
import type { WireType, Writer } from './writer'

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

export type Message = {
  [key in string]: any
}

export type EncodeFunction = {
  (value: any, writer?: Writer): void
  wireType?: WireType
}

export type DecodeFunction = (reader: Reader | Uint8Array) => any

export type Codec = {
  encode: EncodeFunction
  decode: DecodeFunction
}

export type EncodeFields<M> = {
  [key in keyof M]: {
    tag: number
    type: Encoding
    encode: EncodeFunction
  }
}

export type DecodeFields<M> = {
  [key in number]: {
    name: keyof M
    decode: DecodeFunction
  }
}
