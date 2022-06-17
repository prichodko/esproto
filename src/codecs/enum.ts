import { readVarint32, writeVarint32 } from '../helpers/varint'
import type { Reader } from '../reader'

export function createEncode (enumeration: ) {
  return encode
}

export function encode(buffer: number[], value: number): void {
  writeVarint32(buffer, value)
}

export function decode(reader: Reader): number {
  return readVarint32(reader)
}
