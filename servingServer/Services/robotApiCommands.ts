import axios from 'axios';

import {
    currentRobotName,
    robotSettings,
    pointCoordinate,
    setRobotCoordinate,
    setLaserCoordinate,
} from '../robotconfig';


// 좌표 받기
export async function getPose(robotName: string) {
    try {
        // 좌표 받기
        const response = await axios.get(`http://${robotSettings[robotName].robotIP}/reeman/pose`);
        if (response.status === 200) {
            // console.log(response.data); // theta 는 radian이라서 변환이 필요함
            // const currentRobotIndex = (robotSettings[robotName].robotNumber);
            setRobotCoordinate(robotName, response.data.x, response.data.y, response.data.theta);
        }
    } catch (error) {
        console.error('Error with API call:', error);
    }
}



// 이동 취소
export async function cancle(robotName: string) {
    try {
        const response = await axios.post(`http://${robotSettings[robotName].robotIP}/cmd/cancel_goal`);
        if (await response.status === 200) {
            // console.log(response.data);
            console.log("Cancle");
        }

    } catch (error) {
        console.error('Error with API call:', error);
    }
}

// 포인트명으로 이동 => 이름 받기
// export async function movePoint(robotName: string, point: string) {
//     try {
//         const response = await axios.post(`http://${robotSettings[robotName].robotIP}/cmd/nav_point`, {
//             point: `${point}`
//         });
//         if (response.status === 200) {
//             // 성공
//             console.log(response.data);
//             setTimeout(() => {
//                 robotSettings[robotName].robotRunningState = true; // 로봇이 출발
//                 console.log("state : " + robotSettings[robotName].robotRunningState);
//             }, 1000);
//             // robotSettings[robotName].robotLastOrderPoint에 방금 이동한 point를 저장
//             // => 장애물 회피 후 다시 목적지로 보내기 위함
//             robotSettings[robotName].robotLastOrderPoint = pointCoordinate[point];
//             // console.log(robotSettings[robotName].robotLastOrderPoint);
//         }
//         // 이동한 포인트 저장 => 로봇별로 저장해야함
//     } catch (error) {
//         console.error('Error with API call:', error);
//     }
// }

// 포인트명으로 이동 => 이름 안받기
export async function movePoint(point: string) {
    try {
        const response = await axios.post(`http://${robotSettings[currentRobotName].robotIP}/cmd/nav_point`, {
            point: `${point}`
        });
        if (response.status === 200) {
            // 성공
            console.log(response.data);
            setTimeout(() => {
                robotSettings[currentRobotName].robotRunningState = true; // 로봇이 출발
                console.log("state : " + robotSettings[currentRobotName].robotRunningState);
            }, 1000);
            // robotSettings[robotName].robotLastOrderPoint에 방금 이동한 point를 저장
            // => 장애물 회피 후 다시 목적지로 보내기 위함
            robotSettings[currentRobotName].robotLastOrderPoint = pointCoordinate[point];
            // console.log(robotSettings[robotName].robotLastOrderPoint);
        }
        // 이동한 포인트 저장 => 로봇별로 저장해야함
    } catch (error) {
        console.error('Error with API call:', error);
    }
}
// 좌표로 이동
export async function moveCoordinates(robotName: string, xstring?: string, ystring?: string, thetastring?: string) {
    var x: number = Number(xstring);
    var y: number = Number(ystring);
    var theta: number = Number(thetastring);
    try {
        const response = await axios.post(`http://${robotSettings[robotName].robotIP}/cmd/nav`, {
            x,
            y,
            theta
        });
        if (response.status === 200) {
            console.log(response.data);
        }
    } catch (error) {
        console.error('Error with API call:', error);
    }
}


// 포인트 재이동
export async function retryMovePoint(robotName: string) {
    // 로봇 회피 후 다시 목적지로 이동할때 사용
    // getPose를 통해 얻은 좌표에서 로봇끼리 일정거리 이하로 접근햇을때
    // 수동 이동(회전, 직진/후진을 직접적으로 명령할 수 있음)후 목적지로 이동지시를 다시하기 위함
    // 회피 동작 후 회피 동작을 수행한 로봇이 실행
    console.log("재이동 요청");
    console.log(robotName + "로봇 재이동"); // 서빙봇 명칭
    // console.log(robotSettings[robotName].robotLastOrderPoint); // 포인트에 저장된 값 확인
    moveCoordinates(robotName, robotSettings[robotName].robotLastOrderPoint.x, robotSettings[robotName].robotLastOrderPoint.y, robotSettings[robotName].robotLastOrderPoint.theta);
}



// 로봇 이동 경로 표시
// ※ 주의 사항
// 이동 명령을 받고 2, 3초 이내로 API를 보내지않으면 경로를 안보내주고 에러메세지를 반환함
// 즉, 실시간으로 경로를 받으면서 현재위치를 유추할 수 없음 
export async function movePlan(robotName: string) {
    try {
        const response = await axios.get(`http://${robotSettings[robotName].robotIP}/reeman/global_plan`);
        if (response.status === 200) {

            // 도착지점
            // console.log(response.data.coordinates[response.data.coordinates.length - 1]);
            
            // 경로 표시
            console.log(response.data.coordinates);
 
        }

    } catch (error) {
        console.error('Error with API call:', error);
    }
}
// ===============================================================================================================
// 배터리 충전
export async function charge(robotName: string, point: string) {
    try {
        const response = await axios.post(`http://${robotSettings[robotName].robotIP}/cmd/charge`, {
            type: 1, // 지정된 위치로 이동 후 가까운 충전 포인트를 찾아서 접속함
            point: `${point}`
        });
        if (await response.status === 200) {
            console.log(response.data);
        }

    } catch (error) {
        console.error('Error with API call:', error);
    }
}

