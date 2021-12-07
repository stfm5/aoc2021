import { readInput } from "../input.helper";

type Fuel = {
  val: number,
  position: number
}
const input: number[] = readInput(7).split(',').map(e => parseInt(e, 10))

const calcTriangleNumber = (num: number): number => {
  return (num * (num+1))/ 2
}

const sol1 = (input: number[]) => {
  let locArray: number[] = [...input].sort((a,b) => a-b);
  const fuels: Fuel[] = []
  let largest = locArray.reverse()[0]
  let i = 0;
  while(i <= largest) {
    let localFuel: Fuel = {
      val: 0,
      position: i
    }
    input.forEach((e: number) => {
      localFuel.val += Math.abs(e - i);
    })

    fuels.push(localFuel)
    i++;
  }
  return fuels.sort((a, b) => a.val - b.val)[0]
}

const sol2 = (input: number[]) => { 
  let locArray: number[] = [...input].sort((a,b) => a-b);
  let largest = locArray.reverse()[0]
  let i = 0;
  const fuels: Fuel[] = []
  while(i <= largest) {
    let localFuel: Fuel = {
      val: 0,
      position: i
    }
    input.forEach((e: number) => {
      localFuel.val += calcTriangleNumber(Math.abs(e - i));
    })
    fuels.push(localFuel)
    i++;
  }
  return fuels.sort((a, b) => a.val - b.val)[0]
}

console.log({sol: "1", res: sol1([...input]) })
console.log({sol: "2", res: sol2([...input]) })