import * as io from "./io"
import * as util from "./include"
import HGCv8 from "./hgcv8"
import { callbackify } from "util"
import { userInfo } from "os"
import { create } from "domain"

export const runProblem = (problem: string) => {
  let f: () => void

  try {
    // tslint:disable-next-line: no-eval
    if (typeof eval(`p${problem}`) === 'function')
      // tslint:disable-next-line: no-eval
      f = eval(`p${problem}`)
  } finally {
    if (f !== undefined) f()
    else console.log('No such problem!')
  }
}

export const p1a = () => {
  const numbers = io.readIntegers('1.in')
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
    const id = parseInt(seat.replace(/B|R/g, '1').replace(/F|L/g, '0'), 2)
    max = id > max ? id : max
  }

  console.log(max)
}

export const p5b = () => {
  const seats = io.readLines('5.in')

  const ids = []

  for (const seat of seats)
    ids.push(parseInt(seat.replace(/B|R/g, '1').replace(/F|L/g, '0'), 2))

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

export const p7a = () => {
  const rules = io.readBagRules('7.in')
  const found = new Set()

  const toSearch = ['shiny gold']

  while (toSearch.length > 0) {
    const lookingFor = toSearch.pop()
    for (const rule of rules ) {
      if (rule.contents.some(c => c.bag === lookingFor && !found.has(rule.container))) {
        found.add(rule.container)
        toSearch.push(rule.container)
      }
    }
  }

  console.log(found.size)
}

export const p7b = () => {
  const rules = io.readBagRules('7.in')
  const toOpen = [ { qty: 1, bag: 'shiny gold' } ]

  let total = 0

  while (toOpen.length > 0) {
    const opening = toOpen.pop()
    total += opening.qty

    const rule = rules.find(r => r.container === opening.bag)

    if (rule !== undefined)
      rule.contents.forEach(c => toOpen.push({ qty: opening.qty * c.qty, bag: c.bag }))
  }

  console.log(total - 1)
}

export const p8a = () => {
  const code = io.readLines('8.in')
  const hgc = new HGCv8(code)

  hgc.run()

  console.log(hgc.acc)
}

export const p8b = () => {
  const code = io.readLines('8.in')
  const hgc = new HGCv8(code)

  for (const line of hgc.code) {
    hgc.reset()

    line.op = line.op === 'jmp' ? 'nop' : (line.op === 'nop' ? 'jmp' : line.op)
    const status = hgc.run()
    line.op = line.op === 'jmp' ? 'nop' : (line.op === 'nop' ? 'jmp' : line.op)

    if (status) console.log(hgc.acc)
  }
}

export const p9a = () => {
  const numbers = io.readIntegers('9.in')
  console.log(util.findInvalid(numbers))
}

export const p9b = () => {
  const numbers = io.readIntegers('9.in')

  const invalid = util.findInvalid(numbers)
  const slice = util.findContiguousSum(invalid, numbers)

  console.log(Math.min(...slice) + Math.max(...slice))
}

export const p10a = () => {
  const adapters = io.readIntegers('10.in').sort((a,b) => a-b)

  let last = 0
  let count1 = 0
  let count3 = 0
  for (const a of adapters) {
    if (a - last === 1) count1++
    if (a - last === 3) count3++
    last = a
  }

  console.log(count1 * (count3 + 1))
}

export const p10b= () => {
  const adapters = io.readIntegers('10.in').sort((a,b) => a-b)
  const device = Math.max(...adapters)+3
  const set = new Set(adapters)
  const mem = new Map()

  const count = (current: number) => {
    if (mem.has(current)) return mem.get(current)

    let total = 0

    for (let i = 1; i <= 3; i++) {
      if (set.has(current + i)) total += count(current + i)
      if (current + i === device) total++
    }

    mem.set(current, total)

    return total
  }

  console.log(count(0))
}

export const p11a= () => {
    const seats = io.readLines('11.in').map(r => r.split(''))

    const adjacent = (s: string[][], r: number, c: number) =>
      util.directions.map(d => [r + d[0], c + d[1]])
        .filter(a => s[a[0]] !== undefined)
        .filter(a => s[a[0]][a[1]] !== undefined)
        .map(a => s[a[0]][a[1]])

    while (true) {
      const changed = []

      for (const [r, row] of seats.entries())
        for (const [c, seat] of row.entries()) {
          if (seat === 'L' && adjacent(seats, r, c).every(a => a !== '#'))
            changed.push({r, c, t: '#'})
          if (seat === '#' && adjacent(seats, r, c).filter(a => a === '#').length >= 4)
            changed.push({r, c, t: 'L'})
        }

      if (changed.length === 0) break;
      changed.forEach(s => seats[s.r][s.c] = s.t)
    }

    console.log(seats.join('').match(/#/g).length)
}

export const p11b= () => {
  const seats = io.readLines('11.in').map(r => r.split(''))

  const find = (s: string[][], r:number, c:number, d: number[]) => {
    while (true) {
      r += d[0]; c += d[1]
      if (s[r] === undefined || s[r][c] === undefined) return
      if (s[r][c] !== '.') return s[r][c]
    }
  }

  const adjacent = (s: string[][], r: number, c: number) => util.directions.map(d => find(s, r, c, d))

  while (true) {
    const changed = []

    for (const [r, row] of seats.entries())
      for (const [c, seat] of row.entries()) {
        if (seat === 'L' && adjacent(seats, r, c).every(a => a !== '#')) changed.push({r, c, t: '#'})
        if (seat === '#' && adjacent(seats, r, c).filter(a => a === '#').length >= 5) changed.push({r, c, t: 'L'})
      }

    if (changed.length === 0) break;
    changed.forEach(s => seats[s.r][s.c] = s.t)
  }

  console.log(seats.join('').match(/#/g).length)
}

export const p12a= () => {
  const actions = io.readLines('12.in').map(l => l.match(/(\w)(\d+)/)).map(g => { return { a: g[1], v: parseInt(g[2], 10) } })

  const pos = [0, 0]
  let dir = 'E'

  const goL = new Map([['E', 'N'], ['N', 'W'], ['W', 'S'], ['S', 'E']])
  const goR = new Map([['E', 'S'], ['S', 'W'], ['W', 'N'], ['N', 'E']])
  const goB = new Map([['E', 'W'], ['W', 'E'], ['N', 'S'], ['S', 'N']])
  const goF = new Map([['E', 'E'], ['N', 'N'], ['W', 'W'], ['S', 'S']])

  const rotateL = new Map([[0, goF], [90, goL], [180, goB], [270, goR], [360, goF]])
  const rotateR = new Map([[0, goF], [90, goR], [180, goB], [270, goL], [360, goF]])

  const delta = new Map([['E', [1, 0]], ['N', [0, -1]], ['W', [-1, 0]], ['S', [0, 1]]])

  actions.forEach(a => {
    switch(a.a) {
      case 'L': dir = rotateL.get(a.v).get(dir); break;
      case 'R': dir = rotateR.get(a.v).get(dir); break;
      case 'F': const d1 = delta.get(dir); if (d1 !== undefined) { pos[0]+= d1[0] * a.v; pos[1]+= d1[1] * a.v }; break;
      default: const d2 = delta.get(a.a); if (d2 !== undefined) { pos[0]+= d2[0] * a.v; pos[1]+= d2[1] * a.v }; break;
    }
  })

  console.log(Math.abs(pos[0]) + Math.abs(pos[1]))
}

export const p12b= () => {
  const actions = io.readLines('12.in').map(l => l.match(/(\w)(\d+)/)).map(g => { return { a: g[1], v: parseInt(g[2], 10) } })

  const pos = [0, 0]
  let cwp = [10, -1]

  const goL = (wp: number[]) => [wp[1], -wp[0]]
  const goR = (wp: number[]) => [-wp[1], wp[0]]
  const goB = (wp: number[]) => [-wp[0], -wp[1]]
  const goF = (wp: number[]) => [wp[0], wp[1]]

  const rotateL = new Map([[0, goF], [90, goL], [180, goB], [270, goR], [360, goF]])
  const rotateR = new Map([[0, goF], [90, goR], [180, goB], [270, goL], [360, goF]])

  const delta = new Map([['E', [1, 0]], ['N', [0, -1]], ['W', [-1, 0]], ['S', [0, 1]]])

  actions.forEach(a => {
    switch(a.a) {
      case 'L': cwp = rotateL.get(a.v)(cwp); break;
      case 'R': cwp = rotateR.get(a.v)(cwp); break;
      case 'F': pos[0]+= cwp[0]*a.v; pos[1]+= cwp[1]*a.v; break;
      default: const d = delta.get(a.a); if (d !== undefined) { cwp[0]+= d[0]*a.v; cwp[1]+= d[1]*a.v }; break;
    }
  })

  console.log(Math.abs(pos[0]) + Math.abs(pos[1]))
}

export const p13a= () => {
  const [time, buses] = io.readLines('13.in').map(l => l.split(',').filter(b => b !== 'x').map(v => parseInt(v, 10)))

  let min = Number.MAX_SAFE_INTEGER
  let selected: number

  buses.forEach(bus => {
    if (bus - time[0] % bus < min) {
      min = bus - time[0] % bus
      selected = bus
    }
  })

  console.log(min * selected)
}

export const p13b = () => {
  const [_, buses] = io.readLines('13.in').map(l => l.split(',').map((n, i)=>{return {i, n}}).filter(b => b.n !== 'x').map(b => { return { i: b.i, n: parseInt(b.n, 10) } }))

  const gcd = (a: number, b: number) => { if(b) return gcd(b, a % b); else return a; }
  const lcm = (a: number, b: number) => a * b / gcd(a, b)
  const nlcm = (x: number, y: number, a: number, b: number) => {
    while (x !== y)
      if (x < y) {x += a} else y += Math.ceil((x - y) / b) * b
    return x
  }

  const find = (b: {i: number, n: number}[]) => {
    let current = b[0].n
    let delta = b[0].n
    for (let i = 1; i < b.length; i++) {
      current = nlcm(current, b[i].n - (b[i].i - b[0].i), delta, b[i].n)
      delta = lcm(delta, b[i].n)
    }
    return current
  }

  console.log(find(buses))
}

export const p14a = () => {
  const lines = io.readLines('14.in')
  const code = lines
    .map(l => {
      if (l.startsWith('mask')) {
        const c = l.match(/[X01]+/)
        return { i: 'mask', m: c[0] }
      } else if (l.startsWith('mem')) {
        const c = l.match(/mem\[(\d+)] = (\d+)/)
        return { i: 'mem', p: parseInt(c[1], 10), v: c[2] }
      }
    })

  const mem = new Map()
  let mask = ''

  code.forEach(c => {
    switch (c.i) {
      case 'mem':
        // tslint:disable-next-line: no-construct
        const value = new Number(c.v).toString(2).split('')
        const padded = Array(36 - value.length).fill('0').concat(value)
        for (const [i, v] of padded.entries())
          padded[i] = mask[i] === 'X' ? padded[i] : mask[i]
        mem.set(c.p, padded)
        break
      case 'mask':
        mask = c.m
    }
  })

  let total = 0
  for (const m of mem.values())
    total += parseInt(m.join(''), 2)

  console.log(total)
}

export const p14b = () => {
  const lines = io.readLines('14.in')
  const code = lines
    .map(l => {
      if (l.startsWith('mask')) {
        const c = l.match(/[X01]+/)
        return { i: 'mask', m: c[0] }
      } else if (l.startsWith('mem')) {
        const c = l.match(/mem\[(\d+)] = (\d+)/)
        return { i: 'mem', p: c[1], v: c[2] }
      }
    })

  const mem = new Map()
  let mask = []

  const unmask = (padded: string[], m: string[]) => {
    let addresses = [padded.map((n, idx) => m[idx] === '1' ? '1' : n)]

    let i = -1

    // tslint:disable-next-line: no-conditional-assignment
    while((i = m.indexOf('X', ++i)) !== -1) {
      addresses = addresses.reduce((na: string[][], a) => {
        na.push(a.map((v, p) => p === i ? '0' : v))
        na.push(a.map((v, p) => p === i ? '1' : v))
        return na
      }, [])
    }

    return addresses
  }

  code.forEach(c => {
    switch (c.i) {
      case 'mem':
        // tslint:disable-next-line: no-construct
        const address = new Number(c.p).toString(2).split('')
        const padded = Array(36 - address.length).fill('0').concat(address)
        const addresses = unmask(padded, mask)
        // tslint:disable-next-line: no-construct
        for (const a of addresses) mem.set(a.join(''), parseInt(new Number(c.v).toString(2), 2))
        break
      case 'mask':
        mask = c.m.split('')
    }
  })

  let total = 0
  for (const m of mem.values())
    total += m

  console.log(total)
}

export const p15a = (until = 2020) => {
  const numbers = io.readCSInteger('15.in')

  let turn = 0
  let num = numbers[numbers.length - 1]

  const lastTime = new Map()
  numbers.forEach(n => lastTime.set(n, [++turn]))

  while (turn++ !== until) {
    const when = lastTime.get(num) === undefined ? [] : lastTime.get(num)
    const spoken = when.length < 2 ? 0 : when[when.length - 1] - when[when.length - 2]
    const update = lastTime.get(spoken) === undefined ? [] : lastTime.get(spoken)

    update.push(turn)
    lastTime.set(spoken, update)
    num = spoken
  }

  console.log(num)
}

export const p15b = () => {
  p15a(30000000)
}

export const p16a = () => {
  const tickets = io.readTickets('16.in')

  const isValid = (v: number) =>
    tickets.classes.some(c => c.rules.some(r => v >= r.from && v <= r.to))
  const rate =
    tickets.nearby.reduce((r1, t) => r1 + t.reduce((r2, v) => r2 + (!isValid(v) ? v : 0), 0), 0)

  console.log(rate)
}

export const p16b = () => {
  const tickets = io.readTickets('16.in')

  const isValid = (v: number) => tickets.classes.some(c => c.rules.some(r => v >= r.from && v <= r.to))
  const possibleClasses = (v) => tickets.classes.filter(c => c.rules.some(r => v >= r.from && v <= r.to)).map(c => c.name)

  const valid = tickets.nearby.filter(t => t.every(n => isValid(n)))
  const remaining = valid[0].map(_ => tickets.classes.map(t => t.name))

  valid.forEach(t => t.forEach(
    (v, i) => remaining[i] = remaining[i].filter(r => new Set(possibleClasses(v)).has(r))
  ))

  while (remaining.some(r => r.length !== 1))
    remaining.forEach((r1, i1) => {
      if (r1.length === 1) {
        remaining.forEach((r2, i2) => {
          if (i1 !== i2) remaining[i2] = r2.filter(r => r !== r1[0])
        })
      }
    })

  console.log(
    remaining
      .map(r => r[0])
      .reduce((total, r, i) => total *= r.startsWith('departure') ? tickets.ticket[i] : 1, 1)
  )
}

export const p17a = (dim = 3) => {
  const slice = io.readLines('17.in').map(s => s.split(''))
  const cubes = new Map<string, {x: number, y: number, z: number}>()

  slice.forEach((row, x) => row.forEach((cube, y) => {if (cube === '#') cubes.set(JSON.stringify({x, y, z: 0}), {x, y, z: 0})}))

  for (let i = 0; i < 6; i++) {
    const toAdd = new Set<{x: number, y: number, z: number}>()
    const toRemove = [...cubes.values()].map(c => ({c, n: util.neighbours(3)
      .map(n => ({x: c.x + n[0], y: c.y + n[1], z: c.z + n[2]}))
      .filter(n => cubes.has(JSON.stringify(n))).length})
    ).filter(c => c.n !==2 && c.n !== 3 ).map(c => c.c)

    const xs = [...cubes.values()].map(c => c.x)
    const ys = [...cubes.values()].map(c => c.y)
    const zs = [...cubes.values()].map(c => c.z)

    for (let x = Math.min(...xs) - 1; x <= Math.max(...xs) + 1; x++) {
      for (let y = Math.min(...ys) - 1; y <= Math.max(...ys) + 1; y++) {
        for (let z = Math.min(...zs) - 1; z <= Math.max(...zs) + 1; z++) {
          const nc = util.neighbours(3)
            .map(n => ({x: x + n[0], y: y + n[1], z: z + n[2]}))
            .filter(n => cubes.has(JSON.stringify(n)))
          if (nc.length === 3) toAdd.add({x, y, z})
        }
      }
    }

    toRemove.forEach(r => cubes.delete(JSON.stringify(r)))
    toAdd.forEach(r => cubes.set(JSON.stringify(r), r))
  }
  console.log(cubes.size)
}

export const p17b = () => {
  const slice = io.readLines('17.in').map(s => s.split(''))
  const cubes = new Map<string, {x: number, y: number, z: number, w: number}>()

  slice.forEach((row, x) => row.forEach((cube, y) => {
    if (cube === '#') cubes.set(JSON.stringify({x, y, z: 0, w: 0}), {x, y, z: 0, w: 0})
  }))

  for (let i = 0; i < 6; i++) {
    const toAdd = new Set<{x: number, y: number, z: number, w: number}>()
    const toRemove = [...cubes.values()].map(c => ({c, n: util.neighbours(4)
      .map(n => ({x: c.x + n[0], y: c.y + n[1], z: c.z + n[2], w: c.w + n[3]}))
      .filter(n => cubes.has(JSON.stringify(n))).length})
    ).filter(c => c.n !==2 && c.n !== 3 ).map(c => c.c)

    const xs = [...cubes.values()].map(c => c.x)
    const ys = [...cubes.values()].map(c => c.y)
    const zs = [...cubes.values()].map(c => c.z)
    const ws = [...cubes.values()].map(c => c.w)

    for (let x = Math.min(...xs) - 1; x <= Math.max(...xs) + 1; x++)
      for (let y = Math.min(...ys) - 1; y <= Math.max(...ys) + 1; y++)
        for (let z = Math.min(...zs) - 1; z <= Math.max(...zs) + 1; z++)
          for (let w = Math.min(...ws) - 1; w <= Math.max(...ws) + 1; w++)
            if (util.neighbours(4)
                  .map(n => ({x: x + n[0], y: y + n[1], z: z + n[2], w: w + n[3]}))
                  .filter(n => cubes.has(JSON.stringify(n))).length === 3) toAdd.add({x, y, z, w})

    toRemove.forEach(r => cubes.delete(JSON.stringify(r)))
    toAdd.forEach(r => cubes.set(JSON.stringify(r), r))
  }
  console.log(cubes.size)
}

export const p18a = () => {
  const expressions = io.readLines('18.in')

  const calc = (e: string) => {
    const values = e.match(/\d+/g).map(v => parseInt(v, 10))
    const ops = e.match(/[+\-*/]/g)
    let total = values[0]
    for (let i = 1; i < values.length; i++) {
      if (ops[i - 1] === '+') total += values[i]
      if (ops[i - 1] === '*') total *= values[i]
    }
    return total
  }

  const simplify = (e: string) => {
    const [part, inside] = e.match(/\(([^()]+)\)/)
    const value = calc(inside)
    return e.replace(part, value.toString())
  }

  let total = 0
  expressions.forEach(e => {
    while (e.indexOf('(') !== -1) e = simplify(e)
    total += calc(e)
  })

  console.log(total)
}

export const p18b = () => {
  const expressions = io.readLines('18.in')

  const mul = (e: string) => {
    const part = e.match(/\d+ \* \d+/)[0]
    const values = part.match(/\d+/g)
    const value = parseInt(values[0], 10) * parseInt(values[1], 10)
    return e.replace(part, value.toString())
  }


  const sum = (e: string) => {
    const part = e.match(/\d+ \+ \d+/)[0]
    const values = part.match(/\d+/g)
    const value = parseInt(values[0], 10) + parseInt(values[1], 10)
    return e.replace(part, value.toString())
  }

  const calc = (e: string) => {
    while (e.indexOf('+') !== -1) e = sum(e)
    while (e.indexOf('*') !== -1) e = mul(e)
    return parseInt(e, 10)
  }

  const simplify = (e: string) => {
    const [part, inside] = e.match(/\(([^()]+)\)/)
    const value = calc(inside)
    return e.replace(part, value.toString())
  }

  let total = 0
  expressions.forEach(e => {
    while (e.indexOf('(') !== -1) e = simplify(e)
    total += calc(e)
  })

  console.log(total)
}

export const p19a = () => {
  const [ruleParts, messages] = io.readChunks('19.in')

  const rules = new Map()
  ruleParts.forEach(p => {
    const sides = p.split(':')
    rules.set(sides[0].trim(), sides[1].trim())
  })

  const createRegex = (rule: string) => {
    if (rule.indexOf('|') !== -1)
      return `(${rule.split('|').map(p => createRegex(p.trim())).join('|')})`

    if (rule.indexOf('"') !== -1)
      return rule.match(/"(.+)"/)[1]

    return rule.split(' ').map(p => createRegex(rules.get(p))).join('')
  }

  const regex = new RegExp(`^${createRegex(rules.get('0'))}$`)

  let count = 0
  for (const m of messages)
    count += regex.test(m) ? 1 : 0
  console.log(count)
}

export const p19b = () => {
  const [ruleParts, messages] = io.readChunks('19.in')

  const rules = new Map()
  ruleParts.forEach(p => {
    const sides = p.split(':')
    rules.set(sides[0].trim(), sides[1].trim())
  })

  const createRegex = (rule: string) => {
    if (rule.indexOf('|') !== -1)
      return `(${rule.split('|').map(p => createRegex(p.trim())).join('|')})`

    if (rule.indexOf('"') !== -1)
      return rule.match(/"(.+)"/)[1]

    return rule.split(' ').map(p => createRegex(rules.get(p))).join('')
  }

  rules.set('8', '42 | 42 42 | 42 42 42 | 42 42 42 42 | 42 42 42 42 42 | 42 42 42 42 42 42 | 42 42 42 42 42 42 42 | 42 42 42 42 42 42 42 42')
  rules.set('11', '42 31 | 42 42 31 31 | 42 42 42 31 31 31 | 42 42 42 42 31 31 31 31 | 42 42 42 42 42 31 31 31 31 31 | 42 42 42 42 42 42 31 31 31 31 31 31')

  const regex = new RegExp(`^${createRegex(rules.get('0'))}$`)

  let count = 0
  for (const m of messages)
    count += regex.test(m) ? 1 : 0
  console.log(count)
}

export const p20a = () => {
  const tiles = io.readChunks('20.in').map(t => ({id: parseInt(t[0].match(/\d+/)[0], 10), data: t.slice(1).map(r => r.split('')), left: [], right: [], top: [], bottom: [] }))
  const size = Math.sqrt(tiles.length)

  const rotate = (m: string[][]) => m[0].map((v, i) => m.map(r => r[i]).reverse())
  const flip = (m: string[][]) => [...m].reverse()
  const rotateN = (m: string[][], n: number) => {
    for (let i = 0; i < n % 4; i++) m = rotate(m)
    if (n > 3) return flip(m)
    return m
  }

  const checkLeft = (left: string[][], right: string[][]) => {
    if (left === undefined) return true
    for (let i = 0; i < left.length; i++)
      if (left[i][left[i].length - 1] !== right[i][0]) return false
    return true
  }

  const checkTop = (top: string[][], bottom: string[][]) => {
    if (top === undefined) return true
    for (let i = 0; i < top[top.length - 1].length; i++)
      if (top[top.length - 1][i] !== bottom[0][i]) return false
    return true
  }

  const fits = (filled: { idx: number, rot: number }[][], row: number, column: number, idx: number, rot: number) => {
    const top = filled[row - 1] === undefined ? undefined : rotateN(tiles[filled[row - 1][column].idx].data, filled[row - 1][column].rot)
    const left = filled[row][column - 1] === undefined ? undefined : rotateN(tiles[filled[row][column - 1].idx].data, filled[row][column - 1].rot)
    const tile = rotateN(tiles[idx].data, rot)

    return checkLeft(left, tile) && checkTop(top, tile)
  }

  const empty = []
  for (let i = 0; i < size; i++) {
    empty[i] = []
      for (let j = 0; j < size; j++) empty[i][j] = undefined
  }

  for (const [i, t1] of tiles.entries())
    for (const [j, t2] of tiles.entries())
        for (let r = 0; r < 8; r++) {
          if (i !== j && checkLeft(t1.data, rotateN(t2.data, r))) t1.right.push(t2.id)
          if (i !== j && checkTop(t1.data, rotateN(t2.data, r))) t1.bottom.push(t2.id)
          if (i !== j && checkLeft(rotateN(t2.data, r), t1.data)) t1.left.push(t2.id)
          if (i !== j && checkTop(rotateN(t2.data, r), t1.data)) t1.top.push(t2.id)
        }

    const corners = tiles.filter(t => 
      t.left.length === 0 && t.top.length === 0 ||
      t.left.length === 0 && t.bottom.length === 0 ||
      t.right.length === 0 && t.top.length === 0 ||
      t.right.length === 0 && t.bottom.length === 0
    )

    console.log(corners.reduce((m, t) => m = m * t.id, 1))
}

export const p20b = () => {
  const tiles = io.readChunks('20.in').map(t => ({id: parseInt(t[0].match(/\d+/)[0], 10), data: t.slice(1).map(r => r.split('')), left: [], right: [], top: [], bottom: [] }))
  const size = Math.sqrt(tiles.length)
  let image: string[][] = []

  const rotate = (m: string[][]) => m[0].map((v, i) => m.map(r => r[i]).reverse())
  const flip = (m: string[][]) => [...m].reverse()
  const rotateN = (m: string[][], n: number) => {
    for (let i = 0; i < n % 4; i++) m = rotate(m)
    if (n > 3) return flip(m)
    return m
  }

  const peal = (m: string[][]) => m
    .filter((v, i) => i !== 0 && i !== m.length - 1)
    .map(r => r.filter((c, i) => i !== 0 && i !== r.length - 1))

  const checkLeft = (left: string[][], right: string[][]) => {
    if (left === undefined) return true
    for (let i = 0; i < left.length; i++)
      if (left[i][left[i].length - 1] !== right[i][0]) return false
    return true
  }

  const checkTop = (top: string[][], bottom: string[][]) => {
    if (top === undefined) return true
    for (let i = 0; i < top[top.length - 1].length; i++)
      if (top[top.length - 1][i] !== bottom[0][i]) return false
    return true
  }

  const fits = (filled: { idx: number, rot: number }[][], row: number, column: number, idx: number, rot: number) => {
    const top = filled[row - 1] === undefined ? undefined : rotateN(tiles[filled[row - 1][column].idx].data, filled[row - 1][column].rot)
    const left = filled[row][column - 1] === undefined ? undefined : rotateN(tiles[filled[row][column - 1].idx].data, filled[row][column - 1].rot)
    const tile = rotateN(tiles[idx].data, rot)

    return checkLeft(left, tile) && checkTop(top, tile)
  }

  const construct = (used: Set<number>, row: number, column: number, filled: { idx: number, rot: number }[][]) => {
    if (image.length !== 0) return

    if (column === size) { column = 0; row++}
    if (row === size) {
      const map: string[][] = []
      const parts = filled.map(r => r.map(c => peal(rotateN(tiles[c.idx].data, c.rot))))
      const bsize = parts[0][0][0].length

      for (const line of parts) {
        for (let r = 0; r < bsize; r++) {
          map.push([])
          for (let c1 = 0; c1 < size; c1++)
            for (let c2 = 0; c2 < bsize; c2++)
              map[map.length - 1].push(line[c1][r][c2])
        }
      }

      image = map
    }

    for (const idx of tiles.keys()) {
      if (!used.has(idx)) {
        used.add(idx)

        for (let rot = 0; rot < 8; rot++) {
          if (fits(filled, row, column, idx, rot)) {
            filled[row][column] = { idx, rot }
            construct(used, row, column + 1, filled)
          }
        }

        used.delete(idx)
        filled[row][column] = undefined
      }
    }
  }

  const empty = []
  for (let i = 0; i < size; i++) {
    empty[i] = []
      for (let j = 0; j < size; j++) empty[i][j] = undefined
  }

  const search = (pattern: string[][], image: string[][]) => {
    const monsterHeight = pattern.length
    const monsterWidth = pattern[0].length

    const test = (r: number, c: number) => {
      for (let rm = 0; rm < monsterHeight; rm++)
        for (let cm = 0; cm < monsterWidth; cm++)
          if (pattern[rm][cm] === '#' && image[r + rm][c + cm] !== pattern[rm][cm]) return false
      return true
    }

    let count = 0
    for (let r = 0; r < image.length - monsterHeight; r++)
      for (let c = 0; c < image[0].length - monsterWidth; c++)
        if (test(r, c)) count++

    return count
  }

  construct(new Set(), 0, 0, empty)

  const monster = ['                  # '.split(''),
                   '#    ##    ##    ###'.split(''),
                   ' #  #  #  #  #  #   '.split('')]

  let best = 0
  for (let r = 0; r < 8; r++) {
    const found = search(monster, rotateN(image, r))
    if (found > best) best = found
  }

  console.log(
    image.reduce((c1, l) => c1 += l.reduce((c2, p) => c2 += p === '#' ? 1 : 0, 0), 0) -
    best * monster.reduce((c1, l) => c1 += l.reduce((c2, p) => c2 += p === '#' ? 1 : 0, 0), 0)
  )
}