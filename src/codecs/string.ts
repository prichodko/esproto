import { readVarint32, writeVarint32 } from '../helpers/varint'
import type { Reader } from '../reader'
import type { Writer } from '../writer'

export function encode(writer: Writer, value: string): void {
  const encoded = writer.textEncoder.encode(value)
  writeVarint32(writer, encoded.length)
  writer.buffer.push(...encoded)
}

export function decode(reader: Reader): string {
  const count = readVarint32(reader)
  return reader.textDecoder.decode(reader.bytes(count))
}
