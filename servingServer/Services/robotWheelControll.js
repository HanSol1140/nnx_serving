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
exports.wheelControll = void 0;
const serialport_1 = require("serialport");
const robotconfig_1 = require("../robotconfig");
// ============================================
let collisionStartTime = 0;
let collisionDetected = false;
function checkForCollision() {
    if (robotconfig_1.collision) {
        if (!collisionDetected) {
            collisionStartTime = Date.now();
            collisionDetected = true;
        }
    }
    else {
        collisionStartTime = 0;
        collisionDetected = false;
    }
}
// ============================================
//
// UART2와 UART3 설정
const uart2 = new serialport_1.SerialPort({ path: '/dev/ttyAMA2', baudRate: 115200 });
let parser2 = new serialport_1.ReadlineParser();
const uart3 = new serialport_1.SerialPort({ path: '/dev/ttyAMA3', baudRate: 115200 });
let parser3 = new serialport_1.ReadlineParser();
uart2.pipe(parser2);
uart3.pipe(parser3);
function wheelControll() {
    return __awaiter(this, void 0, void 0, function* () {
        uart2.removeAllListeners('readable');
        uart3.removeAllListeners('readable');
        uart2.removeAllListeners('error');
        uart3.removeAllListeners('error');
        uart2.on('readable', () => {
            const data = uart2.read();
            if (data) {
                if (robotconfig_1.collision) {
                    // adjustSpeedAndSend(data);
                    checkForCollision();
                    const timeElapsed = Date.now() - collisionStartTime;
                    if (timeElapsed < 1100) { // 1초가 지나지 않았으면 adjustSpeedAndSend1을 호출
                        // console.log("1");
                        adjustSpeedAndSend1(data);
                    }
                    else { // 1초가 지났으면 adjustSpeedAndSend2를 호출
                        // console.log("2");
                        adjustSpeedAndSend2(data);
                    }
                }
                else {
                    // collision이 false일 때 정상 운행
                    // console.log("정상운행");
                    checkForCollision();
                    uart3.write(data);
                }
            }
        });
        // UART3
        uart3.on('readable', () => {
            const data = uart3.read();
            if (data) {
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
        // 에러가 나오면 한번만 출력하고 그 이후 에러는 무시
        // uart2.once('error', function (err) {
        //     console.log('Error on UART2: ', err.message);
        // });
        // uart3.once('error', function (err) {
        //     console.log('Error on UART3: ', err.message);
        // });
    });
}
exports.wheelControll = wheelControll;
function calculateChecksum(buffer) {
    // 체크섬 계산 시 프레임 헤더는 제외
    const checksumBuffer = buffer.slice(2);
    const sum = checksumBuffer.reduce((a, b) => a + b, 0);
    const checksum = sum % 256;
    return checksum;
}
function adjustSpeedAndSend1(data) {
    // 입력된 데이터를 Buffer 객체로 변환
    let commandBuffer = Buffer.from(data, 'hex');
    if (commandBuffer.slice(0, 3).toString('hex').toUpperCase() === 'D55DFE' && commandBuffer[9] != 0x00) {
        // 속도 데이터 추출 및 조정
        const leftWheelSpeed = (commandBuffer[9] - 0x80) * 256 + commandBuffer[8];
        // 오른쪽 바퀴 속도를 왼쪽 바퀴 속도에 기반하여 계산
        const rightWheelSpeed = (commandBuffer[12]) * 256 + commandBuffer[11];
        // 속도 조정 (예시: 왼쪽 바퀴 50%, 오른쪽 바퀴 25%로 조정)
        let adjustedLeftWheelSpeed = Math.floor(leftWheelSpeed * 0.5);
        let adjustedRightWheelSpeed = Math.floor(leftWheelSpeed * 1);
        // 조정된 속도값으로 Buffer 업데이트
        commandBuffer[9] = (adjustedLeftWheelSpeed >> 8) + 0x80;
        commandBuffer[8] = adjustedLeftWheelSpeed & 0xFF;
        commandBuffer[12] = (adjustedRightWheelSpeed >> 8);
        commandBuffer[11] = adjustedRightWheelSpeed & 0xFF;
        // 체크섬 계산을 위해 마지막 바이트 제거
        commandBuffer = commandBuffer.slice(0, -1);
        // 체크섬 추가
        commandBuffer = Buffer.concat([commandBuffer, Buffer.from([calculateChecksum(commandBuffer)])]);
        // 명령어 전송
        uart3.write(commandBuffer);
    }
    else {
        // 'D55DFE'로 시작하지 않는 데이터는 그대로 전송
        uart3.write(data);
    }
}
function adjustSpeedAndSend2(data) {
    // 입력된 데이터를 Buffer 객체로 변환
    let commandBuffer = Buffer.from(data, 'hex');
    if (commandBuffer.slice(0, 3).toString('hex').toUpperCase() === 'D55DFE' && commandBuffer[9] != 0x00) {
        // 속도 데이터 추출 및 조정
        const leftWheelSpeed = (commandBuffer[9] - 0x80) * 256 + commandBuffer[8];
        // 오른쪽 바퀴 속도를 왼쪽 바퀴 속도에 기반하여 계산
        const rightWheelSpeed = (commandBuffer[12]) * 256 + commandBuffer[11];
        // 속도 조정 (예시: 왼쪽 바퀴 50%, 오른쪽 바퀴 25%로 조정)
        let adjustedLeftWheelSpeed = Math.floor(leftWheelSpeed * 1);
        let adjustedRightWheelSpeed = Math.floor(leftWheelSpeed * 1);
        // 조정된 속도값으로 Buffer 업데이트
        commandBuffer[9] = (adjustedLeftWheelSpeed >> 8) + 0x80;
        commandBuffer[8] = adjustedLeftWheelSpeed & 0xFF;
        commandBuffer[12] = (adjustedRightWheelSpeed >> 8);
        commandBuffer[11] = adjustedRightWheelSpeed & 0xFF;
        // 체크섬 계산을 위해 마지막 바이트 제거
        commandBuffer = commandBuffer.slice(0, -1);
        // 체크섬 추가
        commandBuffer = Buffer.concat([commandBuffer, Buffer.from([calculateChecksum(commandBuffer)])]);
        // 명령어 전송
        uart3.write(commandBuffer);
    }
    else {
        // 'D55DFE'로 시작하지 않는 데이터는 그대로 전송
        uart3.write(data);
    }
}
// function movingCommandTest() {
//     const Speed = Buffer.from([0xD5, 0x5D, 0xFE, 0x0A, 0x83, 0x20, 0x02, 0x0A, 0x49, 0x80, 0x0B, 0x49, 0x00, 0xD4]);
//     uart3.write(Speed, function (err) {
//         if (err) {
//             return console.log('Error on write: ', err.message);
//         }
//         console.log('Speed Command Sent');
//     });
// }
// export async function checkWhell() {
//     setInterval(movingCommandTest, 500);
// }
