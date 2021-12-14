import { readInput } from "../input.helper";

let lines: string[]= readInput(14).split("\n");
const input: string[][] = [[...lines.slice(0, 1)], [...lines.slice(2)]];

type Rules = {
  [key: string]: string
}

type Count = {
  [key: string]: number
}

const runPolymer =(rules: Rules, start: string, steps: number) => {
  let step = 0
  let string = start.split('');
  let pairs: Count = {}
  let count: Count = {}

  for(let i = 0; i < string.length-1;i++) {
    let pair = `${string[i]}${string[i+1]}`
    if(pairs[pair] === undefined) {
      pairs[pair] = 1
    } else {
      pairs[pair]++;
    }
  }

  start.split("").forEach((letter: string) => {
    if(!count[letter]) {
      count[letter] = 1
    } else {
      count[letter]++;
    }
  })

  while(step < steps) {
    let newPairs: Count = {}
    Object.keys(pairs).forEach((pair: string) => {
      let elem = rules[pair];
      let leftPair = `${pair[0]}${elem}`
      let rightPair = `${elem}${pair[1]}`
      if(!count[elem]) {
        count[elem] = pairs[pair]
      } else {
        count[elem] += pairs[pair]
      }
      if(!newPairs[leftPair]) {
        newPairs[leftPair] = pairs[pair];
      } else {
        newPairs[leftPair] += pairs[pair];
      }

      if(!newPairs[rightPair]) {
        newPairs[rightPair] = pairs[pair]
      } else {
        newPairs[rightPair] += pairs[pair];
      }

    })
    pairs = newPairs
    step++;
  }
  return count
}

const sol1 = (input: string[][], steps: number) => {
  const [initial, rules] = input
  const hashRules: Rules = {}
  rules.forEach((e: string) => {
    let [pair, elem] = e.split(' -> ') || []
    hashRules[pair] = elem;
  })
  
  const count: Count= runPolymer(hashRules, initial[0], steps);

  let max = Number.MIN_SAFE_INTEGER
  let min = Number.MAX_SAFE_INTEGER

  Object.keys(count).forEach(( e: string ) => {
    if(count[e] > max) {
      max = count[e]
    } 
    if(count[e] < min) {
      min = count[e]
    }
  })

  return max - min;
}


console.log({sol: "1", res: sol1(JSON.parse(JSON.stringify(input)), 10)})
console.log({sol: "2", res: sol1(JSON.parse(JSON.stringify(input)), 40)})