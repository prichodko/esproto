import fs from 'node:fs'

import protobufjs from 'protobufjs'
import { expect, it } from 'vitest'

import { compile } from '../src'

const proto = fs.readFileSync('./test/protos/bool.proto', 'utf8')

const encodeTestProto = (payload: any) => {
  const { root } = protobufjs.parse(proto)
  const Test = root.lookupType('Test')

  return new Uint8Array(Test.encode(payload).finish())
}

it('should encode value true', async () => {
  const simple = compile(proto)

  const payload = {
    a: true,
  }

  const buffer = simple.encode(payload)
  const result = encodeTestProto(payload)

  expect(buffer).toEqual(result)
})

it('should encode value false', async () => {
  const simple = compile(proto)

  const payload = {
    a: false,
  }

  const buffer = simple.encode(payload)
  const result = encodeTestProto(payload)

  expect(buffer).toEqual(result)
})

it('should decode value true', async () => {
  const simple = compile(proto)

  const payload = {
    a: true,
  }

  const result = encodeTestProto(payload)
  const message = simple.decode(result)

  expect(message).toEqual(payload)
})

it('should decode value false', async () => {
  const simple = compile(proto)

  const payload = {
    a: false,
  }

  const ref = encodeTestProto(payload)
  const message = simple.decode(ref)

  expect(message).toEqual(payload)
})
