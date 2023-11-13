import express from 'express';
import cors from 'cors';
const { PythonShell } = require('python-shell');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8083;
const server = app.listen(PORT, () => {
    console.log("서버시작 PORT : " + PORT);
});


const pyShell = new PythonShell('./output.py'); 