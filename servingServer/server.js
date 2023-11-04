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
const onoff_1 = require("onoff");
// 버튼의 GPIO 핀을 설정합니다.
const buttons = {
    GPIO16: new onoff_1.Gpio(16, 'in', 'rising', { debounceTimeout: 1000, activeLow: true }),
    GPIO19: new onoff_1.Gpio(19, 'in', 'rising', { debounceTimeout: 1000, activeLow: true }),
    GPIO20: new onoff_1.Gpio(20, 'in', 'rising', { debounceTimeout: 1000, activeLow: true }),
    GPIO26: new onoff_1.Gpio(26, 'in', 'rising', { debounceTimeout: 1000, activeLow: true }),
    GPIO21: new onoff_1.Gpio(21, 'in', 'rising', { debounceTimeout: 1000, activeLow: true }),
};
// 버튼 클릭 이벤트 리스너를 설정합니다.
Object.keys(buttons).forEach((button) => {
    buttons[button].watch((err, value) => {
        if (err) {
            throw err;
        }
        console.log(button); // 버튼의 GPIO 번호를 출력합니다.
    });
});
// 서버 종료시 GPIO 자원을 해제합니다.
// process.on('SIGINT', () => {
// Object.values(buttons).forEach((button) => {
//     button.unexport();
// });
// });
