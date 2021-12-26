import { readInput } from "../input.helper";
import { Hash } from "../helper.types";

type Variables = Hash<number>

type Instruction = {
	type: string,
	params: [string, any?]
}

const instRegex = /([a-z]+) ([a-z]) ?([a-z]|-?\d+)?/

const input = readInput(24).split("\n");

const parseInput = (input: string[]): Instruction[] => {
	const instructions: Instruction[] = []
	input.forEach((line: string) => {
		const [, type, p1, p2] = instRegex.exec(line) || [];
		let inst: Instruction = {
			type: type,
			params: [p1]
		}

		if(p2) {
      let secondPar = Number.isNaN(parseInt(p2)) ? p2 : parseInt(p2)
			inst.params.push(secondPar);
		}

		instructions.push(inst);
	})
	return instructions 
}

const runMonad = (instructions: Instruction[], serialNum: number[]) => {
	const vars: Variables = {
		"x": 0,
		"y": 0,
		"w": 0,
		"z": 0,
	}
	let runningNumber: number[] = [...serialNum];
	instructions.forEach((inst:Instruction) => {
    let [p1, p2]: [string, any?] = inst.params;
		switch(inst.type) {
			case "inp":
        vars[p1] = runningNumber.shift() || 0;
        console.log(`After instruction ${14 - runningNumber.length} vars are:`);
        console.log(vars);
        break;
      case "add":
        if(typeof p2 === "string") {
          vars[p1] += vars[p2];
        } else {
          vars[p1] += p2;
        }
        break;
      case "mul":
        if(typeof p2 === "string") {
          vars[p1] = vars[p1] * vars[p2];
        } else {
          vars[p1] = vars[p1] * p2;
        }
        break;
      case "div":
        if(typeof p2 === "string") {
          vars[p1] = Math.floor(vars[p1] / vars[p2]);
        } else {
          vars[p1] = Math.floor(vars[p1] / p2);
        }
        break;
      case "mod":
        if(typeof p2 === "string") {
          vars[p1] = vars[p1] % vars[p2]
          if(runningNumber.length === 9) {
            console.log(vars);
          }
        } else {
          vars[p1] = vars[p1] % p2
        }
        break;
      case "eql":
        if(typeof p2 === "string") {
          vars[p1] = vars[p1] === vars[p2] ? 1 : 0;
        } else {
          vars[p1] = vars[p1] === p2 ? 1 : 0;
        }
        break;
    }
	})
  console.log("at end");
  console.log(vars);
  if(!vars["z"]) {
    return true;
  } else {
    return false;
  }
}

// Tehnichki ima ustvari samo dva vida na "instrukcii"
// Edni vo koishto z se mnozhi so 26 i mu se dodava w + konstata
// Drugi vo koi sho se gleda dali ostatokot od z / 26 - konstanta e ednakov na w
// Prvo z = z / 26
// Ako e ednakov na w, z ostanuva kakov shto e
// Ako ne e, z = z * 26 + w + konstanta
// 7 so 7 instrukcii se, i pochnav odozdola prvo posho kaj mene dolnite dve se u parovi 
// Sekoja instrukcija na koja sho i se dodava w + C, korespondira so nekoja druga kade sho se gleda dali toa (w1 + C1) - C2 = w2
// Za najgolem, setirav se na 9, pochnav odozdola, i posle ja pratev y megju instrukcii, i namaluvav w gledajki da go maks MS brojki

const sol1 = (input: string[]) => {
	const instructions:Instruction[] = parseInput(input);
  let number: number[] = [1,1,1,1,8,1,5,1,6,3,7,1,1,2];
  let res = runMonad(instructions, number);
  return res;
}


const sol2 = (input: string[]) => {
}

console.log({ sol: "1", res: sol1(input) })
console.log({ sol: "2", res: sol2(input) })