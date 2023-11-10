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
// ============================================
//
// UART2와 UART3 설정
const uart2 = new SerialPort({ path: '/dev/ttyAMA2', baudRate: 115200 });
let parser2 = new ReadlineParser();
const uart3 = new SerialPort({ path: '/dev/ttyAMA3', baudRate: 115200 });
let parser3 = new ReadlineParser();
uart2.pipe(parser2);
uart3.pipe(parser3);

export async function wheelControll() {
    uart2.removeAllListeners('readable');
    uart3.removeAllListeners('readable');
    uart2.removeAllListeners('error');
    uart3.removeAllListeners('error');

    uart2.on('readable', () => {
        const data = uart2.read();
        if (data) {
            if (collision) {
                // adjustSpeedAndSend(data);
                checkForCollision();
                const timeElapsed = Date.now() - collisionStartTime;
                if (timeElapsed < 1000) { // 1초가 지나지 않았으면 adjustSpeedAndSend1을 호출
                    // console.log("1");
                    adjustSpeedAndSend1(data);
                } else { // 1초가 지났으면 adjustSpeedAndSend2를 호출
                    movingCommandTest();

                    setTimeout(()=>{
                        movingCommandTest();
                    }, 500);

                    setTimeout(()=>{
                        movingCommandTest();
                    }, 1000);

                    setTimeout(()=>{
                        movingCommandTest();                        
                    }, 1500);

                    setTimeout(()=>{
                        movingCommandTest();
                    }, 2000);
                }
            } else {
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

function movingCommandTest() {
    const Speed = Buffer.from([0xD5, 0x5D, 0xFE, 0x0A, 0x83, 0x20, 0x02, 0x0A, 0x99, 0x81, 0x0B, 0x99, 0x01, 0x76]);
    uart3.write(Speed, function (err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('Speed Command Sent');
    });
}
// export async function checkWhell() {
//     setInterval(movingCommandTest, 500);
// }