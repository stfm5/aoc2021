
import { readInput } from "../input.helper";

const input: string[][]= readInput(10).split("\n").map(e => e.split(""));


const findIncomplete = (input: string[]) => { 
  const opening = ["(", ")", "[", "]", "{", "}", "<", ">"];
  let prize: string[] = [];

  let corrupted = false;
  let prevOpening: string[] = [];
  for (const j in input) {
    if(opening.indexOf(input[j]) % 2 === 0){
      prevOpening.push(input[j])
    } else {
      let lastOpening = prevOpening[prevOpening.length - 1]
      let bracketIndex = opening.indexOf(input[j])
      if(bracketIndex % 2 !== 0 && opening.indexOf(lastOpening)+1 === bracketIndex) {
        prevOpening.pop()
      } else {
        prize.push(input[j]);
        corrupted = true;
        break;
      }
    }
  }

  return {prizes: prize, incomplete: prevOpening, corrupted: corrupted}
}

const sol1 = (input: string[][]) => {
  const enum PRIZES {
    ")"= 3,
    "("= 3,
    "]"= 57,
    "["= 57,
    "}"= 1197,
    "{"= 1197,
    ">"= 25137,
    "<"= 25137
  }
  const opening = ["(", ")", "[", "]", "{", "}", "<", ">"];
  let prize: string[] = [];


  for (const j in input) {
    prize.push(...findIncomplete(input[j]).prizes)
  }
  let res =  0
  let issues = prize.join("");
  let m1 = issues.match(/\)/g) || []

  res += PRIZES["("] * m1.length
  m1 = issues.match(/\]/g) || []

  res += PRIZES["["] * m1.length
  m1 = issues.match(/\}/g) || []

  res += PRIZES["{"] * m1.length
  m1 = issues.match(/\>/g) || []

  res += PRIZES["<"] * m1.length
  return res;
}

const sol2 = (input: string[][]) => { 
  enum PRIZES {
    ")"= 1,
    "("= 1,
    "]"= 2,
    "["= 2,
    "}"= 3,
    "{"= 3,
    ">"= 4,
    "<"= 4
  }

  const scores: number[] = []
  for(const i in input) {
    let locScore = 0;
    let { incomplete, corrupted } = findIncomplete(input[i]);
    incomplete.reverse()
    if(!corrupted) {
      incomplete.forEach((e: string) => {
        locScore *= 5;
        //@ts-ignore
        locScore += PRIZES[e]
      })
      scores.push(locScore)
    }
  }
  scores.sort((a,b) => a-b);
  return scores[Math.floor(scores.length/2)]
}


console.log({sol: "1", res: sol1(input)})
console.log({sol: "2", res: sol2(input)})