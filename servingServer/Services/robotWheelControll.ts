import {SerialPort, ReadlineParser} from 'serialport';


export async function wheelControll() {
    const uart2 = new SerialPort({ path:'/dev/ttyAMA2', baudRate: 115200 });
    let parser2 = new ReadlineParser();
    const uart3 = new SerialPort({ path:'/dev/ttyAMA3', baudRate: 115200 });
    let parser3 = new ReadlineParser();
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
    uart2.on('error', function(err:any) {
    console.log('Error on UART2: ', err.message);
    });
    uart3.on('error', function(err:any) {
        console.log('Error on UART3: ', err.message);
    });
}

const uart2 = new SerialPort({ path:'/dev/ttyAMA2', baudRate: 115200 });
let parser2 = new ReadlineParser();
const uart3 = new SerialPort({ path:'/dev/ttyAMA3', baudRate: 115200 });
let parser3 = new ReadlineParser();
uart2.pipe(parser2);
uart3.pipe(parser3);


  
export async function wheelControll2() {
// UART2와 UART3 설정
    uart2.on('readable', () => { 
    const data = uart2.read();
    if (data) {
        let hexData1 = data.toString('hex').toUpperCase();
        console.log(hexData1);
        adjustSpeedAndSend(data)
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
    uart2.on('error', function(err:any) {
    console.log('Error on UART2: ', err.message);
    });
    uart3.on('error', function(err:any) {
        console.log('Error on UART3: ', err.message);
    });
}

// ===================================================================================================================
function calculateChecksum(commandWithoutChecksum) {
    // 체크섬을 계산하기 위해 바이트 데이터의 합을 계산
    let sum = 0;
    for (let i = 0; i < commandWithoutChecksum.length; i += 2) {
      sum += parseInt(commandWithoutChecksum.substring(i, i + 2), 16);
    }
  
    // 체크섬은 합계를 256으로 나눈 나머지
    return (sum % 256).toString(16).padStart(2, '0').toUpperCase();
  }
  
// 체크섬 계산 함수는 앞서 작성된 코드 그대로 유지

function adjustSpeedAndSend(data) {
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
        leftWheelSpeed = Math.floor(leftWheelSpeed * 0.5); // 왼쪽 바퀴 속도 조정
        let rightWheelSpeed = Math.floor(leftWheelSpeed * 0.25); // 오른쪽 바퀴 속도 조정
  
        // 조정된 속도를 16진수 문자열로 다시 변환
        let adjustedLeftWheelSpeedHex = ((leftWheelSpeed >> 8) + 0x80).toString(16).padStart(2, '0').toUpperCase();
        let adjustedLeftWheelExtraHex = (leftWheelSpeed & 0xFF).toString(16).padStart(2, '0').toUpperCase();
        let adjustedRightWheelSpeedHex = ((rightWheelSpeed >> 8) + 0x80).toString(16).padStart(2, '0').toUpperCase();
        let adjustedRightWheelExtraHex = (rightWheelSpeed & 0xFF).toString(16).padStart(2, '0').toUpperCase();
  
        // 새로운 명령어 생성 (체크섬 전)
        let newCommandWithoutChecksum = `D55DFE0A8320020A${adjustedLeftWheelSpeedHex}${adjustedLeftWheelExtraHex}0B${adjustedRightWheelSpeedHex}${adjustedRightWheelExtraHex}`;
        
        // 체크섬 계산 및 추가
        const checksumHex = calculateChecksum(newCommandWithoutChecksum);
        const newCommand = newCommandWithoutChecksum + checksumHex;
  
        // 새로운 명령어를 바이트 배열로 변환하여 uart3으로 전송
        const commandBuffer = Buffer.from(newCommand, 'hex');
        console.log(commandBuffer.toString('hex').toUpperCase());
        uart3.write(commandBuffer);
      }
    } else {
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
export async function checkWhell(){
    setInterval(sendSpeedCommand, 500);
}