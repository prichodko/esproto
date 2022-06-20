#!/bin/env node

import fs from 'node:fs'

import { globby } from 'globby'
import sade from 'sade'
import { parse } from 'protocol-buffers-schema'
import pkg from '../package.json'

import { compile } from './'

const prog = sade('sade', true)

// prog.version(pkg.version)

prog
  .version(pkg.version)
  .command('<input> [output]')
  .describe('Compile protobufs to TypeScript / JavaScript')
  .option('-o, --output', 'Change the name of the output file')
  .example('example.proto')
  .action(async (input, output, opts) => {
    const paths = await globby(input, {
      gitignore: true,
    })

    for (const path of paths) {
      const contents = fs.readFileSync(path, 'utf8')
      const schema = parse(contents)
      compile(schema, opts)
    }
  })

prog.parse(process.argv)
