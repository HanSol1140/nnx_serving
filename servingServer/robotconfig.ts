// robotconfig.ts
// 현재 라즈베리파이와 연결된 로봇명을 기입
export let currentRobotName = "robot1";

export function  setCurrentRobotName(robotName:string){
    currentRobotName = robotName;
}

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
import fs from 'fs';

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

// crossRoad(교차로) 변수에 등록
export let crossPointCoordinates:{
    [key: string]: {
        x:number,
        y:number
    }
} = {};

export function setCrossPointCoordinates(crossName: string, x: number, y: number) {
    crossPointCoordinates[crossName] = { x, y };    
}

// 교차로 안에 들어온 로봇체크
export let crossRoadState: {
    [key:string]:string;
} = {};

export function setCrossRoadState(roadName: string, robotName:string, ) { 
    crossRoadState[roadName] =  robotName ;    
}

// 맵핑 데이터 변수할당
export let mappingData: number[][] = [];

export function setMappingData(newData: number[][]): void {
    mappingData = newData;
}
