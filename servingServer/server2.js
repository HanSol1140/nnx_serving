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
// process.on('message', (message:any) => {
//     if (message.booleanValue !== undefined) {
//       let collisionValue = message.booleanValue;
//       console.log(collisionValue);
//       setCollision(collisionValue);
//     }
//   });
// 서버 시작
const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});
const robotWheelControll_1 = require("./Services/robotWheelControll");
(0, robotWheelControll_1.wheelControll)();
