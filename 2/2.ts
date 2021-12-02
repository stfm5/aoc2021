import { readInput } from "../input.helper";

const input = readInput(2).split("\n")

const sol1 = () => {
  let x = 0;
  let y = 0;

  input.forEach((e:string) => {
    const [direction, val] = e.split(' ');
    switch(direction) {
      case "forward":
        x += Number(val);
        break;
      case "down":
        y+=Number(val);
        break;
      case "up":
        y-=Number(val);
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
    const [direction, val] = e.split(' ');
    switch(direction) {
      case "forward":
        x += Number(val);
        y += aim * Number(val);
        break;
      case "down":
        aim += Number(val);
        break;
      case "up":
        aim -= Number(val);
        break;
    }
  })

  return x * y;
}

console.log({ name: "sol1", res: sol1()})
console.log({ name: "sol2", res: sol2()})