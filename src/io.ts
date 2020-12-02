import fs from 'fs'

export const readLines = (filename: string) => {
  const text = fs.readFileSync(`inputs/${filename}`,'utf8')
  const lines = text.split('\n')

  return lines
}

export const readIntegers = (filename: string) => {
  return readLines(filename).map(s => parseInt(s, 10))
}

export const readPasswords = (filename: string) => {
  const lines = readLines(filename)
  const matches = lines.map(l => l.match(/(\d+)-(\d+) ([a-z]): ([a-z]+)/))
  return matches.map(m => { return { min: parseInt(m[1], 10), max: parseInt(m[2], 10), letter: m[3], password: m[4] } })
}
