import { readInput } from "../input.helper"
let [p1, p2]: number[] = readInput(21).split("\n").map(e => parseInt(e.slice(-1)));
//console.log(p1, p2)


type Player = {
  score: number,
  position: number
}
const sol1 = (p1: number, p2: number) => {
}

const wins = {
  "p1": 0,
  "p2": 0
}

const possible = [
  3,
  4,
  5,
  4,
  5,
  6,
  5,
  6,
  7,
  4,
  5,
  6,
  5,
  6,
  7,
  6,
  7,
  8,
  5,
  6,
  7,
  6,
  7,
  8,
  7,
  8,
  9
]

let numUni = 0;

const rollDice = (p1: Player, p2: Player, die: number, player: boolean) => {
  numUni++;
  // //console.log(`Throw number ${throwNum}, dice is ${die}`)

  let newP1: Player = JSON.parse(JSON.stringify(p1))
  let newP2: Player = JSON.parse(JSON.stringify(p2))

  if (player) {
    let newPosition = newP1.position + die;
    newP1.position = (newPosition % 10 === 0) ? 10 : newPosition % 10;
    newP1.score += newP1.position
  } else {
    let newPosition = newP2.position + die;
    newP2.position = newPosition % 10 === 0 ? 10 : newPosition % 10;
    newP2.score += newP2.position
  }

  if (newP1.score >= 21) {
    wins["p1"] += 1;
    return;
  }

  if (newP2.score >= 21) {
    wins["p2"] += 1
    return
  }

  for(let key in possible) {
    let newDie = possible[key]
    rollDice(newP1, newP2, newDie, !player)
  }
}
const sol2 = (p1: number, p2: number) => {
  console.time("Running all universes took: ")
  const player1: Player = {
    score: 0,
    position: p1
  }

  const player2: Player = {
    score: 0,
    position: p2
  }
  let throwNum = 0;

  for(let key in possible) {
    let die = possible[key];
    rollDice(player1, player2, die, true)
  }
  console.timeEnd("Running all universes took: ")
  console.log(numUni)
  console.log(wins);
}

console.log({ sol: "1", res: sol1(p1, p2) })
console.log({ sol: "2", res: sol2(p1, p2) })
