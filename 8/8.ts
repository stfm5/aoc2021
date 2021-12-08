import { readInput } from "../input.helper"

const input = readInput(8).split('\n')
const regexFirst = /\| ([a-zA-Z]+) ?([a-zA-Z]+) ?([a-zA-Z]+) ?([a-zA-Z]+) ?/

const isUnique = (e: string) => {
  return e.length === 2 || e.length === 3 || e.length === 4 || e.length === 7
}

type NumSegments = {
  [key: number]: string[]
}

type Display = {
  [key: number]: string | string[]
}

/**
 * Gi dobiva signalite za 5 segmenti, i otkirva koj korespondira so 3
 * 
 * @param signals: string[]
 */
const findThree = (signals: string[]) => {
  const [s1, s2, s3] = [...signals];
  let firstDiff = [...new Set([...`${s1}${s2}`])].length - 5
  let secondDiff = [...new Set([...`${s1}${s3}`])].length - 5

  if(firstDiff === secondDiff) {
    return 0;
  } else {
    if(firstDiff === 1) {
      return 1;
    } else {
      return 2;
    }
  }
}

/**
 * Gi dobiva signalite za 6 segmenti, i dvata za 5 segmenti (za 5 i 2) i vrakja tochniot indeks za 0
 * 
 * @param signal6: string[]
 * @param fives: string[] 
 */
const findZero = (signal6: string[], fives: string[]) => {
  const signals = [...signal6];
  const [d1, d2] = [...fives];

  let zeroIndex = 0
  signals.forEach((s: string, i: number) => {
    let dif1 = [...new Set([...`${s}${d1}`])].length - 6
    let dif2 = [...new Set([...`${s}${d2}`])].length - 6
    
    if(dif1 === 1 && dif2 === 1) {
      zeroIndex = i;
    }
  })

  return zeroIndex
}

/**
 * Dobiva tochen rezultat za eden broj, i povekje signali za drug, i gi vrakja tochnite indeksi za tie broevi 
 * 
 * @param three: string 
 * @param nines: string[] 
 */
const findDifference = (three: string, nines: string[]) => {
  const [s1, s2] = [...nines];

    let dif1 = [...new Set([...`${three}${s1}`])].length - 6
    let dif2 = [...new Set([...`${three}${s2}`])].length - 6

    if(dif1 === 1) {
      return [0,1];
    } else {
      return [1,0];
    }
}

const sol1 = (input: string[]) => {
  let vals = input.map((e: string) => {
    let [, m1, m2, m3, m4 ] = regexFirst.exec(e) || [];
    let val = 0;
    [m1, m2, m3, m4].forEach(e => isUnique(e) ? val++ : null);
    return val
  })
  return vals.reduce((prev, cur) => { return prev + cur }, 0)
}

const sol2 = (input: string[]) => {
  let globalSum = 0;
  input.forEach((e: string) => {

    let line = e.split(" | ");
    let signals = line[0].split(" ");
    // Gi sortirame signalite za podocna da bide poednostavna sporedbata
    const goals = line[1].split(" ").map((e:string) => {
      return [...e].sort().join("")
    });

    let display: Display = {}
    let numSegments: NumSegments = {}
    signals.forEach((signal: string) => { 
      if(!numSegments[signal.length]) {
        numSegments[signal.length] = [];
      }

      // Gi sortirame signalite za podocna da bide poednostavna sporedbata
      let locSig = [...signal].sort().join("")
      numSegments[signal.length].push(locSig)
    })
    // setting the unique ones
    display[1] = numSegments[2][0]
    display[4] = numSegments[4][0]
    display[7] = numSegments[3][0]
    display[8] = numSegments[7][0]

    // Function takes in all of the 5 segmented signals and finds which one is three 
    let threeIndex = findThree(numSegments[5]);
    display[3] = numSegments[5][threeIndex];
    display[5] = [...numSegments[5]];
    display[5].splice(threeIndex,1)
    display[2] = [...numSegments[5]];
    display[2].splice(threeIndex,1)
    
    let zeroIndex = findZero(numSegments[6], display[5]);
    display[0] = numSegments[6][zeroIndex]
    display[6] = [...numSegments[6]];
    display[6].splice(zeroIndex, 1)
    display[9] = [...numSegments[6]];
    display[9].splice(zeroIndex, 1)

    let [six, nine] = findDifference(display[3], display[9]);
    display[6] = display[6][six];
    display[9] = display[9][nine];

    let [two, five] = findDifference(display[6], display[5]);
    display[2] = display[2][two]
    display[5] = display[5][five]

    // Go pretvarame sekoj signal vo goals vo brojka
    const converted = goals.map((e: string) => {
      return Object.keys(display).find((i: string) => {
        return display[parseInt(i)] === e
      })
    })

    globalSum += parseInt(converted.join(""))
  })

  return globalSum;
}

console.log({name: "sol1", val: sol1(input)})
console.log({name: "sol2", val: sol2(input)})