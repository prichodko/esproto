import { createReader, Reader } from './reader'
import type { Message, DecodeFields } from './types'

// todo: add flag to write default values for missing fields
export function decode<M extends Message>(fields: DecodeFields<M>) {
  return (input: Uint8Array | Reader): M => {
    const reader = input instanceof Uint8Array ? createReader(input) : input

    const message = {} as M

    while (reader.position < reader.limit) {
      const tag = reader.tag()
      const field = fields[tag]!
      message[field.name] = field.decode(reader)
    }

    return message as M
  }
}
