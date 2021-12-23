import { readInput } from "../input.helper";
import { Hash } from "../helper.types";

const input = readInput(23).split("\n");

const Modifiers = {
  "A": 1,
  "B": 10,
  "C": 100,
  "D": 1000,
}

const Rooms = {
  "A": 2,
  "B": 4,
  "C": 6,
  "D": 8
}

type PodType = "A" | "B" | "C" | "D"

type Move = {
  podId: number,
  position: [number, number]
}
type Pod = {
  type: PodType,
  postion: [number, number],
  moves: number,
  hasMoved: boolean,
}

type GameState = {
  isDone: boolean,
  pods: Pod[],
}

const getPossibleMoves = (p: Pod[]): [Move[], boolean] => {
  let moves: Move[] = []
  const pods = p;

  const rooms: Hash<string[]> = {
    [Rooms["A"]]: [],
    [Rooms["B"]]: [],
    [Rooms["C"]]: [],
    [Rooms["D"]]: []
  }
  let isWon = true;
  pods.forEach((pod: Pod) => {
    let podY = pod.postion[1]
    if(podY % 2 === 0 && (podY !== 0 && podY !== 10)) {
      rooms[podY].push(pod.type)
      if(podY !== Rooms[pod.type]) {
        isWon = false;
      }
    } else {
      isWon = false;
    }
  })
  if(!isWon) {
    pods.forEach((pod: Pod, i: number) => {
      const podRoom = Rooms[pod.type];
      let occupants = rooms[podRoom]
      if(pod.hasMoved && pod.postion[1] !== podRoom) {
        let isRoomAvailable = occupants.length === 2 ? false : !occupants.filter(occupant => occupant !== pod.type).length
        let possibleBlockers = [1,3,5,7,9, podRoom].sort((a,b)=> a-b);
        pods.forEach((oPod: Pod, j:number) => {
          if(oPod.hasMoved && (oPod.postion[1] % 2) !== 0) {
            if(oPod.postion[1] > pod.postion[1]) {
              possibleBlockers.splice(possibleBlockers.indexOf(oPod.postion[1]))      
            } else if(oPod.postion[1] < pod.postion[1]) {
              possibleBlockers.splice(0, possibleBlockers.indexOf(oPod.postion[1]) + 1);
            }
          }
        })
        let isAvailable = possibleBlockers.includes(podRoom);
        if(isRoomAvailable && isAvailable) {
          if(occupants.length) {
            moves.push({
              podId: i,
              position: [1, podRoom]
            })
          } else {
            moves.push({
              podId: i,
              position: [2, podRoom]
            })
          }
        }
      } else if(!pod.hasMoved) {
        let possiblePosstions = [0,1,3,5,7,9,10, Rooms[pod.type]].sort((a, b) => a - b);
        if(pod.postion[0] !== 2 || pod.postion[1] !== podRoom) {
          for(let pk in pods) {
            let oPod = pods[pk];
            if(oPod.postion[0] === 0) {
              if(oPod.postion[1] > pod.postion[1]) {
                possiblePosstions.splice(possiblePosstions.indexOf(oPod.postion[1]))      
              } else if(oPod.postion[1] < pod.postion[1]) {
                possiblePosstions.splice(0, possiblePosstions.indexOf(oPod.postion[1]) + 1);
              }
            } else {
              if(oPod.postion[1] === pod.postion[1] && oPod.postion[0] < pod.postion[0]) {
                possiblePosstions = []
                break;
              }
            }
          }

          for(let pk in possiblePosstions) {
            let pos: number = possiblePosstions[pk]
            if(pos === podRoom) {
              let isRoomAvailable = occupants.length === 2 ? false : !occupants.filter(occupant => occupant !== pod.type).length
              if(isRoomAvailable) {
                if(occupants.length > 0) {
                  moves.push({
                    podId: i,
                    position: [1, podRoom]
                  })
                } else {
                  moves.push({
                    podId: i,
                    position: [2, podRoom]
                  })
                }
              }
            } else {
              moves.push({
                podId: i,
                position: [0, pos]
              })
            }
          }
        }
      }
    })
  }

  return[moves, isWon]
}

const parseInput = (input: string[]): Pod[] => {
  let pods: Pod[] = []
  input.forEach((line: string, row: number) => {
    line.split("").forEach((space: string, col: number) => {
      if(space !== "#" && space !== "." && space !== " ") {
        pods.push({
          type: space as PodType,
          postion: [row-1, col-1],
          moves: 0,
          hasMoved: false
        })
      }
    })
  })
  return pods
}

const calculatePoints = (p: Pod[]) => {
  return p.reduce((sum: number, pod: Pod) => sum + pod.moves * Modifiers[pod.type] ,0);
}

let minPoints: number = Number.MAX_SAFE_INTEGER;
const cached: Hash<number> = {}
let possibleUniverses = 0;
let ranUniverses = 0;
let readFromCache = 0;
const playGame = (gameState: GameState): number=> {
  // if(cached[JSON.stringify(gameState.pods)]) {
  //   readFromCache++;
  //   return cached[JSON.stringify(gameState.pods)];
  // } 

  let [moves, isWon]: [Move[], boolean] = getPossibleMoves(gameState.pods);
  possibleUniverses += moves.length;
  ranUniverses++;
  console.clear()
  console.log(`${ranUniverses}/${possibleUniverses}`)
  console.log(`${minPoints}`)
  console.log(`Read from cache ${readFromCache} times`)
  if(isWon) {
    let points = calculatePoints(gameState.pods);
    if(minPoints > points) {
      minPoints = points;
    }
    // cached[JSON.stringify(gameState.pods)] = points;
    return points;
  } else if(!moves.length) {
    // cached[JSON.stringify(gameState.pods)] = Number.MAX_SAFE_INTEGER;
    return Number.MAX_SAFE_INTEGER;
  }


  let points = Number.MAX_SAFE_INTEGER
  moves.forEach((move: Move) => {
    let newGameState: GameState = JSON.parse(JSON.stringify(gameState));
    let oldPosition = newGameState.pods[move.podId].postion
    let newPosition = move.position
    let manhattanDistance = Math.abs(newPosition[0] - oldPosition[0]) + Math.abs(newPosition[1] - oldPosition[1]) 
    if((newPosition[1] % 2 === 0 && newPosition[0] !== 0 && newPosition[1] !== 10) && (oldPosition[0] !== 0 && oldPosition[0] !== 10 && oldPosition[1] % 2 === 0)) {
      let roomDistance = Math.abs(oldPosition[1] - newPosition[1]);
      newGameState.pods[move.podId].moves += roomDistance + newPosition[0] + oldPosition[0];
    } else {
      newGameState.pods[move.podId].moves += manhattanDistance
    }
    newGameState.pods[move.podId].postion = [...newPosition];
    newGameState.pods[move.podId].hasMoved = true;
    let res = playGame(newGameState)
    if(res < points) {
      points = res;
    }
  })
  // cached[JSON.stringify(gameState.pods)] = points;
  return points; 
}

const sol1 = (input: string[]) => {
  let pods: Pod[] = parseInput(input)
  console.time("Running game")
  const gameState: GameState = {
    isDone: false,
    pods: pods
  }

  const res = playGame(gameState);
  console.timeEnd("Running game")
  return res;
}

const sol2 = (input: string[]) => {
}

console.log({sol: "1", res: sol1(input)})
console.log({sol: "2", res: sol2(input)})