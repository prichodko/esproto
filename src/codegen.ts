type Runtime = keyof typeof import('./runtime')

export function genContents(types: {}, typescript = true): string {
  const content: string[] = []

  const imports: Runtime[] = []

  for (const [name, type] of Object.entries(types)) {
  }

  return content.join('\n')
}

function genImport(modules: string[], typescript = true): string {
  return `import { ${modules.join(', ')} } from 'esproto'`
}

function genEnum(type: any, typescript = true): string {
  return typescript ? `${type}` : `${type}`
}

function genType(type: any, typescript = true): string {
  return typescript ? `${type}` : `${type}`
}

function genEncode(name: string, fields: {}, typescript = true): string {
  if (!typescript) {
    return `\nexport function encode${name}(message) {
      return encode({})(message)
    }`
  }

  return `\nexport function encode${name}(message: ${name}): Uint8Array {
  return encode({})(message)
}`
}

function genDecode(name: string, fields: any, typescript = true): string {
  if (!typescript) {
    return `\nexport function decode${name}(buffer) {
      return decode({})(buffer)
    }`
  }

  return `\nexport function decode${name}(buffer: ${name}): ${name} {
    return decode({})(buffer)
  }`
}
