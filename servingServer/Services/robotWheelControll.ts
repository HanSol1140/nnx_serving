import { SerialPort, ReadlineParser } from 'serialport';
import {
    collision
} from '../robotconfig';
// ============================================
let collisionStartTime = 0;
let collisionDetected = false;

function checkForCollision() {
    if (collision) {
        if (!collisionDetected) {
            collisionStartTime = Date.now();
            collisionDetected = true;
        }
    } else {
        collisionStartTime = 0;
        collisionDetected = false;
    }
}
async function checkHex(String1:string) {
    if (hexString.length > 18) {
        if (hexString == "D55DFE0A8320020A00000B0000C2") {
            console.log(true);
            isStopped = true;
        } else {
            console.log(false);
            isStopped = false;
        }
    }

}
// ============================================
//
// UART2와 UART3 설정
const uart2 = new SerialPort({ path: '/dev/ttyAMA2', baudRate: 115200 });
let parser2 = new ReadlineParser();
const uart3 = new SerialPort({ path: '/dev/ttyAMA3', baudRate: 115200 });
let parser3 = new ReadlineParser();
uart2.pipe(parser2);
uart3.pipe(parser3);

let isStopped = false;

export async function wheelControll() {
    uart2.removeAllListeners('readable');
    uart3.removeAllListeners('readable');
    uart2.removeAllListeners('error');
    uart3.removeAllListeners('error');

    uart2.on('readable', () => {
        const data = uart2.read();
        if (data) {
            const hexString = data.toString('hex').toUpperCase(); // 16진수 데이터를 문자열로 변환
            console.log(hexString.length);
            

            // console.log("uart2 : " + hexString); 
            if (!isStopped) {
                if (collision) {
                    console.log("장애물");
                    // adjustSpeedAndSend(data);
                    checkForCollision();
                    const timeElapsed = Date.now() - collisionStartTime;
                    if (timeElapsed < 1000) { // 1초가 지나지 않았으면 adjustSpeedAndSend1을 호출
                        // console.log("1");
                        // adjustSpeedAndSend1(data);
                        movingCommandTest(0x99, 0x81, 0x10, 0x01);
                        readCommandTest();
                    } else {

                        movingCommandTest(0x99, 0x81, 0x99, 0x01);
                        readCommandTest();

                    }
                } else {
                    // collision이 false일 때 정상 운행
                    console.log("정상운행");
                    // const hexString = data.toString('hex').toUpperCase(); // 16진수 데이터를 문자열로 변환
                    // console.log("uart2 : " + hexString); 
                    checkForCollision();
                    uart3.write(data);
                }
            }
        }
    });


    // UART3
    
    uart3.on('readable', () => {
        const data = uart3.read();
        if (data) {
            // const hexString = data.toString('hex').toUpperCase(); // 16진수 데이터를 문자열로 변환
            // console.log("uart3 : " + hexString); 
            uart2.write(data);
        }
    });

    // 에러 핸들링
    uart2.on('error', function (err: any) {
        // console.log('Error on UART2: ', err.message);
    });
    uart3.on('error', function (err: any) {
        // console.log('Error on UART3: ', err.message);
    });

    // 에러가 나오면 한번만 출력하고 그 이후 에러는 무시
    // uart2.once('error', function (err) {
    //     console.log('Error on UART2: ', err.message);
    // });

    // uart3.once('error', function (err) {
    //     console.log('Error on UART3: ', err.message);
    // });
}




function calculateChecksum(buffer: Buffer) {
    // 체크섬 계산 시 프레임 헤더는 제외
    const checksumBuffer = buffer.slice(2);
    const sum = checksumBuffer.reduce((a, b) => a + b, 0);
    const checksum = sum % 256;
    return checksum;
}

