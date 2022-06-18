import { parse } from 'protocol-buffers-schema'
import type { Enum, Message } from 'protocol-buffers-schema/types'

import { bool, string, uint32 } from './runtime'

import { decode } from './decode'
import { encode } from './encode'

import type { Codec, DecodeFields, EncodeFields, Encoding } from './types'
import type { Reader } from './reader'

// types.defaults = bake([
//   /* double   */ 0,
//   /* float    */ 0,
//   /* int32    */ 0,
//   /* uint32   */ 0,
//   /* sint32   */ 0,
//   /* fixed32  */ 0,
//   /* sfixed32 */ 0,
//   /* int64    */ 0,
//   /* uint64   */ 0,
//   /* sint64   */ 0,
//   /* fixed64  */ 0,
//   /* sfixed64 */ 0,
//   /* bool     */ false,
//   /* string   */ "",
//   /* bytes    */ util.emptyArray,
//   /* message  */ null
// ]);

// const types: { [type: string]: string } = {
//   string: 'string',
//   bool: 'boolean',
//   bytes: 'Uint8Array',

//   double: 'number',
//   fixed32: 'number',
//   float: 'number',
//   int32: 'number',
//   sfixed32: 'number',
//   sint32: 'number',
//   uint32: 'number',

//   fixed64: 'Long',
//   int64: 'Long',
//   sfixed64: 'Long',
//   sint64: 'Long',
//   uint64: 'Long',
// }

const codecs: Record<Encoding, Codec> = {
  string,
  bool,
  uint32,
  // enums,
  // bytes: 'Uint8Array',

  // double: 'number',
  // fixed32: 'number',
  // float: 'number',
  // int32: 'number',
  // sfixed32: 'number',
  // sint32: 'number',

  // fixed64: 'Long',
  // int64: 'Long',
  // sfixed64: 'Long',
  // sint64: 'Long',
  // uint64: 'Long',
}

const compile = (proto: string) => {
  const schema = parse(proto)

  const types: Record<string, Codec> = {}

  const enums: { [key in string]: { [key in string]: number } } = {}
  // const messages: { [key in string]: any } = {}

  function compileEnums(_enums: Enum[]) {
    for (const enumeration of Object.values(_enums)) {
      const { name, values } = enumeration

      enums[name] = Object.entries(values).reduce<Record<string, number>>(
        (acc, [key, { value }]) => {
          acc[key] = value
          return acc
        },
        {}
      )

      types[name] = {
        encode(value: number, writer) {
          uint32.encode(value, writer)
        },
        decode(reader: Reader) {
          return uint32.decode(reader)
        },
      }
    }
  }

  function compileMessages(messages: Message[]) {
    for (const message of Object.values(messages)) {
      const encodeFields: EncodeFields<any> = {}
      const decodeFields: DecodeFields<any> = {}

      const { name } = message

      compileEnums(message.enums)
      compileMessages(message.messages)

      for (const field of Object.values(message.fields)) {
        const { name, tag, type } = field

        const codec = (types[type] ?? codecs[type]) as Codec

        encodeFields[name] = {
          tag,
          type: 'uint32',
          encode: codec?.encode,
        }

        decodeFields[tag] = {
          name,
          decode: codec?.decode,
        }
      }

      types[name] = {
        encode: encode(encodeFields),
        decode: decode(decodeFields),
      }
    }
  }

  compileEnums(schema.enums)
  compileMessages(schema.messages)

  // TODO: fs.writeFileSync('generated.ts', genInterface(name, contents), 'utf8')
  const testMessage = types['Test']
  return testMessage!
}

export { compile }
