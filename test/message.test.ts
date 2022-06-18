import fs from 'node:fs'

import protobufjs from 'protobufjs'
import { expect, it } from 'vitest'

import { compile } from '../src'

const proto = fs.readFileSync('./test/protos/message.proto', 'utf8')

const encodeTestProto = (payload: any) => {
  const { root } = protobufjs.parse(proto)
  const Test = root.lookupType('Test')
  return new Uint8Array(Test.encode(payload).finish())
}

it('should encode nested message', async () => {
  const payload = {
    c: {
      a: 150,
    },
  }

  const result = encodeTestProto(payload)

  const simple = compile(proto)
  const buffer = simple.encode(payload)

  expect(buffer).toEqual(result)
})
