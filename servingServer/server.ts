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
    collision,
    setCollision,
} from './robotconfig';

import * as RobotSetup from './Services/robotSetup.js';
import * as Func from './Services/robotCommands.js';
import * as API from './Services/robotApiCommands.js';
// ==========================
import { fork } from 'child_process';

// server2.ts를 별도의 자식 프로세스로 실행합니다.
const server2 = fork('server2.js', [], {
  env: { PORT: '8085' }
});

server2.on('message', (message) => {
  console.log('Message from server2:', message);
});

server2.on('close', (code) => {
  console.log(`server2 process exited with code ${code}`);
});
// ==========================
// SETUP
RobotSetup.serverSetup();

setInterval(async () => {
    try {
        for (var i in robotSettings) { // i = 등록된 로봇Name
            // 로봇 좌표 받기
            await API.getPose(i);
            // 교차로 체크
            // const crossCheck = await Func.checkCrossRoad(i); // true / false반환
            // if (crossCheck) {
            //     console.log(crossRoadState);
            // }
        }
        // 자신이 쏘는 라이다 좌표 받기
        await API.getLaser(currentRobotName);




        // 레이저 좌표를 받아서 충돌위험 체크
        let collisionCheck = await Func.detectCollision(currentRobotName); // true / false반환
        console.log(collisionCheck);
        if (collisionCheck) { // mapingServer에서 기록한 맵핑데이터에 의해 벽충돌은 제거함
            setCollision(true);
            // // 장애물이 감지됫다면
            console.log(currentRobotName + " 장애물 충돌 위험");
            // // // 로봇인지 아닌지 체크
            const checkRobot = await Func.checkRobotCoordinates(currentRobotName, collisionCheck);
            if (checkRobot) {
                console.log("로봇입니다");
            } else {
                console.log("로봇이 아닙니다.");
            }
        } else {
            // 장애물 충돌 위험 없음
            setCollision(false);
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

// setInterval(() => {
//     API.movePoint("point01");
    
//     setTimeout(() => {
//         API.movePoint("point02");
//     }, 16000);
// }, 32000);