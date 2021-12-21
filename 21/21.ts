import {readInput} from "../input.helper"
let [p1, p2]: number[]= readInput(21).split("\n").map(e => parseInt(e.slice(-1)));
//console.log(p1, p2)


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
      //console.log({name: "p1", ...player1})
    } else {
      let newPosition = player2.position + score;
      player2.position = newPosition % 10 === 0 ? 10 : newPosition % 10
      player2.score += player2.position
      //console.log({name: "p2", ...player2})
    }
    turn = !turn;
  }

  //console.log(die)
  return die * Math.min(player1.score, player2.score)
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

const rollDice = (p1: Player, p2: Player, throwNum: number, die: number) => {
  numUni++;
  // //console.log(`Throw number ${throwNum}, dice is ${die}`)

  let newP1: Player = JSON.parse(JSON.stringify(p1))
  let newP2: Player = JSON.parse(JSON.stringify(p2))

  if(Math.floor(throwNum / 3) % 2 === 0) {
    //console.log(`Player 1's turn at ${throwNum} with a die of ${1}, and a position of ${newP1.position}`)
    let newPosition = newP1.position + die;
    newP1.position = (newPosition % 10 === 0) ? 10 : newPosition % 10;
    //console.log(`Player 1's new position is ${newP1.position}`)
    if((throwNum+1) % 3 === 0) {
      newP1.score += newP1.position
      //console.log(`Player 1 made 3 throws, his score is ${newP1.score}`)
      if(newP1.score >= 21) {
        wins["p1"] += 1;
        return;
      } 
    }
  } else {
    //console.log(`Player 2's turn at ${throwNum} with a die of ${2}, and a position of ${newP2.position}`)
    let newPosition = newP2.position + die;
    newP2.position = newPosition % 10 === 0 ? 10 : newPosition % 10;
    //console.log(`Player 2's new position is ${newP2.position}`)
    if((throwNum+1) % 3 === 0) {
      newP2.score += newP2.position
      //console.log(`Player 2 made 3 throws, his score is ${newP2.score}`)
      if(newP2.score >= 21) { 
        wins["p2"] += 1
        return
      }
    }
  }

  rollDice(JSON.parse(JSON.stringify(newP1)), JSON.parse(JSON.stringify(newP2)), throwNum + 1, 1) 
  rollDice(JSON.parse(JSON.stringify(newP1)), JSON.parse(JSON.stringify(newP2)), throwNum + 1, 2) 
  rollDice(JSON.parse(JSON.stringify(newP1)), JSON.parse(JSON.stringify(newP2)), throwNum + 1, 3) 
}
const sol2 = (p1:number , p2:number) => {
  console.time("Running all universes took: ")
  const player1: Player= {
    score: 0,
    position: p1
  }

  const player2: Player= {
    score: 0,
    position: p2
  }
  let throwNum = 0;
  rollDice(player1, player2, throwNum, 1)
  rollDice(player1, player2, throwNum, 2)
  rollDice(player1, player2, throwNum, 3)

  console.timeEnd("Running all universes took: ")
  console.log(numUni)
  console.log(wins);
}

console.log({sol: "1", res: sol1(p1, p2)})
console.log({sol: "2", res: sol2(p1, p2)})
