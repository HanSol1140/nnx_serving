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
exports.test = exports.checkRobotCoordinates = exports.detectCollision = exports.checkCrossRoad = exports.getDivideDirection = void 0;
const robotconfig_1 = require("../robotconfig");
// ────────────────────────────────────────────────────────────────────────────────────────────
// ===============================================================================================================
function normalizeAngle(angle) {
    while (angle <= -180)
        angle += 360;
    while (angle > 180)
        angle -= 360;
    return angle;
}
function getDivideDirection(robotTheta, obsX, obsY, robotX, robotY) {
    return __awaiter(this, void 0, void 0, function* () {
        // 좌표 기준으로 방향을 체크
        // let checkDirection = Math.atan2((장애물 y좌표 - 로봇의 y현재좌표), (장애물 x좌표 -로봇의 x현재좌표));
        // checkDirection = aaa * 180 / Math.PI ;
        // 현재 로봇이 바라보고 있는 방향 기준으로 체크
        // checkDirection 로봇의 현재 theta - checkDirection = 양수일경우 좌측, 음수일경우 우측에 장애물이 있다
        let checkDirection = Math.atan2(obsY - robotY, obsX - robotX);
        checkDirection = checkDirection * 180 / Math.PI;
        let deltaTheta = normalizeAngle(checkDirection - robotTheta);
        // 양수일 경우 좌측, 음수일 경우 우측에 장애물이 있다고 판단
        return deltaTheta > 0 ? "left" : "right";
    });
}
exports.getDivideDirection = getDivideDirection;
// ===============================================================================================================
// 교차로 체크
function checkCrossRoad(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        const robotX = robotconfig_1.robotCoordinate[robotName].x;
        const robotY = robotconfig_1.robotCoordinate[robotName].y;
        for (const pointName in robotconfig_1.crossPointCoordinates) {
            // console.log(crossPointCoordinates);
            // console.log(pointName);
            // console.log(crossPointCoordinates[pointName].x);
            // console.log(crossPointCoordinates[pointName].y);
            const pointX = robotconfig_1.crossPointCoordinates[pointName].x;
            const pointY = robotconfig_1.crossPointCoordinates[pointName].y;
            // const distance = Math.sqrt((pointX - robotX) ** 2 + (pointY - robotY) ** 2);
            // if (distance <= 1.0) {
            //     // console.log(robotName + " 교차로 입장 : ", pointName);
            //     setCrossRoadState(robotName, pointName);
            //     return true;
            // } else {
            //     // console.log("교차로가 아닙니다.");
            //     return false;
            // }
        }
    });
}
exports.checkCrossRoad = checkCrossRoad;
// ===============================================================================================================
// 충돌 위험 체크
function detectCollision(robotName) {
    return __awaiter(this, void 0, void 0, function* () {
        const robotTheta = robotconfig_1.robotCoordinate[robotName].theta; // 라디안 값
        const robotX = robotconfig_1.robotCoordinate[robotName].x;
        const robotY = robotconfig_1.robotCoordinate[robotName].y;
        for (const laserPoint of robotconfig_1.laserCoordinate[robotName]) {
            // console.log(laserPoint);
            const dx = laserPoint.x - robotX;
            const dy = laserPoint.y - robotY;
            const rotatedX = dx * Math.cos(-robotTheta) - dy * Math.sin(-robotTheta);
            const rotatedY = dx * Math.sin(-robotTheta) + dy * Math.cos(-robotTheta);
            // 충돌 검사 영역 설정
            const rectangleWidth = 2.0; // 감지영역 거리
            const rectangleHeight = 0.7; // 감지영역 폭
            // 충돌 위험 판단
            if (rotatedX >= 0 && rotatedX <= rectangleWidth && Math.abs(rotatedY) <= rectangleHeight / 2) {
                const direction = rotatedY > 0 ? "left" : "right";
                // console.log("충돌 위험:", robotName, laserPoint, direction);
                // console.log(laserPoint);
                // console.log(mappingData);
                // mappingData와의 거리 계산
                let isObstacle = true; // 먼저 장애물이라고 가정
                // 벽인지 아닌지 검사
                const xRange = 0.1; // laserPoint의 x 좌표를 기준으로 할 범위
                const indexNumber = binarySearchForRange(robotconfig_1.mappingData, laserPoint.x, xRange);
                for (let i = indexNumber[0]; i <= indexNumber[1]; i++) { // startIndex, endIndex
                    const mappingPoint = robotconfig_1.mappingData[i];
                    if (Math.abs(laserPoint.x - mappingPoint[0]) <= xRange) {
                        if (Math.abs(laserPoint.y - mappingPoint[1]) <= xRange) {
                            // 충돌 위험 판단 로직
                            // console.log(robotName + " 벽의 좌표 : ", laserPoint);
                            isObstacle = false;
                            break;
                        }
                    }
                }
                // 벽이 아닌 장애물의 좌표값 리턴
                if (isObstacle) {
                    // console.log(robotName + " 장애물의 좌표 : ", laserPoint);
                    return laserPoint;
                }
            }
        }
        // 장애물이 없으면 undefined를 반환(false)
        return;
    });
}
exports.detectCollision = detectCollision;
// ===============================================================================================================
// 충돌 위험 체크
// export async function detectCollision(robotName: string) {
//     const robotTheta = robotCoordinate[robotName].theta; // 라디안 값
//     const robotX = robotCoordinate[robotName].x;
//     const robotY = robotCoordinate[robotName].y;
//     for (const laserPoint of laserCoordinate[robotName]) {
//         // console.log(laserPoint);
//         const dx = laserPoint.x - robotX;
//         const dy = laserPoint.y - robotY;
//         const rotatedX = dx * Math.cos(-robotTheta) - dy * Math.sin(-robotTheta);
//         const rotatedY = dx * Math.sin(-robotTheta) + dy * Math.cos(-robotTheta);
//         // 충돌 검사 영역 설정
//         const rectangleWidth = 2.5; // 감지영역 거리
//         const rectangleHeight = 0.8; // 감지영역 폭
//         // 충돌 위험 판단
//         if (rotatedX >= 0 && rotatedX <= rectangleWidth && Math.abs(rotatedY) <= rectangleHeight / 2) {
//             const direction = rotatedY > 0 ? "left" : "right";
//             // console.log("충돌 위험:", robotName, laserPoint, direction);
//             // console.log(laserPoint);
//             // console.log(mappingData);
//             // mappingData와의 거리 계산
//             let isObstacle = true; // 먼저 장애물이라고 가정
//             // 벽인지 아닌지 검사
//             const xRange = 0.2; // laserPoint의 x 좌표를 기준으로 할 범위
//             const indexNumber = binarySearchForRange(mappingData, laserPoint.x, xRange);
//             for (let i = indexNumber[0]; i <= indexNumber[1]; i++) { // startIndex, endIndex
//                 const mappingPoint = mappingData[i];
//                 const distance = Math.sqrt(
//                     Math.pow(laserPoint.x - mappingPoint[0], 2) + Math.pow(laserPoint.y - mappingPoint[1], 2)
//                 );
//                 console.log(distance);
//                 // 충돌 위험 판단
//                 if (distance < 0.15) {
//                     isObstacle = false;
//                     break;
//                 }
//             }
//             // 벽이 아닌 장애물의 좌표값 리턴
//             if (isObstacle) {
//                 console.log(robotName + " 장애물의 좌표:", laserPoint);
//                 return laserPoint;
//             }
//         }
//     }
//     // 장애물이 없으면 undefined를 반환(false)
//     return;
// }
function binarySearchForRange(data, target, range) {
    let start = 0;
    let end = data.length - 1;
    let middle;
    let startIndex = -1;
    let endIndex = -1;
    // 시작 인덱스를 찾기
    while (start <= end) {
        middle = Math.floor((start + end) / 2);
        const currentX = data[middle][0];
        if (currentX >= target - range && currentX <= target + range) {
            // 범위 내에 들어왔으므로 다음으로 더 낮은 인덱스를 찾습니다.
            startIndex = middle;
            while (middle > 0 && data[middle - 1][0] >= target - range) {
                middle--;
            }
            startIndex = middle;
            break;
        }
        else if (currentX < target - range) {
            start = middle + 1;
        }
        else {
            end = middle - 1;
        }
    }
    // 시작 인덱스를 찾지 못했다면 범위 내에 데이터가 없는 것입니다.
    if (startIndex === -1) {
        return [-1, -1];
    }
    // 끝 인덱스를 찾습니다. 시작 인덱스부터 검색을 시작합니다.
    start = startIndex;
    end = data.length - 1;
    while (start <= end) {
        middle = Math.floor((start + end) / 2);
        const currentX = data[middle][0];
        if (currentX <= target + range) {
            // 범위 내에 들어왔으므로 이제 더 높은 인덱스를 찾습니다.
            endIndex = middle;
            while (middle < data.length - 1 && data[middle + 1][0] <= target + range) {
                middle++;
            }
            endIndex = middle;
            break;
        }
        else {
            end = middle - 1;
        }
    }
    return [startIndex, endIndex];
}
// const startIndex = binarySearchForStartIndex(mappingData, laserPoint.x - xRange);
// console.log(startIndex);
function binarySearchForStartIndex(data, target) {
    let start = 0;
    let end = data.length - 1;
    let result = -1;
    while (start <= end) {
        let middle = Math.floor((start + end) / 2);
        const currentX = data[middle][0];
        if (currentX >= target) {
            result = middle;
            end = middle - 1;
        }
        else {
            start = middle + 1;
        }
    }
    return result;
}
// const endIndex = binarySearchForEndIndex(mappingData, laserPoint.x + xRange);
// console.log(endIndex);
function binarySearchForEndIndex(data, target) {
    let start = 0;
    let end = data.length - 1;
    let result = -1;
    while (start <= end) {
        let middle = Math.floor((start + end) / 2);
        const currentX = data[middle][0];
        if (currentX <= target) {
            result = middle;
            start = middle + 1;
        }
        else {
            end = middle - 1;
        }
    }
    return result;
}
// ===============================================================================================================
// 인식한 장애물이 로봇인지 체크\
function checkRobotCoordinates(robotName, collision) {
    return __awaiter(this, void 0, void 0, function* () {
        for (var i in robotconfig_1.robotSettings) {
            if (i != robotconfig_1.currentRobotName) { // 비교군에서 자신을 제외
                // currentRobotNumber = robotSettings[robotName].robotNumber;
                // currentRobotCoordinatesX = robotCoordinate[robotName].x;
                // currentRobotCoordinatesY = robotCoordinate[robotName].y;
                const dx = collision.x - robotconfig_1.robotCoordinate[i].x;
                const dy = collision.y - robotconfig_1.robotCoordinate[i].y;
                // console.log(currentRobotName);
                // console.log(robotCoordinate);
                // console.log("비교할 로봇 : "+ i);
                // console.log(collision.x + " / " + robotCoordinate[i].x);
                // console.log(collision.y + " / " + robotCoordinate[i].y);
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 0.3) {
                    // console.log("로봇입니다.");
                    return true;
                }
                else {
                    // console.log("로봇이 아닙니다.");
                    return false;
                }
            }
        }
    });
}
exports.checkRobotCoordinates = checkRobotCoordinates;
// type crashType = {}
let robots = {};
let crashState = {};
// 받은 좌표를 이용하여 수동으로 접근한 로봇을 피함
let currentRobotIndex;
function test(robotName) {
    // getPose(robotName); // 좌표 받기
    const tolerance = 2.5;
    try {
        // 좌표값 비교
        for (let i = 1; i <= Object.keys(robots).length; i++) {
            if (i != currentRobotIndex) { // 비교군에서 자신을 제외
                const dx = robots[currentRobotIndex].x - robots[i].x;
                const dy = robots[currentRobotIndex].y - robots[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= tolerance) { // 충돌위험
                    // console.log(`${currentRobotIndex + 1}번 서빙봇과 ${i + 1}번 서빙봇 접근`);
                    const compareTheta = robots[i].theta;
                    // 충돌 가능성 비교
                    let angle = (compareTheta - robots[currentRobotIndex].theta + 360) % 360;
                    if (angle > 180) {
                        angle -= 360;
                    }
                    // 각도 차이 20도 이하일 때 충돌 위험 판단
                    // -160 ~ -180도 혹은 160 ~ 180도
                    if (angle >= -200 && angle <= -160 && crashState[robotName] == false) {
                        // 충돌 대비 동작
                        console.log(`${currentRobotIndex + 1}번 서빙봇과 ${i + 1}번 서빙봇 충돌 위험`);
                        crashState[robotName] = true;
                        // 수동 방향전환
                        // timerTurn(robotName, 2000); // 움직일 로봇, setinterval반복 시간
                        // 수동 직진
                        // timerMove(robotName, 2000, 2000); // 움직일 로봇, setTimeout 대기시간, setinterval반복 시간
                    }
                }
                else if (distance > tolerance + 1 && crashState[robotName]) { // 멀어지면 ㅇ
                    crashState[robotName] = false;
                    console.log("state : false");
                }
            }
        }
    }
    catch (error) {
        console.error('Error with API call:', error);
    }
}
exports.test = test;
// =======================================================================================================================
// =======================================================================================================================
