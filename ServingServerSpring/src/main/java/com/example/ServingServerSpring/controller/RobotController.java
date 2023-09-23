package com.example.ServingServerSpring.controller;

import com.example.ServingServerSpring.domain.Robot;
import com.example.ServingServerSpring.service.RobotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;

@RestController
    // 컨트롤러 클래스에서 반환하는 객체를 ViewResolver에 바인딩하지 않고, HTTP 응답 본문에 직접 작성하도록 설정
@RequestMapping("/api")
    // @RequestMapping 어노테이션은 클래스 또는 메서드에 매핑 정보를 제공
    // 이 경우 클래스 레벨에서 사용되어 /api로 시작하는 모든 경로에 이 컨트롤러를 매핑
    //예를 들어, 이 컨트롤러 내의 /example 경로에 대한 메서드가 있다면,
    // 실제 요청 경로는 /api/example
public class RobotController {
    @Autowired
    private RobotService robotService;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/createrobotlist")
    public String createRobotData(@RequestBody Robot robot) throws IOException {
        // 중복 로봇 이름 또는 번호 확인
        try{
        List<Robot> existingRobots = robotService.readRobotData();
        for (Robot existingRobot : existingRobots) {
            if (existingRobot.getRobotName().equals(robot.getRobotName())) {
                return "로봇명 중복";
            }
            if (existingRobot.getRobotNumber().equals(robot.getRobotNumber())) {
                return "로봇번호 중복";
            }
        }
        robot.setRobotRunningState(false);
        robot.setRobotLastOrderPoint("");

        robotService.saveRobotData(robot);

        }catch (IOException e){
            e.printStackTrace();
        }
        return "로봇데이터 저장완료";
    }
}
