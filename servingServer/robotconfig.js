"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMappingData = exports.mappingData = exports.setCrossRoadState = exports.crossRoadState = exports.setCrossRoadCoordinates = exports.crossRoadCoordinates = exports.setLaserCoordinate = exports.laserCoordinate = exports.setRobotCoordinate = exports.robotCoordinate = exports.setPointCoordinate = exports.pointCoordinate = exports.setRobotSettings = exports.robotSettings = exports.setCurrentRobotName = exports.currentRobotName = void 0;
// robotconfig.ts
// 현재 라즈베리파이와 연결된 로봇명을 기입
exports.currentRobotName = "robot2";
function setCurrentRobotName(robotName) {
    exports.currentRobotName = robotName;
}
exports.setCurrentRobotName = setCurrentRobotName;
exports.robotSettings = {};
function setRobotSettings(name, robotNumber, robotIP, robotRunningState, robotLastOrderPoint) {
    exports.robotSettings[name] = { robotNumber, robotIP, robotRunningState, robotLastOrderPoint };
}
exports.setRobotSettings = setRobotSettings;
exports.pointCoordinate = {};
function setPointCoordinate(pointName, x, y, theta) {
    exports.pointCoordinate[pointName] = { x, y, theta };
}
exports.setPointCoordinate = setPointCoordinate;
// robotIP
exports.robotCoordinate = {};
function setRobotCoordinate(robotName, x, y, theta) {
    exports.robotCoordinate[robotName] = { x, y, theta };
}
exports.setRobotCoordinate = setRobotCoordinate;
// laserCoordinate
exports.laserCoordinate = {};
function setLaserCoordinate(robotName, centerPortion) {
    exports.laserCoordinate[robotName] = centerPortion;
}
exports.setLaserCoordinate = setLaserCoordinate;
// crossRoad(교차로) 변수에 등록
exports.crossRoadCoordinates = {};
function setCrossRoadCoordinates(crossName, x, y) {
    exports.crossRoadCoordinates[crossName] = { x, y };
}
exports.setCrossRoadCoordinates = setCrossRoadCoordinates;
// 교차로 안에 들어온 로봇체크
exports.crossRoadState = {};
function setCrossRoadState(roadName, robotName) {
    exports.crossRoadState[roadName] = robotName;
}
exports.setCrossRoadState = setCrossRoadState;
// 맵핑 데이터 변수할당
exports.mappingData = [];
function setMappingData(newData) {
    exports.mappingData = newData;
}
exports.setMappingData = setMappingData;
