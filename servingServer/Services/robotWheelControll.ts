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
const Speed = Buffer.from([0xD5, 0x5D, 0xFE, 0x0A, 0x83, 0x20, 0x02, 0x0A, 0x49, 0x80, 0x0B, 0x49, 0x00, 0xD4]);
function sendSpeedCommand() {
    
    uart3.write(Speed, function (err) {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('Speed Command Sent');
    });
}
  
export async function wheelControll2() {
// UART2와 UART3 설정
setInterval(sendSpeedCommand, 500);

    
    // uart2.on('readable', () => { 
    // const data = uart2.read();
    // if (data) {
        // adjustSpeedAndSend(data)
    // }
    // }); 
    
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
function adjustSpeedAndSend(data:any) {
    const hexData = data.toString('hex').toUpperCase();

    if (hexData.startsWith('D55DFE')) {
        // 속도 데이터 추출
        const speedPattern = /(?:0A)([0-9A-F]{2})([0-9A-F]{2})(?:0B)([0-9A-F]{2})([0-9A-F]{2})/;
        const match = speedPattern.exec(hexData);
        
        if (match) {
            // 16진수를 10진수로 변환
            let leftWheelSpeed = parseInt(match[1], 16);
            let leftWheelExtra = parseInt(match[2], 16);
            
            // 속도 조정
            leftWheelSpeed = Math.floor(leftWheelSpeed * 0.5);
            leftWheelExtra = Math.floor(leftWheelExtra * 0.5);

            // B 바퀴의 속도도 A 바퀴의 0.25배로 조정
            let rightWheelSpeed = Math.floor(leftWheelSpeed * 0.25);
            let rightWheelExtra = Math.floor(leftWheelExtra * 0.25);

            // 조정된 속도를 16진수 문자열로 다시 변환
            const adjustedLeftWheelSpeedHex = leftWheelSpeed.toString(16).padStart(2, '0').toUpperCase();
            const adjustedLeftWheelExtraHex = leftWheelExtra.toString(16).padStart(2, '0').toUpperCase();
            const adjustedRightWheelSpeedHex = rightWheelSpeed.toString(16).padStart(2, '0').toUpperCase();
            const adjustedRightWheelExtraHex = rightWheelExtra.toString(16).padStart(2, '0').toUpperCase();
            
            // 체크섬 업데이트는 필요한 경우 여기에서 수행해야 합니다.

            // 새로운 명령어 생성
            const newCommand = `D55DFE0A83${adjustedLeftWheelSpeedHex}${adjustedLeftWheelExtraHex}0BDC${adjustedRightWheelSpeedHex}${adjustedRightWheelExtraHex}C2`;
            
            // 새로운 명령어를 바이트 배열로 변환하여 uart3으로 전송
            const commandBuffer = Buffer.from(newCommand, 'hex');
            uart3.write(commandBuffer);
        }
    } else {
        // 'D55DFE'로 시작하지 않는 데이터는 그대로 전송
        uart3.write(data);
    }
}

  
  