"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const cors = require('cors');
app.use(cors()); // 모든 도메인에서의 요청 허용
const PORT = process.env.PORT || 8084;
// 서버 시작
const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});
//MQTT
// import { initializeMQTT } from './mqtthandler';
const mqttHandler_1 = require("./Services/mqttHandler");
const mqttClient = (0, mqttHandler_1.initializeMQTT)();
// 라우터
const robotrouters_1 = __importDefault(require("./Routers/robotrouters"));
const pointrouters_1 = __importDefault(require("./Routers/pointrouters"));
app.use('/', robotrouters_1.default);
app.use('/', pointrouters_1.default);
const RobotSetup = __importStar(require("./Services/robotSetup.js"));
// 로봇명 전역변수 설정
RobotSetup.serverSetup();
setTimeout(() => {
    // Func.moveCoordinates("192.168.0.177", "1.92", "7.31", "88");
    // for(var i in robotSettings){
    //     console.log(i);
    // }
}, 1000);
// ====================================================================================
let collision;
// setInterval(async () => {
// try{
//     for (var i in robotSettings) { // i = 등록된 로봇Name
//         // 로봇 좌표 받기
//         await Func.getPose(i);
//         // console.log(i);
//         // console.log(robotCoordinate[i]);
//         // 로봇이 쏘는 레이저좌표 받기
//         await Func.getLaser(i);
//         // 교차로 체크
//         const crossCheck = await Func.checkCrossRoad(i); // true / false반환
//         if(crossCheck){ // 교차로
//         }
//         // 레이저 좌표를 받아서 충돌위험 체크
//         collision = await Func.detectCollision(i); // true / false반환
//         if(collision){ // mapingServer에서 기록한 맵핑데이터에 의해 벽충돌은 제거함
//             //     // 장애물이 감지됫다면
//             console.log(i + " 장애물 충돌 위험");
//             //     // 로봇인지 아닌지 체크
//             // console.log(collision);
//             console.log(collision);
//             console.log(robotCoordinate["robot1"].x, robotCoordinate["robot1"].y);
//             Func.checkRobotCoordinates(i, collision);
//         }
//         console.log("======================================");
//         // detectCollision 리턴값이 true(충돌위험발생)이라면 
//         // console.log(robotCoordinate);
//         // if(checkValue){
//             //     // 체크한다
//             //     // 
//             // }
//         }
//     }catch(error){
//         console.error("error");
//     } 
// }, 33);
// ====================================================================================
// import { Gpio } from 'onoff';
// interface ButtonMap {
//     [key: string]: Gpio;
//   }
// // 버튼의 GPIO 핀을 설정합니다.
// const buttons: ButtonMap = {
//   GPIO16: new Gpio(16, 'in', 'falling', { debounceTimeout: 1000, activeLow:false }),
//   GPIO19: new Gpio(19, 'in', 'falling', { debounceTimeout: 1000, activeLow:false }), 
//   GPIO20: new Gpio(20, 'in', 'falling', { debounceTimeout: 1000, activeLow:false }), 
//   GPIO26: new Gpio(26, 'in', 'falling', { debounceTimeout: 1000, activeLow:false }),
//   // 핀에 출력을 HIGH/LOW로 설정한다면 HIGH일때 activeLow:false
//   // 버튼식으로 설정한다면 activeLow:true(풀업저항)으로 해야 누를때 rising이 감지됨 => 반대로 activeLow:false라면 누를때 falling감지
//   GPIO21: new Gpio(21, 'in', 'rising', { debounceTimeout: 1000, activeLow:false }),  
// }; 
// // 버튼 클릭 이벤트 리스너를 설정합니다.
// Object.keys(buttons).forEach((button) => {
//     buttons[button].watch((err:any, value:any) => {
//         if (err) {
//         throw err;
//         }
//         console.log(button); // 버튼의 GPIO 번호를 출력합니다.
//     });
// });
// 서버 종료시 GPIO 자원을 해제합니다.
// process.on('SIGINT', () => {
// Object.values(buttons).forEach((button) => {
//     button.unexport();
// });
// });
// import { PythonShell, Options as PythonShellOptions } from 'python-shell';
// // export function setupRobotPinCheck(){
//     let options: PythonShellOptions = {
//         mode: "text",
//         pythonPath: "/usr/bin/python3",
//         pythonOptions: ['-u'],
//         scriptPath: "/home/NNX_SERVING/servingServer"
//     };
//     let pySheel = new PythonShell('./Services/SetupPinCheck.py', options);
//     pySheel.on("message", function(message){
//         console.log(message);
//     });
// // }
