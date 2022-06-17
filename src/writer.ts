import { TextEncoder } from 'node:util'
import { uint32 } from './runtime'
import type { Encoding } from './types'

export interface Writer {
  buffer: number[]
  position: number
  textEncoder: TextEncoder
  tag(tag: number, type: Encoding): void
  finish(): Uint8Array
}

// Varint  = 0; // varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum
// Fixed64 = 1; // 64-bit: double, fixed64, sfixed64
// Bytes   = 2; // length-delimited: string, bytes, embedded messages, packed repeated fields
// Fixed32 = 5; // 32-bit: float, fixed32, sfixed32

// https://developers.google.com/protocol-buffers/docs/encoding#cheat-sheet
const wireTypes: { [key in Encoding]: number } = {
  bytes: 2,
  string: 2,
  bool: 0,
  double: 0,
  float: 0,
  int32: 0,
  int64: 0,
  uint32: 0,
  uint64: 0,
  sint32: 0,
  sint64: 0,
  fixed32: 0,
  fixed64: 0,
  sfixed32: 0,
  sfixed64: 0,
}

export const createWriter = (): Writer => {
  const buffer: number[] = []
  const textEncoder = new TextEncoder()
  const position = 0

  const finish = () => {
    return new Uint8Array(buffer)
  }

  return {
    buffer,
    textEncoder,
    position,
    tag(field: number, type: 'uint32' | 'string') {
      const wireType = wireTypes[type]
      uint32.encode(this, (field << 3) | wireType)
    },
    finish,
  }
}
