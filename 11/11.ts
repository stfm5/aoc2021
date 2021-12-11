import { readInput } from "../input.helper";
const input: number[][]= readInput(11).split("\n").map(e => e.split("").map(num => parseInt(num)));

const len = 10;

/**
 * Gledame koi se komshii za x i y sho NE svetnale vekje
 * @param x
 * @param y
 * @param flashed 
 * @param neighbours 
 * @returns 
 */
const findNeighbours = (x: number, y: number, flashed: number[][]): number[][] => {
  let res: number[][] = [] 
 
  // Gorni komshii (nad, gore levo i gore desno)
  if(0 <= x-1) {
    res.push([x-1, y]);
    if(0 <= y-1) {
      res.push([x-1, y-1]);
    }
    if(y+1 < len) {
      res.push([x-1, y+1])
    }
  }

  // Lev komshija
  if(0 <= y-1) {
    res.push([x, y-1])
  }

  if(y+1 < len) {
    res.push([x, y+1])
  }

  // Dolni komshii (dole, dole levo i dole desno)
  if(x+1 < len) {
    res.push([x+1, y]);
    if(0 <= y-1) {
      res.push([x+1, y-1]);
    }
    if(y+1 < len) {
      res.push([x+1, y+1])
    }
  }

  // Gi filtrirame samo komshiite koi dosega ne svetnale
  res = [...res.filter((neighborus: number[]) => {
    return !flashed.find((prevFlash: number[]) => {
      return prevFlash[0] === neighborus[0] && prevFlash[1] === neighborus[1]
    })
  })]

  return res
}
const sol1 = (input: number[][], isSim: boolean) => {
  let steps = 0
  let numFlashes = 0
  console.log(input)
  while(isSim ? true : steps < 100) {
    let flashed: number[][] = []
    let neighbours: number[][]= []

    let sum = 0;

    if(steps < 10) {
      console.log(input)
    }
    for(const row in input) {
      sum += input[row].reduce((a,b) => a+b);
    }
    if(sum === 0) {
      break
    }
    for(let i = 0; i < len; i++) {
      for(let j = 0; j < len; j++) {
        // Dali ovoj chekor vekje svetnal
        if(!flashed.find((e: number[]) => {return e[0] === i && e[1] === j})) {
          input[i][j] = (input[i][j] + 1) % 10
          if(input[i][j] === 0) {
            flashed.push([i,j])
            numFlashes++;
            let locNeighbours: number[][] = findNeighbours(i,j, flashed);
            neighbours.push(...locNeighbours);
            while(neighbours.length > 0) {
              let [locX, locY] = neighbours.pop() || [];
              if(!flashed.find((e: number[]) => {return e[0] === locX && e[1] === locY})) {
                input[locX][locY] = (input[locX][locY] + 1) % 10
                if(input[locX][locY] === 0) {
                  flashed.push([locX,locY])
                  numFlashes++;
                  let locNeighbours: number[][] = findNeighbours(locX,locY, flashed);
                  neighbours.push(...locNeighbours);
                }
              }
            }
          }
        }
      }
    }
    steps++;
  }
  return isSim ? steps: numFlashes
}

console.log({sol: "1", res: sol1(JSON.parse(JSON.stringify( input )), false)})
console.log({sol: "2", res: sol1(JSON.parse(JSON.stringify(input)), true)})