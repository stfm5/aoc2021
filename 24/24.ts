import { readInput } from "../input.helper";
import { Hash } from "../helper.types";

type Variables = Hash<number>

type Instruction = {
	type: string,
	params: [string, number?]
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
			inst.params.push(p2);
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
	// ATM, samo za da vidam sho se deshava u sekoj var
	instructions.forEach((inst:Instruction) => {
		switch(inst.type) {
			case: f
		}
	})	

}

const sol1 = (input: string[]) => {

	const instructions:Instruction[] = parseInput(input);
}


const sol2 = (input: string[]) => {
}

console.log({ sol: "1", res: sol1(input) })
console.log({ sol: "2", res: sol2(input) })