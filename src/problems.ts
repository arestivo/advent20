import * as io from "./io"
import * as util from "./include"

export const runProblem = (problem: string) => {
  // tslint:disable-next-line: no-eval
  if (typeof eval(`p${problem}`) === 'function')
    // tslint:disable-next-line: no-eval
    eval(`p${problem}()`)
  else
    console.log('No such problem!')
}

export const pnone = () => {
  console.log('Problem missing!')
}

export const p1a = () => {
  const numbers = io.readIntegers('1a.in')
  const map = new Map()

  for (const n of numbers) map[n] = n

  for (const n of numbers)
    if (map[2020 - n]) { console.log(map[2020 - n] * n); break }
}

export const p1b = () => {
  const numbers = io.readIntegers('1.in')
  const map = new Map()

  for (const n1 of numbers)
    for (const n2 of numbers)
      map[n1 + n2] = n1 * n2

  for (const n of numbers)
    if (map[2020 - n]) { console.log(map[2020 - n] * n); break }
}

export const p2a = () => {
  const passwords = io.readPasswords('2.in')
  console.log(passwords.filter(p => {
    const count = p.password.split(p.letter).length - 1
    return count >= p.min && count <= p.max
  }).length)
}

export const p2b = () => {
  const passwords = io.readPasswords('2.in')
  console.log(passwords.filter(p => {
    const l1 = p.password.charAt(p.min - 1)
    const l2 = p.password.charAt(p.max - 1)
    console.log(p, l1, l2)
    return l1 === p.letter && l2 !== p.letter || l1 !== p.letter && l2 === p.letter
  }).length)
}

export const p3a = () => {
  const map = io.readLines('3.in')

  console.log(util.getTreeCount(map, 3, 1))
}

export const p3b = () => {
  const map = io.readLines('3.in')
  const slopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]]

  let total = 1
  slopes.forEach(s => total *= util.getTreeCount(map, s[0], s[1]))

  console.log(total)
}

export const p4a = () => {
  const passports = io.readBatches('4.in')

  let total = 0

  for (const p of passports) {
    const fields = p.match(/\w+:/g).map(f => f.replace(':', ''))
    const required = ['ecl', 'pid', 'eyr', 'hcl', 'byr', 'iyr', 'hgt']
    const missing = required.filter(r => !fields.includes(r))

    if (missing.length === 0) total++
  }

  console.log(total)
}

export const p4b = () => {
  const passports = io.readBatches('4.in')

  let total = 0

  for (const p of passports) {
    const fields = p.split(' ').map(f => f.split(':'))
    const required = ['ecl', 'pid', 'eyr', 'hcl', 'byr', 'iyr', 'hgt']

    const valid = (f: string, v: string) => {
      if (f === 'byr' && !/^19[2-9]\d|200[0-2]$/.test(v)) return false
      if (f === 'iyr' && !/^201\d|2020$/.test(v)) return false
      if (f === 'eyr' && !/^202\d|2030$/.test(v)) return false
      if (f === 'hgt' && !/^(1[5-8]\d|19[0-3])cm|(59|6\d|7[0-6])in$/.test(v)) return false
      if (f === 'hcl' && !/^#[0-9a-f]{6}$/.test(v)) return false
      if (f === 'ecl' && !/^amb|blu|brn|gry|grn|hzl|oth$/.test(v)) return false
      if (f === 'pid' && !/^\d{9}$/.test(v)) return false

      return true
    }

    const count = fields.reduce((c, f) => c + (required.includes(f[0]) && valid(f[0], f[1]) ? 1 : 0), 0)
    if (count === 7) total++
  }

  console.log(total)
}

export const p5a = () => {
  const seats = io.readLines('5.in')

  let max = 0

  for (const seat of seats) {
    const row = parseInt(seat.substring(0, 7).replace(/B/g, '1').replace(/F/g, '0'), 2)
    const col = parseInt(seat.substring(7, 10).replace(/R/g, '1').replace(/L/g, '0'), 2)
    const id = row * 8 + col
    max = id > max ? id : max
  }

  console.log(max)
}

export const p5b = () => {
  const seats = io.readLines('5.in')

  const ids = []

  for (const seat of seats) {
    const row = parseInt(seat.substring(0, 7).replace(/B/g, '1').replace(/F/g, '0'), 2)
    const col = parseInt(seat.substring(7, 10).replace(/R/g, '1').replace(/L/g, '0'), 2)
    ids.push(row * 8 + col)
  }

  const sorted = ids.sort((a, b) => a - b)

  for (let i = 1; i < sorted.length - 1; i++)
    if (sorted[i] - sorted[i-1] !== 1) console.log(sorted[i] - 1)
}

export const p6a = () => {
  const groups = io.readBatches('6.in')

  let total = 0

  for (const group of groups) {
    const map = new Map()
    group.split(' ').map(p => p.split('').map(a => map.set(a, true)))
    total += map.size
  }

  console.log(total)
}

export const p6b = () => {
  const groups = io.readBatches('6.in')

  let total = 0

  for (const group of groups) {
    const map = new Map()
    const people = group.split(' ')
    people.map(p => p.split('').map(a => map.set(a, (map.get(a) || 0) + 1)))
    map.forEach(count => total += count === people.length ? 1 : 0)
  }

  console.log(total)
}