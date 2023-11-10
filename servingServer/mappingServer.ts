import express from 'express';
import axios from 'axios';
import fs from 'fs';

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 8083;

const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});

const IP = "192.168.0.15";
const filePath = 'Settings/MappingData.json';

async function getLaserMapping(robotIP: string) {
    try {
        const response = await axios.get(`http://${robotIP}/reeman/laser`);
        if (response.status === 200) {
            // const coordinates: number[][] = response.data.coordinates;
            saveUniqueData(response.data.coordinates);
        }
    } catch (error) { 
        console.error('Error with API call:', error);
    }
}

function saveUniqueData(newData: number[][]): void {
    const existingData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
    const roundedNewData = newData.map(coord => coord.map(val => Math.round(val * 100) / 100) as [number, number]); 
    const uniqueData = roundedNewData.filter(newCoord => 
        !existingData.some(existingCoord => 
            (Math.abs(existingCoord[0] - newCoord[0]) <= 0.05 && Math.abs(existingCoord[1] - newCoord[1]) <= 0.05)
        )
    );
    
    const updatedData = [...existingData, ...uniqueData];
    const sortedData = updatedData.sort((a, b) => a[0] - b[0]);
    fs.writeFileSync(filePath, JSON.stringify(sortedData, null, 2));
    console.log(sortedData);
}



setInterval(async () => {
    await getLaserMapping(IP);
}, 50); // 1초마다 실행


import { SerialPort, ReadlineParser } from 'serialport';

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
        const data = uart3.read();
        if (data) {
            uart3.write(data);
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
        console.log('Error on UART2: ', err.message);
    });
    uart3.on('error', function (err: any) {
        console.log('Error on UART3: ', err.message);
    });
}