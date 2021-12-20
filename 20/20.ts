import {readInput} from "../input.helper"
import fs from "fs"

let lines: string[]= readInput(20).split("\n").filter(e => e !== "");


// Dodava nuli ili kecovi okolu slikata 
// Ako prviot bit na algoto e 1, toa znachi deka posle prvata iteracija site nuli na beskrajanta slika se stanati kecoi
// Shto znachi, deka dopunuvanje od okolu nemozhe so nuli, tuku so kecovi
const addBorder = (image: number[][], isAlgoOne: boolean, times: number) => {
  let newImage = JSON.parse(JSON.stringify(image))

  let fillerNum: number = isAlgoOne ? (times % 2 === 0 ? 0 : 1) : 0;
  console.log(fillerNum);
  const imageLenght: number = newImage[0].length;
  const filler = [...new Array(imageLenght).fill(fillerNum)];
  newImage.unshift([...filler])
  newImage.push([...filler])
  newImage = newImage.map((e: number[]) => {
    e.push(fillerNum);
    e.unshift(fillerNum);
    return e
  })

  return newImage
}

const parseInput = (lines: string[]) => {
  let locLines = JSON.parse(JSON.stringify(lines));
  locLines = locLines.map((e: string) => {
    return e.split("").map((char: string) => {
      return char === "." ? 0 : 1;
    })
  })
 
  const algo: number[]= locLines.shift();

  let image: number[][]= [...locLines]
  return {algo: algo, image: image}
} 

const generateImage = (algo: number[], source: number[][], times: number) => {
  const H = source.length;
  const W = source[0].length;
  const filler: number[] = [...new Array(W)].fill(0);
  const newImage: number[][] = []
  for(let i = 0; i < H; i++) {
    newImage.push(JSON.parse(JSON.stringify(filler)))
  }
  const input = addBorder(JSON.parse(JSON.stringify(source)), !!algo[0], times)
  // za sekoj piksel u originalot, gi gledame komshiite, kreirame string so niv, i go chitame toj bit od alg
  for(let i = 1; i < input.length - 1; i++)  {
    for(let j = 1; j < input.length - 1; j++)  {
      const neighbours:number[]= [
        input[i-1][j-1],
        input[i-1][j],
        input[i-1][j+1],
        input[i][j-1],
        input[i][j],
        input[i][j+1],
        input[i+1][j-1],
        input[i+1][j],
        input[i+1][j+1],
      ]
      const index: number = parseInt(neighbours.join(""), 2)
      newImage[i-1][j-1] = algo[index];
    }
  } 
  return newImage;
}
const sol1 = (input: any) => {
  const { algo, image } = parseInput(input);

  let times = 0
  let newImage: number[][] = JSON.parse(JSON.stringify(image));
  while(times < 50) {
    newImage = addBorder(newImage, !!algo[0], times)
    newImage = generateImage(algo, newImage, times);
    times++;
  }
  let sum = 0 
  console.log(newImage.length);
  console.log(newImage[0].length);
  for(let i = 0; i < newImage.length;i++) {
    for(let j = 0; j< newImage[0].length;j++) {
      sum+= newImage[i][j]
    }
  }
  fs.writeFileSync("./out.txt", JSON.stringify(newImage));
  return sum;
}

const sol2 = (input: any) => {
}

console.log({sol: "1", res: sol1(lines)})
console.log({sol: "2", res: sol2(lines)})
