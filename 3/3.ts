import { readInput } from "../input.helper";

const input: string[] = readInput(3).split("\n");
const bits = input[0].length;
const filterNumbers = (bitInput: string[]):number[] => {
  let commonArray: number[] = new Array(bits).fill(0);
  bitInput.forEach((e: string) => {
    [...e].forEach((bit: string, i: number) => {
      if(bit === "1") {
        commonArray[i]++ 
      } else {
        commonArray[i]-- 
      }
    })
  })

  return commonArray
}
const sol1 = () => {
  const commonArray = filterNumbers(input);
  const gammaBinaryString: string= commonArray.map((e: number) => {
    return e > 0 ? "1" : "0";
  }).join('');
  const epislonBinaryString: string = commonArray.map((e:number) => {
    return e < 0 ? "1" : "0";
  }).join('')

  return parseInt(gammaBinaryString, 2) * parseInt(epislonBinaryString, 2);
}

const sol2 = () => {
  let oxygenInput = [...input] 
  let co2Input = [...input]
  for(let i = 0; i < bits; i++) {
    let commonArray = filterNumbers(oxygenInput);
    oxygenInput = oxygenInput.filter((byte:string) => {
      if(( commonArray[i] >=0 && byte[i] === "1" || commonArray[i] < 0 && byte[i] === "0" ) || oxygenInput.length === 1) {
        return true
      } else {
        return false
      }
    })
  }
  for(let i = 0; i < bits; i++) {
    let commonArray = filterNumbers(co2Input);
    co2Input = co2Input.filter((byte:string) => {
      if(( commonArray[i] < 0 && byte[i] === "1" || commonArray[i] >= 0 && byte[i] === "0" ) || co2Input.length === 1) {
        return true
      } else {
        return false
      }
    })
  }


  return parseInt(oxygenInput[0], 2) * parseInt(co2Input[0], 2);
}

console.log({name: "sol1", res: sol1()})
console.log({name: "sol2", res: sol2()})
