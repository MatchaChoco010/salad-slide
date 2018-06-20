#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs')
const pug = require('pug')
const rimraf = require('rimraf')
const pkg = require('../package.json')
const program = require('commander')
const bs = require('browser-sync').create()

const tmpPath = path.join(__dirname, '../tmp/')

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

if (!fs.existsSync(mdFilePath)) {
  console.error('no such file!')
  program.help()
}

const template = pug.compileFile(path.join(__dirname, '../src/template.pug'))

const reloadMdFile = (eventType, _) => {
  if (eventType === 'rename') {
    console.error('Renamed or moved watching markdown file...')
    process.exit(1)
  }

  const md = fs.readFileSync(mdFilePath, { encoding: 'utf8' })

  rimraf.sync(tmpPath)
  fs.mkdirSync(tmpPath)
  fs.writeFileSync(
    path.join(tmpPath, 'index.html'),
    template({ markdown: md }),
    {
      encoding: 'utf8',
    },
  )
}

reloadMdFile()

bs.init({
  files: path.join(tmpPath, '/index.html'),
  server: [tmpPath, path.join(__dirname, '../remark')],
})

fs.watch(mdFilePath, reloadMdFile)
