// server.ts
import express from 'express';
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors()); // 모든 도메인에서의 요청 허용
import axios from 'axios';
const PORT = process.env.PORT || 8084;
 
// 서버 시작
const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});

//MQTT
// import { initializeMQTT } from './mqtthandler';
import { initializeMQTT } from './Services/mqttHandler';
const mqttClient = initializeMQTT();

// 라우터
import robotRouters from './Routers/robotrouters';
import pointRouters from './Routers/pointrouters';
app.use('/', robotRouters);
app.use('/', pointRouters);

import {
    robotSettings,
    setRobotSettings,
    pointCoordinate,
    setPointCoordinate,
    robotCoordinate,
    setRobotCoordinate,
    laserCoordinate,
    setLaserCoordinate
} from './robotconfig';

import * as RobotSetup from './Services/robotSetup.js';
import * as Func from './Services/robotCommands.js';

// 로봇명 전역변수 설정
RobotSetup.serverSetup();


//

// setTimeout(() => {
//     // Func.moveCoordinates("robot1", "0", "0", "0");
//     Func.getLaser("robot1");
//     setTimeout(() => {
//         console.log(laserCoordinate["robot1"]);
        
//     }, 1000);

// }, 1000);

// 각 로봇의 좌표 계속 전송
// 각 로봇 레이저 좌표 계속 전송
 
// setInterval(async () => {
//     // 좌표와 레이저 정보 받기
//     for(var i in robotSettings){ // i = 등록된 로봇Name
//         // console.log(i); // 로봇명
//         await Func.getPose(i);
//         await Func.getLaser(i);
//     }
    
//     // 장애물 감지 
//     for(var i in robotSettings){
        
//         const robotTheta = robotCoordinate[i].theta * (180 / Math.PI); // robotCoordinate[i].theta은 라디안값이라 각도로
//         const robotX = robotCoordinate[i].x;
//         const robotY = robotCoordinate[i].y;
        
//         for(const laserPoint of laserCoordinate[i]){
//         // ====================================================================================

//             const dx = robotX - laserPoint.x;
//             const dy = robotY - laserPoint.y;
//             const distance = Math.sqrt(dx * dx + dy * dy);
//             // 장애물과 로봇이 일정거리 이내
//             if(distance < 1.5) {
    //                 console.log(i + "가 인식한 장애물의 좌표" + laserPoint.x + " / "+ laserPoint.y);
    //                 var direction = await Func.getDivideDirection(robotTheta, laserPoint.x, laserPoint.y, robotX, robotY);
    //                 console.log(direction); // 로봇의 기준으로 장애물이 left / right인지 확인
    //                 break;
    //             }     
    //         }
    //     }
    // }, 33);
    
    // },100);
//         // ====================================================================================
setInterval(async () => {
    // 좌표와 레이저 정보 받기
    for (var i in robotSettings) { // i = 등록된 로봇Name
        await Func.getPose(i);
        await Func.getLaser(i);
    }

    // 장애물 감지 
    for (var i in robotSettings) {
        const robotTheta = robotCoordinate[i].theta; // 라디안 값
        const robotX = robotCoordinate[i].x;
        const robotY = robotCoordinate[i].y;

        for (const laserPoint of laserCoordinate[i]) {
            const dx = laserPoint.x - robotX;
            const dy = laserPoint.y - robotY;
            const rotatedX = dx * Math.cos(-robotTheta) - dy * Math.sin(-robotTheta);
            const rotatedY = dx * Math.sin(-robotTheta) + dy * Math.cos(-robotTheta);

            // 충돌 검사 영역 설정 (예: 로봇 전면 1m x 0.5m 크기의 직사각형)
            const rectangleWidth = 1.5;
            const rectangleHeight = 0.8;

            // 충돌 위험 판단
            if (rotatedX >= 0 && rotatedX <= rectangleWidth && Math.abs(rotatedY) <= rectangleHeight / 2) {
                const direction = rotatedY > 0 ? "left" : "right";
                console.log("충돌 위험:", laserPoint, direction);
            }
        }
    }
}, 33);

//         // ====================================================================================
// for(var i in robotSettings){
    // Func.moveCoordinates("192.168.0.177", "1.92", "7.31", "88");
    // Func.moveCoordinates(i, "1.92", "-0.08", "1.5498");
// }

// setTimeout(() => {
// for(var i in robotSettings){
//     console.log(i);
//     console.log(robotSettings[i]);
// }

//원점
//155 - 244도
//157 - 244

// 170 - 227도
// 180 - 222도  
// 170 - 232도

// 244 -> 232 => 12도

//250도 -> 프로그램 153.55


//Theta 계산 // 각도 => Theta
// const degrees = 88.8;
// const radians = (degrees * Math.PI) / 180;
// console.log(radians);
// // Theta => 각도로 재변환
// // Theta * (180 / Math.PI);
// const degreesFromRadians = radians * (180 / Math.PI);
// console.log(degreesFromRadians);


// moverCoordinates('192.168.0.15', 0.0, 0.0, 0);
// moverCoordinates('192.168.0.15', -2.2, -0.65, radians);
// moverCoordinates('192.168.0.15', 6.2, -0.8, radians);


// 027.019.155.8
// movePoint('192.168.0.15', '0');
// moverCoordinates('192.168.0.15', 1.0, 0.3, radians);

