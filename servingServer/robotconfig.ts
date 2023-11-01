// robotconfig.ts

// robotSettings
type PointCoordinateType = {
    x?: string,
    y?: string,
    theta?: string,
}
export let robotSettings: {
    [key: string]: {
        robotNumber:number,
        robotIP:string,
        robotRunningState:boolean,
        robotLastOrderPoint:PointCoordinateType
    }
} = {};

export function setRobotSettings(name: string, robotNumber:number, robotIP:string, robotRunningState:boolean, robotLastOrderPoint:PointCoordinateType) {
    robotSettings[name] = { robotNumber, robotIP, robotRunningState, robotLastOrderPoint };
}

// pointCoordinate
export let pointCoordinate: {
    [key: string]: {
        x: string,
        y: string,
        theta: string
    }
} = {};

export function setPointCoordinate(pointName: string, x: string, y: string, theta: string) {
    pointCoordinate[pointName] = { x, y, theta };
}

// robotIP
export let robotCoordinate:{
    [key: string]: {
        x:number,
        y:number,
        theta:number
    }
} = {};

export function setRobotCoordinate(robotName: string, x: number, y: number, theta: number) {
    robotCoordinate[robotName] = { x, y, theta };    
}


// laserCoordinate
export let laserCoordinate: {
    [key: string]: { x: number, y: number }[];
} = {};

export function setLaserCoordinate(robotName: string , centerPortion:[]) { 
    laserCoordinate[robotName] = centerPortion;    
}

// 교차로 관리
export let crossRoadState: {
    [key:string]: {
        robotName : string
    }
} = {};

export function setCrossRoadState(roadName: string , robotName:string) { 
    crossRoadState[roadName] = { robotName };    
}