import { createWriter } from './writer'

// todo: strict flag to throw errors for non-existant types or invariant
export function encode<T>(message: T, fields) {
  const writer = createWriter()

  for (const [key, value] of Object.entries(message)) {
    const field = fields[key]!
    writer.tag(field.tag, field.type)
    field.encode(writer, value)
  }

  return writer.finish()
}
