"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const { PythonShell } = require('python-shell');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 8083;
const server = app.listen(PORT, () => {
    console.log("서버시작 PORT : " + PORT);
});
const pyShell = new PythonShell('./output.py');