// 배터리 체크, 이게 일정 이하가 된다면 charge실행
export async function checkBattery(robotName: string) {  // 로봇이름
    try {
        const response = await axios.get(`http://${robotSettings[robotName].robotIP}/reeman/base_encode`,);
        if (await response.status === 200) {
            console.log(response.data);
            // console.log(response.data.battery);
            // return response.data.battery
        }

    } catch (error) {
        console.error('Error with API call:', error);
    }
}
//속도 변경
//기본적인 작동테스트만함, 추가코딩필요
export async function changeSpeed(robotName: string, speed: number) {
    console.log("!!!!");
    try {
        const response = await axios.post(`http://${robotSettings[robotName].robotIP}/cmd/nav_max_vel_x_config`, {
            max_vel: speed
        });
        if (response.status === 200) {
            console.log(response.data);
        }

    } catch (error) {
        console.error('Error', error);
    }
}
// 속도 턴속도 측정이라는데 변하질않음
export async function getIMUstatus() {
    try {
        const response = await axios.get(`http://192.168.0.177/reeman/imu`);
        if (response.status === 200) {
            console.log(response.data);
        }

    } catch (error) {
        console.error('Error with API call:', error);
    }
}

// 현재 속도 측정 => 가만히 있을땐 error출력, 움직일때만 작동하는 API
export async function getSpeed(robotName: string) {
    try {
        const response = await axios.get(`http://${robotSettings[robotName].robotIP}/reeman/speed`);
        if (response.status === 200) {
            console.log(response.data);
            // console.log("!!");
        }

    } catch (error) {
        console.log("속도측정 에러");
        // console.error('Error with API call:', error);
    }
}
// 레이저 데이터 수집
export async function getLaser(robotName: string) {
    try {
        const response = await axios.get(`http://${robotSettings[robotName].robotIP}/reeman/laser`);
        if (response.status === 200) {
            // response.data
            const coordinates = response.data.coordinates;
            
            const laserPosition = coordinates.map((item: [number, number]) => ({ x: item[0], y: item[1] }));
            setLaserCoordinate(robotName, laserPosition);
        }
    } catch (error) {
        console.error('Error with API call:', error);
    }
}
// const length = coordinates.length;
// const middle = Math.floor(length / 2);
// const range = Math.floor(length / 3) / 2;
// const startIndex = middle - range;
// const endIndex = middle + range;
// const rawCenterPortion = coordinates.slice(startIndex, endIndex);
// // centerPortion의 각 항목을 LaserDataType (형태로 변환
// const robotNumber = robotSettings[robotName].robotNumber;
// setLaserCoordinate(robotNumber, centerPortion);

// 레이저 데이터 수집을 통해 방향체크
// =============================================================================================================

export async function movePointList(robotName: string) {
    let ip: string = robotSettings[robotName].robotIP;
    try {
        const response = await axios.post(`http://${ip}/cmd/nav_list`, [
            { "test1": ["-0.56", "-1.78", "-131.35"] },
            { "test2": ["-1.15", "-2.33", "36.43"] }
        ]);
    } catch (error) {
        console.error('Error with API call:', error);
    }
}
// 수동 방향 전환
// // 전진,회전 setInterval로 누르고 있는 식으로 반복해야 제대로 동작함,
// API설명을 보면 지정한만큼 움직이는게아니라, 누르고있는 시간만큼 움직이기때문에 계속 요청을 보내야함
export async function manualTurn(robotName: string) {
    let ip: string = robotSettings[robotName].robotIP;
    try {
        const response = await axios.post(`http://${ip}/cmd/speed`, {
            vx: 0.0,
            vth: 1.0
        });
        if (response.status === 200) {
            // console.log(response.data);
            // console.log("수동회전");
        }

    } catch (error) {
        console.error('Error with API call:', error);
    }
}
function timerTurn(robotName: string, timer: number) {
    const manualTurnInterval = setInterval(() => {
        manualTurn(robotName);
    }, 33);
    setTimeout(() => {
        clearInterval(manualTurnInterval);
    }, timer);
}




// 수동 이동
export async function manualMove(robotName: string) {
    let ip: string = robotSettings[robotName].robotIP;
    try {
        const response = await axios.post(`http://${ip}/cmd/speed`, {
            vx: 1.0,
            vth: 0.0
        });
        if (response.status === 200) {
            // console.log(response.data);
            // console.log("수동이동");
        }

    } catch (error) {
        console.error('Error with API call:', error);
    }
}

function timerMove(robotName: string, timer1: number, timer2: number) {
    setTimeout(() => {
        const manualMoveInterval = setInterval(() => {
            manualMove(robotName);
        }, 33);
        setTimeout(() => {
            clearInterval(manualMoveInterval);
        }, timer2);
    }, timer1);
}

// 사용 보류 기능
// 해당 로봇 위치 근처의 좌표를 보내주면 로봇이 자신의 위치를 다시 설정함,
// async function relocPose() {
//     try {
//         const response = await axios.get(`http://192.168.0.13/cmd/reloc_pose`,{
//             x : 0,
//             y : 0,
//             theta : 0
//         });
//         if (response.status === 200) {
//             console.log(response.data);
//         }
//     } catch (error) {
//         console.error('Error with API call:', error);
//         console.log("error : ", error);
//     }
// }

// 로봇 이름 받기
// async function getRobotName(ip){
//     try {
//         console.log(new Date().toISOString());
//         const response = await axios.get(`http://${ip}/reeman/hostname`);
//         if (response.status === 200) {
//             console.log(response.data);
//         }
//     } catch (error) {
//         console.error('Error with API call:', error);
//     }
// }



