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
exports.checkWhell = exports.wheelControll2 = exports.wheelControll = void 0;
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
                console.log(hexData1);
                // hexData1 = hexData1.match(/.{1,2}/g)
                // let byteArray = hexData.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
                // console.log(`Received from UART2: ${hexData1}`);
                // uart3.write(data); 
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
uart2.pipe(parser2);
uart3.pipe(parser3);
function wheelControll2() {
    return __awaiter(this, void 0, void 0, function* () {
        // UART2와 UART3 설정
        uart2.on('readable', () => {
            const data = uart2.read();
            if (data) {
                let hexData1 = data.toString('hex').toUpperCase();
                console.log(hexData1);
                adjustSpeedAndSend(data);
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
// ===================================================================================================================
// ===================================================================================================================
function calculateChecksum(buffer) {
    // 체크섬 계산 시 프레임 헤더는 제외
    const checksumBuffer = buffer.slice(2);
    const sum = checksumBuffer.reduce((acc, val) => acc + val, 0);
    const checksum = sum % 256;
    return checksum;
}
function adjustSpeedAndSend(data) {
    // 입력된 데이터를 Buffer 객체로 변환
    let commandBuffer = Buffer.from(data, 'hex');
    console.log(commandBuffer);
    if (commandBuffer.slice(0, 3).toString('hex').toUpperCase() === 'D55DFE') {
        if (commandBuffer[9] == 0x00) {
            // 속도 데이터 추출 및 조정
            const leftWheelSpeed = (commandBuffer[9] - 0x80) * 256 + commandBuffer[8];
            // 오른쪽 바퀴 속도를 왼쪽 바퀴 속도에 기반하여 계산
            const rightWheelSpeed = (commandBuffer[12]) * 256 + commandBuffer[11];
            // 속도 조정 (예시: 왼쪽 바퀴 50%, 오른쪽 바퀴 25%로 조정)
            let adjustedLeftWheelSpeed = Math.floor(leftWheelSpeed * 0.5);
            let adjustedRightWheelSpeed = Math.floor(leftWheelSpeed * 0.25);
            // 조정된 속도값으로 Buffer 업데이트
            commandBuffer[9] = (adjustedLeftWheelSpeed >> 8) + 0x80;
            commandBuffer[8] = adjustedLeftWheelSpeed & 0xFF;
            commandBuffer[12] = (adjustedRightWheelSpeed >> 8);
            commandBuffer[11] = adjustedRightWheelSpeed & 0xFF;
            // 체크섬 계산을 위해 마지막 바이트 제거
            commandBuffer = commandBuffer.slice(0, -1);
            console.log(commandBuffer);
            // 체크섬 추가
            commandBuffer = Buffer.concat([commandBuffer, Buffer.from([calculateChecksum(commandBuffer)])]);
            // 명령어 전송
            uart3.write(commandBuffer);
        }
        else {
            uart3.write(data);
        }
    }
    else {
        // 'D55DFE'로 시작하지 않는 데이터는 그대로 전송
        uart3.write(data);
    }
}
// ===================================================================================================================
// ===================================================================================================================
// ===================================================================================================================
function calculateChecksum2(commandWithoutChecksum) {
    // 프레임 헤더 'D55D'를 제거
    const commandWithoutHeader = commandWithoutChecksum.startsWith('D55D')
        ? commandWithoutChecksum.substring(4)
        : commandWithoutChecksum;
    // 체크섬을 계산하기 위해 바이트 데이터의 합을 계산
    let sum = 0;
    for (let i = 0; i < commandWithoutHeader.length; i += 2) {
        sum += parseInt(commandWithoutHeader.substring(i, i + 2), 16);
    }
    // 체크섬은 합계를 256으로 나눈 나머지
    return (sum % 256).toString(16).padStart(2, '0').toUpperCase();
}
// 체크섬 계산 함수는 앞서 작성된 코드 그대로 유지
function adjustSpeedAndSend2(data) {
    const hexData = data.toString('hex').toUpperCase();
    if (hexData.startsWith('D55DFE')) {
        // 속도 데이터 추출
        const speedPattern = /(?:0A)([0-9A-F]{2})([0-9A-F]{2})(?:0B)([0-9A-F]{2})([0-9A-F]{2})/;
        const match = speedPattern.exec(hexData);
        console.log(match);
        if (match && match[2] != "00") {
            let leftWheelSpeedHighByte = parseInt(match[2], 16) - 0x80; // 상위 바이트 계산
            let leftWheelSpeedLowByte = parseInt(match[1], 16); // 하위 바이트 계산
            let leftWheelSpeed = (leftWheelSpeedHighByte * 256) + leftWheelSpeedLowByte;
            // 속도 조정
            // leftWheelSpeed = Math.floor(leftWheelSpeed * 0.5); // 왼쪽 바퀴 속도 조정
            // let rightWheelSpeed = Math.floor(leftWheelSpeed * 0.25); // 오른쪽 바퀴 속도 조정
            // 조정된 속도를 16진수 문자열로 다시 변환
            let adjustedLeftWheelSpeed = Math.floor(leftWheelSpeed * 0.5);
            let adjustedRightWheelSpeed = Math.floor(adjustedLeftWheelSpeed * 0.25);
            let adjustedLeftWheelSpeedHex = ((adjustedLeftWheelSpeed >> 8) + 0x80).toString(16).padStart(2, '0').toUpperCase();
            let adjustedLeftWheelExtraHex = (adjustedLeftWheelSpeed & 0xFF).toString(16).padStart(2, '0').toUpperCase();
            let adjustedRightWheelSpeedHex = ((adjustedRightWheelSpeed >> 8)).toString(16).padStart(2, '0').toUpperCase();
            let adjustedRightWheelExtraHex = (adjustedRightWheelSpeed & 0xFF).toString(16).padStart(2, '0').toUpperCase();
            let newCommandWithoutChecksum = `D55DFE0A8320020A${adjustedLeftWheelExtraHex}${adjustedLeftWheelSpeedHex}0B${adjustedRightWheelExtraHex}${adjustedRightWheelSpeedHex}`;
            // 체크섬 계산 및 추가
            const checksumHex = calculateChecksum(newCommandWithoutChecksum);
            const newCommand = newCommandWithoutChecksum + checksumHex;
            // 새로운 명령어를 바이트 배열로 변환하여 uart3으로 전송
            const commandBuffer = Buffer.from(newCommand, 'hex');
            console.log(commandBuffer.toString('hex').toUpperCase());
            uart3.write(commandBuffer);
        }
    }
    else {
        // 'D55DFE'로 시작하지 않는 데이터는 그대로 전송
        uart3.write(data);
    }
}
function sendSpeedCommand() {
    const Speed = Buffer.from([0xD5, 0x5D, 0xFE, 0x0A, 0x83, 0x20, 0x02, 0x0A, 0x49, 0x80, 0x0B, 0x49, 0x00, 0xD4]);
    uart3.write(Speed, function (err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('Speed Command Sent');
    });
}
function checkWhell() {
    return __awaiter(this, void 0, void 0, function* () {
        setInterval(sendSpeedCommand, 500);
    });
}
exports.checkWhell = checkWhell;
