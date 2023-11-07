"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wheelControll2 = exports.wheelControll = void 0;
const serialport_1 = require("serialport");
function wheelControll() {
    return __awaiter(this, void 0, void 0, function* () {
        const uart2 = new serialport_1.SerialPort({ path: '/dev/ttyAMA2', baudRate: 115200 });
        let parser2 = new serialport_1.ReadlineParser();
        const uart3 = new serialport_1.SerialPort({ path: '/dev/ttyAMA3', baudRate: 115200 });
        let parser3 = new serialport_1.ReadlineParser();
        // UART2와 UART3 설정
        uart2.pipe(parser2);
        uart2.pipe(parser3);
        uart2.on('readable', () => {
            const data = uart2.read();
            if (data) {
                let hexData1 = data.toString('hex').toUpperCase();
                // hexData1 = hexData1.match(/.{1,2}/g)
                // let byteArray = hexData.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
                console.log(`Received from UART2: ${hexData1}`);
                uart3.write(data);
            }
        });
        uart3.on('readable', () => {
            const data = uart3.read();
            if (data) {
                let hexData2 = data.toString('hex').toUpperCase();
                // hexData2 = hexData2.match(/.{1,2}/g)
                // let byteArray = hexData.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
                console.log(`Received from UART3: ${hexData2}`);
                uart2.write(data);
            }
        });
        // 에러 핸들링
        uart2.on('error', function (err) {
            console.log('Error on UART2: ', err.message);
        });
        uart3.on('error', function (err) {
            console.log('Error on UART3: ', err.message);
        });
    });
}
exports.wheelControll = wheelControll;
const uart2 = new serialport_1.SerialPort({ path: '/dev/ttyAMA2', baudRate: 115200 });
let parser2 = new serialport_1.ReadlineParser();
const uart3 = new serialport_1.SerialPort({ path: '/dev/ttyAMA3', baudRate: 115200 });
let parser3 = new serialport_1.ReadlineParser();
function wheelControll2() {
    return __awaiter(this, void 0, void 0, function* () {
        // UART2와 UART3 설정
        uart2.pipe(parser2);
        uart2.pipe(parser3);
        uart2.on('readable', () => {
            const data = uart2.read();
            if (data) {
                let hexData1 = data.toString('hex').toUpperCase();
                let buffer = Buffer.from(hexData1, 'hex');
                // // hexData1 = hexData1.match(/.{1,2}/g)
                // // let byteArray = hexData.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
                // console.log(`Received from UART2: ${hexData1}`);
                uart3.write(buffer);
            }
        });
        uart3.on('readable', () => {
            const data = uart3.read();
            if (data) {
                let hexData2 = data.toString('hex').toUpperCase();
                // hexData2 = hexData2.match(/.{1,2}/g)
                // let byteArray = hexData.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
                // console.log(`Received from UART3: ${hexData2}`);
                uart2.write(data);
            }
        });
        // 에러 핸들링
        uart2.on('error', function (err) {
            console.log('Error on UART2: ', err.message);
        });
        uart3.on('error', function (err) {
            console.log('Error on UART3: ', err.message);
        });
    });
}
exports.wheelControll2 = wheelControll2;
// ===================================================================================================================
function adjustSpeedAndSend(data) {
    // 데이터를 16진수 바이트로 변환
    const hexData = data.toString('hex').toUpperCase();
    // 'D5 5D FE'로 시작하는 데이터 패턴 확인
    if (hexData.startsWith('D55DFE')) {
        // 속도 데이터 추출
        const leftWheelSpeedHex = hexData.substring(18, 22);
        const rightWheelSpeedHex = hexData.substring(24, 28);
        // 16진수를 10진수로 변환
        let leftWheelSpeed = parseInt(leftWheelSpeedHex, 16);
        let rightWheelSpeed = parseInt(rightWheelSpeedHex, 16);
        // 속도 조정 (0.5배, 0.25배)
        leftWheelSpeed = Math.round(leftWheelSpeed * 0.5);
        rightWheelSpeed = Math.round(rightWheelSpeed * 0.25);
        // 조정된 속도를 16진수 문자열로 다시 변환
        const adjustedLeftWheelSpeedHex = leftWheelSpeed.toString(16).padStart(4, '0').toUpperCase();
        const adjustedRightWheelSpeedHex = rightWheelSpeed.toString(16).padStart(4, '0').toUpperCase();
        // 새로운 명령어 생성
        const newCommand = hexData.substring(0, 18) + adjustedLeftWheelSpeedHex + hexData.substring(22, 24) + adjustedRightWheelSpeedHex + hexData.substring(28);
        // 새로운 명령어를 바이트 배열로 변환하여 uart3으로 전송
        const commandBuffer = Buffer.from(newCommand, 'hex');
        uart3.write(commandBuffer);
    }
    else {
        // 'D55DFE'로 시작하지 않는 데이터는 그대로 전송
        uart3.write(data);
    }
}
