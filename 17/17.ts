import {readInput} from "../input.helper"
import fs from "fs"

const rangeRegex = /target area: x=(?:(-?\d+)\.\.(-?\d+)), y=(?:(-?\d+)\.\.(-?\d+))/
const [,x1,x2,y1,y2] = rangeRegex.exec(readInput(17)) || [];
const ranges: number[][] = [[x1,x2].map(e => parseInt(e)),[y1,y2].map(e => parseInt(e))]

const sol1 = (input: number[][]) => {
  let [minY, maxY] = input[1]

  // Najvisokata tochka e ustvari triangle num od v
  // Posho min Y e negativen u momentov, toa sho ni treba e ustvari
  // 1. Otkako kje se vrati proektilot na y = 0, sledniot chekor mu e y += (inicijalniot V + 1) * -1
  // 2. Sho znachi, deka sekoj v sho e ednakov na minY kje go preskokne celiot target

  let v = Math.abs(minY + 1)
  return v*(v+1) / 2
}

// Redosled na ranges:
// Goren Y, Dolen Y, Goren X, Dolen X
const calculateTrajectories = (velocties: number[][], ranges: [number, number, number, number]): string[] => {
  const eligable: string[]= []
  const [uY, lY, uX, lX] = ranges

  for(let vKey in velocties) {
    let [vX, vY] = velocties[vKey]
    let curVX = vX;
    let curVY = vY;
    let x = 0;
    let y = 0;
    let found = false;
    while(y >= lY) {
      if((uY >= y && y >= lY) && (lX <= x && x <= uX)) {
        found = true;
        break
      }
      x += curVX;
      y += curVY;

      curVX = curVX === 0 ? 0 : curVX - 1;
      curVY -= 1 
    }

    if(found) {
      eligable.push(`${vX},${vY}`)
      continue;
    }

  }

  return eligable
}

const sol2 = (input: number[][]) => {
  // array of tuples
  let velocities: number[][] = [] 

  let [minX, maxX] = input[0]
  let [minY, maxY] = input[1]

  let upperRangeY:number = Math.abs(minY + 1) 
  let lowerRangeY:number = minY;

  let upperRangeX:number = maxX;
  let lowerRangeX:number = 0;

  let i =  lowerRangeX;
  let j = lowerRangeY;

  while(i <= upperRangeX) {
    while (j <= upperRangeY) {
      velocities.push([i,j])
      j++
    }
    j = lowerRangeY;
    i++;
  }

  const res: string[] = calculateTrajectories(velocities, [maxY, minY, maxX, minX]);
  return res.length
}

console.log({sol: "1", res: sol1(ranges)})
console.log({sol: "2", res: sol2(ranges)})
