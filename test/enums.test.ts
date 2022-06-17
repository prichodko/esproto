import protobufjs from 'protobufjs'
import pbjs from 'pbjs'
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'

import { compile } from '../src'

const proto = fs.readFileSync('./test/protos/enums.proto', 'utf8')

it('should encode enum', async () => {
  const { root } = protobufjs.parse(proto)
  const Message = root.lookupType('Test')

  const payload = {
    type: 0,
    nested: 1,
  }

  const ref = Message.encode(payload).finish()

  // const result = Message.decode(ref).toJSON()
  const esproto = compile(proto)
  const buffer = esproto.encode(payload)

  expect(buffer).toEqual(new Uint8Array(ref))
})

it('should decode enum', async () => {
  const { root } = protobufjs.parse(proto)
  const Message = root.lookupType('Test')

  const payload = {
    type: 0,
    nested: 1,
  }

  const ref = Message.encode(payload).finish()

  // const result = Message.decode(ref).toJSON()
  const esproto = compile(proto)
  const buffer = esproto.encode(payload)

  expect(buffer).toEqual(new Uint8Array(ref))
})
