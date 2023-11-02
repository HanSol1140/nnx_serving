"use strict";
// robotconfig.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMappingData = exports.mappingData = exports.setCrossRoadState = exports.crossRoadState = exports.setLaserCoordinate = exports.laserCoordinate = exports.setRobotCoordinate = exports.robotCoordinate = exports.setPointCoordinate = exports.pointCoordinate = exports.setRobotSettings = exports.robotSettings = void 0;
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
// 교차로 관리
exports.crossRoadState = {};
function setCrossRoadState(roadName, robotName) {
    exports.crossRoadState[roadName] = { robotName };
}
exports.setCrossRoadState = setCrossRoadState;
// 맵핑 데이터 변수할당
exports.mappingData = [];
function setMappingData(newData) {
    exports.mappingData = newData;
}
exports.setMappingData = setMappingData;
