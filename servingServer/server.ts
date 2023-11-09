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
    setLaserCoordinate,
    mappingData,
    crossRoadState,
    currentRobotName,
    setCurrentRobotName,
    crossPointCoordinates,
} from './robotconfig';

import * as RobotSetup from './Services/robotSetup.js';
import * as Func from './Services/robotCommands.js';
import * as API from './Services/robotApiCommands.js';
import { wheelControll } from './Services/robotWheelControll';

// 로봇명 전역변수 설정
RobotSetup.serverSetup();

setTimeout(() => {
    // Func.moveCoordinates("192.168.0.177", "1.92", "7.31", "88");
    // for(var i in robotSettings){
    //     console.log(i);
    // }
    // console.log(mappingData);
    // console.log(laserCoordinate);
    console.log(crossRoadState);
    console.log(crossPointCoordinates);
}, 10);
// ====================================================================================
// ====================================================================================
// ====================================================================================

setInterval(async () => {
    try {
        for (var i in robotSettings) { // i = 등록된 로봇Name
            // 로봇 좌표 받기
            await API.getPose(i);
            // console.log(i);
            // console.log(robotCoordinate[i]);
            // 교차로 체크
            const crossCheck = await Func.checkCrossRoad(i); // true / false반환
            // if (crossCheck) {
            //     console.log(crossRoadState);
            // }
        }
        // 자신이 쏘는 라이다 좌표 받기
        await API.getLaser(currentRobotName);




        // 레이저 좌표를 받아서 충돌위험 체크
        // collision => 장애물의 좌표
        const collision = await Func.detectCollision(currentRobotName); // true / false반환
        if (collision) { // mapingServer에서 기록한 맵핑데이터에 의해 벽충돌은 제거함
            // // 장애물이 감지됫다면
            wheelControll(true);
            console.log(currentRobotName + " 장애물 충돌 위험");

            // console.log(collision); // 장애물 좌표
            // console.log(robotCoordinate["robot1"].x, robotCoordinate["robot1"].y); // 로봇 좌표
            // // 로봇인지 아닌지 체크
            const checkRobot = await Func.checkRobotCoordinates(currentRobotName, collision);
            if (checkRobot) {
                console.log("로봇입니다");
            } else {
                console.log("로봇이 아닙니다.");
            }
        } else {
            // 장애물 충돌 위험 없음
            wheelControll(false);
        }

        // console.log("======================================");
        // detectCollision 리턴값이 true(충돌위험발생)이라면 
        // console.log(robotCoordinate);
        // if(checkValue){
        //     // 체크한다
        //     // 
        // }

    } catch (error) {
        console.error("error");
    }
}, 33);
// ====================================================================================
// ====================================================================================
wheelControll(true);

setInterval(() => {
    API.movePoint("point01");
    
    setTimeout(() => {
        API.movePoint("point02");
    }, 12000);
}, 12000);