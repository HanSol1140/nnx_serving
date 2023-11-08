// robotSetup.ts
import axios from 'axios';
import fs from 'fs';
import {
    robotSettings,
    setRobotSettings,
    pointCoordinate,
    setPointCoordinate,
    robotCoordinate,
    setRobotCoordinate,
    laserCoordinate,
    setLaserCoordinate,
    mappingData,
    setMappingData,
    crossRoadCoordinates,
    setCrossRoadCoordinates,
    setCrossRoadState,
    setCurrentRobotName
} from '../robotconfig';



// 서버 실행시 로봇리스트 받아오기
export async function setupRobots() {
    if (!fs.existsSync('Settings/RobotSettings.json')) {
        console.error("File not found");
        return;
    }
    try {
        const fileData = fs.readFileSync('Settings/RobotSettings.json', 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        return data;
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

// 서버 실행시 포인트리스트 받아오기
export async function setupPoints() {
    if (!fs.existsSync('Settings/PointSettings.json')) {
        console.error("File not found");
        return;
    }
    try {
        const fileData = fs.readFileSync('Settings/PointSettings.json', 'utf8');
        let data = fileData ? JSON.parse(fileData) : [];
        return data;
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}

// 맵핑 데이터 받아오기 
export function setupMappingData():void {
    const filePath = 'Settings/MappingData.json';
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const newData = JSON.parse(fileData);
        setMappingData(newData);
    } else {
        console.error("File not found: data.json");
    }
}


import { PythonShell, Options as PythonShellOptions } from 'python-shell';
export function setupRobotPinCheck(){
    let options: PythonShellOptions = {
        mode: "text",
        pythonPath: "/usr/bin/python3",
        pythonOptions: ['-u'],
        scriptPath: "/home/nanonix/nnx_serving/servingServer/Services"
    };
    
    let pySheel = new PythonShell('./SetupPinCheck.py', options);

    pySheel.on("message", function(message){
        console.log(message);
        if(message == "GPIO16"){setCurrentRobotName("robot1");}
        if(message == "GPIO19"){setCurrentRobotName("robot2");}
        if(message == "GPIO20"){setCurrentRobotName("robot3");}
        if(message == "GPIO26"){setCurrentRobotName("robot4");}
    });
    pySheel.end(function (err) {
        if (err) throw err;
        // console.log('PythonShell finished');
    });
}
//===========================================================

//
interface robotsInfo {
    robotName: string;
    robotNumber: number;
    robotIP: string;
    robotRunningState: boolean,
    robotLastOrderPoint: object
}
interface pointsInfo {
    pointName: string;
    coordinatesX: string;
    coordinatesY: string;
    coordinatesTheta: string;
}
// 서버 실행시 로봇 / 포인트 설정
export async function serverSetup() {

    // 로봇 설정
    const robots: robotsInfo[] = await setupRobots();
    console.log(robots);

    robots.forEach(robot => {
        setRobotSettings(robot.robotName, robot.robotNumber, robot.robotIP, robot.robotRunningState, robot.robotLastOrderPoint);
    });
    // 포인트 좌표 설정
    const points: pointsInfo[] = await setupPoints();
    // console.log(points);

    points.forEach(point => {
        setPointCoordinate(point.pointName, point.coordinatesX, point.coordinatesY, point.coordinatesTheta);
    });
    
    // 교차로 좌표 설정
    points.forEach(point => {
        if (point.pointName.includes('cross')) {
            // 'cross'가 포함된 pointName을 가진 포인트의 X, Y 좌표를 설정합니다.
            setCrossRoadCoordinates(point.pointName, parseFloat(point.coordinatesX), parseFloat(point.coordinatesY));
        }
    });

    // 교차로 변수 할당
    points.forEach(point => {
        if (point.pointName.includes('cross')) {
            // 'cross'가 포함된 pointName을 가진 포인트의 X, Y 좌표를 설정합니다.
            setCrossRoadState(point.pointName, "");
        }
    });

    console.log("교차로"); 
    console.log(crossRoadCoordinates);
    // 맵핑데이터 변수에 할당
    await setupMappingData();
    // 핀출력으로 로봇명 확인
    // await setupRobotPinCheck();
}