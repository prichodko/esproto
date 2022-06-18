import { readVarint32, writeVarint32 } from '../helpers/varint'
import type { Reader } from '../reader'
import type { Writer } from '../writer'

export function encode(value: string, writer: Writer): void {
  const encoded = writer.textEncoder.encode(value)
  writeVarint32(encoded.length, writer)
  writer.buffer.push(...encoded)
}

encode.wireType = 2

export function decode(reader: Reader): string {
  const count = readVarint32(reader)
  return reader.textDecoder.decode(reader.bytes(count))
}
