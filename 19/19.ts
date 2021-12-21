import { Hash } from "../helper.types";
import {readInput} from "../input.helper"


const input = readInput(19).split("\n");

type Beacon = Hash<number[]>
type Scanner = Hash<Beacon>
type Point = [number, number, number];

const scannerRegex = /--- scanner (\d+) ---/

const parseInput = (input: string[]) => {
  let curScanner: string = '';
  const scanners: Scanner = {}

  for(let key in input) { 
    let line = input[key];
    if(line === "") {
      continue;
    } 
    const matches = scannerRegex.exec(line);
    if(matches) {
      curScanner = matches[1];
      scanners[curScanner] = {}
    } else {
      scanners[curScanner][line] = []
    }
  } 

  calcDistances(scanners);
}

// Presmetuvanje distance megju dve tochki vo 3d koordinaten sistem
const distanceFunc = (p1: Point,p2: Point): number => {
  return Math.sqrt(Math.pow((p2[0]-p1[0]), 2)+ Math.pow((p2[1]-p1[1]), 2) + Math.pow((p2[2]-p1[2]),2))
}

const calcDistances = (scanners: Scanner) => {
  let numNan = 0 
  let numDistances = 0
  for(let sKey in scanners) {
    let scanner = scanners[sKey];
    for(let fBeacon in scanner) {
      for(let sBeacon in scanner) {
        let p1: Point = fBeacon.split(",").map(e=> parseInt(e)) as Point;
        let p2: Point = sBeacon.split(",").map(e=> parseInt(e)) as Point;
        let distance = distanceFunc(p1, p2);
        numDistances++;
        if(isNaN(distance)) {
          numNan++;
          console.log(p1)
          console.log(p2)
        }
        scanner[fBeacon].push(distance)
      }
    }
  }

  console.log(scanners)
  return scanners
}

const sol1 = (input: string[]): number => {
  const scanners = parseInput(input)
  return 0
}

const sol2 = (input: string[]): number => {

  return 0
}

console.log({sol: "1", res: sol1(input)})
console.log({sol: "2", res: sol2(input)})
