import { createReader } from './reader'

// todo: add flag to write default values for missing fields
export function decode<T>(buffer: Uint8Array, fields: any): T {
  const reader = createReader(buffer)

  const message: Record<string, unknown> = {}

  while (reader.position < reader.limit) {
    const tag = reader.tag()
    const field = fields[tag]!
    message[field.name] = field.decode(reader)
  }

  return message as T
}
