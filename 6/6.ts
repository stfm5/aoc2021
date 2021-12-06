import { readInput } from '../input.helper'

const input = readInput(6).split(',').map((e: string) => {return parseInt(e)});

const calcFish = (input: number[], days:number) => {
  let school = [...new Array(9).fill(0)];
  let i = 0;

  input.forEach((e:number) => {
    school[e]++;
  }) 

  while(i < days) {
    let j = 0;
    let newFish = 0;
    let newSchool = [...new Array(9).fill(0)]
    while(j <= 8) {
      if (j === 0 ) {
        newFish += school[j];
        j++;
        continue;
      }
      newSchool[j-1] = school[j]
      j++;
    }
    newSchool[8] += newFish;
    newSchool[6] += newFish;
    school = [...newSchool];
    i++;
  }
  let sum = school.reduce((prev, curr) => {return prev + curr}, 0);
  return sum;
}

const sol1 = (input: number[]) => {
  return calcFish(input, 80);
}

const sol2 = (input: number[]) => {
  return calcFish(input, 256);
}

console.log({name: "sol1", val: sol1(input)})
console.log({name: "sol2", val: sol2(input)})