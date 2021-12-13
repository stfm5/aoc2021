import { readInput } from "../input.helper";
import fs from "fs";

let lines: string[]= readInput(13).split("\n");
const input = [[...lines.slice(0, lines.indexOf(""))],[...lines.slice(lines.indexOf("")+1)]]

const insRegex = /fold along (?:(x|y)=(\d+))/

const drawMatrix = (locMatrix: string[], maxX: number, maxY: number):void => {
    let board: string[][]= []
    for(let i = 0;i <= maxX; i++) {
      board.push([...new Array(maxY+1)].fill(' '))
    }
    locMatrix.forEach((point:string) => {
      let [y, x] = point.split(",").map((e => parseInt(e)))
      board[x][y] = "#";
    }) 
    fs.writeFileSync("./out.txt", JSON.stringify(board.map(( e: string[] ) => e.join('')),null, '\n'))
}

const sol1 = (input: string[][], isPartOne: boolean) => {
  const [matrix, instructions] = input
  console.log(instructions)
  let locMatrix: string[] = JSON.parse(JSON.stringify(matrix));
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;
  for(const point in matrix) {
    let [y, x] = matrix[point].split(',').map(e => parseInt(e));
    if(x > maxX) {
      maxX = x;
    }
    if(y > maxY) {
      maxY = y;
    } 
  }

  for(const i in instructions) {
    let [,c1,c2]= insRegex.exec(instructions[i]) || []
    let val = parseInt(c2);
    console.log(`maxX: ${maxX}, maxY: ${maxY}, val: ${val}`)
    if(c1 === "y") {
      let folded: string[] = []
      for(const point in locMatrix) {
        let [y, x] = locMatrix[point].split(",").map(e => parseInt(e))
        if(x === val) {
          continue;
        }
        if(x === val + 1) {
          debugger
        }
        if(x > val) {
          x = val-(x-val)
        }
        folded.push(`${y},${x}`)
      }
      locMatrix = JSON.parse(JSON.stringify([...new Set(folded)]));
      maxX = val - 1;
    } else {
      let folded: string[] = []
      for(const point in locMatrix) {
        let [y, x] = locMatrix[point].split(",").map(e => parseInt(e))
        if(y === val) {
          continue;
        }
        if(y === val+1) {
          debugger;
        }
        if(y > val) {
          y = val-(y-val);
        }
        folded.push(`${y},${x}`)
      }
      locMatrix = JSON.parse(JSON.stringify([...new Set(folded)]));
      maxY = val - 1;
    }

    if(isPartOne) {
      break;
    }
  }
  console.log(`maxX: ${maxX}, maxY: ${maxY}, val: ${6}`);
  drawMatrix(locMatrix, maxX, maxY)
  return locMatrix.length
}

console.log({sol: "1", res: sol1(JSON.parse(JSON.stringify(input)), true)})
console.log({sol: "2", res: sol1(JSON.parse(JSON.stringify(input)), false)})