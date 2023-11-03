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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 8084;
const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});
const IP = "192.168.0.15";
const filePath = 'MappingData.json';
function getLaserMapping(robotIP) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`http://${robotIP}/reeman/laser`);
            if (response.status === 200) {
                // const coordinates: number[][] = response.data.coordinates;
                saveUniqueData(response.data.coordinates);
            }
        }
        catch (error) {
            console.error('Error with API call:', error);
        }
    });
}
function saveUniqueData(newData) {
    const existingData = fs_1.default.existsSync(filePath) ? JSON.parse(fs_1.default.readFileSync(filePath, 'utf8')) : [];
    const roundedNewData = newData.map(coord => coord.map(val => Math.round(val * 100) / 100));
    const uniqueData = roundedNewData.filter(newCoord => !existingData.some(existingCoord => (Math.abs(existingCoord[0] - newCoord[0]) <= 0.05 && Math.abs(existingCoord[1] - newCoord[1]) <= 0.05)));
    const updatedData = [...existingData, ...uniqueData];
    const sortedData = updatedData.sort((a, b) => a[0] - b[0]);
    fs_1.default.writeFileSync(filePath, JSON.stringify(sortedData, null, 2));
    console.log(sortedData);
}
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    yield getLaserMapping(IP);
}), 100); // 1초마다 실행
