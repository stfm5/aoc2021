import { readInput } from "../input.helper";

const input = readInput(4).split('\n').filter(e => e !== "")
type Point = {
  val: number,
  checked: boolean
}

type Board = {
  points: Point[][],
  sum: number
}

//@ts-ignore
const numbers: number[]= input.shift().split(",").map(e => parseInt(e));
const numberRegex = /(\d?\d)/g
const boards: string[] = [ ...input ]
const boardSize = 5;
const generateBoards = (boards: string[]): Board[] => {

  let localBoards: Board[] = [];
  for(let i = 0; i < boards.length / boardSize; i++ ) { 
    localBoards.push({points:[], sum:0})
  }
  boards.forEach((e: string, i:number) => {
    // @ts-ignore
    let row = e.match(numberRegex).map(e => {return { val: parseInt(e), checked: false }});
    let boardNum = Math.floor(i / boardSize);
    localBoards[boardNum].points.push(row) 
    localBoards[boardNum].sum += row.reduce((prev, cur) => { return prev + cur.val}, 0) 
  })
  return localBoards;
}

const sol1 = () => {
  generateBoards(input);
  return 0;
}

const sol2 = () => {

  return 0;
}

console.log({name: "sol1", val: sol1()})
console.log({name: "sol2", val: sol2()})
