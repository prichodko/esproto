import { createWriter, Writer } from './writer'
import type { Message, EncodeFields } from './types'

// todo: strict flag to throw errors for non-existant types or invariant
export function encode<M extends Message>(fields: EncodeFields<M>) {
  return (message: Partial<M>, _writer?: Writer): Uint8Array => {
    const writer = _writer ?? createWriter()

    for (const [key, value] of Object.entries(message)) {
      const field = fields[key as keyof M]
      writer.tag(field.tag, field.encode.wireType)
      field.encode(value, writer)
    }

    return writer.finish()
  }
}
