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
    for(const num in row) {
      localBoards[boardNum].sum += row[num].val;
    }
    // console.log(localBoards[boardNum].points);
    // console.log(localBoards[boardNum].sum)
    // localBoards[boardNum].sum += row.reduce((prev, cur) => { return prev + cur.val }, 0) 
  })
  return localBoards;
}

const checkBoard = (board: Board, number: number) => {
  let found = false
  for(let i = 0; i < boardSize; i++){
    for(let j = 0; j < boardSize;j++) {
      if(board.points[i][j].val === number) {
        board.points[i][j].checked = true;
        board.sum -= number;
        found = true
        break;
      }

      if(found) {
        break;
      }
    } 
  }

  let bingo = false
  for(let i = 0; i < boardSize; i++) {
    let foundRow = board.points[i].filter((e: Point) => e.checked === false)
    if(foundRow.length === 0) {
      bingo = true
      break;
    }
  }
  if(!bingo) {
    // console.log('no bingo, checking cols')
    for(let i = 0; i < boardSize; i++) {
      let foundCol = true;
      for(let j = 0; j < boardSize; j++) {
        if(!board.points[j][i].checked)  {
          foundCol = false;
          break;
        }
      }
      if(foundCol === true) {
        bingo = true;
        break;
      }
    }
  }
  return bingo;
}

const sol1 = () => {
  const localBoard = generateBoards(boards)
  let res = 0
  for(const i in numbers) {
    for (const board in localBoard) {
      let bingo = checkBoard(localBoard[board], numbers[i])
      if (bingo) {
        res = localBoard[board].sum * numbers[i];
        break;
      }
    }
    if(res !== 0) {
      break;
    }
  }
  return res;
}

const sol2 = () => {
  const localBoard = generateBoards(boards)
  let res = []
  for(const i in numbers) {
    let bingoBoard = [];
    for (const board in localBoard) {
      let bingo = checkBoard(localBoard[board], numbers[i])
      if (bingo) {
        res.push(localBoard[board].sum * numbers[i]);
        bingoBoard.push(parseInt(board));
      }
    }
    if(bingoBoard.length > 0) {
      bingoBoard.reverse().sort();
      bingoBoard.forEach(val => { 
        localBoard.splice(val, 1); 
      })
    }
    if(localBoard.length === 0 ) {
      break;
    }
  }
  return res.slice(-1);
}

console.log({name: "sol1", val: sol1()})
console.log({name: "sol2", val: sol2()})
