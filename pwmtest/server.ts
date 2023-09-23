import express from 'express';
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8084;

const server = app.listen(PORT, () => {
    console.log("서버시작 포트 : " + PORT);
})

