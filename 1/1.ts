import { readInput } from "../input.helper";

const sol1 = (input: number[]) => {
  let count = 0;
  let lastNum = input.shift()
  input.forEach((e:number) => {
    let currNum = e
    // Zagarantiran input, ts pishti
    // @ts-ignore
    if(currNum > lastNum) {
      count++;
    }
    lastNum = currNum;
  }) 

  return count;
}

const sol2 = (input: number[]) => { 
  let count = 0;
  // za da nemora da imam special case u loopot za dali e prviot ili e bilo koj drug segment
  // Zagarantiran input, ts pishti
  // @ts-ignore
  console.log(input);
  let prevSum = input[0] + input[1] + input[2];
  for(let i = 1; i < input.length-2;i++) {
    let currSum = input[i] + input[i+1] + input[i+2]
    if(currSum > prevSum) {
      count++
    }
    prevSum = currSum
  }

  return count
}

const input = readInput(1).split("\n").map((e:string) => {
  return parseInt(e, 10)
});

console.log({sol: "1", res: sol1([ ...input ]) })
console.log({sol: "2", res: sol2([ ...input ]) })