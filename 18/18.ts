import {readInput} from "../input.helper"

type ShellNumber = {
  val: number,
  indentation: number
}


let lines = readInput(18).split("\n")
const input: ShellNumber[][] = lines.map((e: string) => {
  let indentation = 0;
  let shellNumber: ShellNumber[] = []
  for(let i = 0; i < e.length; i++) {
    if(e[i] === "[") {
      indentation++
    } else if(e[i] === "]") {
      indentation--
    } if(!isNaN(parseInt(e[i]))) {
      shellNumber.push({val: parseInt(e[i]), indentation: indentation})
    }
  }

  return shellNumber
})

const explode = (newSum: ShellNumber[]): ShellNumber[] => {
  let number = newSum;

  for(let i = 0; i < number.length; i++) {
    if(number[i].indentation === 5) {
      if(i > 0) {
        number[i-1].val += number[i].val
      } 

      if(i+1 < number.length-1) {
        number[i+2].val += number[i+1].val
      }

      number.splice(i, 2, {val: 0, indentation: 4})
    }
  }
  return number
}

const split = (newSum: ShellNumber[]): [ShellNumber[], boolean] => {
  let number = newSum;
  let isDone = true;
  let index = number.findIndex((e: ShellNumber) => {
    return e.val >= 10
  })

  if(!(index < 0)) {
    isDone = false
    let splitNumbers: [ShellNumber, ShellNumber]= [
      {
        val: Math.floor(number[index].val /2), 
        indentation: number[index].indentation + 1
      },
      {
        val: Math.ceil(number[index].val /2), 
        indentation: number[index].indentation + 1
      },
    ]
    number.splice(index,1,...splitNumbers)
  }

  return [number, isDone]
}

const findMagnitude = (sum: ShellNumber[])=> {
  let nums = sum
  while(nums.length !== 1) {
    let val = Number.MIN_SAFE_INTEGER
    let j = 0
    for(let i = 0; i < nums.length-1; i++) {
      if(nums[i].indentation > val) {
        val = nums[i].indentation
        j = i;
      }
    }
    let newNum: ShellNumber = {
      val: 3*nums[j].val + 2*nums[j+1].val,
      indentation: nums[j].indentation - 1
    }

    nums.splice(j, 2, newNum)
  }

  return nums[0].val
}

const sol1 = (input: ShellNumber[][]) => {
  let sum = input[0]
  for(let i = 1; i < input.length; i++) {
    let newSum= JSON.parse(JSON.stringify([...sum, ...input[i]]));
    let isDone = false
    newSum = newSum.map((e: ShellNumber) => {
      e.indentation++;
      return e
    })
    while(!isDone) {
      newSum = explode(newSum);
      [newSum, isDone] = split(newSum)
    }
    sum = newSum;
  }

  let res = findMagnitude(sum) 
  return res
}

const sol2 = (input: ShellNumber[][]) => {
  let maxMagnitude = Number.MIN_SAFE_INTEGER
  for(let i = 0; i < input.length - 1; i++) {
    for(let j = i+1; j < input.length; j++) {
      let newSum1 = JSON.parse(JSON.stringify([...input[i], ...input[j]]));
      let isDone1 = false
      let newSum2 = JSON.parse(JSON.stringify([...input[j], ...input[i]]));
      let isDone2 = false
      newSum1 = newSum1.map((e: ShellNumber) => {
        e.indentation++;
        return e
      })
      newSum2 = newSum2.map((e: ShellNumber) => {
        e.indentation++;
        return e
      })
      while(!isDone1) {
        newSum1 = explode(newSum1);
        [newSum1, isDone1] = split(newSum1)
      }
      while(!isDone2) {
        newSum1 = explode(newSum2);
        [newSum2, isDone2] = split(newSum2)
      }
      let mag1 = findMagnitude(newSum2)
      let mag2 = findMagnitude(newSum2)
      if(mag1 > maxMagnitude) {
        maxMagnitude = mag1
      }
      if(mag2 > maxMagnitude) {
        maxMagnitude = mag2
      }
    }
  }
  return maxMagnitude
}

console.log({sol: "1", res: sol1(input)})
console.log({sol: "2", res: sol2(input)})
