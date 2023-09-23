package com.example.ServingServerSpring.service;

import com.example.ServingServerSpring.domain.Robot;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class RobotService {
    public List<Robot> readRobotData() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File("RobotSettings.json");
        if (file.exists()) {
            return mapper.readValue(file, new TypeReference<List<Robot>>() {});
        }
        return new ArrayList<>();
    }

    public void saveRobotData(Robot newRobot) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File("RobotSettings.json");
        List<Robot> robots;

        if (file.exists()) {
            robots = mapper.readValue(file, new TypeReference<List<Robot>>() {});
        } else {
            robots = new ArrayList<>();
        }
        robots.add(newRobot);
        mapper.writerWithDefaultPrettyPrinter().writeValue(file, robots);
    }
}
