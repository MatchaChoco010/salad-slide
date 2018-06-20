#!/usr/bin/env node
'use strict'

const path = require('path')
const pkg = require('../package.json')
const program = require('commander')

let mdFilePath

program
  .version(pkg.version, '-v, --version')
  .arguments('<*.md>')
  .action(md => (mdFilePath = md))
  .parse(process.argv)

if (mdFilePath === undefined || path.parse(mdFilePath).ext !== '.md') {
  console.error('no md file given!')
  program.help()
}

console.log(mdFilePath)
