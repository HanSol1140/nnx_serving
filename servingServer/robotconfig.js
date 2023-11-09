"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMappingData = exports.mappingData = exports.setCrossRoadState = exports.crossRoadState = exports.setCrossPointCoordinates = exports.crossPointCoordinates = exports.setLaserCoordinate = exports.laserCoordinate = exports.setRobotCoordinate = exports.robotCoordinate = exports.setPointCoordinate = exports.pointCoordinate = exports.setRobotSettings = exports.robotSettings = exports.setCollision = exports.collision = exports.setCurrentRobotName = exports.currentRobotName = void 0;
// robotconfig.ts
exports.currentRobotName = "robot2";
function setCurrentRobotName(robotName) {
    exports.currentRobotName = robotName;
}
exports.setCurrentRobotName = setCurrentRobotName;
// 충돌 체크
exports.collision = false;
function setCollision(boolean) {
    exports.collision = boolean;
}
exports.setCollision = setCollision;
exports.robotSettings = {};
function setRobotSettings(name, robotNumber, robotIP, robotRunningState, robotLastOrderPoint) {
    exports.robotSettings[name] = { robotNumber, robotIP, robotRunningState, robotLastOrderPoint };
}
exports.setRobotSettings = setRobotSettings;
// pointCoordinate
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
exports.crossPointCoordinates = {};
function setCrossPointCoordinates(crossName, x, y) {
    exports.crossPointCoordinates[crossName] = { x, y };
}
exports.setCrossPointCoordinates = setCrossPointCoordinates;
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
