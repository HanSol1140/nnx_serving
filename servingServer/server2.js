"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server2.ts
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const cors = require('cors');
app.use(cors()); // 모든 도메인에서의 요청 허용
const PORT = process.env.PORT || 8085;
const robotconfig_1 = require("./robotconfig");
process.on('message', (message) => {
    if (message.booleanValue == true && robotconfig_1.collision != true) {
        (0, robotconfig_1.setCollision)(message.booleanValue);
        setTimeout(() => {
            (0, robotconfig_1.setCollision)(false);
        }, 3000);
    }
    // else{
    //     setCollision(false);
    // }
});
// 서버 시작
const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});
const robotWheelControll_1 = require("./Services/robotWheelControll");
(0, robotWheelControll_1.wheelControll)();
