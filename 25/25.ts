import { readInput } from "../input.helper";
import { Hash } from "../helper.types";
import fs from "fs";

const input: string[]= readInput(25).split("\n");
const H = input.length
const W = input[0].length

type Herd = {
  from: [number,number],
  to: [number,number]
  hash?: string
}
type SeaFloor = {
  herds: {
    east: Herd[],
    south: Herd[]
  }, 
  empty: Hash<boolean>
}

const generateHerds = (input: string[]): SeaFloor => {
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
  seaFloor.herds.south.push(...southHerds)

  seaFloor.herds.south.forEach((v: Herd) => {
    v.hash = JSON.stringify(v);
  })
  seaFloor.herds.east.forEach((v: Herd) => {
    v.hash = JSON.stringify(v);
  })
  return seaFloor
}

// Dobiva seaFloor, i ako ima stada koisho se prelevaat, gi spojuva vo edno stado
const joinHerds = (seaFloor: SeaFloor): SeaFloor => {
  let locSeaFloor = JSON.parse(JSON.stringify(seaFloor)) as SeaFloor;

  let toSouth: string[] = [];
  let fromSouth: string[] = [];

  let toEast: string[] = [];
  let fromEast: string[] = [];
  locSeaFloor.herds.south.forEach((herd: Herd, i: number) => {
    if(herd.from[0] === 0) {
      fromSouth.push(herd.hash || "");
    } else if(herd.to[0] === H - 1) {
      toSouth.push(herd.hash || "");
    }
  })

  locSeaFloor.herds.east.forEach((herd: Herd, i: number) => {
    if(herd.from[1] === 0) {
      fromEast.push(herd.hash || "");
    } else if(herd.to[1] === W - 1){
      toEast.push(herd.hash || "");
    }
  })

  // Za sekoe stado koe zavrshuva na posledniot red ili pochuva na prviot, gledame dali se od istata kolona
  // Ako se, na toa sho pochnuva od prviot mu stavame from na toa sho zavrshuva od posledniot, i go brisheme drugiot
  // Ova e za tie sho odat na jug
  // Za tie sho odat na istok kje bide istoto, samo vo drugata nasoka
  toSouth.forEach((toHash: string, i: number) => {
    fromSouth.forEach((fromHash: string, j: number) => {
      let fromI = locSeaFloor.herds.south.findIndex((v: Herd) => {
        return v.hash === fromHash;
      })
      let toI = locSeaFloor.herds.south.findIndex((v: Herd) => {
        return v.hash === toHash;
      })
      if((fromI >= 0 && toI >= 0) && locSeaFloor.herds.south[fromI].from[1] === locSeaFloor.herds.south[toI].to[1] ) {
        locSeaFloor.herds.south[fromI].from = [...locSeaFloor.herds.south[toI].from]
        locSeaFloor.herds.south.splice(toI, 1);
        toSouth.splice(i, 1);
        fromSouth.splice(j, 1);
      }
    })
  })

  toEast.forEach((toHash: string, i:number) => {
    fromEast.forEach((fromHash: string, j: number) => {
      let fromI = locSeaFloor.herds.east.findIndex((v: Herd) => {
        return v.hash === fromHash;
      })
      let toI = locSeaFloor.herds.east.findIndex((v: Herd) => {
        return v.hash === toHash;
      })
      if(locSeaFloor.herds.east[fromI].from[0] === locSeaFloor.herds.east[toI].to[0]) {
        locSeaFloor.herds.east[fromI].from = [...locSeaFloor.herds.east[toI].from]
        locSeaFloor.herds.east.splice(toI, 1);
        toEast.splice(i);
        fromEast.splice(j);
      }
    })
  })

  return locSeaFloor
}

const parseInput = (input: string[]): SeaFloor => {
  return joinHerds(generateHerds(input));
}

const moveEast = (seaFloor: SeaFloor): [SeaFloor, boolean]=> {
  const locSeaFloor = JSON.parse(JSON.stringify(seaFloor)) as SeaFloor;
  let newHerds: Herd[] = [];
  let madeMove = false;
  locSeaFloor.herds.east.forEach((herd: Herd) => {
    let possibleNextPosition = herd.to[1] === W - 1 ? 0 : herd.to[1] + 1
    let herdRow: number = herd.to[0]
    if(locSeaFloor.empty[`${herdRow},${possibleNextPosition}`]) {
      madeMove = true;
      if(herd.from[1] === herd.to[1]) {
        locSeaFloor.empty[`${herdRow},${possibleNextPosition}`] = false
        locSeaFloor.empty[`${herdRow},${herd.to[1]}`] = true
        herd.from[1] = possibleNextPosition
        herd.to[1] = possibleNextPosition
      } else {
        locSeaFloor.empty[`${herdRow},${possibleNextPosition}`] = false
        locSeaFloor.empty[`${herdRow},${herd.to[1]}`] = true
        newHerds.push({
          from: [herdRow, possibleNextPosition],
          to: [herdRow, possibleNextPosition]
        })
        herd.to[1] = herd.to[1] === 0 ? W - 1 : herd.to[1] - 1;
      }
    }
  })


  locSeaFloor.herds.east.push(...newHerds);
  locSeaFloor.herds.east.forEach((herd: Herd, i: number) => {
    let possibleNeighbour = herd.to[1] === W - 1 ? 0 : herd.to[1] + 1
    let herdRow = herd.to[0];
    locSeaFloor.herds.east.forEach((oHerd: Herd, j: number) => {
      if((oHerd.from[1] === possibleNeighbour) && (oHerd.from[0] === herdRow)) {
        oHerd.from[1] = herd.from[1];
        locSeaFloor.herds.east.splice(i, 1)
      }
    })
  })
  locSeaFloor.herds.east.sort((a, b) => {
    if(a.from[0] === b.from[0]) {
      return a.from[1] - b.from[1];
    } else {
      return a.from[0] - b.from[0];
    }
  })
  return [JSON.parse(JSON.stringify(locSeaFloor)), madeMove]
}

