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

export const readChunks = (filename: string) => {
  const text = fs.readFileSync(`inputs/${filename}`,'utf8')
  const batches = text.split('\n\n')

  return batches.map(b => b.split('\n'))
}

export const readIntegers = (filename: string) => {
  return readLines(filename).map(s => parseInt(s, 10))
}

export const readCSInteger = (filename: string) => {
  const text = fs.readFileSync(`inputs/${filename}`,'utf8')
  return  text.split(',').map(v => parseInt(v, 10))
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

export const readTickets = (filename: string) => {
  const chunks = readChunks(filename)
  const classes = chunks[0]
    .map(c => c.match(/([\w ]+): (\d+-\d+) or (\d+-\d+)/))
    .map(c => {return {name: c[1], rules: [c[2].split('-'), c[3].split('-')]}})
    .map(c => {return {name: c.name, rules: c.rules.map(r => {return{from: parseInt(r[0], 10), to: parseInt(r[1], 10)}})}})
  const ticket = chunks[1][1].split(',').map(v => parseInt(v, 10))
  const nearby = chunks[2].slice(1).map(t => t.split(',').map(v => parseInt(v, 10)))
  return {classes, ticket, nearby}
}