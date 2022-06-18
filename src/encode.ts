import { createWriter, Writer } from './writer'
import type { Message, EncodeFields } from './types'
import { uint32 } from './runtime'

// todo: strict flag to throw errors for non-existant types or invariant
export function encode<M extends Message>(fields: EncodeFields<M>) {
  return (message: Partial<M>, writer?: Writer) => {
    const _writer = createWriter()

    for (const [key, value] of Object.entries(message)) {
      const field = fields[key as keyof M]
      _writer.tag(field.tag, field.encode.wireType)
      field.encode(value, _writer)
    }

    // only encode which created the writer should finish it
    if (writer) {
      uint32.encode(_writer.buffer.length, writer)
      writer.buffer.push(..._writer.buffer)
      return
    }

    return _writer.finish()
  }
}
