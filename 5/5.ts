import { readInput } from "../input.helper";

type Point = {
    x: number,
    y: number
}

type Line = {
    begin: Point,
    end: Point
}


type Floor = {
    lines: Line[];
    x: number,
    y: number
    board: number[][]
}

const lineRegex = /(\d+),(\d+) -> (\d+),(\d+)/; 
const input = readInput(5).split("\n");

const generateFloor = (input: string[], countDiagonals: boolean) => {
    const lines: Line[] = []
    let maxX = 0;
    let maxY = 0;
    input.forEach((e: string) => {
        let [, x1match, y1match, x2match, y2match] = lineRegex.exec(e) || []
        let [x1, y1, x2, y2] = [ parseInt(x1match), parseInt(y1match), parseInt(x2match), parseInt(y2match) ]
        if(!countDiagonals) {
            if(x1 === x2 || y1 === y2) {
                maxX = maxX < Math.max(x1,x2) ? Math.max(x1,x2) : maxX;
                maxY = maxY < Math.max(y1,y2) ? Math.max(y1,y2) : maxY;
                let begin: Point= {
                    x: x1,
                    y: y1
                }
                let end: Point= {
                    x: x2,
                    y: y2
                }
                lines.push({begin: {...begin}, end: {...end}})
            }
        } else {
            maxX = maxX < Math.max(x1,x2) ? Math.max(x1,x2) : maxX;
            maxY = maxY < Math.max(y1,y2) ? Math.max(y1,y2) : maxY;
            let begin: Point= {
                x: x1,
                y: y1
            }
            let end: Point= {
                x: x2,
                y: y2
            }
            lines.push({begin: {...begin}, end: {...end}})
        }
    })
    const floor: Floor = {
        lines: [...lines],
        x: maxX,
        y: maxY,
        // Ova kreira array so dimeznii maxx/maxy i go polni so nuli
        board: [...new Array(maxY+1)].map(e => [...Array(maxX+1).fill(0)])
    }
    return floor;
}

const drawLines = (floor: Floor, drawDiagonals: boolean) => {
    let points = 0
    floor.lines.forEach((line: Line) => {
        if(line.begin.x === line.end.x) {
            for(let i = Math.min(line.begin.y, line.end.y); i <= Math.max(line.begin.y, line.end.y); i++) {
                floor.board[i][line.begin.x] += 1;
                if(floor.board[i][line.begin.x] === 2) {
                    points++;
                    console.log(`Horizontal line, points++ : ${points}`)
                }
            }
        } else if(line.begin.y === line.end.y) {
            for(let i = Math.min(line.begin.x, line.end.x); i <= Math.max(line.begin.x, line.end.x); i++) {
                floor.board[line.begin.y][i] += 1;
                if(floor.board[line.begin.y][i] === 2) {
                    points++;
                    console.log(`Vertical line, points++ : ${points}`)
                }
            }
        } else if(drawDiagonals) {
            // ako dijagonalata e od levo kon desno ili kon desno kon levo
            if(( line.begin.x < line.end.x ) && (line.begin.y < line.end.y) || (line.begin.x > line.end.x ) && (line.begin.y > line.end.y)) {
                let steps = Math.abs(line.begin.x - line.end.x);
                let i = 0
                let startX = Math.min(line.begin.x, line.end.x)
                let startY = Math.min(line.begin.y, line.end.y)
                while(i <= steps) {
                    floor.board[startY+i][startX+i] += 1
                    if(floor.board[startY+i][startX+i] === 2) {
                        points++
                        console.log(`Positive diagonal, points++ : ${points}`)
                    }
                    i++;
                }
            } else {
                let steps = Math.abs(line.begin.x - line.end.x);
                let i = 0
                let startX: number;
                let startY: number;
                if(line.begin.x < line.end.x) {
                    startX = line.begin.x
                    startY = line.begin.y
                } else {
                    startX = line.end.x
                    startY = line.end.y
                }
                while(i <= steps) {
                    floor.board[startY-i][startX+i] += 1
                    if(floor.board[startY-i][startX+i] === 2) {
                        points++;
                        console.log(`Negative diagonal, points++ : ${points}`)
                    }
                    i++;
                }
            }
        }
    });
    return points
}
const sol1 = (floor: Floor) => {
    return drawLines(floor, false); 
}

const sol2 = (floor: Floor) => {
    return drawLines(floor, true)
}

const floor1 = generateFloor(input, false);
const floor2 = generateFloor(input, true);

console.log({name: "sol1", val: sol1(floor1)})
console.log({name: "sol2", val: sol2(floor2)})
