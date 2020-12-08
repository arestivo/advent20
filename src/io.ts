import fs from 'fs'

export const readLines = (filename: string) => {
  const text = fs.readFileSync(`inputs/${filename}`,'utf8')
  const lines = text.split('\n')

  return lines
}

export const readBatches = (filename: string) => {
  const text = fs.readFileSync(`inputs/${filename}`,'utf8')
  const batches = text.split('\n\n')

  return batches.map(b => b.replace(/\n/g, ' '))
}

export const readIntegers = (filename: string) => {
  return readLines(filename).map(s => parseInt(s, 10))
}

export const readPasswords = (filename: string) => {
  const lines = readLines(filename)
  const matches = lines.map(l => l.match(/(\d+)-(\d+) ([a-z]): ([a-z]+)/))
  return matches.map(m => { return { min: parseInt(m[1], 10), max: parseInt(m[2], 10), letter: m[3], password: m[4] } })
}

export const readBagRules = (filename: string) => {
  return readLines('7.in').map((r) => {
    const container = r.split('contain')[0].replace('bags', '').trim()
    const contents = r.split('contain')[1].split(',').map((c) => {
      return { qty : c.match(/\d+/g), bag: c.replace(/[^a-z ]/g, '').replace(/bags?/, '').trim() }
    }).filter(c => c.qty !== null).map(c => { return { qty: parseInt(c.qty.toString(), 10), bag: c.bag } } )
    return { container, contents }
  }).filter(r => r.contents.length > 0)
}