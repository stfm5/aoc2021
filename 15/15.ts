import {readInput} from "../input.helper"

type Nodes = {
  [key: string]: {
    distance: number
    weight: number
    h: number
  }
}

const nodes: Nodes = {}

const lines: string[][] = readInput(15).split("\n").map((e: string) => e.split(""))
lines.forEach((line: string[], i: number) => {
  line.forEach((weight:string, j: number) => {
    let key = `${i},${j}`
    nodes[key] = {
      distance: Number.MAX_SAFE_INTEGER,
      weight: parseInt(weight),
      h: Math.abs(i - lines.length - 1) + Math.abs(j - lines[0].length - 1)
    }
  })
})

nodes["0,0"].distance = 0;

const aStar = (nodes: Nodes, goal: string) => {
  const visited: Nodes = {}
  const frontier: Nodes = {"0,0": {...nodes["0,0"]}} 

  let cost = 0;
  while(Object.keys(frontier).length> 0 ) {
    let found = false
    let sum = Number.MAX_SAFE_INTEGER;
    let nodeKey = '';

    for(const key in frontier) {
      let f = frontier[key].distance + frontier[key].h 
      if(frontier[key].distance + frontier[key].h < sum) {
        nodeKey = key;
        sum = f;
      }
    }

    let node = {...frontier[nodeKey]}
    let [x,y] = nodeKey.split(",").map(e => parseInt(e));
    let nodeNeighbours = [`${x},${y+1}`,`${x},${y-1}`,`${x+1},${y}`,`${x-1},${y}`]
    delete frontier[nodeKey];

    for(const i in nodeNeighbours) {
      let nKey = nodeNeighbours[i]
      if(nodes[nKey]) {
        if(nKey === goal) {
          found = true;
          cost = node.distance + nodes[nKey].weight;
          break
        }

        let successor = {
          distance: node.distance + nodes[nKey].weight,
          weight: nodes[nKey].weight,
          h: nodes[nKey].h
        }

        let succF = successor.distance + successor.h
        if(frontier[nKey] && frontier[nKey].h + frontier[nKey].distance < succF) {
          continue;
        }
        if(visited[nKey] && visited[nKey].h + visited[nKey].distance < succF) {
          continue;
        }

        frontier[nKey] = {...successor};
      }
    }

    visited[nodeKey] = {...node}
    if(found) {
      break
    }
  }
  return cost;
}

const sol1 = (input:Nodes) => {
  console.time("sol1");
  const nodes: Nodes= JSON.parse(JSON.stringify(input))
  let goal = `${lines.length-1},${lines[0].length - 1}`
  const cost: number = aStar(nodes, goal);
  console.timeEnd("sol1");
  return cost
}

const sol2 = (input: Nodes) => {
  console.time("sol1");
  const nodes: Nodes= JSON.parse(JSON.stringify(input))

  const newNodes: Nodes = {}
  for(let i = 0; i < 5; i++ ) {
    for(let j = 0; j < 5; j++ ) {
      Object.keys(nodes).forEach((key) => {
        let [x, y] = key.split(",").map(e => parseInt(e))
        let newPoint = `${x+(i*lines.length)},${y+(j*lines[0].length)}`;
        let newWeight = nodes[key].weight + i + j;
        newNodes[newPoint] = {
          distance: Number.MAX_SAFE_INTEGER,
          weight: newWeight > 9 ? newWeight - 9 : newWeight,
          h: Math.abs(i - lines.length*5 - 1) + Math.abs(j - lines[0].length*5 - 1)
        }
      })
    }
  }

  newNodes["0,0"].distance = 0
  let goal = `${lines.length*5-1},${lines[0].length*5-1}`
  let cost = aStar(newNodes, goal);
  console.timeEnd("sol1");

  return cost;
}

console.log({sol: "1", res: sol1(nodes)})
console.log({sol: "2", res: sol2(nodes)})
