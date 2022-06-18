import { encode } from './src/encode'
import { decode, enums, uint32 } from './src/runtime'

type Foo = 'FOO_A' | 'FOO_B' | 'FOO_C'

interface Bar {
  foo: Foo
}

interface Test {
  bar: Bar
  testBar: Record<string, number>
  testUint32: number
}

/**
 * ENCODE
 */
export const encodeBar = encode<Bar>({
  foo: {
    tag: 1,
    type: 'string',
    encode: enums.encode,
  },
})

export const encodeTest = encode<Test>({
  bar: {
    tag: 0,
    encode: encodeBar,
    type: 'uint32',
  },
  testBar: {
    tag: 1,
    encode: map.encode,
    type: 'uint32',
  },
  testUint32: {
    tag: 2,
    encode: uint32.encode,
    type: 'uint32',
  },
})

/**
 * DECODE
 */
export const decodeBar = decode<Bar>({
  0: {
    name: 'foo',
    decode: enums.decode,
  },
})

export const decodeTest = decode<Test>({
  0: {
    name: 'bar',
    decode: decodeBar,
  },
  1: {
    name: 'testBar',
    decode: map.decode,
  },
  2: {
    name: 'testUint32',
    decode: uint32.decode,
  },
})
