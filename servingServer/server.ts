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
    currentRobotName,
    setCurrentRobotName,
} from './robotconfig';

import * as RobotSetup from './Services/robotSetup.js';
import * as Func from './Services/robotCommands.js';

// 로봇명 전역변수 설정
RobotSetup.serverSetup();

setTimeout(()=>{
    // Func.moveCoordinates("192.168.0.177", "1.92", "7.31", "88");
    // for(var i in robotSettings){
    //     console.log(i);
    // }
    console.log(currentRobotName);
}, 1000);

// ====================================================================================
let collision;
setInterval(async () => {
try{
    for (var i in robotSettings) { // i = 등록된 로봇Name
        // 로봇 좌표 받기
        await Func.getPose(i);
        // console.log(i);
        // console.log(robotCoordinate[i]);
        // 로봇이 쏘는 레이저좌표 받기
        await Func.getLaser(i);
        // 교차로 체크
        const crossCheck = await Func.checkCrossRoad(i); // true / false반환
        if(crossCheck){ // 교차로
        }
        
        // 레이저 좌표를 받아서 충돌위험 체크
        collision = await Func.detectCollision(i); // true / false반환
        if(collision){ // mapingServer에서 기록한 맵핑데이터에 의해 벽충돌은 제거함
            //     // 장애물이 감지됫다면
            console.log(i + " 장애물 충돌 위험");
            //     // 로봇인지 아닌지 체크
            // console.log(collision);
            console.log(collision);
            console.log(robotCoordinate["robot1"].x, robotCoordinate["robot1"].y);
            Func.checkRobotCoordinates(i, collision);
        }
        
        console.log("======================================");
        // detectCollision 리턴값이 true(충돌위험발생)이라면 
        // console.log(robotCoordinate);
        // if(checkValue){
            //     // 체크한다
            //     // 
            // }
            
        }
    }catch(error){
        console.error("error");
    } 
}, 33);
// ====================================================================================
const {SerialPort, ReadlineParser} = require('serialport');

// UART2와 UART3 설정
const uart2 = new SerialPort({ path:'/dev/ttyAMA2', baudRate: 115200 });
let parser2 = new ReadlineParser();
uart2.pipe(parser2);
const uart3 = new SerialPort({ path:'/dev/ttyAMA3', baudRate: 115200 });
let parser3 = new ReadlineParser();
uart2.pipe(parser3);
;
   
// parser2.on('data', (data:any) => {
//   const hexString = Buffer.from(data).toString('hex');
//   console.log(`Received from UART2: ${hexString}`);
//   uart3.write(data); 
// });
// parser3.on('data', (data:any) => {
//     console.log(`Received from UART2: ${data.toString('hex')}`);
//     uart2.write(data); 
// });
uart2.on('readable', () => {
  const data = uart2.read();
  if (data) {
    let hexData = data.toString('hex').toUpperCase();
    hexData = hexData.match(/.{1,2}/g).join(' ');
    let byteArray = hexData.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
    console.log(`Received from UART2: ${hexData}`);
    uart3.write(data); 
  }
}); 
 
uart3.on('readable', () => {
  const data = uart3.read();
  if (data) {
    let hexData = data.toString('hex').toUpperCase();
    hexData = hexData.match(/.{1,2}/g).join(' ');
    let byteArray = hexData.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
    console.log(`Received from UART3: ${hexData}`);
    uart2.write(data); 
  }
});

// 에러 핸들링
uart2.on('error', function(err:any) {
  console.log('Error on UART2: ', err.message);
});
uart3.on('error', function(err:any) {
    console.log('Error on UART2: ', err.message);
});

// 서버가 종료될 때 포트 닫기
// process.on('SIGINT', () => {
//   console.log('Terminating the program...');
//   uart2.close(() => {
//     console.log('UART2 closed');
//   });
// });
