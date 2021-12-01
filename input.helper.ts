import fs from 'fs'

export const readInput = (day:number) => {
  return fs.readFileSync(`./${day}.txt`).toString()
}