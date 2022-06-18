import { readVarint32, writeVarint32 } from '../helpers/varint'
import type { Reader } from '../reader'
import type { Writer } from '../writer'

export function encode(value: number, writer: Writer): void {
  return writeVarint32(value, writer)
}

export function decode(reader: Reader): number {
  return readVarint32(reader)
}
