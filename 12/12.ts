import { readInput } from "../input.helper";

const input: string[][]= readInput(12).split("\n").map(( e: string ) => e.split("-"));

type Cave = {
  [key: string]: string[]
}
const caves: Cave = {}

input.forEach((path: string[]) => {
  if(!caves[path[0]]) {
    caves[path[0]] = [path[1]]
  } else {
    caves[path[0]].push(path[1]);
  }
  if (!caves[path[1]]){ 
    caves[path[1]] = [path[0]]
  } else {
    caves[path[1]].push(path[0])
  }
})

const allPaths: string[][] = [];
const allPaths2: string[][] = [];
const findPath = (curCave: string, path: string[]) => {
  if(curCave === "end") {
    allPaths.push([...path])
    return;
  }

  const eligable: string[] = []
  caves[curCave].forEach((e: string) => {
    if(e === e.toUpperCase()) {
      eligable.push(e);
    } else if(e !== "start" && !path.includes(e)) {
      eligable.push(e);
    }
  }) 
  if(eligable.length === 0) {
    return
  }

  eligable.forEach((cave: string) => {
    let newPath = [...path];
    newPath.push(cave)
    findPath(cave, newPath);
  })
}


const findPath2 = (curCave: string, path: string[]) => {
  if(curCave === "end") {
    allPaths2.push([...path])
    return;
  }

  const eligable: string[] = []
  let smallCaves = path.filter((e: string) => e === e.toLowerCase())
  let hasTwice = smallCaves.length !== [... new Set(smallCaves)].length;
  caves[curCave].forEach((e: string) => {
    if(e === e.toUpperCase()) {
      eligable.push(e);
    } else if(e !== "start" && (!path.includes(e) || !hasTwice)) {
      eligable.push(e);
    }
  }) 
  if(eligable.length === 0) {
    return
  }

  eligable.forEach((cave: string) => {
    let newPath = [...path];
    newPath.push(cave)
    findPath2(cave, newPath);
  })
}

const sol1 = (input: string[][]) => {
  findPath("start", JSON.parse(JSON.stringify([])));
  return allPaths.length
}

const sol2 = (input: string[][]) => {
  findPath2("start", JSON.parse(JSON.stringify([])))
  console.log(allPaths2)
  return allPaths2.length
}

console.log({sol: "1", res: sol1(JSON.parse(JSON.stringify(input)))})
console.log({sol: "2", res: sol2(JSON.parse(JSON.stringify(input)))})