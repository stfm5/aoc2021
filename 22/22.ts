import { readInput } from "../input.helper";
import { Hash } from "../helper.types";

let instRegex = /(on|off) x=(?:(-?\d+)\.\.(-?\d+)),y=(?:(-?\d+)\.\.(-?\d+)),z=(?:(-?\d+)\.\.(-?\d+))/

const input = readInput(22).split("\n");

const getInstructions = (input: string[]): Instruction[] => {
  const instList: Instruction[] = input.map((e: string) => {
    const [,mode,x1,x2,y1,y2,z1,z2] = instRegex.exec(e) || [];
    return {
      mode: mode === "on" ? true : false,
      range: {
        x: {
          from: parseInt(x1),
          to: parseInt(x2),
        },
        y: {
          from: parseInt(y1),
          to: parseInt(y2),
        },
        z: {
          from: parseInt(z1),
          to: parseInt(z2),
        },
      }
    } as Instruction
  })
  return instList
}

type Range = {
  x: {
    from: number,
    to: number,
  },
  y: {
    from: number,
    to: number,
  }
  z: {
    from: number,
    to: number
  }
}
type Instruction = {
  mode: boolean,
  range: Range
}

const cubes: Hash<boolean> = { }
const sol1 = (input: string[]) => {
  console.time("Processing cubes: ")
  const instList = getInstructions(input)
  instList.forEach((inst: Instruction ,i: number) => {
    if(inst.range.x.from >= -50 && inst.range.x.to <= 50 && inst.range.y.from >= -50 && inst.range.y.to <= 50 && inst.range.z.from >= -50 && inst.range.z.to) {
      for(let i = inst.range.x.from; i <= inst.range.x.to; i++ ) {
        for(let j = inst.range.y.from; j <= inst.range.y.to; j++ ) {
          for(let g = inst.range.z.from; g <= inst.range.z.to; g++ ) {
            cubes[`${i},${j},${g}`] = inst.mode
          }
        }
      }
    }
  })

  let turnedOnCubes = 0
  for(const key in cubes) {
    if(cubes[key]) {
      turnedOnCubes++;
    }
  }

  console.timeEnd("Processing cubes: ")
  return turnedOnCubes
}

// Upaleni ranges
const cuboids: Instruction[]= []
const getOverlaps = (inst: Instruction) => {
  const overlaps: Instruction[] = []
  for(let i in cuboids) {
    let oldCube = cuboids[i];
    let { range }  = inst
    if (
       (((range.x.from <= oldCube.range.x.from) && (oldCube.range.x.from <= range.x.to)) ||
       ((oldCube.range.x.from <= range.x.from) && (range.x.from <= oldCube.range.x.to))) &&
       (((range.y.from <= oldCube.range.y.from) && (oldCube.range.y.from <= range.y.to)) ||
       ((oldCube.range.y.from <= range.y.from) && (range.y.from <= oldCube.range.y.to))) &&
       (((range.z.from <= oldCube.range.z.from) && (oldCube.range.z.from <= range.z.to)) ||
       ((oldCube.range.z.from <= range.z.from) && (range.z.from <= oldCube.range.z.to)))
      ) {
      overlaps.push(oldCube);
    } 
  }

  return overlaps;
}
const calculateCuboids = (inst: Instruction) => {
  let overlaps = getOverlaps(inst);
  overlaps.forEach((i: Instruction) => {
    // Za sekoja kocka koja se seche so novata, kreirame ushe edna so golemina na presekot, chija shto vrednost e sprotivna od prvichnata
    // 2D PRIMER (ne e omotot na Pinegrove - Cardinal)
    //          _____________
    //          |           |
    //          |           |
    // _________|____       |
    // |        |   |       |        
    // |        |___|_______|
    // |            |
    // |            |
    // |____________|
    //
    // 
    // Ako dolniot kvadrat e vekjepostoechki i e ukluchen, a gorniot e noviot i e iskluchen, kreirame nov, so golemina na presekot megju dvata
    // So vrednost ugaseni

    let newFromX = Math.max(i.range.x.from, inst.range.x.from)
    let newToX = Math.min(i.range.x.to, inst.range.x.to)

    let newFromY = Math.max(i.range.y.from, inst.range.y.from)
    let newToY = Math.min(i.range.y.to, inst.range.y.to)

    let newFromZ = Math.max(i.range.z.from, inst.range.z.from)
    let newToZ = Math.min(i.range.z.to, inst.range.z.to)

    let intersectionCuboid: Instruction = {
      mode: !i.mode,
      range: {
        x: {
          from: newFromX,
          to: newToX
        },
        y: {
          from: newFromY,
          to: newToY
        },
        z: {
          from: newFromZ,
          to: newToZ
        }
      }
    }
    cuboids.push(intersectionCuboid)    
  })
}

const sol2 = (input: string[]) => {
  const instList = getInstructions(input)
  instList.forEach((inst: Instruction) => {
    calculateCuboids(inst);
    if(inst.mode) {
      cuboids.push(inst) 
    }
  })
  let lights = cuboids.reduce((on, i) => {
    let cuboidMode = i.mode ? 1 : -1
    return on + (cuboidMode * (i.range.x.to - i.range.x.from + 1) * (i.range.y.to - i.range.y.from + 1) * (i.range.z.to - i.range.z.from + 1)) 
    // volume = i.mode ? volume : volume * -1
  } ,0)

  return lights;
}

console.log({sol: "1", res: sol1(input)})
console.log({sol: "2", res: sol2(input)})