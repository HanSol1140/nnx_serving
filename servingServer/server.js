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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const robotconfig_1 = require("./robotconfig");
const RobotSetup = __importStar(require("./Services/robotSetup.js"));
const Func = __importStar(require("./Services/robotCommands.js"));
const API = __importStar(require("./Services/robotApiCommands.js"));
const robotWheelControll_1 = require("./Services/robotWheelControll");
// 로봇명 전역변수 설정
RobotSetup.serverSetup();
setTimeout(() => {
    // Func.moveCoordinates("192.168.0.177", "1.92", "7.31", "88");
    // for(var i in robotSettings){
    //     console.log(i);
    // }
    // console.log(mappingData);
    // console.log(laserCoordinate);
    console.log(robotconfig_1.crossRoadState);
    console.log(robotconfig_1.crossPointCoordinates);
}, 1000);
// ====================================================================================
// ====================================================================================
// ====================================================================================
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (var i in robotconfig_1.robotSettings) { // i = 등록된 로봇Name
            // 로봇 좌표 받기
            yield API.getPose(i);
            // console.log(i);
            // console.log(robotCoordinate[i]);
            // 교차로 체크
            const crossCheck = yield Func.checkCrossRoad(i); // true / false반환
            // if (crossCheck) {
            //     console.log(crossRoadState);
            // }
        }
        // 자신이 쏘는 라이다 좌표 받기
        yield API.getLaser(robotconfig_1.currentRobotName);
        // 레이저 좌표를 받아서 충돌위험 체크
        // collision => 장애물의 좌표
        const collision = yield Func.detectCollision(robotconfig_1.currentRobotName); // true / false반환
        if (collision) { // mapingServer에서 기록한 맵핑데이터에 의해 벽충돌은 제거함
            // // 장애물이 감지됫다면
            (0, robotWheelControll_1.wheelControll)(true);
            console.log(robotconfig_1.currentRobotName + " 장애물 충돌 위험");
            // console.log(collision); // 장애물 좌표
            // console.log(robotCoordinate["robot1"].x, robotCoordinate["robot1"].y); // 로봇 좌표
            // // 로봇인지 아닌지 체크
            const checkRobot = yield Func.checkRobotCoordinates(robotconfig_1.currentRobotName, collision);
            if (checkRobot) {
                console.log("로봇입니다");
            }
            else {
                console.log("로봇이 아닙니다.");
            }
        }
        else {
            // 장애물 충돌 위험 없음
            (0, robotWheelControll_1.wheelControll)(false);
        }
        // console.log("======================================");
        // detectCollision 리턴값이 true(충돌위험발생)이라면 
        // console.log(robotCoordinate);
        // if(checkValue){
        //     // 체크한다
        //     // 
        // }
    }
    catch (error) {
        console.error("error");
    }
}), 33);
// ====================================================================================
// ====================================================================================
(0, robotWheelControll_1.wheelControll)(true);
setInterval(() => {
    API.movePoint("point01");
    setTimeout(() => {
        API.movePoint("point02");
    }, 12000);
}, 12000);
