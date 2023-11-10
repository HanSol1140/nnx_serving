// server2.ts
import express from 'express';
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors()); // 모든 도메인에서의 요청 허용
const PORT = process.env.PORT || 8085;
import {
    collision,
    setCollision,
} from './robotconfig';
let bool =
process.on('message', (message: any) => {
    if (message.booleanValue == true && collision != true) {
        setCollision(message.booleanValue);
        setTimeout(()=> {
            setCollision(false);
        }, 2500)
    }
    // else{
    //     setCollision(false);
    // }
});
// 서버 시작
const server = app.listen(PORT, () => {
    console.log(`Server listening on HTTP port ${PORT}`);
});

import { wheelControll } from './Services/robotWheelControll';

wheelControll();

