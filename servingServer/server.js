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
exports.movePlan = void 0;
// server.ts
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const cors = require('cors');
app.use(cors()); // 모든 도메인에서의 요청 허용
const axios_1 = __importDefault(require("axios"));
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
// 로봇명 전역변수 설정
RobotSetup.serverSetup();
// ==
function movePlan(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`http://${robotconfig_1.robotSettings[robotName].robotIP}/reeman/global_plan`);
            if (response.status === 200) {
                var valuelist = Object.values(response.data);
                console.log(response.data.coordinates[response.data.coordinates.length - 1]);
                console.log(valuelist);
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
exports.movePlan = movePlan;
// ==
setTimeout(() => {
    // Func.moveCoordinates("192.168.0.177", "1.92", "7.31", "88");
    // Func.moveCoordinates(i, "1.92", "-0.08", "1.5498");
    // console.log(pointCoordinate);
    for (var i in robotconfig_1.robotSettings) {
        movePlan(i);
    }
}, 1000);
//         // ====================================================================================
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    for (var i in robotconfig_1.robotSettings) { // i = 등록된 로봇Name
        // 로봇 좌표 받기
        yield Func.getPose(i);
        // 로봇이 쏘는 레이저좌표 받기
        yield Func.getLaser(i);
        // 교차로 체크
        yield Func.checkCrossRoad(i);
        // 레이저 좌표를 받아서 충돌위험 체크
        yield Func.detectCollision(i);
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
}), 33);
//         // ====================================================================================
