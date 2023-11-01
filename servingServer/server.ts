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


setTimeout(()=>{
    // Func.moveCoordinates("192.168.0.177", "1.92", "7.31", "88");
    // Func.moveCoordinates(i, "1.92", "-0.08", "1.5498");
    // console.log(pointCoordinate);
    for(var i in robotSettings){
        Func.movePlan(i);
    }
}, 100);

//         // ====================================================================================

setInterval(async () => {
    
    for (var i in robotSettings) { // i = 등록된 로봇Name
        // 로봇 좌표 받기
        await Func.getPose(i);
        // 로봇이 쏘는 레이저좌표 받기
        await Func.getLaser(i);
        // 교차로 체크
        await Func.checkCrossRoad(i);
        

        // 레이저 좌표를 받아서 충돌위험 체크
        await Func.detectCollision(i);
        // console.log(checkValue);
        // detectCollision 리턴값이 true(충돌위험발생)이라면
        // console.log(robotCoordinate);
        // if(checkValue){
        //     // 체크한다
        //     // 
        // }

    }

    // // 장애물 감지 
    // for (var i in robotSettings) {
    //     const robotTheta = robotCoordinate[i].theta; // 라디안 값
    //     const robotX = robotCoordinate[i].x;
    //     const robotY = robotCoordinate[i].y;

    //     for (const laserPoint of laserCoordinate[i]) {
    //         const dx = laserPoint.x - robotX;
    //         const dy = laserPoint.y - robotY;
    //         const rotatedX = dx * Math.cos(-robotTheta) - dy * Math.sin(-robotTheta);
    //         const rotatedY = dx * Math.sin(-robotTheta) + dy * Math.cos(-robotTheta);

    //         // 충돌 검사 영역 설정 (예: 로봇 전면 1m x 0.5m 크기의 직사각형)
    //         const rectangleWidth = 1.5;
    //         const rectangleHeight = 0.8;

    //         // 충돌 위험 판단
    //         if (rotatedX >= 0 && rotatedX <= rectangleWidth && Math.abs(rotatedY) <= rectangleHeight / 2) {
    //             const direction = rotatedY > 0 ? "left" : "right";
    //             console.log("충돌 위험:", laserPoint, direction);
    //         }
    //     }
    // }
}, 33);

//         // ====================================================================================