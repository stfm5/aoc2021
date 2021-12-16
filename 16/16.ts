import {readInput} from "../input.helper"
import fs from "fs"

type Packet = {
  version: number,
  id: number,
  subpackets: Packet[],
  l?: number,
  lType?: string,
  value?: number
}

type Codes= {
  [key: string]: string;
}

const codes: Codes =  {
  "0": "0000",
  "1": "0001",
  "2": "0010",
  "3": "0011",
  "4": "0100",
  "5": "0101",
  "6": "0110",
  "7": "0111",
  "8": "1000",
  "9": "1001",
  "A": "1010",
  "B": "1011",
  "C": "1100",
  "D": "1101",
  "E": "1110",
  "F": "1111"
}

const input: string = readInput(16).split("").map((e: string) => codes[e]).join("");

const generatePacket = (parent: Packet, transmission: string) => {
  let locTransmission = transmission;
  
  let version: string = locTransmission.substring(0,3)
  let id: string = locTransmission.substring(3,6);
  locTransmission = locTransmission.slice(6);
  let packet: Packet = {
    version: parseInt(version, 2),
    id: parseInt(id, 2),
    subpackets: []
  }
  let bitsRead = 6;
  if(packet.id === 4) {
    let foundZero = false; 
    let value = ""
    while(!foundZero) {
      let bits = locTransmission.substring(0,5);
      if(bits[0] === "0") {
        foundZero = true
      }
      locTransmission = locTransmission.slice(5);
      bitsRead += 5;
      value = `${value}${bits.slice(1)}`
    }
    packet.value = parseInt(value, 2);
  } else {
      let lTypeId = locTransmission[0];
      locTransmission = locTransmission.slice(1);
      bitsRead++;
      let l = 0;
      if(lTypeId === "0") {
        l = parseInt(locTransmission.substring(0,15),2);
        locTransmission = locTransmission.slice(15);
        bitsRead += 15;
      } else {
        l = parseInt(locTransmission.substring(0,11),2);
        locTransmission = locTransmission.slice(11);
        bitsRead += 11;
      }

      packet.l = l;
      packet.lType = lTypeId;

      // console.log(`v: ${packet.version} headerbits:${bitsRead}`)
      if(packet.lType === "1") {
        while(packet.subpackets.length !== packet.l) {
          let subPackets = generatePacket(packet, locTransmission);
          locTransmission = locTransmission.slice(subPackets);
          bitsRead += subPackets
        }
      } else {
        let subBitsRead = 0;
        while(subBitsRead < packet.l) {
          let subPackets = generatePacket(packet, locTransmission);
          locTransmission = locTransmission.slice(subPackets);
          subBitsRead += subPackets
        }
        bitsRead += subBitsRead
      }
  }
  parent.subpackets.push(packet);
  return bitsRead;
}

const getValue = (packet: Packet): number=> {
  if(packet.value) {
    return packet.value
  } 

  let values: number[] = packet.subpackets.map(p => {
    return getValue(p) 
  }) || [-1]

  switch(packet.id) {
    case 0: 
      packet.value = values.reduce((prev, cur) => {return prev + cur});
      break;
    case 1:
      packet.value = values.reduce((prev, cur) => {return prev * cur})
      break;
    case 2:
      packet.value = Math.min(...values);
      break;
    case 3:
      packet.value = Math.max(...values);
      break;
    case 5:
      packet.value = values[0] > values[1] ? 1 : 0;
      break;
    case 6:
      packet.value = values[0] < values[1] ? 1 : 0;
      break;
    case 7:
      packet.value = values[0] === values[1] ? 1 : 0;
      break;
  }
  return packet.value as number;
}

const sumVersion = (packet: Packet, sum: number) => {
  if(packet.subpackets.length === 0) {
    return packet.version
  }
  let recSum = packet.version
  packet.subpackets.forEach(p => recSum += sumVersion(p, sum))
  return sum + recSum
}
const sol1 = (input: string) => {
  let transmission: string= input;
  // Kje generirame drvo so paketi, ovoj go kreirame samo kako root
  const rootPacket: Packet = {
    version: 0,
    id: 0,
    subpackets: [],
    lType: "0",
    l: transmission.length
  }

  generatePacket(rootPacket, transmission)
  let sum = sumVersion(rootPacket, 0);
  fs.writeFileSync("./test.json",JSON.stringify(rootPacket, null, 2))
  return sum;
}

const sol2 = (input: string) => {
  let transmission: string= input;
  // Kje generirame drvo so paketi, ovoj go kreirame samo kako root
  const rootPacket: Packet = {
    version: 0,
    id: 0,
    subpackets: [],
    lType: "0",
    l: transmission.length
  }

  generatePacket(rootPacket, transmission)
  let value = getValue(rootPacket.subpackets[0]);

  return value
}

console.log({sol: "1", res: sol1(input)})
console.log({sol: "2", res: sol2(input)})
