const express = require('express')
const cors = require('cors')
const { SerialPort, ReadlineParser } = require('serialport')

// const SerialPort = require('serialport');
// import { SerialPort } from 'serialport'
// const ReadlineParser = require('@serialport/parser-readline');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3011;

const serialPort = new SerialPort({
    path: '/dev/ttyS0',
    baudRate: 9600
});

const serialport = new SerialPort({ path: '/dev/ttyS0', baudRate: 9600 })
serialport.write('ROBOT POWER ON')

const parser = serialPort.pipe(new ReadlineParser());

parser.on('data', (data) => {
    console.log(`Received from Arduino: ${data}`); 
    // 웹 브라우저나 다른 클라이언트에 실시간으로 데이터를 전송하려면 여기에 코드를 추가하세요 (예: WebSocket 사용)
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
