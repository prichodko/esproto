import type { Reader } from '../reader'
import type { Writer } from '../writer'

export function writeVarint32(value: number, writer: Writer): void {
  while (value > 0x7f) {
    writer.buffer.push((value & 0x7f) | 0x80)
    value = value >>> 7
  }
  writer.buffer.push(value)
}

export function readVarint32(reader: Reader): number {
  let c = 0
  let value = 0
  let byte: number

  do {
    byte = reader.byte()
    if (c < 32) value |= (byte & 0x7f) << c
    c += 7
  } while (byte & 0x80)

  return value
}
