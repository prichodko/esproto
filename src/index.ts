import fs from 'fs'
import path from 'path'

import { parse } from 'protocol-buffers-schema'
import { genInterface, genObjectFromRawEntries } from 'knitwork'
import type { Enum, Message } from 'protocol-buffers-schema/types'
import * as uint32 from './codecs/uint32'
import * as bool from './codecs/bool'
import * as string from './codecs/string'
import { createReader } from './reader'
import { createWriter } from './writer'
import type { Codec, Encoding } from './types'
import { decode } from './decode'
import { encode } from './runtime'

type enco = typeof import('./codecs/bool')

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

const types: { [type: string]: string } = {
  string: 'string',
  bool: 'boolean',
  bytes: 'Uint8Array',

  double: 'number',
  fixed32: 'number',
  float: 'number',
  int32: 'number',
  sfixed32: 'number',
  sint32: 'number',
  uint32: 'number',

  fixed64: 'Long',
  int64: 'Long',
  sfixed64: 'Long',
  sint64: 'Long',
  uint64: 'Long',
}

const codecs: Record<Encoding, Codec> = {
  string,
  bool,
  uint32,
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

type Encode = {
  [name: string]: {
    tag: number
    type: Encoding | string
    encode: Codec['encode']
  }
}

type Decode = {
  [tag: string]: {
    name: string
    type: Encoding | string
    decode: Codec['decode']
  }
}

const compile = (proto: string) => {
  const schema = parse(proto)

  const types: Record<string, Codec> = {}

  const enums: { [key in string]: { [key in string]: number } } = {}
  const messages = {}

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
        decode(reader) {},
        encode(writer, value) {},
      }
    }
  }

  function compileMessages(messages: Message[]) {
    for (const message of Object.values(messages)) {
      const encodeFields: Encode = {}
      const decodeFields: Decode = {}

      for (const message of Object.values(schema.messages)) {
        const { name } = message

        compileEnums(message.enums)
        compileMessages(message.messages)

        for (const field of Object.values(message.fields)) {
          const { name, tag, type } = field

          encodeFields[name] = {
            tag,
            type,
            encode: codecs[type as Encoding].encode,
          }

          decodeFields[tag] = {
            type,
            name,
            decode: codecs[type as Encoding].decode,
          }
        }
      }
    }
  }

  compileEnums(schema.enums)
  compileMessages(schema.messages)

  // TODO: fs.writeFileSync('generated.ts', genInterface(name, contents), 'utf8')

  return {
    encode<T>(data: T): Uint8Array {
      return encode(data, encodeFields)
    },

    decode<T extends {}>(buffer: Uint8Array): T {
      return decode(buffer, decodeFields)
    },
  }
}

export { compile }