const moveSouth = (seaFloor: SeaFloor): [SeaFloor, boolean] => {
  const locSeaFloor = JSON.parse(JSON.stringify(seaFloor)) as SeaFloor;
  let madeMove = false;

  const newHerds: Herd[] = [];
  locSeaFloor.herds.south.forEach((herd: Herd) => {
    let possibleNextPosition = herd.to[0] === H - 1 ? 0 : herd.to[0] + 1
    let herdCol = herd.to[1];

    if(locSeaFloor.empty[`${possibleNextPosition},${herdCol}`]) {
      madeMove = true
      if(herd.to[0] === herd.from[0]) {
        locSeaFloor.empty[`${herd.to[0]},${herdCol}`] = true
        locSeaFloor.empty[`${possibleNextPosition},${herdCol}`] = false
        herd.from[0] = possibleNextPosition;
        herd.to[0] = possibleNextPosition
      } else {
        locSeaFloor.empty[`${herd.to[0]},${herdCol}`] = true
        locSeaFloor.empty[`${possibleNextPosition},${herdCol}`] = false

        newHerds.push({
          from: [possibleNextPosition, herdCol],
          to: [possibleNextPosition, herdCol],
        })

        herd.to[0] = herd.to[0] === 0 ? H - 1 : herd.to[0] - 1
      }
    }
  })

  locSeaFloor.herds.south.push(...newHerds);
  locSeaFloor.herds.south.forEach((herd: Herd, i: number) => {
    let possibleFrontNeighbour = herd.to[0] === H - 1 ? 0 : herd.to[0] + 1
    let possibleBackNeighbour = herd.from[0] === 0 ? H - 1 : herd.from[0] - 1
    let herdCol = herd.to[1];
    locSeaFloor.herds.south.forEach((oHerd: Herd, j: number) => {
      if((oHerd.from[0] === possibleFrontNeighbour) && (oHerd.from[1] === herdCol)) {
        oHerd.from[0] = herd.from[0];
        locSeaFloor.herds.south.splice(i, 1);
      } 
    })
  })
  locSeaFloor.herds.south.sort((a, b) => {
    if(a.from[1] === b.from[1]) {
      return a.from[0] - b.from[0];
    } else {
      return a.from[1] - b.from[1];
    }
  })

  return [JSON.parse(JSON.stringify(locSeaFloor)), madeMove]
}

const drawBoard = (seaFloor: SeaFloor, steps: number): void => {
  let board: string[][] = [...new Array(H)]
  board.forEach((v: string[], i: number) => {
    let string: string[]= [...new Array(W).fill(".")]
    board[i] = string;
  })

  seaFloor.herds.east.forEach((herd: Herd) => {
    let start = herd.from[1];
    let end = herd.to[1];
    let herdRow = herd.to[0];
    while(start !== end) {
      board[herdRow][start] = ">";
      start = (start + 1) % (W)
    }
    board[herdRow][start] = ">";
  })

  seaFloor.herds.south.forEach((herd: Herd) => {
    let start = herd.from[0];
    let end = herd.to[0];
    let herdCol = herd.to[1];
    while(start !== end) {
      board[start][herdCol] = "v";
      start = (start + 1) % (H)
    }
    board[start][herdCol] = "v";
  })


  let joinedBoard = board.map(( row: string[] ) => {
    return row.join("");
  })
  console.clear();
  console.log(joinedBoard.join("\n"));
  console.log(`Step: ${steps}`)
  // fs.writeFileSync("./test.txt", joinedBoard.join("\n"));
}

const sol1 = (input: string[]) => {
  let seaFloor = parseInput(input);

  let steps = 0;
  let madeMove: boolean = true
  while(madeMove) {
    steps++;
    let didMove = false;
    [seaFloor, didMove] = moveEast(seaFloor);
    if(didMove) {
      madeMove = true;
    }
    [seaFloor, madeMove] = moveSouth(seaFloor);
    if(didMove) {
      madeMove = true;
    }
    drawBoard(seaFloor,steps);
  }

  return steps;
}


const sol2 = (input: string[]) => {

}

console.log({ sol: "1", res: sol1(input) })
console.log({ sol: "2", res: sol2(input) })