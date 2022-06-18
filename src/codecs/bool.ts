import type { Reader } from '../reader'
import type { Writer } from '../writer'

export function encode(value: boolean, writer: Writer): void {
  writer.buffer.push(value ? 1 : 0)
}

encode.wireType = 0

export function decode(reader: Reader): boolean {
  return Boolean(reader.byte())
}
