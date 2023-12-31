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
const existingCoord:any = '';
function saveUniqueData(newData: number[][]): void {
    const existingData: number[][] = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
    const roundedNewData = newData.map(coord => coord.map(val => Math.round(val * 100) / 100) as [number, number]); 
    const uniqueData = roundedNewData.filter(newCoord => 
        !existingData.some((coord:any) => 
            (Math.abs(coord[0] - newCoord[0]) <= 0.05 && Math.abs(coord[1] - newCoord[1]) <= 0.05)
        )
    );
    
    const updatedData = [...existingData, ...uniqueData];
    const sortedData = updatedData.sort((a, b) => a[0] - b[0]);
    fs.writeFileSync(filePath, JSON.stringify(sortedData, null, 2));
}



setInterval(async () => {
    await getLaserMapping(IP);
}, 50); // 1초마다 실행

