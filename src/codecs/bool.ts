import type { Reader } from '../reader'
import type { Writer } from '../writer'

export function encode(writer: Writer, value: boolean): void {
  writer.buffer.push(value ? 1 : 0)
}

export function decode(reader: Reader): boolean {
  return Boolean(reader.byte())
}
