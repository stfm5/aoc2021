import {readInput} from "../input.helper"
import { Hash } from "../helper.types"

let [p1, p2]: number[]= readInput(21).split("\n").map(e => parseInt(e.slice(-1)));

type Player = {
  score: number,
  position: number
}
const sol1 = (p1:number , p2:number) => {
  const player1 = {
    score: 0,
    position: p1
  }

  const player2 = {
    score: 0,
    position: p2
  }

  let die = 0;
  let turn = true;
  while(player1.score < 1000 && player2.score < 1000) {
    die += 3;
    let score = 3*(die-1)
    if(turn) {

      let newPosition = player1.position + score;
      player1.position = newPosition % 10 === 0 ? 10 : newPosition % 10
      player1.score += player1.position
    } else {
      let newPosition = player2.position + score;
      player2.position = newPosition % 10 === 0 ? 10 : newPosition % 10
      player2.score += player2.position
    }
    turn = !turn;
  }

  return die * Math.min(player1.score, player2.score)
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

type Winners = Hash<[number,number]>
const moomins: Winners = {}

const rollDice = (p1: Player, p2: Player, player: boolean) => {
  if(p1.score >= 21) {
    return [1,0]
  }
  if(p2.score >= 21) {
    return [0,1]
  }
  let hash = `${p1.position},${p2.position},${p1.score},${p2.score},${player ? "p1":"p2"}`
  if(moomins[hash]) {
    return moomins[hash];
  }

  let wins1 = 0;
  let wins2 = 0;

  for(let key in possible) {
    let die = possible[key];
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
    let [futureWins1, futureWins2] = rollDice(newP1, newP2, !player);
    wins1 += futureWins1
    wins2 += futureWins2
  }

  let newHash = `${p1.position},${p2.position},${p1.score},${p2.score},${player ? "p1":"p2"}` 
  moomins[newHash] = [wins1, wins2];
  return [wins1, wins2];
}
const sol2 = (p1:number , p2:number) => {
  const player1: Player = {
    score: 0,
    position: p1
  }

  const player2: Player = {
    score: 0,
    position: p2
  }
  let [p1Wins, p2Wins] = rollDice(player1, player2, true)
  return Math.max(p1Wins, p2Wins)
}

console.log({sol: "1", res: sol1(p1, p2)})
console.log({sol: "2", res: sol2(p1, p2)})
