import { uint32 } from './runtime'

/**
 * @typedef {'varint' | 'fixed64' | 'delimited' | 'fixed32'} WireType
 * inlining the type here to avoid object lookup
 */
export type WireType = 0 | 1 | 2 | 5

export interface Writer {
  buffer: number[]
  position: number
  textEncoder: TextEncoder
  tag(tag: number, type: WireType): void
  finish(): Uint8Array
}

// https://developers.google.com/protocol-buffers/docs/encoding#cheat-sheet
// Varint  = 0; // varint: int32, int64, uint32, uint64, sint32, sint64, bool, enum
// Fixed64 = 1; // 64-bit: double, fixed64, sfixed64
// Bytes   = 2; // length-delimited: string, bytes, embedded messages, packed repeated fields
// Fixed32 = 5; // 32-bit: float, fixed32, sfixed32

export const createWriter = (): Writer => {
  return {
    buffer: [],
    position: 0,
    textEncoder: new TextEncoder(),
    tag(field: number, wireType: WireType) {
      uint32.encode((field << 3) | wireType, this)
    },
    finish() {
      return new Uint8Array(this.buffer)
    },
  }
}