function adjustSpeedAndSend1(data: any) {
    // 입력된 데이터를 Buffer 객체로 변환
    let commandBuffer = Buffer.from(data, 'hex');

    if (commandBuffer.slice(0, 3).toString('hex').toUpperCase() === 'D55DFE' && commandBuffer[9] != 0x00) {
        // 속도 데이터 추출 및 조정
        const leftWheelSpeed = (commandBuffer[9] - 0x80) * 256 + commandBuffer[8];
        // 오른쪽 바퀴 속도를 왼쪽 바퀴 속도에 기반하여 계산
        const rightWheelSpeed = (commandBuffer[12]) * 256 + commandBuffer[11];

        // 속도 조정 (예시: 왼쪽 바퀴 50%, 오른쪽 바퀴 100%로 조정)
        let adjustedRightWheelSpeed = Math.floor(leftWheelSpeed * 1);
        let adjustedLeftWheelSpeed = Math.floor(leftWheelSpeed * 0.75);

        // 조정된 속도값으로 Buffer 업데이트
        commandBuffer[9] = (adjustedRightWheelSpeed >> 8) + 0x80;
        commandBuffer[8] = adjustedRightWheelSpeed & 0xFF;
        commandBuffer[12] = (adjustedLeftWheelSpeed >> 8);
        commandBuffer[11] = adjustedLeftWheelSpeed & 0xFF;

        // 체크섬 계산을 위해 마지막 바이트 제거
        commandBuffer = commandBuffer.slice(0, -1);

        // 체크섬 추가
        commandBuffer = Buffer.concat([commandBuffer, Buffer.from([calculateChecksum(commandBuffer)])]);

        // 명령어 전송
        uart3.write(commandBuffer);

    } else {
        // 'D55DFE'로 시작하지 않는 데이터는 그대로 전송
        uart3.write(data);
    }
}

function adjustSpeedAndSend2(data: any) {
    // 입력된 데이터를 Buffer 객체로 변환
    let commandBuffer = Buffer.from(data, 'hex');

    if (commandBuffer.slice(0, 3).toString('hex').toUpperCase() === 'D55DFE' && commandBuffer[9] != 0x00) {
        // 속도 데이터 추출 및 조정
        const leftWheelSpeed = (commandBuffer[9] - 0x80) * 256 + commandBuffer[8];
        // 오른쪽 바퀴 속도를 왼쪽 바퀴 속도에 기반하여 계산
        const rightWheelSpeed = (commandBuffer[12]) * 256 + commandBuffer[11];

        // 속도 조정 (예시: 왼쪽 바퀴 100%, 오른쪽 바퀴 100%로 조정) => 직진
        let adjustedRightWheelSpeed = Math.floor(leftWheelSpeed * 1);
        let adjustedLeftWheelSpeed = Math.floor(leftWheelSpeed * 1);

        // 조정된 속도값으로 Buffer 업데이트
        commandBuffer[9] = (adjustedRightWheelSpeed >> 8) + 0x80;
        commandBuffer[8] = adjustedRightWheelSpeed & 0xFF;
        commandBuffer[12] = (adjustedLeftWheelSpeed >> 8);
        commandBuffer[11] = adjustedLeftWheelSpeed & 0xFF;

        // 체크섬 계산을 위해 마지막 바이트 제거
        commandBuffer = commandBuffer.slice(0, -1);

        // 체크섬 추가
        commandBuffer = Buffer.concat([commandBuffer, Buffer.from([calculateChecksum(commandBuffer)])]);

        // 명령어 전송
        uart3.write(commandBuffer);

    } else {
        // 'D55DFE'로 시작하지 않는 데이터는 그대로 전송
        uart3.write(data);
    }
}

function movingCommandTest(leftSpeedHigh: any, leftSpeedLow: any, rightSpeedHigh: any, rightSpeedLow: any) {
    // 명령어의 기본 구조 설정
    let command = Buffer.from([0xD5, 0x5D, 0xFE, 0x0A, 0x83, 0x20, 0x02, 0x0A, leftSpeedHigh, leftSpeedLow, 0x0B, rightSpeedHigh, rightSpeedLow, 0x00]);

    // 체크섬 계산 (마지막 바이트는 체크섬으로 설정될 예정이므로 제외)
    const checksum = calculateChecksum(command.slice(0, -1));

    // 체크섬 값 설정
    command[13] = checksum;

    // 명령어 전송
    uart3.write(command);
    // uart3.write(command, function (err) {
    //     if (err) {
    //         return console.log('Error on write: ', err.message);
    //     }
    //     console.log('Command Sent:', command.toString('hex').toUpperCase());
    // });
}
function readCommandTest() {
    let command1 = Buffer.from([0xD5, 0x5D, 0x0A, 0x04, 0x02, 0x28, 0x02, 0x3A]);
    let command2 = Buffer.from([0xD5, 0x5D, 0x0B, 0x04, 0x02, 0x28, 0x02, 0x3B]);
    uart3.write(command1);
    uart3.write(command2);

}
// export async function checkWhell() {
//     setInterval(movingCommandTest, 500);
// }