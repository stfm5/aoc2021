import { readInput } from "../input.helper";

const input = readInput(2).split("\n")

const sol1 = () => {
  let x = 0;
  let y = 0;

  input.forEach((e:string) => {
    const eSplit = e.split(' ');
    const direction = eSplit[0];
    const val = Number(eSplit[1])

    switch(direction) {
      case "forward":
        x += val;
        break;
      case "down":
        y+=val;
        break;
      case "up":
        y-=val;
        break
    }
  })
  return x * y;
}

const sol2=() => {
  let aim = 0;
  let x = 0
  let y = 0;
  input.forEach((e:string) => {
    const eSplit = e.split(' ');
    const direction = eSplit[0];
    const val = Number(eSplit[1])
    switch(direction) {
      case "forward":
        x += val;
        y += aim * val;
        break;
      case "down":
        aim += val;
        break;
      case "up":
        aim -= val;
        break;
    }
  })

  return x * y;
}

console.log({ name: "sol1", res: sol1()})
console.log({ name: "sol2", res: sol2()})