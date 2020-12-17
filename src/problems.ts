import * as io from "./io"
import * as util from "./include"
import HGCv8 from "./hgcv8"

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