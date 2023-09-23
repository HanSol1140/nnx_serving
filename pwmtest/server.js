"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors = require('cors');
app.use(express_1.default.json());
app.use(cors());
const PORT = process.env.PORT || 8084;
const server = app.listen(PORT, () => {
    console.log("서버시작 포트 : " + PORT);
});
//  sudo apt-get install pigpio
const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;
const pwmPin = new Gpio(18, { mode: Gpio.OUTPUT });
let dutyCycle = 0;
setInterval(() => {
    pwmPin.pwmWrite(dutyCycle);
    dutyCycle += 5;
    if (dutyCycle > 255) {
        dutyCycle = 0;
    }
}, 20);
