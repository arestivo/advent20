export const getRolling = (map, x, y) => {
  const height = map.length
  const width = map[0].length

  return map[y % height][x % width]
}

export const getTreeCount = (map, dx, dy) => {
  let x = dx, y = dy, trees = 0

  while (y < map.length) {
    trees += getRolling(map, x, y) === '#' ? 1 : 0
    x += dx
    y += dy
  }

  return trees
}