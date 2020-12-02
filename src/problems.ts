import * as io from "./io"

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