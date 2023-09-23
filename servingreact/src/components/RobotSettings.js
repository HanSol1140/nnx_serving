import { useState, useCallback, useEffect } from "react";
import axios from 'axios';
import './RobotSettings.css'


const RobotSettings = () => {

    const [robotList, setRobotList] = useState([]);
    const [editName, setEditName] = useState(null);
    const [inputText, setInputText] = useState({
        robotName: '',
        robotNumber: '',
        robotIP: '',

    });
    const [editInputText, setEditInputText] = useState({
        robotName: '',
        robotNumber: '',
        robotIP: '',
    });

    const onChange = useCallback(e => {
        const { name, value } = e.target;
        setInputText(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    });


    const onEditChange = useCallback(e => {
        const { name, value } = e.target;
        setEditInputText(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    });

    useEffect(() => {
        async function getRobotList() {
            try {
                const response = await axios.get(`http://localhost:8084/api/getrobotlist`);
                if (response.status === 200) {
                    // console.log(response.data);
                    setRobotList(response.data);
                }
            } catch (error) {
                console.error('Error with API call:', error);
            }
        }
        getRobotList();
    }, []);

    async function createRobotList() {
        try {
            if(inputText.robotName == '' || inputText.robotNumber == '' || inputText.robotIP == ''){
                alert("비어있는 값이 있습니다.");
                return
            }
            const response = await axios.post(`http://localhost:8084/api/createrobotlist`, {
                robotName: inputText.robotName,
                robotNumber: inputText.robotNumber,
                robotIP: inputText.robotIP,
            });

            if (response.status === 200) {
                alert(response.data);
                // 로봇 리스트를 다시 가져와서 업데이트
                const robotListResponse = await axios.get(`http://localhost:8084/api/getrobotlist`);
                if (robotListResponse.status === 200) {
                    console.log("요청성공");
                    setRobotList(robotListResponse.data);
                    setInputText({
                        robotName: '',
                        robotNumber: '',
                        robotIP: '',
                    });
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert(error.response.data);
            } else {
                console.error('Error with API call:', error);
            }
        }
    }

    async function deleteRobotList(deletename) {
        try {
            const response = await axios.post(`http://localhost:8084/api/deleterobot`, {
                robotName: deletename
            });
            if (response.status === 200) {
                console.log(response.data);
                // 로봇 리스트를 다시 가져와서 업데이트
                const robotListResponse = await axios.get(`http://localhost:8084/api/getrobotlist`);
                if (robotListResponse.status === 200) {
                    setRobotList(robotListResponse.data);
                }
            }
        } catch (error) {
            console.error('Error with API call:', error);
        }
    }

    async function startEditRobot(editname, editnumber, editip) {
        setEditInputText({
            robotName: editname,
            robotNumber: editnumber,
            robotIP: editip,
        });
        setEditName(editname);
    }

    async function updateRobot(editname) {
        try {
            const response = await axios.post(`http://localhost:8084/api/updaterobot`, {
                robotName: editname,
                newRobotName: editInputText.robotName,
                newRobotNumber: editInputText.robotNumber,
                newRobotIP: editInputText.robotIP,
            });
            if (response.status === 200) {
                alert(response.data);
                // 로봇 리스트를 다시 가져와서 업데이트
                const robotListResponse = await axios.get(`http://localhost:8084/api/getrobotlist`);
                if (robotListResponse.status === 200) {
                    setRobotList(robotListResponse.data);
                }
            }
        } catch (error) {
            alert(error.response.data);
        } finally {
            setEditName(null);
        }
    }



    return (
        <section id="RobotSettings">
            <div className='category'>
                <ul>
                    <li>RobotName</li>
                    <li>RobotNumber</li>
                    <li>RobotIP</li>
                </ul>
            </div>
            <div className="createRobotList">
                <ul>
                    <li>
                        <input
                            type="text"
                            id="robotName"
                            name="robotName"
                            placeholder='로봇명을 입력해주세요.'
                            value={inputText.robotName}
                            onChange={onChange}
                        >
                        </input>
                    </li>
                    <li>
                        <input
                            type="number"
                            id="robotNumber"
                            name="robotNumber"
                            placeholder='001~004'
                            value={inputText.robotNumber}
                            onChange={onChange}
                        >
                        </input>
                    </li>
                    <li>
                        <input
                            type="text"
                            id="robotIP"
                            name="robotIP"
                            placeholder='000.000.000.000'
                            value={inputText.robotIP}
                            onChange={onChange}
                        >
                        </input>
                    </li>
                    <li>
                        <button onClick={createRobotList}>추가</button>
                    </li>
                </ul>
            </div>
            <div className="line" />
            <h2>Robot List</h2>
            <div className="robotListTitle">
                <ul>
                    <li>RobotName</li>
                    <li>RobotNumber</li>
                    <li>RobotIP</li>
                    <li>수정 / 삭제</li>

                </ul>
            </div>
            {robotList.map((item, index) => (
                <div className="robotList" key={index}>
                    {editName === item.robotName ? (
                        <ul>
                            <li>
                                <input
                                    type="text"
                                    id="robotName"
                                    name="robotName"
                                    placeholder="수정할 로봇명 입력"
                                    value={editInputText.robotName}
                                    onChange={onEditChange}
                                />
                            </li>
                            <li>
                                <input
                                    type="number"
                                    id="robotNumber"
                                    name="robotNumber"
                                    placeholder="001~004"
                                    value={editInputText.robotNumber}
                                    onChange={onEditChange}
                                />
                            </li>
                            <li>
                                <input
                                    type="text"
                                    id="robotIP"
                                    name="robotIP"
                                    placeholder="000.000.000.000"
                                    value={editInputText.robotIP}
                                    onChange={onEditChange}
                                />
                            </li>
                            <li>
                                <button onClick={() => updateRobot(item.robotName)}>저장</button>
                                <button onClick={() => setEditName(null)}>취소</button>
                            </li>
                        </ul>
                    ) : (
                        <ul>
                            <li>{item.robotName}</li>
                            <li>{item.robotNumber}</li>
                            <li>{item.robotIP}</li>
                            <li>
                                <button onClick={() => startEditRobot(item.robotName, item.robotNumber, item.robotIP)}>수정</button>
                                <button onClick={() => deleteRobotList(item.robotName)}>삭제</button>
                            </li>
                        </ul>
                    )}
                </div>
            ))}



        </section>
    );
};

export default RobotSettings;   