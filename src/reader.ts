import { uint32 } from './runtime'

export interface Reader {
  readonly buffer: Uint8Array
  readonly textDecoder: TextDecoder
  readonly limit: number
  position: number
  tag(): number
  byte(): number
  bytes(count: number): Uint8Array
}

export const createReader = (buffer: Uint8Array): Reader => {
  return {
    buffer,
    position: 0,
    limit: buffer.length,
    textDecoder: new TextDecoder(),
    tag() {
      return uint32.decode(this) >>> 3
    },
    byte() {
      if (this.position + 1 > this.limit) {
        throw new Error('out of bounds')
      }
      return buffer[this.position++]!
    },
    bytes(count: number) {
      if (this.position + count > this.limit) {
        throw new Error('out of bounds')
      }
      const start = this.position
      this.position += count
      return buffer.subarray(start, this.position)
    },
  }
}
