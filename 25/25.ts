import { readInput } from "../input.helper";
import { Hash } from "../helper.types";
import fs from "fs";

const input: string[]= readInput(25).split("\n");
const H = input.length
const W = input[0].length

type Herd = {
  from: [number,number],
  to: [number,number]
}
type SeaFloor = {
  herds: {
    east: Herd[],
    south: Herd[]
  }, 
  empty: Hash<boolean>
}

const parseInput = (input: string[]): SeaFloor => {
  const seaFloor: SeaFloor = {
    herds: {
      east: [],
      south: []
    },
    empty: {}
  }
  let southHerds: Herd[]= []
  input.forEach((row: string, i: number) => {
    let eastHerds: Herd[]= []
    row.split("").forEach((col: string, j: number) => {
      // Dali postoi juzhno stado koe e na ovaa tochka
      let southHerdsExist = southHerds.findIndex((herd: Herd) => {
        // Ako redot e najgore, da wrappneme na najdolniot red 
        let wrapperRow = i === 0 ? H - 1 : i - 1
        return herd.to[0] === wrapperRow && herd.to[1] === j;
      })

      let eastHerdsExist = eastHerds.findIndex((herd: Herd) => {
        let wrapperCol = j === 0 ? W - 1 : j - 1
        return herd.to[0] === i && herd.to[1] === wrapperCol;
      })
      if(col === ".") {
        if(southHerdsExist >= 0) {
         seaFloor.herds.south.push(...southHerds.splice(southHerdsExist, 1))
        }
        if(eastHerdsExist >= 0) {
         seaFloor.herds.east.push(...eastHerds.splice(eastHerdsExist, 1))
        }
        seaFloor.empty[`${i},${j}`] = true
      } else if(col === ">") {
        if(southHerdsExist >= 0) {
          seaFloor.herds.south.push(...southHerds.splice(southHerdsExist, 1))
        }

        if(eastHerdsExist >= 0) {
          eastHerds[eastHerdsExist].to[1]++
        } else {
          eastHerds.push({
            from:[i,j],
            to:[i,j]
          })
        }
        seaFloor.empty[`${i},${j}`] = false
      } else if(col === "v") {
        if(eastHerdsExist >= 0) {
          seaFloor.herds.east.push(...eastHerds.splice(eastHerdsExist, 1))
        }

        if(southHerdsExist >= 0) {
          southHerds[southHerdsExist].to[0]++
        } else {
          southHerds.push({
            from: [i,j],
            to: [i,j]
          })
        }
        seaFloor.empty[`${i},${j}`] = false
      }
      if(j === W - 1) {
        seaFloor.herds.east.push(...eastHerds);
      }
    })
  })
  // TODO: Vekje gi imash site stada, sega samo treba tie sho se prelevaat od eden na drug kraj da gi spoish
  seaFloor.herds.south.forEach((herd: Herd, i: number) => {
  })
    
  console.log(seaFloor);
  fs.writeFileSync("./test.json", JSON.stringify(seaFloor));
  return seaFloor
}


const sol1 = (input: string[]) => {
  const seaFloor = parseInput(input);
}


const sol2 = (input: string[]) => {

}

console.log({ sol: "1", res: sol1(input) })
console.log({ sol: "2", res: sol2(input) })