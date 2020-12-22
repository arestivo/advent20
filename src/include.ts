export const getRolling = (map: string[], x: number, y: number) => {
  const height = map.length
  const width = map[0].length

  return map[y % height][x % width]
}

export const getTreeCount = (map: string[], dx: number, dy: number) => {
  let x = dx
  let y = dy
  let trees = 0

  while (y < map.length) {
    trees += getRolling(map, x, y) === '#' ? 1 : 0
    x += dx
    y += dy
  }

  return trees
}

export const findInvalid = (numbers: number[]) => {
  const preamble = numbers.slice(0, 25)

  const calculateValid = () => {
    const valid = new Set()
    for (const i of preamble) for (const j of preamble) if (i !== j) valid.add(i + j)
    return valid
  }

  for (let i = 25; i < numbers.length; i++) {
    const valid = calculateValid()
    if (!valid.has(numbers[i])) return numbers[i]
    preamble.shift()
    preamble.push(numbers[i])
  }
}

export const findContiguousSum = (sum: number, numbers: number[]) => {
  let current = numbers[0]
  let start = 0

  for (let i = 1; i <= numbers.length; i++) {
    while (current > sum && start < i - 1) current -= numbers[start++]
    if (current === sum) return numbers.slice(start, i)
    if (i < numbers.length) current = current + numbers[i]
  }
}

export const directions = [[-1, -1], [-1, 0], [-1, 1],
                           [ 0, -1],          [ 0, 1],
                           [ 1, -1], [ 1, 0], [ 1, 1]]

export const neighbours = (dim: number) => {
  return _neighbours(dim).filter(n => n.some(c => c !== 0))
}

const _neighbours = (dim: number): number[][] => {
  if (dim === 0) return [[]]
  return _neighbours(dim - 1).map(n => [-1, 0, 1].map(c => n.concat([c]))).flat()
}