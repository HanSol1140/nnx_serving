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
