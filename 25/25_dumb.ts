import { readInput } from "../input.helper";

const input: string[][] = readInput(25).split("\n").map(row => row.split(""))
const H = input.length
const W = input[0].length

const drawBoard = (board: string[][]) => {
  let newBoard: string[] = board.map(( row: string[] ) => {
    return row.join("")
  })
  console.clear();
  console.log("-------------------------")
  console.log(newBoard.join("\n"));
}

const sol1 = (input: string[][]) => {
  let madeMove: boolean = true;
  let board: string[][]= input;
  let steps: number = 0;
  while(madeMove) {
    steps++;
    madeMove = false
    let newBoard: string[][]= [...new Array(H)];
    newBoard = newBoard.map((v) => {
      return v = [...new Array(W).fill(".")]
    })

    board.forEach((row: string[], i: number ) => {
      row.forEach((char: string, j: number) => {
        if(char === ">") {
          let newPosition: number = (j + 1) % W
          if(board[i][newPosition] === ".") {
            madeMove = true;
            newBoard[i][newPosition] = ">"
          } else {
            newBoard[i][j] = ">"
          }
        }
      })
    })
    drawBoard(newBoard);

    board.forEach((row: string[], i: number ) => {
      row.forEach((char: string, j: number) => {
        if(char === "v") {
          let newPosition: number = (i + 1) % H
          if(newBoard[newPosition][j] === "." && board[newPosition][j] !== "v") {
            madeMove = true;
            newBoard[newPosition][j] = "v"
          } else {
            newBoard[i][j] = "v"
          }
        }
      })
    })

    board = JSON.parse(JSON.stringify(newBoard));
    drawBoard(board);
  }

  return steps
}

const sol2 = (input: string[][]) => {

}

console.log({ sol: "1", res: sol1(input) })
console.log({ sol: "2", res: sol2(input) })