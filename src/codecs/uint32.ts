import { readVarint32, writeVarint32 } from '../helpers/varint'
import type { Reader } from '../reader'
import type { Writer } from '../writer'

export function encode(writer: Writer, value: number): void {
  return writeVarint32(writer, value)
}

export function decode(reader: Reader): number {
  return readVarint32(reader)
}
