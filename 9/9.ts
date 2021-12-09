import { readInput } from "../input.helper";

const input = readInput(9).split("\n").map((e: string) => {
  return e.split("").map(val => parseInt(val))
})


/**
 * Proverue dali tochkata vekje bila najdena 
 * @param point: number[]
 * @param checked: number[][]
 * 
 */
const isChecked = (point: number[], checked: number[][], possible: number[][]): boolean => {
  let [x,y] = point
  return !!checked.find((e: number[]) => e[0] === x && e[1] === y) || !!possible.find((e: number[]) => e[0] === x && e[1] === y)
}

const sol1 = (map: number[][]) => {
  const x = map.length
  const y = map[0].length

  let sum = 0

  for(let i = 0; i < x; i++) {
    for(let j = 0; j < y; j++) {
      let isLower = true
      let val = map[i][j]
      if(i > 0 && map[i-1][j] <= val) {
        isLower = false
      } else if (i < x-1 && map[i+1][j] <= val) {
        isLower = false
      } else if (j>0 && map[i][j-1] <= val) {
        isLower = false
      } else if (j < y-1 && map[i][j+1] <= val) {
        isLower = false
      }

      if(isLower) {
        sum += val + 1;
      }
    }
  }

  return sum
}

const sol2 = (map: number[][]) => {
  const x = map.length
  const y = map[0].length

  let lowPoints: number[][] = []

  for(let i = 0; i < x; i++) {
    for(let j = 0; j < y; j++) {
      let isLower = true
      let val = map[i][j]
      if(i > 0 && map[i-1][j] <= val) {
        isLower = false
      } 
      if (i < x-1 && map[i+1][j] <= val) {
        isLower = false
      } 
      if (j>0 && map[i][j-1] <= val) {
        isLower = false
      } 
      if (j < y-1 && map[i][j+1] <= val) {
        isLower = false
      }

      if(isLower) {
        lowPoints.push([i,j])
      }
    }
  }

  let basins: number[] = []
  lowPoints.forEach(( point: number[] ) => {
    let checkedIndexes: number[][] = []
    let possibleIndexes: number[][] = [[...point]]
    while(true) {
      let [i, j] = possibleIndexes.pop() || [];
      let isPossible = true;
      if(i > 0 && map[i-1][j] !== 9 && !isChecked([i-1,j], checkedIndexes, possibleIndexes)) {
        possibleIndexes.push([i-1, j]);
      } 
      if(i < x - 1 && map[i+1][j] !== 9 && !isChecked([i+1,j], checkedIndexes, possibleIndexes)){
        possibleIndexes.push([i+1, j]);
      } 
      if(j > 0 && map[i][j-1] !== 9 && !isChecked([i, j-1], checkedIndexes, possibleIndexes)) {
        possibleIndexes.push([i, j-1])
      } 
      if(j < y-1 && map[i][j+1] !== 9 && !isChecked([i, j+1], checkedIndexes, possibleIndexes)) {
        possibleIndexes.push([i, j+1])
      }
      checkedIndexes.push([i, j]);
      if(possibleIndexes.length === 0) {
        break
      }
    }
    basins.push(checkedIndexes.length);
  })

  let [p1,p2,p3] = basins.sort((a,b) => b - a)
  return p1 * p2 * p3
}

console.log({name: "sol1", val: sol1(input)})
console.log({name: "sol2", val: sol2(input)})