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
        // let hexData1 = data.toString('hex').toUpperCase();
        // hexData1 = hexData1.match(/.{1,2}/g)
        // let byteArray = hexData.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
        // console.log(`Received from UART2: ${hexData1}`);
        uart3.write(data); 
    }
    }); 
    
    uart3.on('readable', () => {
    const data = uart3.read();
    if (data) {
        // let hexData2 = data.toString('hex').toUpperCase();
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