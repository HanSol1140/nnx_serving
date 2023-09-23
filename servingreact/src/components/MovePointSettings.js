import { useState, useCallback, useEffect } from "react";
import axios from 'axios';
import './MovePointSettings.css'


const MovePointSettings = () => {
    const [pointList, setPointList] = useState([]);
    const [inputText, setInputText] = useState({
        pointName: '',
        pointCoordinates: '',
        searchText: ''
    });
    const onChange = useCallback(e => {
        const { name, value } = e.target;
        setInputText(prevForm => ({
            ...prevForm,
            [name]: value
        }));
        // console.log(e.target.value);
    });
    
    async function getPointList() {
        try {
            const response = await axios.get(`http://localhost:8084/api/getpointlist`);
            if (response.status === 200) {
                console.log(response.data);
                setPointList(response.data);
            }
        } catch (error) {
            console.error('Error with API call:', error);
        }
    }
    useEffect(() => {

        getPointList();
    }, []);

    async function createPointList() {
        try {
            if(inputText.pointName == '' || inputText.pointCoordinates == ''){
                alert("비어있는 값이 있습니다.");
                return
            }

            const coordinates = inputText.pointCoordinates.split(',');
            const coordinatesX = coordinates[0];
            const coordinatesY = coordinates[1];
            const coordinatesTheta = coordinates[2];

            const response = await axios.post(`http://localhost:8084/api/createPointList`, {
                pointName: inputText.pointName,
                coordinatesX,
                coordinatesY,
                coordinatesTheta,

            });

            if (response.status === 200) {
                alert(response.data);
                setInputText(prevState => ({
                    ...prevState,
                    pointName: '',
                    pointCoordinates: '',
                }));
                // 로봇 리스트를 다시 가져와서 업데이트
                getPointList();
      
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert(error.response.data);
            } else {
                console.error('Error with API call:', error);
            }
        }
    }

    async function deletePointList(pointName) {
        try {
            const response = await axios.post(`http://localhost:8084/api/deletepointlist`, {
                pointName: pointName
            });
            if (response.status === 200) {
                console.log(response.data);
                // 로봇 리스트를 다시 가져와서 업데이트
                getPointList();
            }
        } catch (error) {
            console.error('Error with API call:', error);
        }
    }

    return (

        <section id="MovePointSettings">
            <div className='category'>
                <ul>
                    <li>포인트명</li>
                    <li>좌표</li>
                    <li></li>
                </ul>
            </div>
            <div className="createRobotList">
                <ul>
                    <li>
                        <input
                            type="text"
                            id="pointName"
                            name="pointName"
                            placeholder='포인트 지점의 이름을 입력해주세요.'
                            value={inputText.pointName}
                            onChange={onChange}
                        >
                        </input>
                    </li>
                    <li>
                        <input
                            type="text"
                            id="pointCoordinates"
                            name="pointCoordinates"
                            placeholder='X,Y,Theta형식으로 값을 넣어주세요.'
                            value={inputText.pointCoordinates}
                            onChange={onChange}
                        >
                        </input>
                    </li>
                    <li>
                        <button onClick={createPointList}>포인트 추가</button>
                    </li>
                </ul>
            </div>
            <div className="line" />
            <h2>Point List</h2>
            <div className="robotListTitle">
                <ul>
                    <li>포인트명</li>
                    <li>좌표</li>
                    <li>삭제</li>

                </ul>
            </div>
            {pointList.map((item, index) => (
            <div className="pointList" key={index}>
                <ul>
                    <li>{item.pointName}</li>
                </ul>
                <ul>
                    <li>X : {item.coordinatesX}</li>
                    <li>Y : {item.coordinatesY}</li>
                    <li>Theta : {item.coordinatesTheta}</li>
                    
                    
                </ul>
                <ul>
                    <li>
                        <button onClick={() => deletePointList(item.pointName)}>삭제</button>
                    </li>
                </ul>
            </div>
            ))}

            <footer id="footer"></footer>
        </section>
    );
};

export default MovePointSettings;